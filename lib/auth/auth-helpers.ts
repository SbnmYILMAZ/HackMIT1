import { supabase } from '@/lib/supabase/client'
import { createClient } from '@/lib/supabase/server'
import type { SignUpWithUsernameData, SignInWithUsernameData, AuthUser } from '@/lib/types/database'

// Función para registrarse con username
export async function signUpWithUsername(data: SignUpWithUsernameData) {
  try {
    // Crear email sintético para Supabase
    const syntheticEmail = `${data.username}@app.local`
    
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
      // Manejar errores específicos en español
      if (authError.message.includes('already registered')) {
        throw new Error('Este nombre de usuario ya está registrado')
      }
      if (authError.message.includes('Password should be')) {
        throw new Error('La contraseña debe tener al menos 6 caracteres')
      }
      throw new Error(`Error de registro: ${authError.message}`)
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
    
    type ProfileResult = { email: string | null; id: string } | null

    if (profileError || !profile?.email) {
      throw new Error('Nombre de usuario no encontrado')
    }

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: profile.email,
      password: data.password,
    })

    if (authError) {
      if (authError.message.includes('Invalid login credentials')) {
        throw new Error('Credenciales inválidas')
      }
      throw new Error(`Error de inicio de sesión: ${authError.message}`)
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
      throw new Error(`Error al cerrar sesión: ${error.message}`)
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

// Función para actualizar perfil
export async function updateProfile(updates: Partial<Pick<AuthUser, 'full_name' | 'avatar_url'>>) {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      throw new Error('Usuario no autenticado')
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates as any)
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      throw new Error(`Error al actualizar perfil: ${error.message}`)
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
      throw new Error(`Error al cambiar contraseña: ${error.message}`)
    }
  } catch (error) {
    console.error('Error en updatePassword:', error)
    throw error
  }
}

// Función para obtener autenticación en el servidor
export async function getAuth(req: Request) {
  try {
    const supabaseServer = createClient()
    const { data: { user }, error } = await supabaseServer.auth.getUser()
    
    if (error || !user) {
      throw new Error('No autorizado')
    }

    return { user }
  } catch (error) {
    console.error('Error en getAuth:', error)
    throw new Error('No autorizado')
  }
}
