import { supabase } from "@/lib/supabase/client";
import { 
  CreateAttemptForm, 
  AttemptWithDetails,
  AttemptStats 
} from "@/lib/types/database";

const API_BASE = "/api/attempts";

// Crear un nuevo intento
export async function createAttempt(data: CreateAttemptForm) {
  try {
    const response = await fetch(API_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Error al crear intento");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in createAttempt:", error);
    throw error;
  }
}

// Obtener intentos del usuario
export async function fetchAttempts() {
  try {
    const response = await fetch(API_BASE);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Error al obtener intentos");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in fetchAttempts:", error);
    throw error;
  }
}

// Obtener detalles de un intento específico
export async function fetchAttemptById(id: string): Promise<{ attempt: AttemptWithDetails }> {
  try {
    const response = await fetch(`${API_BASE}/${id}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Error al obtener intento");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in fetchAttemptById:", error);
    throw error;
  }
}

// Enviar una respuesta individual
export async function submitAnswer(attemptId: string, data: {
  question_id: string;
  response: any;
}) {
  try {
    const response = await fetch(`${API_BASE}/${attemptId}/answer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Error al enviar respuesta");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in submitAnswer:", error);
    throw error;
  }
}

// Finalizar intento
export async function finishAttempt(id: string, data?: { score?: number }) {
  try {
    const response = await fetch(`${API_BASE}/${id}/finish`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data || {}),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Error al finalizar intento");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in finishAttempt:", error);
    throw error;
  }
}

// Abandonar un intento
export async function abandonAttempt(id: string) {
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Error al abandonar intento");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in abandonAttempt:", error);
    throw error;
  }
}

// Obtener intentos de un quiz específico (para creadores)
export async function fetchQuizAttempts(quizId: string): Promise<{
  attempts: AttemptWithDetails[];
  stats?: AttemptStats;
}> {
  try {
    const response = await fetch(`/api/quizzes/${quizId}/attempts`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Error al obtener intentos del quiz");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in fetchQuizAttempts:", error);
    throw error;
  }
}

// Hook personalizado para manejar intentos
export function useAttempts() {
  return {
    createAttempt,
    fetchAttempts,
    fetchAttemptById,
    submitAnswer,
    finishAttempt,
    abandonAttempt,
    fetchQuizAttempts,
  };
}
