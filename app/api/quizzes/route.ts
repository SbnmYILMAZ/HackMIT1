import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/server"
import { z } from "zod"
import { getAuth } from "@/lib/auth/auth-helpers"
import type { Database } from "@/lib/types/database"

const createSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  subject: z.enum(["math", "physics", "general"]),
  difficulty: z.enum(["easy", "medium", "hard"]),
})

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const subject = searchParams.get("subject")
    const difficulty = searchParams.get("difficulty")
    const published = searchParams.get("published")

    let query = supabaseAdmin
      .from("quizzes")
      .select(`
        *,
        profiles (
          id,
          username,
          full_name
        )
      `)

    // Apply filters
    if (subject && subject !== "all") {
      query = query.eq("subject", subject)
    }
    if (difficulty && difficulty !== "all") {
      query = query.eq("difficulty", difficulty)
    }
    if (published !== null) {
      query = query.eq("is_published", published === "true")
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ quizzes: data })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuth(req)
    const body = await req.json()
    const parsed = createSchema.parse(body)

    const { data, error } = await (supabaseAdmin as any)
      .from("quizzes")
      .insert({
        title: parsed.title,
        description: parsed.description,
        subject: parsed.subject,
        difficulty: parsed.difficulty,
        created_by: auth.user.id,
        is_published: false, // New quizzes start as drafts
      })
      .select(`
        *,
        profiles (
          id,
          username,
          full_name
        )
      `)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ quiz: data }, { status: 201 })
  } catch (e: any) {
    if (e.message === "Unauthorized") {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }
    return NextResponse.json({ error: e?.message ?? "Bad request" }, { status: 400 })
  }
}
