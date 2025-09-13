"use client"

import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import {
  Trophy,
  TrendingUp,
  Target,
  Clock,
  Calendar,
  Award,
  BarChart3,
  PieChartIcon,
  Filter,
  Download,
  Share2,
} from "lucide-react"
import { useState } from "react"

interface QuizResult {
  id: string
  title: string
  subject: "math" | "physics" | "general"
  difficulty: "easy" | "medium" | "hard"
  score: number
  totalQuestions: number
  timeSpent: number
  completedAt: string
  pointsEarned: number
}

interface ProgressData {
  date: string
  score: number
  quizzes: number
  points: number
}

interface SubjectPerformance {
  subject: string
  averageScore: number
  quizzesCompleted: number
  totalPoints: number
  color: string
}

const mockResults: QuizResult[] = [
  {
    id: "1",
    title: "Calculus Fundamentals",
    subject: "math",
    difficulty: "medium",
    score: 9,
    totalQuestions: 10,
    timeSpent: 720000,
    completedAt: "2024-01-15T10:30:00Z",
    pointsEarned: 90,
  },
  {
    id: "2",
    title: "Classical Mechanics",
    subject: "physics",
    difficulty: "hard",
    score: 7,
    totalQuestions: 8,
    timeSpent: 900000,
    completedAt: "2024-01-15T09:15:00Z",
    pointsEarned: 105,
  },
  {
    id: "3",
    title: "Basic Algebra",
    subject: "math",
    difficulty: "easy",
    score: 10,
    totalQuestions: 10,
    timeSpent: 480000,
    completedAt: "2024-01-14T16:45:00Z",
    pointsEarned: 100,
  },
  {
    id: "4",
    title: "General Knowledge Quiz",
    subject: "general",
    difficulty: "medium",
    score: 8,
    totalQuestions: 10,
    timeSpent: 600000,
    completedAt: "2024-01-14T14:20:00Z",
    pointsEarned: 80,
  },
  {
    id: "5",
    title: "Quantum Physics",
    subject: "physics",
    difficulty: "hard",
    score: 6,
    totalQuestions: 8,
    timeSpent: 1080000,
    completedAt: "2024-01-13T11:00:00Z",
    pointsEarned: 90,
  },
  {
    id: "6",
    title: "Statistics Basics",
    subject: "math",
    difficulty: "medium",
    score: 9,
    totalQuestions: 12,
    timeSpent: 840000,
    completedAt: "2024-01-12T15:30:00Z",
    pointsEarned: 108,
  },
]

const progressData: ProgressData[] = [
  { date: "Jan 8", score: 75, quizzes: 1, points: 75 },
  { date: "Jan 9", score: 82, quizzes: 2, points: 164 },
  { date: "Jan 10", score: 78, quizzes: 1, points: 78 },
  { date: "Jan 11", score: 88, quizzes: 2, points: 176 },
  { date: "Jan 12", score: 85, quizzes: 1, points: 90 },
  { date: "Jan 13", score: 75, quizzes: 1, points: 90 },
  { date: "Jan 14", score: 90, quizzes: 2, points: 180 },
  { date: "Jan 15", score: 87, quizzes: 2, points: 195 },
]

const subjectPerformance: SubjectPerformance[] = [
  { subject: "math", averageScore: 95, quizzesCompleted: 3, totalPoints: 298, color: "#d97706" },
  { subject: "physics", averageScore: 85, quizzesCompleted: 2, totalPoints: 195, color: "#ec4899" },
  { subject: "general", averageScore: 80, quizzesCompleted: 1, totalPoints: 80, color: "#8b5cf6" },
]

