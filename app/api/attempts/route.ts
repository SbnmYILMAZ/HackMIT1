import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { getAuth } from "@/lib/auth/auth-helpers";
import { z } from "zod";
import type { Quiz, Attempt, Database } from "@/lib/types/database";

const createSchema = z.object({ quiz_id: z.string().uuid() });

export async function GET(req: Request) {
  try {
    const auth = await getAuth(req);
    if (!auth.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from("attempts")
      .select("*, quizzes(title,subject,difficulty)")
      .eq("user_id", auth.user.id)
      .order("started_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ attempts: data });
  } catch {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const auth = await getAuth(req);
    if (!auth.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = createSchema.parse(await req.json());

    // Verificar que el quiz existe y está publicado
    const { data: quiz, error: quizError } = await supabaseAdmin
      .from("quizzes")
      .select("id, is_published")
      .eq("id", body.quiz_id)
      .single() as { data: Pick<Quiz, 'id' | 'is_published'> | null; error: any };

    if (quizError || !quiz) {
      return NextResponse.json({ error: "Quiz no encontrado" }, { status: 404 });
    }

    if (!quiz.is_published) {
      return NextResponse.json({ error: "Quiz no está publicado" }, { status: 400 });
    }

    // Verificar si ya existe un intento en progreso
    const { data: existingAttempt } = await supabaseAdmin
      .from("attempts")
      .select("id")
      .eq("user_id", auth.user.id)
      .eq("quiz_id", body.quiz_id)
      .eq("status", "in_progress")
      .single();

    if (existingAttempt) {
      return NextResponse.json(
        { error: "Ya tienes un intento en progreso para este quiz" },
        { status: 400 }
      );
    }

    const { data, error } = await (supabaseAdmin
      .from("attempts") as any)
      .insert({ 
        user_id: auth.user.id, 
        quiz_id: body.quiz_id,
        status: "in_progress",
        started_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ attempt: data }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Solicitud incorrecta" }, { status: 400 });
  }
}
