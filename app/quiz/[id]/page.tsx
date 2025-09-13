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
} from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"

// Mock quiz data - in real app this would come from API
const mockQuizData = {
  "1": {
    id: "1",
    title: "JavaScript Fundamentals",
    description:
      "Test your knowledge of JavaScript basics including variables, functions, and control structures. This comprehensive quiz covers essential concepts that every JavaScript developer should know.",
    subject: "general",
    difficulty: "medium" as const,
    questionCount: 15,
    estimatedTime: 12,
    rating: 4.8,
    completions: 1234,
    author: {
      name: "CodeMaster",
      avatar: "/placeholder.svg",
      bio: "Senior Full-Stack Developer with 8+ years of experience",
    },
    tags: ["javascript", "programming", "web-development"],
    isPopular: true,
    objectives: [
      "Understand JavaScript variable declarations and scoping",
      "Master function definitions and arrow functions",
      "Learn about control structures and loops",
      "Grasp object-oriented programming concepts",
      "Apply asynchronous programming patterns",
    ],
    prerequisites: [
      "Basic understanding of HTML and CSS",
      "Familiarity with programming concepts",
      "Text editor or IDE setup",
    ],
    recentScores: [
      { score: 87, total: 15, user: "Alice", date: "2024-01-15" },
      { score: 92, total: 15, user: "Bob", date: "2024-01-14" },
      { score: 78, total: 15, user: "Charlie", date: "2024-01-14" },
      { score: 95, total: 15, user: "Diana", date: "2024-01-13" },
    ],
  },
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

  const quiz = mockQuizData[quizId as keyof typeof mockQuizData]

  if (!quiz) {
    return (
      <AuthGuard>
        <DashboardLayout>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-foreground mb-4">Quiz Not Found</h1>
            <p className="text-muted-foreground mb-6">The quiz you're looking for doesn't exist.</p>
            <Button asChild>
              <Link href="/catalog">Back to Catalog</Link>
            </Button>
          </div>
        </DashboardLayout>
      </AuthGuard>
    )
  }

  const SubjectIcon = getSubjectIcon(quiz.subject)
  const averageScore =
    quiz.recentScores.reduce((acc, score) => acc + (score.score / score.total) * 100, 0) / quiz.recentScores.length

  const handleStartQuiz = async () => {
    setIsStarting(true)
    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, 1000))
    router.push(`/quiz/${quizId}/take`)
  }

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
                        {quiz.isPopular && (
                          <Badge
                            className="ml-2 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
                            variant="secondary"
                          >
                            Popular
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <CardTitle className="text-3xl text-balance">{quiz.title}</CardTitle>
                  <CardDescription className="text-lg text-pretty">{quiz.description}</CardDescription>

                  {/* Quiz Stats */}
                  <div className="flex flex-wrap gap-6 pt-4 text-sm">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-muted-foreground" />
                      <span>{quiz.questionCount} questions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{quiz.estimatedTime} minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{quiz.rating} rating</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>{quiz.completions.toLocaleString()} completed</span>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Learning Objectives */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Learning Objectives
                  </CardTitle>
                  <CardDescription>What you'll learn from this quiz</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {quiz.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-foreground">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Prerequisites */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Prerequisites</CardTitle>
                  <CardDescription>What you should know before taking this quiz</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {quiz.prerequisites.map((prerequisite, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-foreground">{prerequisite}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
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
                    <p>Estimated time: {quiz.estimatedTime} minutes</p>
                    <p>{quiz.questionCount} questions</p>
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
                      <AvatarImage src={quiz.author.avatar || "/placeholder.svg"} alt={quiz.author.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {quiz.author.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium text-foreground">{quiz.author.name}</h4>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{quiz.author.bio}</p>
                </CardContent>
              </Card>

              {/* Recent Performance */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Recent Performance
                  </CardTitle>
                  <CardDescription>Average score: {Math.round(averageScore)}%</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Progress value={averageScore} className="h-2" />
                    <div className="space-y-2">
                      {quiz.recentScores.slice(0, 3).map((score, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{score.user}</span>
                          <span className="font-medium">{Math.round((score.score / score.total) * 100)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {quiz.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
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
