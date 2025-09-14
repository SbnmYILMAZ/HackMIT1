"use client"

import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  BookOpen,
  Clock,
  Star,
  Users,
  Play,
  ArrowLeft,
  Trophy,
  Target,
  Code,
  Calculator,
  Globe,
  Brain,
  Palette,
  Music,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"

interface Quiz {
  id: string
  title: string
  description: string
  subject: string
  difficulty: string
  is_published: boolean
  created_at: string
  updated_at: string
  created_by: string
  profiles: {
    id: string
    username: string
    full_name: string
  }
  questions: Array<{
    id: string
    stem: string
    qtype: string
    choices: any
    correct_answer: string
    solution_explained: string
    tags: string[]
  }>
}

const getSubjectIcon = (subject: string) => {
  switch (subject) {
    case "math":
      return Calculator
    case "physics":
      return Brain
    case "general":
      return BookOpen
    default:
      return BookOpen
  }
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "easy":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    case "medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    case "hard":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  }
}

export default function QuizDetailPage() {
  const params = useParams()
  const router = useRouter()
  const quizId = params.id as string
  const [isStarting, setIsStarting] = useState(false)
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/quizzes/${quizId}`)
        
        if (!response.ok) {
          throw new Error('Quiz not found')
        }
        
        const data = await response.json()
        setQuiz(data.quiz)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load quiz')
      } finally {
        setLoading(false)
      }
    }

    if (quizId) {
      fetchQuiz()
    }
  }, [quizId])

  const handleStartQuiz = async () => {
    setIsStarting(true)
    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, 1000))
    router.push(`/quiz/${quizId}/take`)
  }

  if (loading) {
    return (
      <AuthGuard>
        <DashboardLayout>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading quiz...</p>
            </div>
          </div>
        </DashboardLayout>
      </AuthGuard>
    )
  }

  if (error || !quiz) {
    return (
      <AuthGuard>
        <DashboardLayout>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-foreground mb-4">Quiz Not Found</h1>
            <p className="text-muted-foreground mb-6">{error || "The quiz you're looking for doesn't exist."}</p>
            <Button asChild>
              <Link href="/catalog">Back to Catalog</Link>
            </Button>
          </div>
        </DashboardLayout>
      </AuthGuard>
    )
  }

  const SubjectIcon = getSubjectIcon(quiz.subject)
  const questionCount = quiz.questions?.length || 0
  const estimatedTime = Math.max(1, Math.ceil(questionCount * 0.8)) // Estimate 0.8 minutes per question

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Back Button */}
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/catalog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Catalog
            </Link>
          </Button>

          {/* Quiz Header */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-border">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <SubjectIcon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <Badge className={getDifficultyColor(quiz.difficulty)} variant="secondary">
                          {quiz.difficulty}
                        </Badge>
                        <Badge className="ml-2" variant="outline">
                          {quiz.subject === "math" ? "Math" : quiz.subject === "physics" ? "Physics" : "General"}
                        </Badge>
                        {quiz.is_published && (
                          <Badge
                            className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            variant="secondary"
                          >
                            Published
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <CardTitle className="text-3xl text-balance">{quiz.title}</CardTitle>
                  <CardDescription className="text-lg text-pretty">{quiz.description || "No description available."}</CardDescription>

                  {/* Quiz Stats */}
                  <div className="flex flex-wrap gap-6 pt-4 text-sm">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-muted-foreground" />
                      <span>{questionCount} questions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{estimatedTime} minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>Created by {quiz.profiles?.full_name || quiz.profiles?.username || "Unknown"}</span>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Questions Preview */}
              {questionCount > 0 && (
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Questions Overview
                    </CardTitle>
                    <CardDescription>This quiz contains {questionCount} questions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      <p>Ready to test your knowledge? Click "Start Quiz" to begin!</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Start Quiz Card */}
              <Card className="border-border">
                <CardContent className="p-6">
                  <Button size="lg" className="w-full mb-4" onClick={handleStartQuiz} disabled={isStarting}>
                    <Play className="w-5 h-5 mr-2" />
                    {isStarting ? "Starting..." : "Start Quiz"}
                  </Button>
                  <div className="text-center text-sm text-muted-foreground">
                    <p>Estimated time: {estimatedTime} minutes</p>
                    <p>{questionCount} questions</p>
                  </div>
                </CardContent>
              </Card>

              {/* Author Info */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Quiz Author</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar>
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {(quiz.profiles?.full_name || quiz.profiles?.username || "U").charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium text-foreground">
                        {quiz.profiles?.full_name || quiz.profiles?.username || "Unknown Author"}
                      </h4>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Created on {new Date(quiz.created_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>

              {/* Quiz Info */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Quiz Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subject:</span>
                      <span className="font-medium capitalize">{quiz.subject}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Difficulty:</span>
                      <span className="font-medium capitalize">{quiz.difficulty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="font-medium">{quiz.is_published ? "Published" : "Draft"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
