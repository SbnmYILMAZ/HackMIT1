"use client"

import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { LiveRegion } from "@/components/live-region"
import { Wand2, Plus, Trash2, Edit, Save, Eye, Lightbulb, Settings, BookOpen, Target, Clock } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  hint: string
  difficulty: "easy" | "medium" | "hard"
}

interface QuizData {
  title: string
  description: string
  topic: string
  difficulty: "easy" | "medium" | "hard"
  estimatedTime: number
  isPublic: boolean
  tags: string[]
  questions: Question[]
}

const topics = [
  "Programming",
  "Mathematics",
  "History",
  "Language",
  "Science",
  "Art",
  "Music",
  "Business",
  "Health",
  "Other",
]

export default function CreateQuizPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("generate")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [notes, setNotes] = useState("")
  const [newTag, setNewTag] = useState("")
  const [liveMessage, setLiveMessage] = useState("")
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const [quizData, setQuizData] = useState<QuizData>({
    title: "",
    description: "",
    topic: "",
    difficulty: "medium",
    estimatedTime: 10,
    isPublic: true,
    tags: [],
    questions: [],
  })

  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [showQuestionDialog, setShowQuestionDialog] = useState(false)

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!quizData.title.trim()) {
      errors.title = "Quiz title is required"
    }

    if (quizData.questions.length === 0) {
      errors.questions = "At least one question is required"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const generateQuestions = async () => {
    if (!notes.trim()) {
      setLiveMessage("Please enter some notes to generate questions from")
      return
    }

    setIsGenerating(true)
    setLiveMessage("Generating questions from your notes...")

    // Simulate AI question generation
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const generatedQuestions: Question[] = [
      {
        id: "gen-1",
        question: "What is the main concept discussed in the provided notes?",
        options: [
          "Basic programming principles",
          "Advanced data structures",
          "Web development frameworks",
          "Database management",
        ],
        correctAnswer: 0,
        explanation: "Based on the notes provided, the main focus appears to be on basic programming principles.",
        hint: "Look for the most frequently mentioned topic in your notes.",
        difficulty: "medium",
      },
      {
        id: "gen-2",
        question: "Which of the following is a key takeaway from the material?",
        options: [
          "Always use the latest technology",
          "Focus on understanding fundamentals",
          "Memorize all syntax",
          "Skip documentation",
        ],
        correctAnswer: 1,
        explanation: "Understanding fundamentals is crucial for long-term success in any field.",
        hint: "Think about what creates a strong foundation for learning.",
        difficulty: "easy",
      },
      {
        id: "gen-3",
        question: "What would be the best next step after learning this material?",
        options: ["Practice with real projects", "Read more theory", "Take a break", "Start over"],
        correctAnswer: 0,
        explanation: "Practical application helps solidify theoretical knowledge.",
        hint: "Consider how to apply what you've learned.",
        difficulty: "medium",
      },
    ]

    setQuizData((prev) => ({
      ...prev,
      questions: [...prev.questions, ...generatedQuestions],
    }))
    setIsGenerating(false)
    setLiveMessage(`Successfully generated ${generatedQuestions.length} questions`)
  }

  const addManualQuestion = () => {
    const newQuestion: Question = {
      id: `manual-${Date.now()}`,
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: "",
      hint: "",
      difficulty: "medium",
    }
    setEditingQuestion(newQuestion)
    setShowQuestionDialog(true)
  }

  const editQuestion = (question: Question) => {
    setEditingQuestion({ ...question })
    setShowQuestionDialog(true)
  }

  const saveQuestion = () => {
    if (!editingQuestion) return

    if (editingQuestion.question.trim() && editingQuestion.options.every((opt) => opt.trim())) {
      setQuizData((prev) => {
        const existingIndex = prev.questions.findIndex((q) => q.id === editingQuestion.id)
        if (existingIndex >= 0) {
          const updated = [...prev.questions]
          updated[existingIndex] = editingQuestion
          return { ...prev, questions: updated }
        } else {
          return { ...prev, questions: [...prev.questions, editingQuestion] }
        }
      })
      setShowQuestionDialog(false)
      setEditingQuestion(null)
    }
  }

  const deleteQuestion = (questionId: string) => {
    setQuizData((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== questionId),
    }))
  }

  const addTag = () => {
    if (newTag.trim() && !quizData.tags.includes(newTag.trim())) {
      setQuizData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setQuizData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const saveQuiz = async () => {
    if (!validateForm()) {
      setLiveMessage("Please fix the form errors before saving")
      return
    }

    setIsSaving(true)
    setLiveMessage("Saving your quiz...")

    // Simulate saving to API
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Save to localStorage for demo
    const quizId = `custom-${Date.now()}`
    localStorage.setItem(`custom-quiz-${quizId}`, JSON.stringify({ ...quizData, id: quizId }))

    setIsSaving(false)
    setLiveMessage("Quiz saved successfully!")
    router.push(`/quiz/${quizId}`)
  }

  const previewQuiz = () => {
    if (quizData.questions.length === 0) return
    // In a real app, this would open a preview modal or navigate to preview page
    alert("Quiz preview would open here")
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

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="max-w-6xl mx-auto space-y-8">
          <LiveRegion message={liveMessage} />

          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">Create Custom Quiz</h1>
            <p className="text-muted-foreground mt-1">
              Generate questions from your notes or create them manually to share with others
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quiz Settings */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" aria-hidden="true" />
                    Quiz Settings
                  </CardTitle>
                  <CardDescription>Configure your quiz details and settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4" noValidate>
                    <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <legend className="sr-only">Basic quiz information</legend>
                      <div className="space-y-2">
                        <Label htmlFor="title">
                          Quiz Title{" "}
                          <span className="text-destructive" aria-label="required">
                            *
                          </span>
                        </Label>
                        <Input
                          id="title"
                          placeholder="Enter quiz title"
                          value={quizData.title}
                          onChange={(e) => {
                            setQuizData((prev) => ({ ...prev, title: e.target.value }))
                            if (formErrors.title) {
                              setFormErrors((prev) => ({ ...prev, title: "" }))
                            }
                          }}
                          aria-invalid={!!formErrors.title}
                          aria-describedby={formErrors.title ? "title-error" : undefined}
                          required
                        />
                        {formErrors.title && (
                          <div id="title-error" className="text-sm text-destructive" role="alert">
                            {formErrors.title}
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="topic">Topic</Label>
                        <Select
                          value={quizData.topic}
                          onValueChange={(value) => setQuizData((prev) => ({ ...prev, topic: value }))}
                        >
                          <SelectTrigger id="topic" aria-label="Select quiz topic">
                            <SelectValue placeholder="Select topic" />
                          </SelectTrigger>
                          <SelectContent>
                            {topics.map((topic) => (
                              <SelectItem key={topic} value={topic}>
                                {topic}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </fieldset>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe what this quiz covers"
                        value={quizData.description}
                        onChange={(e) => setQuizData((prev) => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        aria-describedby="description-help"
                      />
                      <div id="description-help" className="text-xs text-muted-foreground">
                        Help learners understand what they'll be tested on
                      </div>
                    </div>

                    <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <legend className="sr-only">Quiz difficulty and timing</legend>
                      <div className="space-y-2">
                        <Label htmlFor="difficulty">Difficulty</Label>
                        <Select
                          value={quizData.difficulty}
                          onValueChange={(value: "easy" | "medium" | "hard") =>
                            setQuizData((prev) => ({ ...prev, difficulty: value }))
                          }
                        >
                          <SelectTrigger id="difficulty" aria-label="Select quiz difficulty">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="time">Estimated Time (minutes)</Label>
                        <Input
                          id="time"
                          type="number"
                          min="1"
                          max="120"
                          value={quizData.estimatedTime}
                          onChange={(e) =>
                            setQuizData((prev) => ({ ...prev, estimatedTime: Number.parseInt(e.target.value) || 10 }))
                          }
                          aria-describedby="time-help"
                        />
                        <div id="time-help" className="text-xs text-muted-foreground">
                          How long should learners expect to spend on this quiz?
                        </div>
                      </div>
                    </fieldset>

                    {/* Tags */}
                    <fieldset className="space-y-2">
                      <legend className="text-sm font-medium">Tags</legend>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a tag"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              addTag()
                            }
                          }}
                          aria-label="Enter a new tag"
                          aria-describedby="tags-help"
                        />
                        <Button type="button" onClick={addTag} size="sm" aria-label="Add tag">
                          Add
                        </Button>
                      </div>
                      <div id="tags-help" className="text-xs text-muted-foreground">
                        Add tags to help others find your quiz
                      </div>
                      {quizData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2" role="list" aria-label="Current tags">
                          {quizData.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="cursor-pointer"
                              onClick={() => removeTag(tag)}
                              role="listitem"
                              aria-label={`Remove tag: ${tag}`}
                            >
                              {tag} ×
                            </Badge>
                          ))}
                        </div>
                      )}
                    </fieldset>
                  </form>
                </CardContent>
              </Card>

              {/* Question Creation */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Create Questions</CardTitle>
                  <CardDescription>Generate questions from notes or create them manually</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2" role="tablist">
                      <TabsTrigger value="generate" role="tab" aria-controls="generate-panel">
                        Generate from Notes
                      </TabsTrigger>
                      <TabsTrigger value="manual" role="tab" aria-controls="manual-panel">
                        Manual Creation
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="generate" className="space-y-4" role="tabpanel" id="generate-panel">
                      <div className="space-y-2">
                        <Label htmlFor="notes">Paste Your Notes</Label>
                        <Textarea
                          id="notes"
                          placeholder="Paste your study notes, lecture content, or any text you want to create questions from..."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          rows={8}
                          className="resize-none"
                          aria-describedby="notes-help"
                        />
                        <div id="notes-help" className="text-xs text-muted-foreground">
                          AI will analyze your content and generate relevant quiz questions
                        </div>
                      </div>
                      <Button
                        onClick={generateQuestions}
                        disabled={!notes.trim() || isGenerating}
                        className="w-full"
                        aria-describedby={isGenerating ? "generating-status" : undefined}
                      >
                        <Wand2 className="w-4 h-4 mr-2" aria-hidden="true" />
                        {isGenerating ? "Generating Questions..." : "Generate Questions"}
                      </Button>
                      {isGenerating && (
                        <Alert role="status" aria-live="polite">
                          <Lightbulb className="h-4 w-4" aria-hidden="true" />
                          <AlertDescription id="generating-status">
                            AI is analyzing your notes and generating relevant questions. This may take a moment...
                          </AlertDescription>
                        </Alert>
                      )}
                    </TabsContent>

                    <TabsContent value="manual" className="space-y-4" role="tabpanel" id="manual-panel">
                      <div className="text-center py-8">
                        <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" aria-hidden="true" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">Create Questions Manually</h3>
                        <p className="text-muted-foreground mb-4">
                          Add custom questions with multiple choice answers, explanations, and hints.
                        </p>
                        <Button onClick={addManualQuestion} aria-label="Add a new question manually">
                          <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
                          Add Question
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Questions List */}
              {quizData.questions.length > 0 && (
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle>Questions ({quizData.questions.length})</CardTitle>
                    <CardDescription>Review and edit your quiz questions</CardDescription>
                    {formErrors.questions && (
                      <div className="text-sm text-destructive" role="alert">
                        {formErrors.questions}
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4" role="list" aria-label="Quiz questions">
                      {quizData.questions.map((question, index) => (
                        <div key={question.id} className="border border-border rounded-lg p-4" role="listitem">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">Q{index + 1}</Badge>
                              <Badge className={getDifficultyColor(question.difficulty)} variant="secondary">
                                {question.difficulty}
                              </Badge>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => editQuestion(question)}
                                aria-label={`Edit question ${index + 1}`}
                              >
                                <Edit className="w-4 h-4" aria-hidden="true" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteQuestion(question.id)}
                                aria-label={`Delete question ${index + 1}`}
                              >
                                <Trash2 className="w-4 h-4" aria-hidden="true" />
                              </Button>
                            </div>
                          </div>
                          <h4 className="font-medium text-foreground mb-2">{question.question}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            {question.options.map((option, optionIndex) => (
                              <div
                                key={optionIndex}
                                className={`p-2 rounded border ${
                                  optionIndex === question.correctAnswer
                                    ? "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800"
                                    : "bg-muted/50 border-border"
                                }`}
                                aria-label={optionIndex === question.correctAnswer ? "Correct answer" : "Answer option"}
                              >
                                {String.fromCharCode(65 + optionIndex)}. {option}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quiz Preview */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Quiz Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Target className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                      <span>{quizData.questions.length} questions</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                      <span>~{quizData.estimatedTime} minutes</span>
                    </div>
                    {quizData.topic && (
                      <div className="flex items-center gap-2 text-sm">
                        <BookOpen className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                        <span>{quizData.topic}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={previewQuiz}
                      disabled={quizData.questions.length === 0}
                      aria-label="Preview your quiz before publishing"
                    >
                      <Eye className="w-4 h-4 mr-2" aria-hidden="true" />
                      Preview Quiz
                    </Button>
                    <Button
                      className="w-full"
                      onClick={saveQuiz}
                      disabled={!quizData.title.trim() || quizData.questions.length === 0 || isSaving}
                      aria-describedby={isSaving ? "saving-status" : undefined}
                    >
                      <Save className="w-4 h-4 mr-2" aria-hidden="true" />
                      {isSaving ? "Saving..." : "Save & Publish"}
                    </Button>
                    {isSaving && (
                      <div id="saving-status" className="sr-only" aria-live="polite">
                        Saving your quiz, please wait...
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Tips */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Tips for Great Quizzes</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground" role="list">
                    <li role="listitem">• Keep questions clear and concise</li>
                    <li role="listitem">• Provide helpful explanations</li>
                    <li role="listitem">• Mix difficulty levels</li>
                    <li role="listitem">• Add relevant hints</li>
                    <li role="listitem">• Test your quiz before sharing</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Question Editor Dialog */}
          <Dialog open={showQuestionDialog} onOpenChange={setShowQuestionDialog}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-labelledby="question-dialog-title">
              <DialogHeader>
                <DialogTitle id="question-dialog-title">
                  {editingQuestion?.id.startsWith("manual") ? "Add Question" : "Edit Question"}
                </DialogTitle>
                <DialogDescription>Create a multiple choice question with explanation and hint</DialogDescription>
              </DialogHeader>
              {editingQuestion && (
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault()
                    saveQuestion()
                  }}
                >
                  <div className="space-y-2">
                    <Label htmlFor="question-text">
                      Question{" "}
                      <span className="text-destructive" aria-label="required">
                        *
                      </span>
                    </Label>
                    <Textarea
                      id="question-text"
                      placeholder="Enter your question"
                      value={editingQuestion.question}
                      onChange={(e) =>
                        setEditingQuestion((prev) => (prev ? { ...prev, question: e.target.value } : null))
                      }
                      rows={3}
                      required
                    />
                  </div>

                  <fieldset className="space-y-2">
                    <legend className="text-sm font-medium">
                      Answer Options{" "}
                      <span className="text-destructive" aria-label="required">
                        *
                      </span>
                    </legend>
                    {editingQuestion.options.map((option, index) => (
                      <div key={index} className="flex gap-2">
                        <div className="flex items-center justify-center w-8 h-10 bg-muted rounded text-sm font-medium">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <Input
                          placeholder={`Option ${String.fromCharCode(65 + index)}`}
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...editingQuestion.options]
                            newOptions[index] = e.target.value
                            setEditingQuestion((prev) => (prev ? { ...prev, options: newOptions } : null))
                          }}
                          aria-label={`Option ${String.fromCharCode(65 + index)}`}
                          required
                        />
                        <Button
                          type="button"
                          variant={editingQuestion.correctAnswer === index ? "default" : "outline"}
                          size="sm"
                          onClick={() =>
                            setEditingQuestion((prev) => (prev ? { ...prev, correctAnswer: index } : null))
                          }
                          aria-label={`Mark option ${String.fromCharCode(65 + index)} as ${editingQuestion.correctAnswer === index ? "incorrect" : "correct"}`}
                          aria-pressed={editingQuestion.correctAnswer === index}
                        >
                          {editingQuestion.correctAnswer === index ? "Correct" : "Mark Correct"}
                        </Button>
                      </div>
                    ))}
                  </fieldset>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="explanation-text">Explanation</Label>
                      <Textarea
                        id="explanation-text"
                        placeholder="Explain why this answer is correct"
                        value={editingQuestion.explanation}
                        onChange={(e) =>
                          setEditingQuestion((prev) => (prev ? { ...prev, explanation: e.target.value } : null))
                        }
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hint-text">Hint</Label>
                      <Textarea
                        id="hint-text"
                        placeholder="Provide a helpful hint"
                        value={editingQuestion.hint}
                        onChange={(e) =>
                          setEditingQuestion((prev) => (prev ? { ...prev, hint: e.target.value } : null))
                        }
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="question-difficulty">Difficulty</Label>
                    <Select
                      value={editingQuestion.difficulty}
                      onValueChange={(value: "easy" | "medium" | "hard") =>
                        setEditingQuestion((prev) => (prev ? { ...prev, difficulty: value } : null))
                      }
                    >
                      <SelectTrigger id="question-difficulty">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" onClick={() => setShowQuestionDialog(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Save Question</Button>
                  </div>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
