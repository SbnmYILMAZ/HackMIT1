import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { getAuth } from "@/lib/auth/auth-helpers";
import { z } from "zod";

const updateSchema = z.object({
  stem: z.string().min(1).optional(),
  qtype: z.enum(["mcq","numeric","open"]).optional(),
  choices: z.array(z.object({ id: z.string(), text: z.string() })).optional(),
  correct_answer: z.string().optional(),
  solution_explained: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

async function requireOwner(questionId: string, userId: string) {
  const { data } = await supabaseAdmin
    .from("questions")
    .select("quiz_id, quizzes!inner(created_by)")
    .eq("id", questionId)
    .single();
  return data && (data as any).quizzes.created_by === userId;
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await getAuth(req);
    if (!auth.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (!await requireOwner(params.id, auth.user.id)) {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
    }

    const body = updateSchema.parse(await req.json());
    const { data, error } = await (supabaseAdmin as any)
      .from("questions")
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating question:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ question: data });
  } catch (e: any) {
    console.error('Error in PUT /api/questions/[id]:', e);
    return NextResponse.json({ error: e?.message ?? "Solicitud incorrecta" }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await getAuth(req);
    if (!auth.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (!await requireOwner(params.id, auth.user.id)) {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
    }

    const { error } = await supabaseAdmin
      .from("questions")
      .delete()
      .eq("id", params.id);

    if (error) {
      console.error('Error deleting question:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error('Error in DELETE /api/questions/[id]:', e);
    return NextResponse.json({ error: "Solicitud incorrecta" }, { status: 400 });
  }
}
