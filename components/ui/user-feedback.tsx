"use client"

import React, { useState, useEffect } from "react"
import { CheckCircle, AlertCircle, Info, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface FeedbackProps {
  type: "success" | "error" | "info" | "loading"
  title: string
  message: string
  isVisible: boolean
  onClose?: () => void
  autoClose?: boolean
  autoCloseDelay?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export function UserFeedback({
  type,
  title,
  message,
  isVisible,
  onClose,
  autoClose = false,
  autoCloseDelay = 3000,
  action
}: FeedbackProps) {
  const [isShowing, setIsShowing] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setIsShowing(true)
      
      if (autoClose && type !== "loading") {
        const timer = setTimeout(() => {
          handleClose()
        }, autoCloseDelay)
        
        return () => clearTimeout(timer)
      }
    }
  }, [isVisible, autoClose, autoCloseDelay, type])

  const handleClose = () => {
    setIsShowing(false)
    setTimeout(() => {
      onClose?.()
    }, 300) // Wait for animation to complete
  }

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case "info":
        return <Info className="w-5 h-5 text-blue-500" />
      case "loading":
        return <Loader2 className="w-5 h-5 text-primary animate-spin" />
      default:
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  const getColorClasses = () => {
    switch (type) {
      case "success":
        return "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
      case "error":
        return "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"
      case "info":
        return "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950"
      case "loading":
        return "border-primary/20 bg-primary/5"
      default:
        return "border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950"
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <Card 
        className={`
          ${getColorClasses()} 
          shadow-lg border transition-all duration-300 ease-in-out
          ${isShowing ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        `}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {getIcon()}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-foreground mb-1">
                {title}
              </h4>
              <p className="text-sm text-muted-foreground">
                {message}
              </p>
              
              {action && (
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-3"
                  onClick={action.onClick}
                >
                  {action.label}
                </Button>
              )}
            </div>
            
            {onClose && type !== "loading" && (
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 hover:bg-transparent"
                onClick={handleClose}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Toast-like notification system
interface ToastNotification {
  id: string
  type: "success" | "error" | "info" | "loading"
  title: string
  message: string
  autoClose?: boolean
  autoCloseDelay?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<ToastNotification[]>([])

  const addNotification = (notification: Omit<ToastNotification, "id">) => {
    const id = Math.random().toString(36).substr(2, 9)
    setNotifications(prev => [...prev, { ...notification, id }])
    return id
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const updateNotification = (id: string, updates: Partial<ToastNotification>) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, ...updates } : n)
    )
  }

  return {
    notifications,
    addNotification,
    removeNotification,
    updateNotification
  }
}

// Notification container component
export function NotificationContainer() {
  const { notifications, removeNotification } = useNotifications()

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <UserFeedback
          key={notification.id}
          type={notification.type}
          title={notification.title}
          message={notification.message}
          isVisible={true}
          onClose={() => removeNotification(notification.id)}
          autoClose={notification.autoClose}
          autoCloseDelay={notification.autoCloseDelay}
          action={notification.action}
        />
      ))}
    </div>
  )
}
