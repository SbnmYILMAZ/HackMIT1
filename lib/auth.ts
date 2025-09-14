import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { User } from '@supabase/supabase-js'

export interface AuthUser {
  userId: string
  email: string
  role: 'user' | 'admin'
  user: User
}

/**
 * Get authenticated user from request
 * Throws error if user is not authenticated
 */
export async function getAuth(req: NextRequest): Promise<AuthUser> {
  const supabase = createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    throw new Error('Unauthorized')
  }

  // Get user profile to determine role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  return {
    userId: user.id,
    email: user.email!,
    role: profile?.role || 'user',
    user
  }
}

/**
 * Get authenticated user from request (optional)
 * Returns null if user is not authenticated
 */
export async function getOptionalAuth(req: NextRequest): Promise<AuthUser | null> {
  try {
    return await getAuth(req)
  } catch {
    return null
  }
}

/**
 * Check if user has admin role
 */
export async function requireAdmin(req: NextRequest): Promise<AuthUser> {
  const auth = await getAuth(req)
  
  if (auth.role !== 'admin') {
    throw new Error('Admin access required')
  }
  
  return auth
}

/**
 * Middleware helper to extract auth from headers
 */
export function getAuthFromHeaders(headers: Headers): { authorization?: string } {
  return {
    authorization: headers.get('authorization') || undefined
  }
}
