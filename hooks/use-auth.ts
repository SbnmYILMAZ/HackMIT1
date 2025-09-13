'use client'

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { AuthUser } from '@/lib/types/database'
import type { Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: AuthUser | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Función simple para obtener usuario actual
async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return null
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return null
    }

    return {
      id: user.id,
      email: profile.email,
      username: profile.username,
      full_name: profile.full_name,
      avatar_url: profile.avatar_url,
      role: profile.role
    }
  } catch (error) {
    console.error('Error en getCurrentUser:', error)
    return null
  }
}

// Función simple para cerrar sesión
async function signOutUser() {
  const { error } = await supabase.auth.signOut()
  if (error) {
    throw new Error(`Error al cerrar sesión: ${error.message}`)
  }
}

export function AuthProvider({ children }: { children: ReactNode }): React.ReactElement {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = async () => {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error('Error refreshing user:', error)
      setUser(null)
    }
  }

  const signOut = async () => {
    try {
      await signOutUser()
      setUser(null)
      setSession(null)
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  useEffect(() => {
    // Obtener sesión inicial
    const getInitialSession = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession()
        setSession(initialSession)
        
        if (initialSession) {
          await refreshUser()
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        
        if (event === 'SIGNED_IN' && session) {
          await refreshUser()
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return React.createElement(
    AuthContext.Provider,
    { value: { user, session, loading, signOut, refreshUser } },
    children
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}
