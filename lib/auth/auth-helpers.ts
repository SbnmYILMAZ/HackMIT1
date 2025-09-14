import { supabase } from '@/lib/supabase/client'
import { createServerClient } from '@supabase/ssr'
import { env } from '@/lib/env'
import type { SignUpWithUsernameData, SignInWithUsernameData, AuthUser, Database } from '@/lib/types/database'

// Server-side authentication function for API routes
export async function getAuth(req: Request) {
  try {
    // Extract cookies from the request headers
    const cookieHeader = req.headers.get('cookie') || ''
    const cookies = new Map<string, string>()
    
    // Parse cookies from header
    cookieHeader.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=')
      if (name && value) {
        cookies.set(name, decodeURIComponent(value))
      }
    })

    // Create server client with cookies
    const supabaseServer = createServerClient<Database>(
      env.supabase.url!,
      env.supabase.anonKey!,
      {
        cookies: {
          getAll() {
            return Array.from(cookies.entries()).map(([name, value]) => ({ name, value }))
          },
          setAll() {
            // No-op for API routes
          },
        },
      }
    )

    const { data: { user }, error } = await supabaseServer.auth.getUser()
    
    if (error || !user) {
      throw new Error('Unauthorized')
    }

    // Get user profile
    const { data: profile } = await supabaseServer
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    type ProfileData = {
      id: string;
      email: string | null;
      username: string;
      full_name: string | null;
      avatar_url: string | null;
      role: 'user' | 'admin';
    } | null

    const typedProfile = profile as ProfileData

    const authUser: AuthUser = {
      id: user.id,
      email: typedProfile?.email || undefined,
      username: typedProfile?.username || '',
      full_name: typedProfile?.full_name || undefined,
      avatar_url: typedProfile?.avatar_url || undefined,
      role: typedProfile?.role || 'user'
    }

    return { user: authUser }
  } catch (error) {
    throw new Error('Unauthorized')
  }
}

// Función para registrarse con username
export async function signUpWithUsername(data: SignUpWithUsernameData) {
  try {
    // Crear email sintético para Supabase
    const syntheticEmail = `${data.username}@quizmaster.app`
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: syntheticEmail,
      password: data.password,
      options: {
        data: {
          username: data.username,
          full_name: data.full_name || '',
        }
      }
    })

    if (authError) {
      // Handle specific errors in English
      if (authError.message.includes('already registered')) {
        throw new Error('This username is already registered')
      }
      if (authError.message.includes('Password should be')) {
        throw new Error('Password must be at least 6 characters long')
      }
      throw new Error(`Registration error: ${authError.message}`)
    }

    return { user: authData.user, session: authData.session }
  } catch (error) {
    console.error('Error en signUpWithUsername:', error)
    throw error
  }
}

// Función para iniciar sesión con username
export async function signInWithUsername(data: SignInWithUsernameData) {
  try {
    // Primero buscar el usuario por username para obtener el email sintético
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('email, id')
      .eq('username', data.username)
      .single()
    
    type ProfileLoginData = { email: string | null; id: string } | null
    
    if (profileError || !profile) {
      throw new Error('Username not found')
    }

    const typedProfile = profile as { email: string | null; id: string }
    
    if (!typedProfile.email) {
      throw new Error('Username not found')
    }

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: typedProfile.email,
      password: data.password,
    })

    if (authError) {
      if (authError.message.includes('Invalid login credentials')) {
        throw new Error('Invalid credentials')
      }
      throw new Error(`Sign in error: ${authError.message}`)
    }

    return { user: authData.user, session: authData.session }
  } catch (error) {
    console.error('Error en signInWithUsername:', error)
    throw error
  }
}

// Función para cerrar sesión
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) {
      throw new Error(`Sign out error: ${error.message}`)
    }
  } catch (error) {
    console.error('Error en signOut:', error)
    throw error
  }
}

// Función para obtener el usuario actual con perfil
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return null
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    type ProfileData = {
      id: string;
      email: string | null;
      username: string;
      full_name: string | null;
      avatar_url: string | null;
      role: 'user' | 'admin';
    } | null

    if (profileError || !profile) {
      return null
    }

    const typedProfile = profile as ProfileData

    return {
      id: user.id,
      email: typedProfile?.email || undefined,
      username: typedProfile?.username || '',
      full_name: typedProfile?.full_name || undefined,
      avatar_url: typedProfile?.avatar_url || undefined,
      role: typedProfile?.role || 'user'
    }
  } catch (error) {
    console.error('Error en getCurrentUser:', error)
    return null
  }
}

// Función para actualizar perfil
export async function updateProfile(updates: Partial<Pick<AuthUser, 'full_name' | 'avatar_url'>>) {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      throw new Error('User not authenticated')
    }

    const { data, error } = await (supabase as any)
      .from('profiles')
      .update({
        ...(updates.full_name !== undefined && { full_name: updates.full_name }),
        ...(updates.avatar_url !== undefined && { avatar_url: updates.avatar_url })
      })
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      throw new Error(`Profile update error: ${error.message}`)
    }

    return data
  } catch (error) {
    console.error('Error en updateProfile:', error)
    throw error
  }
}

// Función para verificar si el username está disponible
export async function checkUsernameAvailability(username: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .single()

    if (error && error.code === 'PGRST116') {
      // No se encontró el username, está disponible
      return true
    }

    // Si se encontró o hay otro error, no está disponible
    return false
  } catch (error) {
    console.error('Error en checkUsernameAvailability:', error)
    return false
  }
}

// Función para cambiar contraseña
export async function updatePassword(newPassword: string) {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) {
      throw new Error(`Password change error: ${error.message}`)
    }
  } catch (error) {
    console.error('Error en updatePassword:', error)
    throw error
  }
}

