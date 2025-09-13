"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem("user")
      if (user) {
        try {
          const userData = JSON.parse(user)
          setIsAuthenticated(true)
          // If user is admin and trying to access regular routes, redirect to admin
          if (userData.role === "admin" && !window.location.pathname.startsWith("/admin")) {
            router.push("/admin")
            return
          }
        } catch (error) {
          // If parsing fails, treat as regular user
          setIsAuthenticated(true)
        }
      } else {
        router.push("/login")
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  if (isLoading) {
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

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
