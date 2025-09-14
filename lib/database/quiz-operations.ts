import { supabase } from '@/lib/supabase/client'
import type { 
  Quiz, 
  Question, 
  QuizWithCreator, 
  CreateQuizForm, 
  CreateQuestionForm,
  CreateQuestionAPIForm,
  UpdateQuestionAPIForm,
  QuestionCustom,
  SubjectType,
  DifficultyType,
  Database 
} from '@/lib/types/database'

// Operaciones de Quiz
export async function createQuiz(quizData: CreateQuizForm) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuario no autenticado')

    const { data, error } = await supabase
      .from('quizzes')
      .insert({
        ...quizData,
        created_by: user.id
      } as any)
      .select()
      .single()

    if (error) throw new Error(`Error al crear quiz: ${error.message}`)
    return data
  } catch (error) {
    console.error('Error en createQuiz:', error)
    throw error
  }
}

export async function getQuizById(id: string): Promise<QuizWithCreator | null> {
  try {
    const { data, error } = await supabase
      .from('quizzes')
      .select(`
        *,
        creator:profiles!created_by(*),
        questions(*)
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw new Error(`Error al obtener quiz: ${error.message}`)
    }

    return data as QuizWithCreator
  } catch (error) {
    console.error('Error en getQuizById:', error)
    throw error
  }
}

export async function getPublishedQuizzes(filters?: {
  subject?: SubjectType
  difficulty?: DifficultyType
  search?: string
  limit?: number
  offset?: number
}) {
  try {
    let query = supabase
      .from('quizzes')
      .select(`
        *,
        creator:profiles!created_by(username, full_name),
        questions(id)
      `)
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    if (filters?.subject) {
      query = query.eq('subject', filters.subject)
    }

    if (filters?.difficulty) {
      query = query.eq('difficulty', filters.difficulty)
    }

    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    const { data, error } = await query

    if (error) throw new Error(`Error al obtener quizzes: ${error.message}`)
    
    return (data as any)?.map((quiz: any) => ({
      ...quiz,
      _count: {
        questions: quiz.questions?.length || 0,
        attempts: 0
      }
    })) as QuizWithCreator[]
  } catch (error) {
    console.error('Error en getPublishedQuizzes:', error)
    throw error
  }
}

export async function getUserQuizzes(userId?: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    const targetUserId = userId || user?.id
    
    if (!targetUserId) throw new Error('Usuario no especificado')

    const { data, error } = await supabase
      .from('quizzes')
      .select(`
        *,
        questions(id),
        attempts(id, status)
      `)
      .eq('created_by', targetUserId)
      .order('created_at', { ascending: false })

    if (error) throw new Error(`Error al obtener quizzes del usuario: ${error.message}`)
    
    return (data as any)?.map((quiz: any) => ({
      ...quiz,
      _count: {
        questions: quiz.questions?.length || 0,
        attempts: quiz.attempts?.length || 0
      }
    })) as QuizWithCreator[]
  } catch (error) {
    console.error('Error en getUserQuizzes:', error)
    throw error
  }
}

export async function updateQuiz(id: string, updates: Partial<CreateQuizForm>) {
  try {
    const { data, error } = await (supabase as any)
      .from('quizzes')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(`Error al actualizar quiz: ${error.message}`)
    return data
  } catch (error) {
    console.error('Error en updateQuiz:', error)
    throw error
  }
}

export async function deleteQuiz(id: string) {
  try {
    const { error } = await supabase
      .from('quizzes')
      .delete()
      .eq('id', id)

    if (error) throw new Error(`Error al eliminar quiz: ${error.message}`)
  } catch (error) {
    console.error('Error en deleteQuiz:', error)
    throw error
  }
}

// Operaciones de Question - usando esquema personalizado
export async function createQuestion(questionData: CreateQuestionAPIForm) {
  try {
    const { data, error } = await supabase
      .from('questions')
      .insert(questionData as any)
      .select()
      .single()

    if (error) throw new Error(`Error al crear pregunta: ${error.message}`)
    return data
  } catch (error) {
    console.error('Error en createQuestion:', error)
    throw error
  }
}

export async function getQuestionsByQuizId(quizId: string) {
  try {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('quiz_id', quizId)
      .order('order_index', { ascending: true })

    if (error) throw new Error(`Error al obtener preguntas: ${error.message}`)
    return data
  } catch (error) {
    console.error('Error en getQuestionsByQuizId:', error)
    throw error
  }
}

export async function updateQuestion(id: string, updates: UpdateQuestionAPIForm) {
  try {
    // Type assertion to bypass strict typing while maintaining type safety
    const { data, error } = await (supabase as any)
      .from('questions')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(`Error al actualizar pregunta: ${error.message}`)
    return data as QuestionCustom
  } catch (error) {
    console.error('Error en updateQuestion:', error)
    throw error
  }
}

export async function deleteQuestion(id: string) {
  try {
    const { error } = await supabase
      .from('questions')
      .delete()
      .eq('id', id)

    if (error) throw new Error(`Error al eliminar pregunta: ${error.message}`)
  } catch (error) {
    console.error('Error en deleteQuestion:', error)
    throw error
  }
}

// Función para obtener preguntas por quiz ID usando esquema personalizado
export async function getQuestionsByQuizIdCustom(quizId: string) {
  try {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('quiz_id', quizId)
      .order('created_at', { ascending: true })

    if (error) throw new Error(`Error al obtener preguntas: ${error.message}`)
    return data
  } catch (error) {
    console.error('Error en getQuestionsByQuizIdCustom:', error)
    throw error
  }
}
