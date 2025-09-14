import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { getAuth } from "@/lib/auth/auth-helpers";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await getAuth(req);
    if (!auth.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Verificar que el quiz existe y el usuario tiene acceso
    const { data: quiz } = await supabaseAdmin
      .from("quizzes")
      .select("id, created_by, is_published")
      .eq("id", params.id)
      .single();

    if (!quiz) {
      return NextResponse.json({ error: "Quiz no encontrado" }, { status: 404 });
    }

    // Solo el creador puede ver preguntas de quizzes no publicados
    if (!quiz.is_published && quiz.created_by !== auth.user.id) {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
    }

    const { data: questions, error } = await supabaseAdmin
      .from("questions")
      .select("*")
      .eq("quiz_id", params.id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching questions:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ questions: questions || [] });
  } catch (e: any) {
    console.error("Error in GET /api/quizzes/[id]/questions:", e);
    return NextResponse.json(
      { error: e?.message ?? "Error interno del servidor" },
      { status: 500 }
    );
  }
}
