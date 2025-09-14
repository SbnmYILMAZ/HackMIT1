import { QuestionCustom, CreateQuestionAPIForm, UpdateQuestionAPIForm } from '@/lib/types/database'

const API_BASE = '/api/questions'

export async function createQuestion(questionData: CreateQuestionAPIForm): Promise<QuestionCustom> {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(questionData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create question')
  }

  const data = await response.json()
  return data.question
}

export async function updateQuestion(id: string, updates: UpdateQuestionAPIForm): Promise<QuestionCustom> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to update question')
  }

  const data = await response.json()
  return data.question
}

export async function deleteQuestion(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to delete question')
  }
}

export async function getQuestionsByQuizId(quizId: string): Promise<QuestionCustom[]> {
  const response = await fetch(`/api/quizzes/${quizId}/questions`)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch questions')
  }

  const data = await response.json()
  return data.questions || []
}
