import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { getAuth } from "@/lib/auth/auth-helpers";
import { z } from "zod";
import type { Question, Attempt } from "@/lib/types/database";

const schema = z.object({
  question_id: z.string().uuid(),
  response: z.any(),
});

async function checkOwnership(attemptId: string, userId: string) {
  const { data } = await supabaseAdmin
    .from("attempts")
    .select("id, user_id, status")
    .eq("id", attemptId)
    .single();
  
  return (data as Attempt | null)?.user_id === userId && (data as Attempt | null)?.status === "in_progress";
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await getAuth(req);
    if (!auth.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (!await checkOwnership(params.id, auth.user.id))
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });

    const body = schema.parse(await req.json());

    // Obtener la pregunta y su respuesta correcta
    const { data: q, error: qerr } = await supabaseAdmin
      .from("questions")
      .select("id, answer")
      .eq("id", body.question_id)
      .single();
    if (qerr || !q) return NextResponse.json({ error: "Pregunta inválida" }, { status: 400 });

    // Evaluar si la respuesta es correcta
    const is_correct = (q as any).answer != null
      ? String(body.response).trim() === String((q as any).answer).trim()
      : null;

    const { data, error } = await supabaseAdmin
      .from("attempt_items")
      .insert({
        attempt_id: params.id,
        question_id: body.question_id,
        response: body.response,
        is_correct,
        answered_at: new Date().toISOString(),
      } as any)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ item: data }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Solicitud incorrecta" }, { status: 400 });
  }
}
