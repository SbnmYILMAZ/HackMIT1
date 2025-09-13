"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Shield, AlertTriangle } from "lucide-react"

interface AdminGuardProps {
  children: React.ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAdminAuth = () => {
      const user = localStorage.getItem("user")
      if (user) {
        try {
          const userData = JSON.parse(user)
          setIsAuthenticated(true)
          if (userData.role === "admin") {
            setIsAdmin(true)
          } else {
            // Redirect non-admin users to dashboard
            router.push("/dashboard")
          }
        } catch (error) {
          router.push("/login")
        }
      } else {
        router.push("/login")
      }
      setIsLoading(false)
    }

    checkAdminAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <p className="text-slate-300">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-slate-400 mb-6">
            You don't have permission to access the admin panel. Please contact your administrator.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
