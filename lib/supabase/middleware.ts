import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANTE: Evita escribir lógica entre createServerClient y
  // supabase.auth.getUser(). Un simple error podría hacer que el usuario
  // sea redirigido aleatoriamente al endpoint de login.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Rutas protegidas que requieren autenticación
  const protectedRoutes = ['/dashboard', '/profile', '/create-quiz', '/admin', '/quiz/*/take']
  const adminRoutes = ['/admin']
  
  const isProtectedRoute = protectedRoutes.some(route => {
    if (route.includes('*')) {
      const pattern = route.replace('*', '[^/]+')
      return new RegExp(`^${pattern}`).test(request.nextUrl.pathname)
    }
    return request.nextUrl.pathname.startsWith(route)
  })

  const isAdminRoute = adminRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  // Redirigir a login si no está autenticado y trata de acceder a ruta protegida
  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // Verificar permisos de admin
  if (isAdminRoute && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  // Redirigir usuarios autenticados lejos de páginas de auth
  if (user && ['/login', '/register'].includes(request.nextUrl.pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
