"use client"

import React from 'react'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'success' | 'error' | 'loading'
  title: string
  message: string
  autoClose?: boolean
  autoCloseDelay?: number
}

export function FeedbackModal({ 
  isOpen, 
  onClose, 
  type, 
  title, 
  message, 
  autoClose = false,
  autoCloseDelay = 2000 
}: FeedbackModalProps) {
  React.useEffect(() => {
    if (isOpen && autoClose && type !== 'loading') {
      const timer = setTimeout(() => {
        onClose()
      }, autoCloseDelay)
      
      return () => clearTimeout(timer)
    }
  }, [isOpen, autoClose, autoCloseDelay, onClose, type])

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-12 h-12 text-green-500" />
      case 'error':
        return <XCircle className="w-12 h-12 text-red-500" />
      case 'loading':
        return <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      default:
        return null
    }
  }

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-950/20'
      case 'error':
        return 'bg-red-50 dark:bg-red-950/20'
      case 'loading':
        return 'bg-blue-50 dark:bg-blue-950/20'
      default:
        return 'bg-background'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={cn(
          "sm:max-w-md border-0 shadow-2xl",
          getBackgroundColor()
        )}
        showCloseButton={type !== 'loading'}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">{message}</DialogDescription>
        
        <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
          <div className="mb-4">
            {getIcon()}
          </div>
          
          <h2 className={cn(
            "text-xl font-semibold mb-2",
            type === 'success' && "text-green-700 dark:text-green-300",
            type === 'error' && "text-red-700 dark:text-red-300",
            type === 'loading' && "text-blue-700 dark:text-blue-300"
          )}>
            {title}
          </h2>
          
          <p className={cn(
            "text-sm opacity-80",
            type === 'success' && "text-green-600 dark:text-green-400",
            type === 'error' && "text-red-600 dark:text-red-400",
            type === 'loading' && "text-blue-600 dark:text-blue-400"
          )}>
            {message}
          </p>
          
          {type === 'loading' && (
            <div className="mt-4">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
