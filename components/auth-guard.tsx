"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Brain, Loader2, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading, refreshUser } = useAuth()
  const [retryCount, setRetryCount] = useState(0)
  const [showRetry, setShowRetry] = useState(false)

  console.log('AuthGuard - loading:', loading, 'user:', user)

  useEffect(() => {
    if (!loading && !user && retryCount < 3) {
      const timer = setTimeout(() => {
        setShowRetry(true)
      }, 3000) // Show retry option after 3 seconds
      
      return () => clearTimeout(timer)
    }
  }, [loading, user, retryCount])

  const handleRetry = async () => {
    setRetryCount(prev => prev + 1)
    setShowRetry(false)
    try {
      await refreshUser()
    } catch (error) {
      console.error('Error refreshing user:', error)
    }
  }

  const handleGoToLogin = () => {
    window.location.href = '/login'
  }

  if (loading) {
    console.log('AuthGuard - showing loading state')
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-primary-foreground animate-pulse" />
            </div>
            <CardTitle className="text-xl">Cargando Luminara</CardTitle>
            <CardDescription>Verificando tu autenticación...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Por favor espera</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Enhanced error state with retry options
  if (!user) {
    console.log('AuthGuard - no user, showing authentication required state')
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="w-16 h-16 bg-destructive/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <CardTitle className="text-xl">Autenticación Requerida</CardTitle>
            <CardDescription>
              {retryCount > 0 
                ? `Intento ${retryCount}/3: No se pudo verificar tu sesión`
                : "Necesitas iniciar sesión para acceder a esta página"
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {showRetry && retryCount < 3 ? (
              <div className="space-y-3">
                <Button 
                  onClick={handleRetry} 
                  variant="outline" 
                  className="w-full"
                  disabled={loading}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reintentar Verificación
                </Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">O</span>
                  </div>
                </div>
              </div>
            ) : null}
            
            <Button onClick={handleGoToLogin} className="w-full">
              <Brain className="w-4 h-4 mr-2" />
              Ir a Iniciar Sesión
            </Button>
            
            {retryCount >= 3 && (
              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  Si el problema persiste, intenta limpiar las cookies del navegador o contacta soporte.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  console.log('AuthGuard - rendering children')
  return <>{children}</>
}
