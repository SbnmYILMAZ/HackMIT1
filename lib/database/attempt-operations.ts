import { supabase } from '@/lib/supabase/client'
import type { 
  Attempt, 
  AttemptItem, 
  AttemptWithDetails,
  TakeQuizResponse,
  AttemptStatus 
} from '@/lib/types/database'

// Operaciones de Attempt
export async function startQuizAttempt(quizId: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuario no autenticado')

    const { data, error } = await supabase
      .from('attempts')
      .insert({
        user_id: user.id,
        quiz_id: quizId,
        status: 'in_progress' as AttemptStatus
      } as any)
      .select()
      .single()

    if (error) throw new Error(`Error al iniciar intento: ${error.message}`)
    return data
  } catch (error) {
    console.error('Error en startQuizAttempt:', error)
    throw error
  }
}

export async function getAttemptById(id: string): Promise<AttemptWithDetails | null> {
  try {
    const { data, error } = await supabase
      .from('attempts')
      .select(`
        *,
        quiz:quizzes(*),
        user:profiles!user_id(*),
        attempt_items(
          *,
          question:questions(*)
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw new Error(`Error al obtener intento: ${error.message}`)
    }

    return data as AttemptWithDetails
  } catch (error) {
    console.error('Error en getAttemptById:', error)
    throw error
  }
}

export async function getUserAttempts(userId?: string, filters?: {
  status?: AttemptStatus
  quizId?: string
  limit?: number
  offset?: number
}) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    const targetUserId = userId || user?.id
    
    if (!targetUserId) throw new Error('Usuario no especificado')

    let query = supabase
      .from('attempts')
      .select(`
        *,
        quiz:quizzes(id, title, subject, difficulty)
      `)
      .eq('user_id', targetUserId)
      .order('started_at', { ascending: false })

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    if (filters?.quizId) {
      query = query.eq('quiz_id', filters.quizId)
    }

    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    const { data, error } = await query

    if (error) throw new Error(`Error al obtener intentos: ${error.message}`)
    return data as AttemptWithDetails[]
  } catch (error) {
    console.error('Error en getUserAttempts:', error)
    throw error
  }
}

export async function updateAttemptStatus(id: string, status: AttemptStatus, score?: number) {
  try {
    const updates: any = { status }
    
    if (status === 'completed') {
      updates.completed_at = new Date().toISOString()
      if (score !== undefined) {
        updates.score = score
      }
    }

    const { data, error } = await supabase
      .from('attempts')
      .update(updates as any)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(`Error al actualizar intento: ${error.message}`)
    return data
  } catch (error) {
    console.error('Error en updateAttemptStatus:', error)
    throw error
  }
}

// Operaciones de AttemptItem
export async function submitQuestionResponse(
  attemptId: string, 
  questionId: string, 
  response: TakeQuizResponse['response']
) {
  try {
    // Primero obtener la pregunta para verificar la respuesta
    const { data: question, error: questionError } = await supabase
      .from('questions')
      .select('*')
      .eq('id', questionId)
      .single()

    if (questionError) throw new Error(`Error al obtener pregunta: ${questionError.message}`)

    // Evaluar si la respuesta es correcta
    const isCorrect = evaluateAnswer(question, response)
    const awardedScore = isCorrect ? 1 : 0 // Puntuación simple por ahora

    const { data, error } = await supabase
      .from('attempt_items')
      .upsert({
        attempt_id: attemptId,
        question_id: questionId,
        response,
        is_correct: isCorrect,
        awarded_score: awardedScore
      } as any)
      .select()
      .single()

    if (error) throw new Error(`Error al guardar respuesta: ${error.message}`)
    return data
  } catch (error) {
    console.error('Error en submitQuestionResponse:', error)
    throw error
  }
}

export async function getAttemptItems(attemptId: string) {
  try {
    const { data, error } = await supabase
      .from('attempt_items')
      .select(`
        *,
        question:questions(*)
      `)
      .eq('attempt_id', attemptId)
      .order('answered_at', { ascending: true })

    if (error) throw new Error(`Error al obtener respuestas: ${error.message}`)
    return data
  } catch (error) {
    console.error('Error en getAttemptItems:', error)
    throw error
  }
}

export async function calculateAttemptScore(attemptId: string) {
  try {
    const { data: items, error } = await supabase
      .from('attempt_items')
      .select('awarded_score')
      .eq('attempt_id', attemptId)

    if (error) throw new Error(`Error al calcular puntuación: ${error.message}`)
    
    const totalScore = (items as any)?.reduce((sum: number, item: any) => sum + (item.awarded_score || 0), 0) || 0
    const maxScore = items?.length || 1
    const percentage = (totalScore / maxScore) * 100

    return {
      totalScore,
      maxScore,
      percentage: Math.round(percentage * 100) / 100
    }
  } catch (error) {
    console.error('Error en calculateAttemptScore:', error)
    throw error
  }
}

// Función auxiliar para evaluar respuestas
function evaluateAnswer(question: any, response: any): boolean {
  if (!question.answer || !response) return false

  switch (question.type) {
    case 'single_choice':
      return question.answer.correct === response.selected
    
    case 'multiple_choice':
      const correctAnswers = question.answer.correct || []
      const selectedAnswers = response.selected || []
      return correctAnswers.length === selectedAnswers.length &&
             correctAnswers.every((answer: string) => selectedAnswers.includes(answer))
    
    case 'true_false':
      return question.answer.correct === response.value
    
    case 'numeric':
      const correctValue = question.answer.value
      const userValue = parseFloat(response.value)
      const tolerance = question.answer.tolerance || 0.01
      return Math.abs(correctValue - userValue) <= tolerance
    
    case 'short_answer':
      const correctAnswers2 = question.answer.correct || []
      const userAnswer = response.value?.toLowerCase().trim()
      const caseSensitive = question.answer.case_sensitive || false
      
      return correctAnswers2.some((correct: string) => {
        const compareValue = caseSensitive ? correct : correct.toLowerCase()
        return compareValue === userAnswer
      })
    
    default:
      return false
  }
}

// Estadísticas de intentos
export async function getUserAttemptStats(userId?: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    const targetUserId = userId || user?.id
    
    if (!targetUserId) throw new Error('Usuario no especificado')

    const { data: attempts, error } = await supabase
      .from('attempts')
      .select('status, score, quiz_id')
      .eq('user_id', targetUserId)

    if (error) throw new Error(`Error al obtener estadísticas: ${error.message}`)

    const totalAttempts = (attempts as any)?.length || 0
    const completedAttempts = (attempts as any)?.filter((a: any) => a.status === 'completed').length || 0
    const averageScore = (attempts as any)
      ?.filter((a: any) => a.status === 'completed' && a.score !== null)
      .reduce((sum: number, a: any, _: any, arr: any[]) => sum + (a.score || 0) / arr.length, 0) || 0

    return {
      totalAttempts,
      completedAttempts,
      averageScore: Math.round(averageScore * 100) / 100,
      completionRate: totalAttempts > 0 ? (completedAttempts / totalAttempts) * 100 : 0
    }
  } catch (error) {
    console.error('Error en getUserAttemptStats:', error)
    throw error
  }
}
