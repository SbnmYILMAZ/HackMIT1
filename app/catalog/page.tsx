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
import { useState, useMemo } from "react"

interface Quiz {
  id: string
  title: string
  description: string
  topic: string
  difficulty: "easy" | "medium" | "hard"
  questionCount: number
  estimatedTime: number
  rating: number
  completions: number
  author: string
  tags: string[]
  isPopular?: boolean
  isNew?: boolean
}

const mockQuizzes: Quiz[] = [
  {
    id: "1",
    title: "JavaScript Fundamentals",
    description: "Test your knowledge of JavaScript basics including variables, functions, and control structures.",
    topic: "Programming",
    difficulty: "medium",
    questionCount: 15,
    estimatedTime: 12,
    rating: 4.8,
    completions: 1234,
    author: "CodeMaster",
    tags: ["javascript", "programming", "web-development"],
    isPopular: true,
  },
  {
    id: "2",
    title: "World History: Ancient Civilizations",
    description: "Explore the rise and fall of ancient civilizations from Egypt to Rome.",
    topic: "History",
    difficulty: "hard",
    questionCount: 20,
    estimatedTime: 18,
    rating: 4.6,
    completions: 892,
    author: "HistoryBuff",
    tags: ["history", "ancient", "civilizations"],
  },
  {
    id: "3",
    title: "Basic Algebra",
    description: "Master the fundamentals of algebra with equations, variables, and problem-solving.",
    topic: "Mathematics",
    difficulty: "easy",
    questionCount: 12,
    estimatedTime: 10,
    rating: 4.9,
    completions: 2156,
    author: "MathWiz",
    tags: ["math", "algebra", "equations"],
    isNew: true,
  },
  {
    id: "4",
    title: "English Grammar Essentials",
    description: "Improve your grammar skills with comprehensive exercises on tenses, punctuation, and syntax.",
    topic: "Language",
    difficulty: "medium",
    questionCount: 18,
    estimatedTime: 15,
    rating: 4.7,
    completions: 1567,
    author: "GrammarGuru",
    tags: ["english", "grammar", "language"],
  },
  {
    id: "5",
    title: "Introduction to React",
    description: "Learn the basics of React including components, props, and state management.",
    topic: "Programming",
    difficulty: "medium",
    questionCount: 16,
    estimatedTime: 14,
    rating: 4.8,
    completions: 987,
    author: "ReactPro",
    tags: ["react", "javascript", "frontend"],
    isPopular: true,
  },
  {
    id: "6",
    title: "Art History: Renaissance",
    description: "Discover the masterpieces and artists of the Renaissance period.",
    topic: "Art",
    difficulty: "medium",
    questionCount: 14,
    estimatedTime: 12,
    rating: 4.5,
    completions: 654,
    author: "ArtLover",
    tags: ["art", "renaissance", "history"],
  },
  {
    id: "7",
    title: "Basic Chemistry",
    description: "Understand fundamental chemistry concepts including atoms, molecules, and reactions.",
    topic: "Science",
    difficulty: "hard",
    questionCount: 22,
    estimatedTime: 20,
    rating: 4.4,
    completions: 743,
    author: "ChemExpert",
    tags: ["chemistry", "science", "atoms"],
  },
  {
    id: "8",
    title: "Music Theory Basics",
    description: "Learn the fundamentals of music theory including scales, chords, and rhythm.",
    topic: "Music",
    difficulty: "easy",
    questionCount: 10,
    estimatedTime: 8,
    rating: 4.6,
    completions: 432,
    author: "MusicMaestro",
    tags: ["music", "theory", "scales"],
    isNew: true,
  },
]

const topics = ["All", "Programming", "Mathematics", "History", "Language", "Science", "Art", "Music"]
const difficulties = ["All", "easy", "medium", "hard"]

const getTopicIcon = (topic: string) => {
  switch (topic.toLowerCase()) {
    case "programming":
      return Code
    case "mathematics":
      return Calculator
    case "history":
      return Globe
    case "language":
      return BookOpen
    case "science":
      return Brain
    case "art":
      return Palette
    case "music":
      return Music
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
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTopic, setSelectedTopic] = useState("All")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")
  const [sortBy, setSortBy] = useState("popular")

  const filteredAndSortedQuizzes = useMemo(() => {
    const filtered = mockQuizzes.filter((quiz) => {
      const matchesSearch =
        quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quiz.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quiz.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesTopic = selectedTopic === "All" || quiz.topic === selectedTopic
      const matchesDifficulty = selectedDifficulty === "All" || quiz.difficulty === selectedDifficulty

      return matchesSearch && matchesTopic && matchesDifficulty
    })

    // Sort quizzes
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.completions - a.completions
        case "rating":
          return b.rating - a.rating
        case "newest":
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)
        case "difficulty":
          const difficultyOrder = { easy: 1, medium: 2, hard: 3 }
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
        default:
          return 0
      }
    })

    return filtered
  }, [searchQuery, selectedTopic, selectedDifficulty, sortBy])

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">Quiz Catalog</h1>
            <p className="text-muted-foreground mt-1">
              Discover and take quizzes on various topics to expand your knowledge
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
                    placeholder="Search quizzes, topics, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {topics.map((topic) => (
                        <SelectItem key={topic} value={topic}>
                          {topic}
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
              {(selectedTopic !== "All" || selectedDifficulty !== "All" || searchQuery) && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {searchQuery && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      Search: "{searchQuery}"
                    </Badge>
                  )}
                  {selectedTopic !== "All" && (
                    <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                      Topic: {selectedTopic}
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
                      setSelectedTopic("All")
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

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              Showing {filteredAndSortedQuizzes.length} of {mockQuizzes.length} quizzes
            </p>
          </div>

          {/* Quiz Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedQuizzes.map((quiz) => {
              const TopicIcon = getTopicIcon(quiz.topic)
              return (
                <Card key={quiz.id} className="border-border hover:shadow-lg transition-all duration-200 group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <TopicIcon className="w-4 h-4 text-primary" />
                        </div>
                        <Badge className={getDifficultyColor(quiz.difficulty)} variant="secondary">
                          {quiz.difficulty}
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        {quiz.isPopular && (
                          <Badge
                            className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
                            variant="secondary"
                          >
                            Popular
                          </Badge>
                        )}
                        {quiz.isNew && (
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
                            <span>{quiz.questionCount} questions</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{quiz.estimatedTime} min</span>
                          </div>
                        </div>
                      </div>

                      {/* Rating and Completions */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{quiz.rating}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Users className="w-4 h-4" />
                          <span>{quiz.completions.toLocaleString()} completed</span>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {quiz.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {quiz.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{quiz.tags.length - 3}
                          </Badge>
                        )}
                      </div>

                      {/* Author and Action */}
                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <span className="text-sm text-muted-foreground">by {quiz.author}</span>
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

          {/* No Results */}
          {filteredAndSortedQuizzes.length === 0 && (
            <Card className="border-border">
              <CardContent className="text-center py-12">
                <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No quizzes found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search criteria or browse all available quizzes.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedTopic("All")
                    setSelectedDifficulty("All")
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
