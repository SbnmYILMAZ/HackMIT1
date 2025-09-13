"use client"

import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Calendar, Trophy, Clock, Target, RotateCcw } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface QuizHistory {
  id: string
  title: string
  topic: string
  difficulty: "easy" | "medium" | "hard"
  score: number
  totalQuestions: number
  timeSpent: number
  completedAt: string
  pointsEarned: number
}

const mockHistory: QuizHistory[] = [
  {
    id: "1",
    title: "JavaScript Fundamentals",
    topic: "Programming",
    difficulty: "medium",
    score: 9,
    totalQuestions: 10,
    timeSpent: 720000,
    completedAt: "2024-01-15T10:30:00Z",
    pointsEarned: 90,
  },
  {
    id: "2",
    title: "World History Quiz",
    topic: "History",
    difficulty: "hard",
    score: 7,
    totalQuestions: 8,
    timeSpent: 900000,
    completedAt: "2024-01-15T09:15:00Z",
    pointsEarned: 105,
  },
  {
    id: "3",
    title: "Basic Math",
    topic: "Mathematics",
    difficulty: "easy",
    score: 10,
    totalQuestions: 10,
    timeSpent: 480000,
    completedAt: "2024-01-14T16:45:00Z",
    pointsEarned: 100,
  },
  {
    id: "4",
    title: "English Grammar",
    topic: "Language",
    difficulty: "medium",
    score: 8,
    totalQuestions: 10,
    timeSpent: 600000,
    completedAt: "2024-01-14T14:20:00Z",
    pointsEarned: 80,
  },
  {
    id: "5",
    title: "React Components",
    topic: "Programming",
    difficulty: "hard",
    score: 6,
    totalQuestions: 8,
    timeSpent: 1080000,
    completedAt: "2024-01-13T11:00:00Z",
    pointsEarned: 90,
  },
]

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [topicFilter, setTopicFilter] = useState("all")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [sortBy, setSortBy] = useState("recent")

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
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getPerformanceColor = (score: number, total: number) => {
    const percentage = (score / total) * 100
    if (percentage >= 90) return "text-green-600"
    if (percentage >= 80) return "text-blue-600"
    if (percentage >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const filteredHistory = mockHistory.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTopic = topicFilter === "all" || item.topic.toLowerCase() === topicFilter
    const matchesDifficulty = difficultyFilter === "all" || item.difficulty === difficultyFilter
    return matchesSearch && matchesTopic && matchesDifficulty
  })

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">Quiz History</h1>
            <p className="text-muted-foreground mt-1">Review all your past quiz attempts and performance</p>
          </div>

          {/* Filters */}
          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search quiz history..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Select value={topicFilter} onValueChange={setTopicFilter}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Topic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Topics</SelectItem>
                      <SelectItem value="programming">Programming</SelectItem>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="history">History</SelectItem>
                      <SelectItem value="language">Language</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="score">Highest Score</SelectItem>
                      <SelectItem value="time">Fastest Time</SelectItem>
                      <SelectItem value="points">Most Points</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Attempts</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{filteredHistory.length}</div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {Math.round(
                    filteredHistory.reduce((sum, item) => sum + (item.score / item.totalQuestions) * 100, 0) /
                      filteredHistory.length,
                  )}
                  %
                </div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Points</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {filteredHistory.reduce((sum, item) => sum + item.pointsEarned, 0)}
                </div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {Math.round(filteredHistory.reduce((sum, item) => sum + item.timeSpent, 0) / 60000)}m
                </div>
              </CardContent>
            </Card>
          </div>

          {/* History List */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Quiz History</CardTitle>
              <CardDescription>Showing {filteredHistory.length} quiz attempts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredHistory.map((item) => (
                  <div key={item.id} className="border border-border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                          <Badge className={getDifficultyColor(item.difficulty)} variant="secondary">
                            {item.difficulty}
                          </Badge>
                          <Badge variant="outline">{item.topic}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(item.completedAt)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{formatTime(item.timeSpent)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-3xl font-bold ${getPerformanceColor(item.score, item.totalQuestions)}`}>
                          {Math.round((item.score / item.totalQuestions) * 100)}%
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {item.score}/{item.totalQuestions} correct
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="bg-muted/50 rounded-lg p-3 text-center">
                        <div className="text-lg font-semibold text-foreground">{item.score}</div>
                        <div className="text-xs text-muted-foreground">Correct Answers</div>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-3 text-center">
                        <div className="text-lg font-semibold text-foreground">{item.totalQuestions}</div>
                        <div className="text-xs text-muted-foreground">Total Questions</div>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-3 text-center">
                        <div className="text-lg font-semibold text-foreground">{item.pointsEarned}</div>
                        <div className="text-xs text-muted-foreground">Points Earned</div>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-3 text-center">
                        <div className="text-lg font-semibold text-foreground">{formatTime(item.timeSpent)}</div>
                        <div className="text-xs text-muted-foreground">Time Taken</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/quiz/${item.id}/results`}>View Details</Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/quiz/${item.id}`}>
                          <RotateCcw className="w-4 h-4 mr-1" />
                          Retake
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredHistory.length === 0 && (
                <div className="text-center py-12">
                  <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No quiz history found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters or take some quizzes to build your history.
                  </p>
                  <Button asChild>
                    <Link href="/catalog">Browse Quizzes</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
