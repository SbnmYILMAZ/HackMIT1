"use client"

import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Target, Clock, TrendingUp, BookOpen, Star, Award, Zap, Calendar, Play, Plus, Edit } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { getUserAttemptStats, getUserAttempts } from "@/lib/database/attempt-operations"
import { getUserQuizzes } from "@/lib/database/quiz-operations"

interface UserStats {
  totalQuizzes: number
  averageScore: number
  currentStreak: number
  totalPoints: number
  completedToday: number
  weeklyGoal: number
}

interface QuizHistory {
  id: string
  title: string
  subject: "math" | "physics" | "general"
  score: number
  totalQuestions: number
  completedAt: string
  difficulty: "easy" | "medium" | "hard"
}

interface UserBadge {
  id: string
  name: string
  description: string
  icon: string
  earned: boolean
  earnedAt?: string
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<UserStats>({
    totalQuizzes: 0,
    averageScore: 0,
    currentStreak: 0,
    totalPoints: 0,
    completedToday: 0,
    weeklyGoal: 10,
  })
  const [loading, setLoading] = useState(true)

  const [recentQuizzes, setRecentQuizzes] = useState<QuizHistory[]>([])
  const [userProfile, setUserProfile] = useState<{ full_name?: string } | null>(null)

  const [badges] = useState<UserBadge[]>([
    {
      id: "1",
      name: "First Steps",
      description: "Complete your first quiz",
      icon: "target",
      earned: true,
      earnedAt: "2024-01-10T12:00:00Z",
    },
    {
      id: "2",
      name: "Streak Master",
      description: "Maintain a 5-day streak",
      icon: "flame",
      earned: true,
      earnedAt: "2024-01-15T08:00:00Z",
    },
    {
      id: "3",
      name: "Perfect Score",
      description: "Get 100% on any quiz",
      icon: "star",
      earned: true,
      earnedAt: "2024-01-14T16:45:00Z",
    },
    {
      id: "4",
      name: "Quiz Creator",
      description: "Create your first custom quiz",
      icon: "edit",
      earned: false,
    },
    {
      id: "5",
      name: "Knowledge Seeker",
      description: "Complete 50 quizzes",
      icon: "brain",
      earned: false,
    },
    {
      id: "6",
      name: "Speed Demon",
      description: "Complete a quiz in under 2 minutes",
      icon: "zap",
      earned: false,
    },
  ])

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return
      
      try {
        // Load user stats
        const userStats = await getUserAttemptStats(user.id)
        if (userStats) {
          setStats({
            totalQuizzes: userStats.totalAttempts || 0,
            averageScore: userStats.averageScore || 0,
            currentStreak: 0, // TODO: Implement streak calculation
            totalPoints: userStats.totalAttempts * 10 || 0, // Simple points calculation
            completedToday: 0, // TODO: Calculate today's attempts
            weeklyGoal: 10,
          })
        }

        // Load recent attempts
        const attempts = await getUserAttempts(user.id, { limit: 5 })
        if (attempts) {
          const recentHistory: QuizHistory[] = attempts.map((attempt: any) => ({
            id: attempt.id,
            title: attempt.quiz?.title || 'Quiz',
            topic: attempt.quiz?.category || 'General',
            score: attempt.score || 0,
            totalQuestions: attempt.total_questions || 0,
            completedAt: attempt.completed_at || attempt.created_at,
            difficulty: attempt.quiz?.difficulty || 'medium'
          }))
          setRecentQuizzes(recentHistory)
        }

        // Load user profile for display name
        // Use email as fallback since we have username-only auth
        setUserProfile({ full_name: user.email?.split('@')[0] || 'Usuario' })
        
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [user])

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const renderBadgeIcon = (iconName: string) => {
    const iconProps = { className: "w-6 h-6" }
    switch (iconName) {
      case "target":
        return <Target {...iconProps} />
      case "flame":
        return <Zap {...iconProps} />
      case "star":
        return <Star {...iconProps} />
      case "edit":
        return <Edit {...iconProps} />
      case "brain":
        return <BookOpen {...iconProps} />
      case "zap":
        return <Zap {...iconProps} />
      default:
        return <Award {...iconProps} />
    }
  }

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Welcome back, {userProfile?.full_name || "Student"}!</h1>
              <p className="text-muted-foreground mt-1">Ready to continue your learning journey?</p>
            </div>
            <div className="flex gap-3">
              <Button asChild>
                <Link href="/create-quiz">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Quiz
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/catalog">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Browse Quizzes
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stats.totalQuizzes}</div>
                <p className="text-xs text-muted-foreground">Quizzes completed</p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{Math.round(stats.averageScore)}%</div>
                <p className="text-xs text-muted-foreground">Overall performance</p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stats.currentStreak} days</div>
                <p className="text-xs text-muted-foreground">Keep it up!</p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Weekly Progress
                </CardTitle>
                <CardDescription>
                  You've completed {stats.completedToday} quizzes today. Goal: {stats.weeklyGoal} this week.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>
                      {stats.completedToday}/{stats.weeklyGoal}
                    </span>
                  </div>
                  <Progress value={(stats.completedToday / stats.weeklyGoal) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Recent Quizzes
                </CardTitle>
                <CardDescription>Your latest quiz attempts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentQuizzes.map((quiz) => (
                    <div key={quiz.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-foreground">{quiz.title}</h4>
                          <Badge className={getDifficultyColor(quiz.difficulty)} variant="secondary">
                            {quiz.difficulty}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{quiz.subject === "math" ? "Mathematics" : quiz.subject === "physics" ? "Physics" : "General Knowledge"}</p>
                        <p className="text-xs text-muted-foreground mt-1">{formatDate(quiz.completedAt)}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-foreground">
                          {quiz.score}/{quiz.totalQuestions}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {Math.round((quiz.score / quiz.totalQuestions) * 100)}%
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href="/history">View All History</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Badges */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Achievements
                </CardTitle>
                <CardDescription>Your earned badges and upcoming goals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {badges.map((badge) => (
                    <div
                      key={badge.id}
                      className={`p-3 rounded-lg border text-center transition-all ${
                        badge.earned ? "bg-primary/10 border-primary/20" : "bg-muted/50 border-border opacity-60"
                      }`}
                    >
                      <div className="flex justify-center mb-2">{renderBadgeIcon(badge.icon)}</div>
                      <h4 className="font-medium text-sm text-foreground mb-1">{badge.name}</h4>
                      <p className="text-xs text-muted-foreground">{badge.description}</p>
                      {badge.earned && badge.earnedAt && (
                        <p className="text-xs text-primary mt-1">Earned {formatDate(badge.earnedAt)}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Jump into your learning activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="h-20 flex-col gap-2" asChild>
                  <Link href="/catalog">
                    <Play className="w-6 h-6" />
                    Take a Quiz
                  </Link>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent" asChild>
                  <Link href="/create-quiz">
                    <Plus className="w-6 h-6" />
                    Create Quiz
                  </Link>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent" asChild>
                  <Link href="/profile">
                    <Star className="w-6 h-6" />
                    View Profile
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
