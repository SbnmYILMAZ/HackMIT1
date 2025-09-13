"use client"

import { AuthGuard } from "@/components/auth-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LiveRegion } from "@/components/live-region"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Clock,
  HelpCircle,
  Lightbulb,
  CheckCircle,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Mic,
  MicOff,
  Flag,
  Home,
} from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect, useCallback, useRef } from "react"

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  hint: string
  difficulty: "easy" | "medium" | "hard"
}

interface QuizSession {
  quizId: string
  title: string
  questions: Question[]
  currentQuestionIndex: number
  answers: (number | null)[]
  startTime: number
  timeLimit?: number
  score: number
  isCompleted: boolean
}

// Mock quiz questions
const mockQuestions: Question[] = [
  {
    id: "1",
    question: "What is the correct way to declare a variable in JavaScript using ES6 syntax?",
    options: ["var myVariable = 5;", "let myVariable = 5;", "const myVariable = 5;", "Both let and const are correct"],
    correctAnswer: 3,
    explanation:
      "Both 'let' and 'const' are ES6 ways to declare variables. 'let' is for variables that can be reassigned, while 'const' is for constants that cannot be reassigned.",
    hint: "Think about the new variable declaration keywords introduced in ES6.",
    difficulty: "easy",
  },
  {
    id: "2",
    question: "Which method is used to add an element to the end of an array in JavaScript?",
    options: ["append()", "push()", "add()", "insert()"],
    correctAnswer: 1,
    explanation:
      "The push() method adds one or more elements to the end of an array and returns the new length of the array.",
    hint: "This method 'pushes' elements to the end of the array.",
    difficulty: "easy",
  },
  {
    id: "3",
    question: "What does the '===' operator do in JavaScript?",
    options: [
      "Checks for equality without type conversion",
      "Checks for equality with type conversion",
      "Assigns a value",
      "Checks if not equal",
    ],
    correctAnswer: 0,
    explanation:
      "The '===' operator (strict equality) checks for equality without performing type conversion. Both the value and type must be the same.",
    hint: "This is called the 'strict equality' operator.",
    difficulty: "medium",
  },
  {
    id: "4",
    question: "Which of the following is NOT a JavaScript data type?",
    options: ["undefined", "boolean", "float", "symbol"],
    correctAnswer: 2,
    explanation:
      "JavaScript doesn't have a specific 'float' data type. Numbers in JavaScript are all stored as double-precision floating-point numbers.",
    hint: "JavaScript has a 'number' type, but not this specific numeric type.",
    difficulty: "medium",
  },
  {
    id: "5",
    question: "What is a closure in JavaScript?",
    options: [
      "A way to close the browser",
      "A function that has access to variables in its outer scope",
      "A method to end a loop",
      "A type of error",
    ],
    correctAnswer: 1,
    explanation:
      "A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned.",
    hint: "Think about functions that 'remember' their surrounding context.",
    difficulty: "hard",
  },
]

