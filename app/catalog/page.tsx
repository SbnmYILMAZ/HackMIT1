"use client"

import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Filter,
  Play,
  Clock,
  Star,
  Users,
  BookOpen,
  Brain,
  Calculator,
  Globe,
  Code,
  Palette,
  Music,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect, useMemo } from "react"
import { fetchQuizzes } from "@/lib/api/quiz-api"
import type { SubjectType, DifficultyType } from "@/lib/types/database"

interface Quiz {
  id: string
  title: string
  description?: string
  subject: SubjectType
  difficulty: DifficultyType
  is_published: boolean
  created_at: string
  updated_at: string
  profiles?: {
    id: string
    username?: string
    full_name?: string
  } | null
  questions?: { id: string }[]
  _count?: {
    questions: number
    attempts: number
  }
}

const subjects = ["All", "Mathematics", "Physics", "General Knowledge"]
const difficulties = ["All", "easy", "medium", "hard"]

const getSubjectIcon = (subject: string) => {
  switch (subject.toLowerCase()) {
    case "math":
      return Calculator
    case "physics":
      return Brain
    case "general":
      return Globe
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

export default function CatalogPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("All")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")
  const [sortBy, setSortBy] = useState("popular")

  // Load quizzes on component mount
  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchQuizzes({ published: true })
        setQuizzes(data)
      } catch (err) {
        console.error('Error loading quizzes:', err)
        setError('Failed to load quizzes. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    loadQuizzes()
  }, [])

  const filteredAndSortedQuizzes = useMemo(() => {
    const filtered = quizzes.filter((quiz) => {
      const matchesSearch =
        quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (quiz.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)

      const matchesSubject = selectedSubject === "All" || 
        (quiz.subject === "math" && selectedSubject === "Mathematics") ||
        (quiz.subject === "physics" && selectedSubject === "Physics") ||
        (quiz.subject === "general" && selectedSubject === "General Knowledge")
      const matchesDifficulty = selectedDifficulty === "All" || quiz.difficulty === selectedDifficulty

      return matchesSearch && matchesSubject && matchesDifficulty
    })

    // Sort quizzes
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return (b._count?.attempts || 0) - (a._count?.attempts || 0)
        case "rating":
          // For now, sort by creation date as we don't have ratings yet
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case "difficulty":
          const difficultyOrder = { easy: 1, medium: 2, hard: 3 }
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
        default:
          return 0
      }
    })

    return filtered
  }, [quizzes, searchQuery, selectedSubject, selectedDifficulty, sortBy])

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">Quiz Catalog</h1>
            <p className="text-muted-foreground mt-1">
              Discover and take quizzes on various subjects to expand your knowledge
            </p>
          </div>

          {/* Search and Filters */}
          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search quizzes, subjects, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      {difficulties.map((difficulty) => (
                        <SelectItem key={difficulty} value={difficulty}>
                          {difficulty === "All"
                            ? "All Levels"
                            : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="difficulty">Difficulty</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Active Filters */}
              {(selectedSubject !== "All" || selectedDifficulty !== "All" || searchQuery) && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {searchQuery && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      Search: "{searchQuery}"
                    </Badge>
                  )}
                  {selectedSubject !== "All" && (
                    <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                      Subject: {selectedSubject}
                    </Badge>
                  )}
                  {selectedDifficulty !== "All" && (
                    <Badge variant="secondary" className="bg-accent/10 text-accent">
                      Difficulty: {selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)}
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedSubject("All")
                      setSelectedDifficulty("All")
                    }}
                    className="h-6 px-2 text-xs"
                  >
                    Clear All
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Loading State */}
          {loading && (
            <Card className="border-border">
              <CardContent className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading quizzes...</p>
              </CardContent>
            </Card>
          )}

          {/* Error State */}
          {error && (
            <Card className="border-border border-red-200">
              <CardContent className="text-center py-12">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-red-600 text-xl">!</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Error Loading Quizzes</h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                >
                  Try Again
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Results Count */}
          {!loading && !error && (
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">
                Showing {filteredAndSortedQuizzes.length} of {quizzes.length} quizzes
              </p>
            </div>
          )}

          {/* Quiz Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedQuizzes.map((quiz) => {
                const SubjectIcon = getSubjectIcon(quiz.subject)
                const questionCount = quiz.questions?.length || quiz._count?.questions || 0
                const completions = quiz._count?.attempts || 0
                const isNew = new Date(quiz.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
                const isPopular = completions > 100
                
                return (
                  <Card key={quiz.id} className="border-border hover:shadow-lg transition-all duration-200 group">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <SubjectIcon className="w-4 h-4 text-primary" />
                          </div>
                          <Badge className={getDifficultyColor(quiz.difficulty)} variant="secondary">
                            {quiz.difficulty}
                          </Badge>
                        </div>
                        <div className="flex gap-1">
                          {isPopular && (
                            <Badge
                              className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
                              variant="secondary"
                            >
                              Popular
                            </Badge>
                          )}
                          {isNew && (
                            <Badge
                              className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                              variant="secondary"
                            >
                              New
                            </Badge>
                          )}
                        </div>
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">{quiz.title}</CardTitle>
                      <CardDescription className="text-sm line-clamp-2">{quiz.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        {/* Quiz Stats */}
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <BookOpen className="w-4 h-4" />
                              <span>{questionCount} questions</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{Math.max(1, Math.ceil(questionCount * 1.5))} min</span>
                            </div>
                          </div>
                        </div>

                        {/* Completions */}
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Users className="w-4 h-4" />
                            <span>{completions.toLocaleString()} completed</span>
                          </div>
                        </div>

                        {/* Author and Action */}
                        <div className="flex items-center justify-between pt-2 border-t border-border">
                          <span className="text-sm text-muted-foreground">
                            by {quiz.profiles?.username || quiz.profiles?.full_name || 'Anonymous'}
                          </span>
                          <Button size="sm" asChild>
                            <Link href={`/quiz/${quiz.id}`}>
                              <Play className="w-4 h-4 mr-1" />
                              Start Quiz
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {/* No Results */}
          {!loading && !error && filteredAndSortedQuizzes.length === 0 && (
            <Card className="border-border">
              <CardContent className="text-center py-12">
                <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No quizzes found</h3>
                <p className="text-muted-foreground mb-4">
                  {quizzes.length === 0 
                    ? "No quizzes are available yet. Check back later or create your own!"
                    : "Try adjusting your search criteria or browse all available quizzes."
                  }
                </p>
                {quizzes.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedSubject("All")
                      setSelectedDifficulty("All")
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
