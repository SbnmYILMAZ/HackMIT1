import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/types/database'
import { validateEnvVars, env } from '@/lib/env'

// Validate environment variables on module load
validateEnvVars()

// Create Supabase client with type safety
export const supabase = createClient<Database>(
  env.supabase.url!,
  env.supabase.anonKey!,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  }
)
