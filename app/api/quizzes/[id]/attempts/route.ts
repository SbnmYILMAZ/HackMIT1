import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { getAuth } from "@/lib/auth/auth-helpers";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await getAuth(req);
    if (!auth.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Verificar que el quiz existe
    const { data: quiz, error: quizError } = await supabaseAdmin
      .from("quizzes")
      .select("id, created_by, is_published")
      .eq("id", params.id)
      .single();

    if (quizError || !quiz) {
      return NextResponse.json({ error: "Quiz no encontrado" }, { status: 404 });
    }

    // Solo el creador del quiz puede ver todos los intentos
    // Otros usuarios solo pueden ver sus propios intentos si el quiz está publicado
    let query = supabaseAdmin
      .from("attempts")
      .select(`
        *,
        profiles!attempts_user_id_fkey (
          id,
          username,
          full_name
        )
      `)
      .eq("quiz_id", params.id)
      .order("created_at", { ascending: false });

    if (quiz.created_by !== auth.user.id) {
      // Si no es el creador, solo mostrar intentos propios y quiz debe estar publicado
      if (!quiz.is_published) {
        return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
      }
      query = query.eq("user_id", auth.user.id);
    }

    const { data: attempts, error } = await query;

    if (error) {
      console.error("Error fetching quiz attempts:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Calcular estadísticas si es el creador
    let stats = null;
    if (quiz.created_by === auth.user.id && attempts) {
      const completedAttempts = attempts.filter(a => a.status === "completed");
      const totalAttempts = attempts.length;
      const averageScore = completedAttempts.length > 0 
        ? completedAttempts.reduce((sum, a) => sum + (a.score || 0), 0) / completedAttempts.length 
        : 0;
      
      stats = {
        total_attempts: totalAttempts,
        completed_attempts: completedAttempts.length,
        in_progress_attempts: attempts.filter(a => a.status === "in_progress").length,
        abandoned_attempts: attempts.filter(a => a.status === "abandoned").length,
        average_score: Math.round(averageScore),
        completion_rate: totalAttempts > 0 ? Math.round((completedAttempts.length / totalAttempts) * 100) : 0
      };
    }

    return NextResponse.json({ 
      attempts: attempts || [],
      stats
    });
  } catch (e: any) {
    console.error("Error in GET /api/quizzes/[id]/attempts:", e);
    return NextResponse.json(
      { error: e?.message ?? "Error interno del servidor" },
      { status: 500 }
    );
  }
}
