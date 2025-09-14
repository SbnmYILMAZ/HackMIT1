import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/lib/types/database'
import { validateEnvVars, env } from '@/lib/env'

// Validate environment variables
validateEnvVars()

export const createClient = () => {
  const cookieStore = cookies()

  return createServerClient<Database>(
    env.supabase.url!,
    env.supabase.anonKey!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // El método `setAll` fue llamado desde un Server Component.
            // Esto puede ser ignorado si tienes middleware refrescando
            // las cookies del usuario.
          }
        },
      },
    }
  )
}

// Admin client for server-side operations
export const supabaseAdmin = createServerClient<Database>(
  env.supabase.url!,
  env.supabase.serviceRoleKey!,
  {
    cookies: {
      getAll() {
        return []
      },
      setAll() {
        // No-op for admin client
      },
    },
  }
)
