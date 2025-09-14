import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/server"
import { getAuth } from "@/lib/auth/auth-helpers"
import { z } from "zod"

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  subject: z.enum(["math", "physics", "general"]).optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  is_published: z.boolean().optional(),
})

export async function GET(
  _req: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await (supabaseAdmin as any)
      .from("quizzes")
      .select(`
        *,
        profiles!quizzes_created_by_fkey (
          id,
          username,
          full_name
        ),
        questions (
          id,
          stem,
          qtype,
          choices,
          correct_answer,
          solution_explained,
          tags
        )
      `)
      .eq("id", params.id)
      .single()

    if (error) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
    }

    return NextResponse.json({ quiz: data })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Internal server error" }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    const auth = await getAuth(req)
    const body = await req.json()
    const parsed = updateSchema.parse(body)

    // Check if user owns the quiz or is admin
    const { data: existingQuiz, error: fetchError } = await (supabaseAdmin as any)
      .from("quizzes")
      .select("created_by")
      .eq("id", params.id)
      .single()

    if (fetchError || !existingQuiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
    }

    if (existingQuiz.created_by !== auth.user.id) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 })
    }

    const { data, error } = await (supabaseAdmin as any)
      .from("quizzes")
      .update({
        ...parsed,
        updated_at: new Date().toISOString()
      })
      .eq("id", params.id)
      .select(`
        *,
        profiles!quizzes_created_by_fkey (
          id,
          username,
          full_name
        )
      `)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ quiz: data })
  } catch (e: any) {
    if (e.message === "Unauthorized") {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }
    return NextResponse.json({ error: e?.message ?? "Bad request" }, { status: 400 })
  }
}

export async function DELETE(
  req: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    const auth = await getAuth(req)

    // Check if user owns the quiz or is admin
    const { data: existingQuiz, error: fetchError } = await (supabaseAdmin as any)
      .from("quizzes")
      .select("created_by")
      .eq("id", params.id)
      .single()

    if (fetchError || !existingQuiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
    }

    if (existingQuiz.created_by !== auth.user.id) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 })
    }

    // Delete quiz (cascade will handle related questions and attempts)
    const { error } = await (supabaseAdmin as any)
      .from("quizzes")
      .delete()
      .eq("id", params.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (e: any) {
    if (e.message === "Unauthorized") {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }
    return NextResponse.json({ error: e?.message ?? "Bad request" }, { status: 400 })
  }
}
