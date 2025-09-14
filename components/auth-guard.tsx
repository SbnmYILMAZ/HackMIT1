"use client"

import type React from "react"

import { useAuth } from "@/hooks/use-auth"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth()

  console.log('AuthGuard - loading:', loading, 'user:', user)

  if (loading) {
    console.log('AuthGuard - showing loading state')
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-5 h-5 bg-primary-foreground rounded" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // The middleware will handle redirects, so if we get here with no user, 
  // it means we're in a redirect loop - just show loading
  if (!user) {
    console.log('AuthGuard - no user, showing redirect state')
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-5 h-5 bg-primary-foreground rounded" />
          </div>
          <p className="text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    )
  }

  console.log('AuthGuard - rendering children')
  return <>{children}</>
}
