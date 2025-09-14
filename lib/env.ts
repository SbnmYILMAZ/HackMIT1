/**
 * Environment Variables Helper
 * Centralizes all environment variable access with validation and type safety
 */

// Supabase Configuration
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

// App Configuration
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
export const NODE_ENV = process.env.NODE_ENV || 'development'

// Database Configuration
export const DATABASE_URL = process.env.DATABASE_URL

// Authentication Configuration
export const JWT_SECRET = process.env.JWT_SECRET
export const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET
export const NEXTAUTH_URL = process.env.NEXTAUTH_URL || APP_URL

// Email Configuration (optional)
export const SMTP_HOST = process.env.SMTP_HOST
export const SMTP_PORT = process.env.SMTP_PORT
export const SMTP_USER = process.env.SMTP_USER
export const SMTP_PASSWORD = process.env.SMTP_PASSWORD
export const FROM_EMAIL = process.env.FROM_EMAIL

// Validation function for required environment variables
export function validateEnvVars() {
  const requiredVars = {
    NEXT_PUBLIC_SUPABASE_URL: SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: SUPABASE_ANON_KEY,
  }

  const missingVars = Object.entries(requiredVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key)

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}\n` +
      'Please check your .env.local file and ensure all required variables are set.'
    )
  }
}

// Helper to check if we're in development mode
export const isDev = NODE_ENV === 'development'
export const isProd = NODE_ENV === 'production'

// Helper to get the full app URL
export function getAppUrl(path: string = '') {
  const baseUrl = APP_URL.endsWith('/') ? APP_URL.slice(0, -1) : APP_URL
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${baseUrl}${cleanPath}`
}

// Type-safe environment configuration object
export const env = {
  supabase: {
    url: SUPABASE_URL,
    anonKey: SUPABASE_ANON_KEY,
    serviceRoleKey: SUPABASE_SERVICE_ROLE_KEY,
  },
  app: {
    url: APP_URL,
    nodeEnv: NODE_ENV,
    isDev,
    isProd,
  },
  database: {
    url: DATABASE_URL,
  },
  auth: {
    jwtSecret: JWT_SECRET,
    nextAuthSecret: NEXTAUTH_SECRET,
    nextAuthUrl: NEXTAUTH_URL,
  },
  email: {
    host: SMTP_HOST,
    port: SMTP_PORT ? parseInt(SMTP_PORT) : undefined,
    user: SMTP_USER,
    password: SMTP_PASSWORD,
    from: FROM_EMAIL,
  },
} as const

// Export default for convenience
export default env
