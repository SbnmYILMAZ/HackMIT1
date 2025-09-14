"use client"

import React, { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { LoadingScreen } from "@/components/ui/loading-screen"
import { UserFeedback } from "@/components/ui/user-feedback"
import { CheckCircle, User, Shield, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface AuthStatusProps {
  children: React.ReactNode
  showWelcome?: boolean
}

export function AuthStatus({ children, showWelcome = true }: AuthStatusProps) {
  const { user, loading } = useAuth()
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false)
  const [authProgress, setAuthProgress] = useState(0)

  useEffect(() => {
    if (loading) {
      // Simulate authentication progress
      const interval = setInterval(() => {
        setAuthProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval)
            return 90
          }
          return prev + Math.random() * 20
        })
      }, 200)

      return () => clearInterval(interval)
    } else if (user && showWelcome) {
      setAuthProgress(100)
      // Show welcome message for new sessions
      const hasShownWelcome = sessionStorage.getItem('welcome-shown')
      if (!hasShownWelcome) {
        setTimeout(() => {
          setShowWelcomeMessage(true)
          sessionStorage.setItem('welcome-shown', 'true')
        }, 500)
      }
    }
  }, [loading, user, showWelcome])

  if (loading) {
    return (
      <LoadingScreen
        title="Verificando Autenticación"
        description="Conectando con tu cuenta de QuizMaster..."
        showProgress={true}
        progress={authProgress}
      />
    )
  }

  return (
    <>
      {children}
      
      {/* Welcome message for authenticated users */}
      {showWelcomeMessage && user && (
        <UserFeedback
          type="success"
          title="¡Bienvenido de vuelta!"
          message={`Hola ${user.username || user.email?.split('@')[0] || 'Usuario'}, tu sesión está activa y segura.`}
          isVisible={showWelcomeMessage}
          onClose={() => setShowWelcomeMessage(false)}
          autoClose={true}
          autoCloseDelay={4000}
        />
      )}
    </>
  )
}

// Authentication status indicator for the header
export function AuthIndicator() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-full">
        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
        <span className="text-xs text-muted-foreground">Verificando...</span>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-destructive/10 rounded-full">
        <div className="w-2 h-2 bg-destructive rounded-full" />
        <span className="text-xs text-destructive">No autenticado</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-950 rounded-full border border-green-200 dark:border-green-800">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      <div className="flex items-center gap-1">
        <CheckCircle className="w-3 h-3 text-green-600" />
        <span className="text-xs text-green-700 dark:text-green-300 font-medium">
          Autenticado
        </span>
      </div>
      {user.role === 'admin' && (
        <Badge variant="secondary" className="text-xs px-1.5 py-0">
          <Shield className="w-3 h-3 mr-1" />
          Admin
        </Badge>
      )}
    </div>
  )
}

// Session timer component
export function SessionTimer() {
  const { user } = useAuth()
  const [sessionTime, setSessionTime] = useState(0)

  useEffect(() => {
    if (!user) return

    const startTime = Date.now()
    const interval = setInterval(() => {
      setSessionTime(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)

    return () => clearInterval(interval)
  }, [user])

  if (!user) return null

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`
    } else {
      return `${secs}s`
    }
  }

  return (
    <div className="flex items-center gap-1 text-xs text-muted-foreground">
      <Clock className="w-3 h-3" />
      <span>Sesión: {formatTime(sessionTime)}</span>
    </div>
  )
}
