"use client"

import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trophy, Target, Clock, CheckCircle, XCircle, Star, RotateCcw, Home, Share2, Award } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"

interface QuizResult {
  quizId: string
  title: string
  score: number
  totalQuestions: number
  timeSpent: number
  answers: (number | null)[]
  questions: Array<{
    id: string
    question: string
    options: string[]
    correctAnswer: number
    explanation: string
    difficulty: "easy" | "medium" | "hard"
  }>
  completedAt: number
}

export default function QuizResultsPage() {
  const params = useParams()
  const quizId = params.id as string
  const [result, setResult] = useState<QuizResult | null>(null)
  const [newBadges, setNewBadges] = useState<string[]>([])

  useEffect(() => {
    // Load quiz result from localStorage
    const savedResult = localStorage.getItem(`quiz-result-${quizId}`)
    if (savedResult) {
      const parsedResult = JSON.parse(savedResult)
      setResult({
        ...parsedResult,
        timeSpent: Date.now() - parsedResult.startTime,
        completedAt: Date.now(),
      })

      // Check for new badges
      const badges = []
      const percentage = (parsedResult.score / parsedResult.questions.length) * 100
      if (percentage === 100) badges.push("Perfect Score")
      if (percentage >= 90) badges.push("High Achiever")
      if (parsedResult.questions.length >= 15) badges.push("Endurance")
      setNewBadges(badges)
    }
  }, [quizId])

  if (!result) {
    return (
      <AuthGuard>
        <DashboardLayout>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-foreground mb-4">Results Not Found</h1>
            <p className="text-muted-foreground mb-6">Unable to load quiz results.</p>
            <Button asChild>
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </DashboardLayout>
      </AuthGuard>
    )
  }

  const percentage = Math.round((result.score / result.totalQuestions) * 100)
  const timeSpentMinutes = Math.round(result.timeSpent / 60000)

  const getPerformanceLevel = (percentage: number) => {
    if (percentage >= 90) return { level: "Excellent", color: "text-green-600", bgColor: "bg-green-100" }
    if (percentage >= 80) return { level: "Good", color: "text-blue-600", bgColor: "bg-blue-100" }
    if (percentage >= 70) return { level: "Fair", color: "text-yellow-600", bgColor: "bg-yellow-100" }
    return { level: "Needs Improvement", color: "text-red-600", bgColor: "bg-red-100" }
  }

  const performance = getPerformanceLevel(percentage)

  const formatTime = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000)
    const seconds = Math.floor((milliseconds % 60000) / 1000)
    return `${minutes}m ${seconds}s`
  }

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Quiz Complete!</h1>
            <p className="text-muted-foreground">Here's how you performed on {result.title}</p>
          </div>

          {/* Score Overview */}
          <Card className="border-border">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="text-6xl font-bold text-foreground mb-2">{percentage}%</div>
                <Badge className={`${performance.bgColor} ${performance.color} text-lg px-4 py-2`} variant="secondary">
                  {performance.level}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">{result.score}</div>
                  <div className="text-sm text-muted-foreground">Correct Answers</div>
                  <div className="text-xs text-muted-foreground">out of {result.totalQuestions}</div>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-secondary" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">{timeSpentMinutes}</div>
                  <div className="text-sm text-muted-foreground">Minutes</div>
                  <div className="text-xs text-muted-foreground">Time Spent</div>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Star className="w-6 h-6 text-accent" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">+{result.score * 10}</div>
                  <div className="text-sm text-muted-foreground">Points Earned</div>
                  <div className="text-xs text-muted-foreground">Added to Total</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* New Badges */}
          {newBadges.length > 0 && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  New Badges Earned!
                </CardTitle>
                <CardDescription>Congratulations on your achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {newBadges.map((badge, index) => (
                    <Badge
                      key={index}
                      className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 text-sm flex items-center gap-2"
                    >
                      <Trophy className="w-4 h-4" />
                      {badge}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Detailed Results */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Question Review</CardTitle>
              <CardDescription>Review your answers and explanations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {result.questions.map((question, index) => {
                  const userAnswer = result.answers[index]
                  const isCorrect = userAnswer === question.correctAnswer
                  const wasAnswered = userAnswer !== null

                  return (
                    <div key={question.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Question {index + 1}</Badge>
                          <Badge
                            className={
                              question.difficulty === "easy"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : question.difficulty === "medium"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            }
                            variant="secondary"
                          >
                            {question.difficulty}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          {wasAnswered ? (
                            isCorrect ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-600" />
                            )
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-gray-300" />
                          )}
                        </div>
                      </div>

                      <h4 className="font-medium text-foreground mb-3">{question.question}</h4>

                      <div className="space-y-2 mb-4">
                        {question.options.map((option, optionIndex) => {
                          const isUserAnswer = userAnswer === optionIndex
                          const isCorrectAnswer = optionIndex === question.correctAnswer

                          return (
                            <div
                              key={optionIndex}
                              className={`p-3 rounded-lg border ${
                                isCorrectAnswer
                                  ? "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800"
                                  : isUserAnswer && !isCorrectAnswer
                                    ? "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800"
                                    : "bg-muted/50 border-border"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-background text-foreground text-sm font-medium">
                                  {String.fromCharCode(65 + optionIndex)}
                                </div>
                                <span className="flex-1">{option}</span>
                                {isCorrectAnswer && <CheckCircle className="w-4 h-4 text-green-600" />}
                                {isUserAnswer && !isCorrectAnswer && <XCircle className="w-4 h-4 text-red-600" />}
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-sm text-foreground">
                          <strong>Explanation:</strong> {question.explanation}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/dashboard">
                <Home className="w-5 h-5 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href={`/quiz/${quizId}`}>
                <RotateCcw className="w-5 h-5 mr-2" />
                Retake Quiz
              </Link>
            </Button>
            <Button size="lg" variant="outline">
              <Share2 className="w-5 h-5 mr-2" />
              Share Results
            </Button>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
