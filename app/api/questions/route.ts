import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { getAuth } from "@/lib/auth/auth-helpers";
import { z } from "zod";
import type { Quiz } from "@/lib/types/database";

const schema = z.object({
  quiz_id: z.string().uuid(),
  stem: z.string().min(1),
  qtype: z.enum(["mcq", "numeric", "open"]),
  choices: z.array(z.object({ id: z.string(), text: z.string() })).optional(), // mcq
  correct_answer: z.string().optional(),
  solution_explained: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export async function POST(req: Request) {
  try {
    const auth = await getAuth(req);
    if (!auth.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = schema.parse(await req.json());

    // Verifica ownership del quiz
    const { data: quiz, error: quizError } = await supabaseAdmin
      .from("quizzes")
      .select("id, created_by")
      .eq("id", body.quiz_id)
      .single();

    if (quizError || !quiz) {
      return NextResponse.json({ error: "Quiz no encontrado" }, { status: 404 });
    }

    // Type assertion to ensure TypeScript knows the structure
    const typedQuiz = quiz as Pick<Quiz, 'id' | 'created_by'>;

    if (typedQuiz.created_by !== auth.user.id) {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
    }

    const questionData = {
      quiz_id: body.quiz_id,
      stem: body.stem,
      qtype: body.qtype,
      choices: body.choices ?? null,
      correct_answer: body.correct_answer ?? null,
      solution_explained: body.solution_explained ?? null,
      tags: body.tags ?? [],
      created_by: auth.user.id,
    };

    const { data, error } = await supabaseAdmin
      .from("questions")
      .insert(questionData as any)
      .select()
      .single();

    if (error) {
      console.error("Error creating question:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ question: data }, { status: 201 });
  } catch (e: any) {
    console.error("Error in POST /api/questions:", e);
    return NextResponse.json(
      { error: e?.message ?? "Solicitud incorrecta" },
      { status: 400 }
    );
  }
}
