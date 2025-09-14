"use client"

import { useState, useEffect } from "react"
import { SubjectType, DifficultyType } from "@/lib/types/database"
import { fetchQuizzes, QuizWithProfile } from "@/lib/api/quiz-api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Search,
  MoreHorizontal,
  BookOpen,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Edit,
  Trash2,
  Flag,
  Users,
  BarChart3,
  AlertTriangle,
} from "lucide-react"

// Quiz interface
interface QuizData {
  id: string
  title: string
  subject: SubjectType
  difficulty: DifficultyType
  status: 'published' | 'pending' | 'draft' | 'flagged' | 'rejected'
  author: string
  authorId: string
  createdAt: string
  updatedAt: string
  questions: number
  attempts: number
  averageScore: number
  reports: number
  featured: boolean
  is_published: boolean
  profiles?: {
    id: string
    username?: string
    full_name?: string
  } | null
  _count?: {
    questions: number
    attempts: number
  }
}


export function QuizManagement() {
  const [quizzes, setQuizzes] = useState<QuizData[]>([])
  const [filteredQuizzes, setFilteredQuizzes] = useState<QuizData[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [subjectFilter, setSubjectFilter] = useState("all")
  const [selectedQuiz, setSelectedQuiz] = useState<QuizData | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load quizzes from API
  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await fetchQuizzes({})
        
        // Transform API data to QuizData format
        const transformedQuizzes: QuizData[] = data.map((quiz: QuizWithProfile) => ({
          id: quiz.id,
          title: quiz.title,
          subject: quiz.subject,
          difficulty: quiz.difficulty,
          status: quiz.is_published ? 'published' : 'draft',
          author: quiz.profiles?.username || quiz.profiles?.full_name || 'Anonymous',
          authorId: quiz.profiles?.id || 'unknown',
          createdAt: quiz.created_at,
          updatedAt: quiz.updated_at,
          questions: 0, // Would need questions count from API
          attempts: 0, // Would need attempt stats API
          averageScore: 0, // Would need attempt stats API
          reports: 0, // Would need reports API
          featured: false, // Would need featured flag in DB
          is_published: quiz.is_published,
          profiles: quiz.profiles
        }))
        
        setQuizzes(transformedQuizzes)
        setFilteredQuizzes(transformedQuizzes)
      } catch (err) {
        console.error('Error loading quizzes:', err)
        setError('Failed to load quizzes')
      } finally {
        setIsLoading(false)
      }
    }
    
    loadQuizzes()
  }, [])

  useEffect(() => {
    let filtered = [...quizzes]

    // Apply tab filter
    if (activeTab !== "all") {
      if (activeTab === "pending") {
        filtered = filtered.filter((quiz) => quiz.status === "pending")
      } else if (activeTab === "flagged") {
        filtered = filtered.filter((quiz) => quiz.status === "flagged" || quiz.reports > 0)
      } else if (activeTab === "featured") {
        filtered = filtered.filter((quiz) => quiz.featured)
      }
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (quiz) =>
          quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          quiz.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          quiz.subject.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((quiz) => quiz.status === statusFilter)
    }

    // Apply subject filter
    if (subjectFilter !== "all") {
      filtered = filtered.filter((quiz) => quiz.subject === subjectFilter)
    }

    setFilteredQuizzes(filtered)
  }, [quizzes, searchTerm, statusFilter, subjectFilter, activeTab])

  const getStatusBadge = (status: string, reports: number = 0) => {
    if (reports > 0) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <Flag className="w-3 h-3" />
          Flagged ({reports})
        </Badge>
      )
    }

    const variants = {
      published: { variant: "default", icon: CheckCircle, color: "text-green-400" },
      pending: { variant: "secondary", icon: Clock, color: "text-yellow-400" },
      draft: { variant: "outline", icon: Edit, color: "text-slate-400" },
      flagged: { variant: "destructive", icon: Flag, color: "text-red-400" },
      rejected: { variant: "destructive", icon: XCircle, color: "text-red-400" },
    } as const

    const config = variants[status as keyof typeof variants] || variants.draft
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getDifficultyBadge = (difficulty: DifficultyType) => {
    const colors = {
      easy: "bg-green-500/20 text-green-300 border-green-500/30",
      medium: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      hard: "bg-red-500/20 text-red-300 border-red-500/30",
    }

    return (
      <Badge className={colors[difficulty] || colors.medium}>
        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
      </Badge>
    )
  }

  const handleQuizAction = async (action: string, quizId: string) => {
    try {
      setIsLoading(true)
      
      // In a real app, these would be API calls
      switch (action) {
        case "view":
          // Navigate to quiz view
          window.open(`/quiz/${quizId}`, '_blank')
          break
        case "edit":
          // Navigate to quiz edit
          window.open(`/quiz/${quizId}/edit`, '_blank')
          break
        case "approve":
        case "reject":
        case "flag":
        case "unflag":
        case "feature":
        case "delete":
          // Update local state for demo purposes
          setQuizzes((prevQuizzes) =>
            prevQuizzes
              .map((quiz) => {
                if (quiz.id === quizId) {
                  switch (action) {
                    case "approve":
                      return { ...quiz, status: "published" as const }
                    case "reject":
                      return { ...quiz, status: "rejected" as const }
                    case "flag":
                      return { ...quiz, status: "flagged" as const, reports: quiz.reports + 1 }
                    case "unflag":
                      return { ...quiz, status: "published" as const, reports: 0 }
                    case "feature":
                      return { ...quiz, featured: !quiz.featured }
                    case "delete":
                      return quiz // Will be filtered out below
                    default:
                      return quiz
                  }
                }
                return quiz
              })
              .filter((quiz) => action !== "delete" || quiz.id !== quizId)
          )
          break
        default:
          console.warn(`Unknown action: ${action}`)
      }
    } catch (error) {
      console.error('Error performing quiz action:', error)
      setError(`Failed to ${action} quiz`)
    } finally {
      setIsLoading(false)
    }
  }

  const stats = {
    total: quizzes.length,
    published: quizzes.filter((q) => q.status === "published").length,
    pending: quizzes.filter((q) => q.status === "pending").length,
    flagged: quizzes.filter((q) => q.status === "flagged" || q.reports > 0).length,
    featured: quizzes.filter((q) => q.featured).length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Quiz Management</h1>
          <p className="text-slate-400 mt-1">Moderate and manage quiz content</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
          <BookOpen className="w-4 h-4 mr-2" />
          Create Quiz
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Quizzes</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <BookOpen className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Published</p>
                <p className="text-2xl font-bold text-white">{stats.published}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Pending</p>
                <p className="text-2xl font-bold text-white">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Flagged</p>
                <p className="text-2xl font-bold text-white">{stats.flagged}</p>
              </div>
              <Flag className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Featured</p>
                <p className="text-2xl font-bold text-white">{stats.featured}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-cyan-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-900 border-slate-800">
          <TabsTrigger value="all" className="data-[state=active]:bg-slate-800">
            All Quizzes ({stats.total})
          </TabsTrigger>
          <TabsTrigger value="pending" className="data-[state=active]:bg-slate-800">
            Pending ({stats.pending})
          </TabsTrigger>
          <TabsTrigger value="flagged" className="data-[state=active]:bg-slate-800">
            Flagged ({stats.flagged})
          </TabsTrigger>
          <TabsTrigger value="featured" className="data-[state=active]:bg-slate-800">
            Featured ({stats.featured})
          </TabsTrigger>
        </TabsList>

        {/* Filters and Search */}
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search quizzes by title, author, or subject..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-800 border-slate-700 text-white"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48 bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="flagged">Flagged</SelectItem>
                </SelectContent>
              </Select>
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger className="w-full md:w-48 bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Filter by subject" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all">All Subjects</SelectItem>
                  <SelectItem value="math">Math</SelectItem>
                  <SelectItem value="physics">Physics</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <TabsContent value={activeTab} className="space-y-6">
          {/* Loading State */}
          {isLoading && (
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-slate-400">Cargando quizzes...</p>
              </CardContent>
            </Card>
          )}

          {/* Error State */}
          {error && (
            <Card className="bg-slate-900 border-slate-800 border-red-500/20">
              <CardContent className="text-center py-12">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-red-600 text-xl">!</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Error al cargar quizzes</h3>
                <p className="text-slate-400 mb-4">{error}</p>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  Intentar de nuevo
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Quizzes Table */}
          {!isLoading && !error && (
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Quizzes ({filteredQuizzes.length})</CardTitle>
                <CardDescription className="text-slate-400">Gestionar contenido y moderación de quizzes</CardDescription>
              </CardHeader>
              <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-800">
                    <TableHead className="text-slate-300">Quiz</TableHead>
                    <TableHead className="text-slate-300">Author</TableHead>
                    <TableHead className="text-slate-300">Category</TableHead>
                    <TableHead className="text-slate-300">Status</TableHead>
                    <TableHead className="text-slate-300">Stats</TableHead>
                    <TableHead className="text-slate-300">Created</TableHead>
                    <TableHead className="text-slate-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQuizzes.map((quiz) => (
                    <TableRow key={quiz.id} className="border-slate-800">
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <p className="text-white font-medium">{quiz.title}</p>
                            {quiz.featured && (
                              <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 text-xs">
                                Featured
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            {getDifficultyBadge(quiz.difficulty)}
                            <span className="text-slate-400 text-sm">{quiz.questions} questions</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-slate-700 text-white text-xs">
                              {quiz.author
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-slate-300">{quiz.author}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-slate-600 text-slate-300">
                          {quiz.subject === "math" ? "Math" : quiz.subject === "physics" ? "Physics" : "General"}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(quiz.status, quiz.reports)}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1 text-sm">
                            <Users className="w-3 h-3 text-slate-400" />
                            <span className="text-slate-300">{quiz.attempts}</span>
                          </div>
                          {quiz.attempts > 0 && (
                            <div className="flex items-center space-x-1 text-sm">
                              <BarChart3 className="w-3 h-3 text-slate-400" />
                              <span className="text-slate-300">{quiz.averageScore}%</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-400">
                        {new Date(quiz.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-slate-400 hover:text-white hover:bg-slate-800"
                              onClick={() => setSelectedQuiz(quiz)}
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Gestionar Quiz: {quiz.title}</DialogTitle>
                              <DialogDescription className="text-slate-400">
                                Selecciona una acción para realizar en este quiz
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6">
                              {/* Quiz Details */}
                              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-800 rounded-lg">
                                <div>
                                  <p className="text-slate-400 text-sm">Autor</p>
                                  <p className="text-white">{quiz.author}</p>
                                </div>
                                <div>
                                  <p className="text-slate-400 text-sm">Materia</p>
                                  <p className="text-white">{quiz.subject === "math" ? "Matemáticas" : quiz.subject === "physics" ? "Física" : "General"}</p>
                                </div>
                                <div>
                                  <p className="text-slate-400 text-sm">Preguntas</p>
                                  <p className="text-white">{quiz.questions}</p>
                                </div>
                                <div>
                                  <p className="text-slate-400 text-sm">Intentos</p>
                                  <p className="text-white">{quiz.attempts}</p>
                                </div>
                                {quiz.reports > 0 && (
                                  <div className="col-span-2">
                                    <p className="text-slate-400 text-sm">Reportes</p>
                                    <div className="flex items-center space-x-2">
                                      <AlertTriangle className="w-4 h-4 text-red-400" />
                                      <p className="text-red-400">{quiz.reports} reportes de usuarios</p>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Actions */}
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                  <Button
                                    variant="outline"
                                    className="border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent"
                                    onClick={() => handleQuizAction("view", quiz.id)}
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    Preview Quiz
                                  </Button>
                                  <Button
                                    variant="outline"
                                    className="border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent"
                                    onClick={() => handleQuizAction("edit", quiz.id)}
                                  >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit Quiz
                                  </Button>

                                  {quiz.status === "pending" && (
                                    <>
                                      <Button
                                        variant="outline"
                                        className="border-green-700 text-green-300 hover:bg-green-900/20 bg-transparent"
                                        onClick={() => handleQuizAction("approve", quiz.id)}
                                        disabled={isLoading}
                                      >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Approve
                                      </Button>
                                      <Button
                                        variant="outline"
                                        className="border-red-700 text-red-300 hover:bg-red-900/20 bg-transparent"
                                        onClick={() => handleQuizAction("reject", quiz.id)}
                                        disabled={isLoading}
                                      >
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Reject
                                      </Button>
                                    </>
                                  )}

                                  {(quiz.status === "flagged" || quiz.reports > 0) && (
                                    <Button
                                      variant="outline"
                                      className="border-green-700 text-green-300 hover:bg-green-900/20 bg-transparent"
                                      onClick={() => handleQuizAction("unflag", quiz.id)}
                                      disabled={isLoading}
                                    >
                                      <CheckCircle className="w-4 h-4 mr-2" />
                                      Clear Flags
                                    </Button>
                                  )}

                                  {quiz.status === "published" && (
                                    <>
                                      <Button
                                        variant="outline"
                                        className="border-yellow-700 text-yellow-300 hover:bg-yellow-900/20 bg-transparent"
                                        onClick={() => handleQuizAction("feature", quiz.id)}
                                        disabled={isLoading}
                                      >
                                        <BarChart3 className="w-4 h-4 mr-2" />
                                        {quiz.featured ? "Unfeature" : "Feature"}
                                      </Button>
                                      <Button
                                        variant="outline"
                                        className="border-red-700 text-red-300 hover:bg-red-900/20 bg-transparent"
                                        onClick={() => handleQuizAction("flag", quiz.id)}
                                        disabled={isLoading}
                                      >
                                        <Flag className="w-4 h-4 mr-2" />
                                        Flag Quiz
                                      </Button>
                                    </>
                                  )}
                                </div>

                                <Button
                                  variant="destructive"
                                  className="w-full"
                                  onClick={() => handleQuizAction("delete", quiz.id)}
                                  disabled={isLoading}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete Quiz
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredQuizzes.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <div className="text-slate-400">
                          <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p className="text-lg mb-2">No se encontraron quizzes</p>
                          <p className="text-sm">Ajusta los filtros o crea un nuevo quiz</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
