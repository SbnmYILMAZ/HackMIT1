import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { getAuth } from "@/lib/auth/auth-helpers";
import { z } from "zod";

const schema = z.object({
  score: z.number().min(0).max(100).optional(),
});

async function checkOwnership(attemptId: string, userId: string) {
  const { data } = await supabaseAdmin
    .from("attempts")
    .select("id, user_id, status")
    .eq("id", attemptId)
    .single();
  return data && data.user_id === userId && data.status === "in_progress";
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

    // Si no llega score, calculamos % correctas:
    let score = body.score;
    if (score == null) {
      const { data: items } = await supabaseAdmin
        .from("attempt_items")
        .select("is_correct")
        .eq("attempt_id", params.id);
      const total = items?.length ?? 0;
      const ok = items?.filter((i: any) => i.is_correct === true).length ?? 0;
      score = total > 0 ? Math.round((ok / total) * 100) : 0;
    }

    const { data, error } = await supabaseAdmin
      .from("attempts")
      .update({ 
        completed_at: new Date().toISOString(), 
        score, 
        status: "completed"
      } as any)
      .eq("id", params.id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ attempt: data });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Solicitud incorrecta" }, { status: 400 });
  }
}
