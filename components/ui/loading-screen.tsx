"use client"

import React from "react"
import { Brain, Loader2, Sparkles } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface LoadingScreenProps {
  title?: string
  description?: string
  variant?: "default" | "auth" | "minimal"
  showProgress?: boolean
  progress?: number
}

export function LoadingScreen({ 
  title = "Cargando...", 
  description = "Por favor espera un momento",
  variant = "default",
  showProgress = false,
  progress = 0
}: LoadingScreenProps) {
  if (variant === "minimal") {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">{title}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center border-0 shadow-xl">
        <CardHeader className="pb-4">
          <div className="relative w-28 h-28 mx-auto mb-6">
            {/* Animated background circle */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full animate-pulse" />
            
            {/* Main logo container */}
            <div className="relative w-full h-full bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg">
              <img 
                src="/logo_final.png" 
                alt="Luminara Logo" 
                className="w-16 h-16 object-contain animate-pulse"
              />
            </div>
            
            {/* Floating sparkles */}
            <Sparkles className="absolute -top-2 -right-2 w-4 h-4 text-primary animate-bounce" />
            <Sparkles className="absolute -bottom-1 -left-2 w-3 h-3 text-primary/60 animate-bounce delay-300" />
          </div>
          
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            {title}
          </CardTitle>
          <CardDescription className="text-base mt-2">
            {description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Loading indicator */}
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Procesando...</span>
          </div>
          
          {/* Progress bar */}
          {showProgress && (
            <div className="space-y-2">
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round(progress)}% completado
              </p>
            </div>
          )}
          
          {/* Animated dots */}
          <div className="flex justify-center gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-primary/60 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Skeleton components for different layouts
export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 bg-muted rounded w-64" />
          <div className="h-4 bg-muted rounded w-48" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 bg-muted rounded w-32" />
          <div className="h-10 bg-muted rounded w-32" />
        </div>
      </div>
      
      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="h-32 bg-muted rounded-lg" />
          </div>
        ))}
      </div>
      
      {/* Content skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="h-6 bg-muted rounded w-32" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-6 bg-muted rounded w-32" />
          <div className="h-48 bg-muted rounded" />
        </div>
      </div>
    </div>
  )
}