export default function TakeQuizPage() {
  const params = useParams()
  const router = useRouter()
  const quizId = params.id as string
  const questionRef = useRef<HTMLDivElement>(null)

  const [session, setSession] = useState<QuizSession>({
    quizId,
    title: "JavaScript Fundamentals",
    questions: mockQuestions,
    currentQuestionIndex: 0,
    answers: new Array(mockQuestions.length).fill(null),
    startTime: Date.now(),
    timeLimit: 15 * 60 * 1000, // 15 minutes in milliseconds
    score: 0,
    isCompleted: false,
  })

  const [timeRemaining, setTimeRemaining] = useState<number>(session.timeLimit || 0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [isAnswered, setIsAnswered] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [liveMessage, setLiveMessage] = useState("")

  const currentQuestion = session.questions[session.currentQuestionIndex]
  const progress = ((session.currentQuestionIndex + 1) / session.questions.length) * 100

  // Timer effect
  useEffect(() => {
    if (session.timeLimit && !session.isCompleted) {
      const timer = setInterval(() => {
        const elapsed = Date.now() - session.startTime
        const remaining = Math.max(0, session.timeLimit - elapsed)
        setTimeRemaining(remaining)

        if (remaining === 0) {
          handleQuizComplete()
        }
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [session.startTime, session.timeLimit, session.isCompleted])

  // Load saved answer for current question
  useEffect(() => {
    const savedAnswer = session.answers[session.currentQuestionIndex]
    setSelectedAnswer(savedAnswer)
    setIsAnswered(savedAnswer !== null)
    setShowHint(false)
    setShowExplanation(false)
  }, [session.currentQuestionIndex, session.answers])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isAnswered) return

      // Number keys 1-4 for answer selection
      if (event.key >= "1" && event.key <= "4") {
        const answerIndex = Number.parseInt(event.key) - 1
        if (answerIndex < currentQuestion.options.length) {
          event.preventDefault()
          handleAnswerSelect(answerIndex)
        }
      }

      // Arrow keys for navigation
      if (event.key === "ArrowLeft" && session.currentQuestionIndex > 0) {
        event.preventDefault()
        handlePreviousQuestion()
      }

      if (event.key === "ArrowRight" && isAnswered) {
        event.preventDefault()
        handleNextQuestion()
      }

      // H key for hint
      if (event.key.toLowerCase() === "h") {
        event.preventDefault()
        setShowHint(true)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isAnswered, session.currentQuestionIndex, currentQuestion.options.length])

  useEffect(() => {
    if (questionRef.current) {
      questionRef.current.focus()
    }
  }, [session.currentQuestionIndex])

  const formatTime = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000)
    const seconds = Math.floor((milliseconds % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered) return

    setSelectedAnswer(answerIndex)
    const newAnswers = [...session.answers]
    newAnswers[session.currentQuestionIndex] = answerIndex
    setSession((prev) => ({ ...prev, answers: newAnswers }))
    setIsAnswered(true)
    setShowExplanation(true)

    const isCorrect = answerIndex === currentQuestion.correctAnswer
    const optionLetter = String.fromCharCode(65 + answerIndex)
    setLiveMessage(
      `Answer ${optionLetter} selected. ${isCorrect ? "Correct!" : "Incorrect."} ${currentQuestion.explanation}`,
    )
  }

  const handleNextQuestion = () => {
    if (session.currentQuestionIndex < session.questions.length - 1) {
      setSession((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
      }))
      setLiveMessage(`Question ${session.currentQuestionIndex + 2} of ${session.questions.length}`)
    } else {
      handleQuizComplete()
    }
  }

  const handlePreviousQuestion = () => {
    if (session.currentQuestionIndex > 0) {
      setSession((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1,
      }))
      setLiveMessage(`Question ${session.currentQuestionIndex} of ${session.questions.length}`)
    }
  }

  const handleQuizComplete = useCallback(() => {
    const finalScore = session.answers.reduce((score, answer, index) => {
      if (answer === session.questions[index].correctAnswer) {
        return score + 1
      }
      return score
    }, 0)

    const completedSession = {
      ...session,
      score: finalScore,
      isCompleted: true,
    }

    // Save results to localStorage (in real app, this would be sent to API)
    localStorage.setItem(`quiz-result-${quizId}`, JSON.stringify(completedSession))

    router.push(`/quiz/${quizId}/results`)
  }, [session, quizId, router])

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled)
    if (isListening) {
      setIsListening(false)
    }
  }

  const startVoiceRecognition = () => {
    if (!voiceEnabled) return
    setIsListening(true)
    // Mock voice recognition - in real app, this would use Web Speech API
    setTimeout(() => {
      setIsListening(false)
      // Simulate voice command recognition
      const commands = ["A", "B", "C", "D", "next", "previous", "hint"]
      const randomCommand = commands[Math.floor(Math.random() * commands.length)]
      if (["A", "B", "C", "D"].includes(randomCommand)) {
        const answerIndex = ["A", "B", "C", "D"].indexOf(randomCommand)
        handleAnswerSelect(answerIndex)
      }
    }, 2000)
  }

  const getAnswerStatus = (optionIndex: number) => {
    if (!isAnswered) return "default"
    if (optionIndex === currentQuestion.correctAnswer) return "correct"
    if (optionIndex === selectedAnswer && optionIndex !== currentQuestion.correctAnswer) return "incorrect"
    return "default"
  }

  const getAnswerButtonClass = (optionIndex: number) => {
    const status = getAnswerStatus(optionIndex)
    const baseClass = "w-full text-left p-4 rounded-lg border transition-all duration-200 "

    switch (status) {
      case "correct":
        return baseClass + "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800"
      case "incorrect":
        return baseClass + "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800"
      default:
        return (
          baseClass +
          "bg-card border-border hover:bg-muted hover:border-primary " +
          (selectedAnswer === optionIndex && !isAnswered ? "border-primary bg-primary/5" : "")
        )
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <LiveRegion message={liveMessage} />

        {/* Header */}
        <header className="border-b border-border bg-card sticky top-0 z-50">
          <div className="flex h-16 items-center px-4 gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard" aria-label="Return to dashboard">
                <Home className="w-5 h-5" aria-hidden="true" />
              </Link>
            </Button>

            <div className="flex-1">
              <h1 className="font-semibold text-foreground">{session.title}</h1>
              <p className="text-sm text-muted-foreground">
                Question {session.currentQuestionIndex + 1} of {session.questions.length}
              </p>
            </div>

            {session.timeLimit && (
              <div className="flex items-center gap-2" role="timer" aria-live="polite">
                <Clock className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                <span
                  className={`font-mono ${timeRemaining < 60000 ? "text-destructive" : "text-foreground"}`}
                  aria-label={`Time remaining: ${formatTime(timeRemaining)}`}
                >
                  {formatTime(timeRemaining)}
                </span>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleVoice}
              className={voiceEnabled ? "text-primary" : "text-muted-foreground"}
              aria-label={voiceEnabled ? "Disable voice commands" : "Enable voice commands"}
              aria-pressed={voiceEnabled}
            >
              {voiceEnabled ? (
                <Mic className="w-5 h-5" aria-hidden="true" />
              ) : (
                <MicOff className="w-5 h-5" aria-hidden="true" />
              )}
            </Button>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Progress</span>
              <span className="text-sm font-medium text-foreground">{Math.round(progress)}% Complete</span>
            </div>
            <Progress
              value={progress}
              className="h-2"
              aria-label={`Quiz progress: ${Math.round(progress)}% complete`}
            />
          </div>

          {/* Question Card */}
          <Card className="border-border mb-8">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <Badge className="bg-primary/10 text-primary">Question {session.currentQuestionIndex + 1}</Badge>
                <div className="flex gap-2">
                  <Badge
                    className={
                      currentQuestion.difficulty === "easy"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : currentQuestion.difficulty === "medium"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                    }
                    variant="secondary"
                  >
                    {currentQuestion.difficulty}
                  </Badge>
                  <Dialog open={showHint} onOpenChange={setShowHint}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" aria-label="Show hint for current question">
                        <HelpCircle className="w-4 h-4 mr-1" aria-hidden="true" />
                        Hint
                      </Button>
                    </DialogTrigger>
                    <DialogContent aria-labelledby="hint-title">
                      <DialogHeader>
                        <DialogTitle id="hint-title" className="flex items-center gap-2">
                          <Lightbulb className="w-5 h-5 text-yellow-500" aria-hidden="true" />
                          Hint
                        </DialogTitle>
                        <DialogDescription className="text-base pt-2">{currentQuestion.hint}</DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <CardTitle
                className="text-xl text-balance leading-relaxed"
                ref={questionRef}
                tabIndex={-1}
                id="current-question"
              >
                {currentQuestion.question}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <fieldset className="space-y-3">
                <legend className="sr-only">Answer options for current question</legend>
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={isAnswered}
                    className={getAnswerButtonClass(index)}
                    aria-describedby={isAnswered ? `answer-${index}-status` : undefined}
                    aria-label={`Option ${String.fromCharCode(65 + index)}: ${option}`}
                    role="radio"
                    aria-checked={selectedAnswer === index}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground font-medium">
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="flex-1">{option}</span>
                      {isAnswered && index === currentQuestion.correctAnswer && (
                        <>
                          <CheckCircle className="w-5 h-5 text-green-600" aria-hidden="true" />
                          <span id={`answer-${index}-status`} className="sr-only">
                            Correct answer
                          </span>
                        </>
                      )}
                      {isAnswered && index === selectedAnswer && index !== currentQuestion.correctAnswer && (
                        <>
                          <XCircle className="w-5 h-5 text-red-600" aria-hidden="true" />
                          <span id={`answer-${index}-status`} className="sr-only">
                            Incorrect answer
                          </span>
                        </>
                      )}
                    </div>
                  </button>
                ))}
              </fieldset>

              <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  <strong>Keyboard shortcuts:</strong> Press 1-4 to select answers, H for hint, ← → to navigate
                  questions
                </p>
              </div>

              {/* Voice Recognition */}
              {voiceEnabled && (
                <div className="mt-6 p-4 bg-muted/50 rounded-lg" role="region" aria-label="Voice commands">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mic className="w-4 h-4 text-primary" aria-hidden="true" />
                      <span className="text-sm text-foreground">Voice Commands Enabled</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={startVoiceRecognition}
                      disabled={isListening || isAnswered}
                      aria-label={isListening ? "Currently listening for voice commands" : "Start voice recognition"}
                    >
                      {isListening ? (
                        <>
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2" aria-hidden="true" />
                          Listening...
                        </>
                      ) : (
                        "Start Listening"
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Say "A", "B", "C", or "D" to select an answer, or "hint" for a hint.
                  </p>
                </div>
              )}

              {/* Explanation */}
              {showExplanation && isAnswered && (
                <Alert className="mt-6" role="region" aria-label="Answer explanation">
                  <Lightbulb className="h-4 w-4" aria-hidden="true" />
                  <AlertDescription className="text-sm">
                    <strong>Explanation:</strong> {currentQuestion.explanation}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <nav className="flex items-center justify-between" aria-label="Quiz navigation">
            <Button
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={session.currentQuestionIndex === 0}
              aria-label="Go to previous question"
            >
              <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
              Previous
            </Button>

            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" aria-label="Finish quiz early">
                    <Flag className="w-4 h-4 mr-2" aria-hidden="true" />
                    Finish Quiz
                  </Button>
                </DialogTrigger>
                <DialogContent aria-labelledby="finish-dialog-title">
                  <DialogHeader>
                    <DialogTitle id="finish-dialog-title">Finish Quiz?</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to finish the quiz? You have answered{" "}
                      {session.answers.filter((a) => a !== null).length} out of {session.questions.length} questions.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => {}}>
                      Cancel
                    </Button>
                    <Button onClick={handleQuizComplete}>Finish Quiz</Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                onClick={handleNextQuestion}
                disabled={!isAnswered && session.currentQuestionIndex < session.questions.length - 1}
                aria-label={
                  session.currentQuestionIndex === session.questions.length - 1 ? "Finish quiz" : "Go to next question"
                }
              >
                {session.currentQuestionIndex === session.questions.length - 1 ? "Finish" : "Next"}
                <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
              </Button>
            </div>
          </nav>
        </div>

        {/* Voice Listening Indicator */}
        {isListening && (
          <div className="fixed bottom-4 right-4 z-50" role="status" aria-label="Voice recognition is active">
            <div className="bg-red-500 text-white p-3 rounded-full shadow-lg animate-pulse">
              <Mic className="w-6 h-6" aria-hidden="true" />
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  )
}
