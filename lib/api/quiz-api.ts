/**
 * API client functions for quiz operations
 * Uses fetch to communicate with Next.js API routes
 */

import { SubjectType, DifficultyType } from '@/lib/types/database'

export interface QuizFilters {
  subject?: SubjectType | 'all'
  difficulty?: DifficultyType | 'all'
  published?: boolean
  search?: string
  limit?: number
  offset?: number
}

export interface CreateQuizData {
  title: string
  description?: string
  subject: SubjectType
  difficulty: DifficultyType
}

export interface UpdateQuizData extends Partial<CreateQuizData> {
  is_published?: boolean
}

// Quiz API functions
// Type for quiz with profile data from API
export interface QuizWithProfile {
  id: string
  title: string
  description?: string
  subject: SubjectType
  difficulty: DifficultyType
  is_published: boolean
  created_by: string
  created_at: string
  updated_at: string
  profiles?: {
    id: string
    username?: string
    full_name?: string
  } | null
}

export async function fetchQuizzes(filters?: QuizFilters): Promise<QuizWithProfile[]> {
  const params = new URLSearchParams()
  
  if (filters?.subject && filters.subject !== 'all') {
    params.append('subject', filters.subject)
  }
  if (filters?.difficulty && filters.difficulty !== 'all') {
    params.append('difficulty', filters.difficulty)
  }
  if (filters?.published !== undefined) {
    params.append('published', filters.published.toString())
  }
  if (filters?.search) {
    params.append('search', filters.search)
  }
  if (filters?.limit) {
    params.append('limit', filters.limit.toString())
  }
  if (filters?.offset) {
    params.append('offset', filters.offset.toString())
  }

  const response = await fetch(`/api/quizzes?${params.toString()}`)
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch quizzes')
  }
  
  const data = await response.json()
  return data.quizzes || []
}

export async function fetchQuizById(id: string): Promise<{ quiz: QuizWithProfile & { questions?: any[] } }> {
  const response = await fetch(`/api/quizzes/${id}`)
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch quiz')
  }
  
  return response.json()
}

export async function createQuiz(data: CreateQuizData) {
  const response = await fetch('/api/quizzes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create quiz')
  }
  
  return response.json()
}

export async function updateQuiz(id: string, data: UpdateQuizData) {
  const response = await fetch(`/api/quizzes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to update quiz')
  }
  
  return response.json()
}

export async function deleteQuiz(id: string) {
  const response = await fetch(`/api/quizzes/${id}`, {
    method: 'DELETE',
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to delete quiz')
  }
  
  return response.json()
}

// Utility functions for common operations
export async function getPublishedQuizzes(filters?: Omit<QuizFilters, 'published'>) {
  return fetchQuizzes({ ...filters, published: true })
}

export async function getUserQuizzes(filters?: Omit<QuizFilters, 'published'>) {
  return fetchQuizzes({ ...filters, published: false })
}

export async function searchQuizzes(query: string, filters?: Omit<QuizFilters, 'search'>) {
  return fetchQuizzes({ ...filters, search: query })
}
