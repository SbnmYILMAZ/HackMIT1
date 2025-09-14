import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { getAuth } from "@/lib/auth/auth-helpers";
import { Attempt, AttemptStatus, Database } from "@/lib/types/database";

async function checkOwnership(attemptId: string, userId: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from("attempts")
    .select("id, user_id, status")
    .eq("id", attemptId)
    .single();
  
  if (error || !data) {
    return false;
  }
  
  // Type assertion to ensure TypeScript knows the shape of data
  const attempt = data as { id: string; user_id: string; status: string };
  return attempt.user_id === userId;
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await getAuth(req);
    if (!auth.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { data: attempt, error } = await supabaseAdmin
      .from("attempts")
      .select(`
        *,
        quizzes (
          id,
          title,
          subject,
          difficulty
        ),
        attempt_items (
          id,
          question_id,
          response,
          is_correct,
          awarded_score,
          answered_at
        )
      `)
      .eq("id", params.id)
      .single();

    if (error || !attempt) {
      return NextResponse.json({ error: "Intento no encontrado" }, { status: 404 });
    }

    // Type the attempt data properly
    type AttemptWithRelations = Attempt & {
      quizzes: {
        id: string;
        title: string;
        subject: string;
        difficulty: string;
      };
      attempt_items: Array<{
        id: string;
        question_id: string;
        response: any;
        is_correct: boolean | null;
        awarded_score: number | null;
        answered_at: string;
      }>;
    };

    const attemptData = attempt as AttemptWithRelations;

    // Solo el owner puede ver los detalles completos
    if (attemptData.user_id !== auth.user.id) {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
    }

    return NextResponse.json({ attempt: attemptData });
  } catch (e: any) {
    console.error("Error in GET /api/attempts/[id]:", e);
    return NextResponse.json(
      { error: e?.message ?? "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// Este endpoint ya no se usa - usar /answer y /finish en su lugar
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({ error: "Endpoint obsoleto. Usar /answer y /finish" }, { status: 410 });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await getAuth(req);
    if (!auth.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (!await checkOwnership(params.id, auth.user.id)) {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
    }

    // Solo permitir eliminar intentos en progreso
    const { error } = await (supabaseAdmin as any)
      .from("attempts")
      .update({ status: "abandoned" })
      .eq("id", params.id);

    if (error) {
      console.error("Error abandoning attempt:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("Error in DELETE /api/attempts/[id]:", e);
    return NextResponse.json(
      { error: "Solicitud incorrecta" },
      { status: 400 }
    );
  }
}
