// Tipos de base de datos generados desde el esquema SQL
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Enums de la base de datos
export type QuestionType = 'single_choice' | 'multiple_choice' | 'true_false' | 'numeric' | 'short_answer'
export type QuestionTypeAPI = 'mcq' | 'numeric' | 'open'
export type SubjectType = 'math' | 'physics' | 'general'
export type DifficultyType = 'easy' | 'medium' | 'hard'
export type AttemptStatus = 'in_progress' | 'completed' | 'abandoned'

// Interfaces de las tablas
export interface Profile {
  id: string
  email?: string
  full_name?: string
  avatar_url?: string
  role: 'user' | 'admin'
  username: string
  created_at: string
  updated_at: string
}

export interface Quiz {
  id: string
  title: string
  description?: string
  subject: SubjectType
  difficulty: DifficultyType
  is_published: boolean
  created_by: string
  created_at: string
  updated_at: string
}

export interface Question {
  id: string
  quiz_id: string
  type: QuestionType
  prompt: string
  options?: Json
  answer?: Json
  order_index: number
  created_at: string
  updated_at: string
}

// Custom Questions table for our API
export interface QuestionCustom {
  id: string
  quiz_id: string
  stem: string
  qtype: QuestionTypeAPI
  choices?: { id: string; text: string }[] | null
  correct_answer?: string | null
  solution_explained?: string | null
  tags: string[]
  created_by: string
  created_at: string
  updated_at: string
}

export interface Attempt {
  id: string
  user_id: string
  quiz_id: string
  status: AttemptStatus
  score?: number
  started_at: string
  completed_at?: string
  created_at: string
  updated_at: string
}

export interface AttemptItem {
  id: string
  attempt_id: string
  question_id: string
  response?: Json
  is_correct?: boolean
  awarded_score?: number
  answered_at: string
  created_at: string
  updated_at: string
}

export interface SecurityQuestion {
  id: number
  question_text: string
  is_active: boolean
  created_at: string
}

export interface UserSecurityAnswer {
  id: string
  user_id: string
  question_id: number
  answer_hash: string
  salt: string
  created_at: string
}

// Tipos para las respuestas de las preguntas
export interface SingleChoiceAnswer {
  correct: string
}

export interface MultipleChoiceAnswer {
  correct: string[]
}

export interface TrueFalseAnswer {
  correct: boolean
}

export interface NumericAnswer {
  value: number
  tolerance?: number
}

export interface ShortAnswer {
  correct: string[]
  case_sensitive?: boolean
}

// Tipos para las opciones de las preguntas
export interface SingleChoiceOptions {
  options: string[]
}

export interface MultipleChoiceOptions {
  options: string[]
}

export interface NumericOptions {
  min?: number
  max?: number
  step?: number
  unit?: string
}

// Tipos de Supabase Database
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>
      }
      quizzes: {
        Row: Quiz
        Insert: Omit<Quiz, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Quiz, 'id' | 'created_at' | 'updated_at'>>
      }
      questions: {
        Row: QuestionCustom
        Insert: Omit<QuestionCustom, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<QuestionCustom, 'id' | 'created_at' | 'updated_at'>>
      }
      attempts: {
        Row: Attempt
        Insert: Omit<Attempt, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Attempt, 'id' | 'created_at' | 'updated_at'>>
      }
      attempt_items: {
        Row: AttemptItem
        Insert: Omit<AttemptItem, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<AttemptItem, 'id' | 'created_at' | 'updated_at'>>
      }
      security_questions: {
        Row: SecurityQuestion
        Insert: Omit<SecurityQuestion, 'id' | 'created_at'>
        Update: Partial<Omit<SecurityQuestion, 'id' | 'created_at'>>
      }
      user_security_answers: {
        Row: UserSecurityAnswer
        Insert: Omit<UserSecurityAnswer, 'id' | 'created_at'>
        Update: Partial<Omit<UserSecurityAnswer, 'id' | 'created_at'>>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      question_type: QuestionType
      subject_type: SubjectType
      difficulty_type: DifficultyType
      attempt_status: AttemptStatus
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Tipos extendidos con relaciones
export interface QuizWithCreator extends Quiz {
  creator?: Profile
  questions?: Question[]
  _count?: {
    questions: number
    attempts: number
  }
}

export interface QuestionWithQuiz extends Question {
  quiz?: Quiz
}

export interface AttemptWithDetails extends Attempt {
  quiz?: Quiz
  user?: Profile
  attempt_items?: AttemptItemWithQuestion[]
}

export interface AttemptItemWithQuestion extends AttemptItem {
  question?: Question
}

// Tipos para formularios
export interface CreateQuizForm {
  title: string
  description?: string
  subject: SubjectType
  difficulty: DifficultyType
  is_published?: boolean
}

export interface CreateQuestionForm {
  quiz_id: string
  type: QuestionType
  prompt: string
  options?: Json
  answer?: Json
  order_index?: number
}

// Form interfaces for API endpoints
export interface CreateQuestionAPIForm {
  quiz_id: string
  stem: string
  qtype: QuestionTypeAPI
  choices?: { id: string; text: string }[]
  correct_answer?: string
  solution_explained?: string
  tags?: string[]
}

export interface UpdateQuestionAPIForm {
  stem?: string
  qtype?: QuestionTypeAPI
  choices?: { id: string; text: string }[]
  correct_answer?: string
  solution_explained?: string
  tags?: string[]
}

// Attempt interfaces for API endpoints
export interface CreateAttemptForm {
  quiz_id: string
}

export interface SubmitAnswersForm {
  answers: {
    question_id: string
    response: any
  }[]
}

export interface AttemptWithDetails extends Attempt {
  quizzes?: {
    id: string
    title: string
    subject: SubjectType
    difficulty: DifficultyType
    questions?: QuestionCustom[]
  }
  attempt_items?: AttemptItem[]
  profiles?: {
    id: string
    username?: string
    full_name?: string
  }
}

export interface AttemptStats {
  total_attempts: number
  completed_attempts: number
  in_progress_attempts: number
  abandoned_attempts: number
  average_score: number
  completion_rate: number
}

export interface TakeQuizResponse {
  question_id: string
  response: Json
}

// Tipos para autenticación con username
export interface AuthUser {
  id: string
  email?: string
  username: string
  full_name?: string
  avatar_url?: string
  role: 'user' | 'admin'
}

export interface SignUpWithUsernameData {
  username: string
  password: string
  full_name?: string
}

export interface SignInWithUsernameData {
  username: string
  password: string
}

// Tipos para estadísticas y analytics
export interface UserStats {
  total_attempts: number
  completed_attempts: number
  average_score: number
  total_quizzes_created: number
  favorite_subject: SubjectType
  current_streak: number
  badges_earned: string[]
}

export interface QuizStats {
  total_attempts: number
  average_score: number
  completion_rate: number
  difficulty_distribution: Record<DifficultyType, number>
  subject_distribution: Record<SubjectType, number>
}