export default function ResultsPage() {
  const [timeFilter, setTimeFilter] = useState("all")
  const [subjectFilter, setSubjectFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("overview")

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

  const formatTime = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000)
    const seconds = Math.floor((milliseconds % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const totalQuizzes = mockResults.length
  const totalPoints = mockResults.reduce((sum, result) => sum + result.pointsEarned, 0)
  const averageScore = Math.round(
    mockResults.reduce((sum, result) => sum + (result.score / result.totalQuestions) * 100, 0) / totalQuizzes,
  )
  const totalTimeSpent = mockResults.reduce((sum, result) => sum + result.timeSpent, 0)

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Results & Progress</h1>
              <p className="text-muted-foreground mt-1">Track your learning journey and performance analytics</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Filters */}
          <Card className="border-border">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Filters:</span>
                </div>
                <Select value={timeFilter} onValueChange={setTimeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    <SelectItem value="math">Math</SelectItem>
                    <SelectItem value="physics">Physics</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{totalQuizzes}</div>
                <p className="text-xs text-muted-foreground">+2 from last week</p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{averageScore}%</div>
                <p className="text-xs text-muted-foreground">+3% from last week</p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Points</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{totalPoints.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+195 from last session</p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{Math.round(totalTimeSpent / 60000)}m</div>
                <p className="text-xs text-muted-foreground">Across all quizzes</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="subjects">By Subject</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Performance Trend */}
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Performance Trend
                    </CardTitle>
                    <CardDescription>Your quiz scores over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={progressData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="score" stroke="#d97706" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Topic Distribution */}
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChartIcon className="w-5 h-5" />
                      Subject Distribution
                    </CardTitle>
                    <CardDescription>Quiz attempts by subject</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={subjectPerformance}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ subject, quizzesCompleted }: any) => `${subject}: ${quizzesCompleted}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="quizzesCompleted"
                        >
                          {subjectPerformance.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Recent Quiz Results</CardTitle>
                  <CardDescription>Your latest quiz performances</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockResults.slice(0, 5).map((result) => (
                      <div key={result.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-foreground">{result.title}</h4>
                            <Badge className={getDifficultyColor(result.difficulty)} variant="secondary">
                              {result.difficulty}
                            </Badge>
                            <Badge variant="outline">{result.subject === "math" ? "Math" : result.subject === "physics" ? "Physics" : "General"}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{formatDate(result.completedAt)}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-foreground">
                            {result.score}/{result.totalQuestions}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {Math.round((result.score / result.totalQuestions) * 100)}% • {formatTime(result.timeSpent)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="progress" className="space-y-6">
              {/* Progress Charts */}
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle>Score Progress</CardTitle>
                    <CardDescription>Track your improvement over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={progressData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="score" stroke="#d97706" fill="#d97706" fillOpacity={0.3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader>
                    <CardTitle>Points Earned</CardTitle>
                    <CardDescription>Daily points accumulation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={progressData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="points" fill="#ec4899" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Streaks and Goals */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle>Learning Streaks</CardTitle>
                    <CardDescription>Your consistency metrics</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Current Streak</span>
                      <span className="text-2xl font-bold text-primary">5 days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Longest Streak</span>
                      <span className="text-lg font-semibold text-foreground">12 days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">This Week</span>
                      <span className="text-lg font-semibold text-foreground">4/7 days</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader>
                    <CardTitle>Weekly Goals</CardTitle>
                    <CardDescription>Track your learning targets</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Quizzes Completed</span>
                        <span>4/10</span>
                      </div>
                      <Progress value={40} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Points Earned</span>
                        <span>375/500</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Study Time</span>
                        <span>45/60 min</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="subjects" className="space-y-6">
              {/* Subject Performance */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Performance by Subject
                  </CardTitle>
                  <CardDescription>Compare your performance across different subjects</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={subjectPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="subject" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="averageScore" fill="#d97706" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Subject Details */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjectPerformance.map((subject) => (
                  <Card key={subject.subject} className="border-border">
                    <CardHeader>
                      <CardTitle className="text-lg">{subject.subject === "math" ? "Math" : subject.subject === "physics" ? "Physics" : "General"}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Average Score</span>
                        <span className="font-semibold">{subject.averageScore}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Quizzes</span>
                        <span className="font-semibold">{subject.quizzesCompleted}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Points</span>
                        <span className="font-semibold">{subject.totalPoints}</span>
                      </div>
                      <Progress value={subject.averageScore} className="h-2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              {/* Complete History */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Complete Quiz History
                  </CardTitle>
                  <CardDescription>All your quiz attempts with detailed results</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockResults.map((result) => (
                      <div key={result.id} className="border border-border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-foreground mb-1">{result.title}</h4>
                            <div className="flex items-center gap-2">
                              <Badge className={getDifficultyColor(result.difficulty)} variant="secondary">
                                {result.difficulty}
                              </Badge>
                              <Badge variant="outline">{result.subject === "math" ? "Math" : result.subject === "physics" ? "Physics" : "General"}</Badge>
                              <span className="text-sm text-muted-foreground">{formatDate(result.completedAt)}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-foreground">
                              {Math.round((result.score / result.totalQuestions) * 100)}%
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {result.score}/{result.totalQuestions} correct
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Time Spent:</span>
                            <div className="font-medium">{formatTime(result.timeSpent)}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Points Earned:</span>
                            <div className="font-medium">{result.pointsEarned}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Questions:</span>
                            <div className="font-medium">{result.totalQuestions}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Accuracy:</span>
                            <div className="font-medium">
                              {Math.round((result.score / result.totalQuestions) * 100)}%
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
