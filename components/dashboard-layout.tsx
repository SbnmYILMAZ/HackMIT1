"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Brain, Home, BookOpen, Plus, Trophy, User, Settings, LogOut, Menu, Mic, MicOff, Bell, Search, Sparkles } from "lucide-react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "@/hooks/use-toast"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, loading, signOut } = useAuth()
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    try {
      setIsSigningOut(true)
      toast({
        title: "Cerrando sesión...",
        description: "Te estamos desconectando de forma segura",
      })
      await signOut()
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente",
      })
      router.push("/login")
    } catch (error) {
      console.error('Error signing out:', error)
      toast({
        title: "Error",
        description: "Hubo un problema al cerrar sesión",
        variant: "destructive",
      })
    } finally {
      setIsSigningOut(false)
    }
  }

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled)
    toast({
      title: voiceEnabled ? "Comandos de voz desactivados" : "Comandos de voz activados",
      description: voiceEnabled ? "Los comandos de voz están ahora desactivados" : "Ahora puedes usar comandos de voz",
    })
  }

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home, badge: null },
    { name: "Explorar Quizzes", href: "/catalog", icon: BookOpen, badge: null },
    { name: "Crear Quiz", href: "/create-quiz", icon: Plus, badge: "Nuevo" },
    { name: "Mis Resultados", href: "/results", icon: Trophy, badge: null },
    { name: "Perfil", href: "/profile", icon: User, badge: null },
  ]

  const isActive = (href: string) => pathname === href

  const NavigationItems = () => (
    <>
      {navigation.map((item) => {
        const Icon = item.icon
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${
              isActive(item.href)
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/80 hover:shadow-sm"
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
            aria-current={isActive(item.href) ? "page" : undefined}
            aria-label={`Navigate to ${item.name}`}
          >
            <div className="flex items-center gap-3">
              <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                isActive(item.href) ? "" : "group-hover:text-primary"
              }`} aria-hidden="true" />
              {item.name}
            </div>
            {item.badge && (
              <Badge variant="secondary" className="text-xs px-2 py-0.5">
                {item.badge}
              </Badge>
            )}
          </Link>
        )
      })}
    </>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="flex h-16 items-center px-4 gap-4">
          {/* Mobile menu trigger */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open navigation menu"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-navigation"
              >
                <Menu className="w-5 h-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <div className="flex items-center gap-2 mb-8">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-primary-foreground" aria-hidden="true" />
                </div>
                <span className="text-xl font-bold text-foreground">QuizMaster</span>
              </div>
              <nav className="space-y-2" id="mobile-navigation" aria-label="Main navigation">
                <NavigationItems />
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2" aria-label="QuizMaster home">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary-foreground" aria-hidden="true" />
            </div>
            <span className="text-xl font-bold text-foreground hidden sm:block">QuizMaster</span>
          </Link>

          <div className="flex-1" />

          {/* Welcome Message */}
          {user && (
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-full">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">
                ¡Hola, <span className="font-medium text-foreground">{user.username || user.email?.split('@')[0] || 'Usuario'}!</span>
              </span>
            </div>
          )}

          {/* Search Button */}
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            aria-label="Search quizzes"
          >
            <Search className="w-5 h-5" aria-hidden="true" />
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" aria-hidden="true" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
          </Button>

          {/* Voice Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleVoice}
            className={`transition-colors ${
              voiceEnabled ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
            }`}
            aria-label={voiceEnabled ? "Disable voice commands" : "Enable voice commands"}
            aria-pressed={voiceEnabled}
          >
            {voiceEnabled ? (
              <Mic className="w-5 h-5" aria-hidden="true" />
            ) : (
              <MicOff className="w-5 h-5" aria-hidden="true" />
            )}
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-transparent hover:ring-primary/20 transition-all" aria-label="User account menu">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar_url || "/placeholder-user.jpg"} alt={`Avatar de ${user?.username || 'Usuario'}`} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold">
                    {user?.username?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.username || user?.email?.split('@')[0] || "Usuario"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || "Sin email"}
                  </p>
                  {user?.role && (
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="w-fit text-xs mt-1">
                      {user.role === 'admin' ? 'Administrador' : 'Usuario'}
                    </Badge>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Mi Perfil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Configuración
                </Link>
              </DropdownMenuItem>
              {user?.role === 'admin' && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Panel Admin
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleLogout} 
                disabled={isSigningOut}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                {isSigningOut ? "Cerrando sesión..." : "Cerrar Sesión"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card/50 backdrop-blur-sm">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.avatar_url || "/placeholder-user.jpg"} alt={`Avatar de ${user?.username || 'Usuario'}`} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold">
                  {user?.username?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.username || user?.email?.split('@')[0] || "Usuario"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.role === 'admin' ? 'Administrador' : 'Estudiante'}
                </p>
              </div>
            </div>
          </div>
          <nav className="flex-1 space-y-2 p-4" aria-label="Main navigation">
            <NavigationItems />
          </nav>
          <div className="p-4 border-t border-border">
            <div className="text-xs text-muted-foreground text-center">
              QuizMaster v2.0
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 max-w-full overflow-hidden" id="main-content" role="main">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-32" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="space-y-3">
                      <Skeleton className="h-32 w-full" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              children
            )}
          </div>
        </main>
      </div>

      {/* Voice Accessibility Overlay */}
      {voiceEnabled && (
        <div className="fixed bottom-6 right-6 z-50" role="status" aria-label="Voice commands are active">
          <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 rounded-full shadow-xl animate-pulse border-2 border-primary/20">
            <Mic className="w-6 h-6" aria-hidden="true" />
          </div>
          <div className="absolute -top-12 right-0 bg-popover text-popover-foreground px-3 py-1 rounded-md text-xs shadow-md border">
            Comandos de voz activos
          </div>
        </div>
      )}

      {/* Loading Overlay for Sign Out */}
      {isSigningOut && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-card p-6 rounded-lg shadow-xl border text-center">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
              <LogOut className="w-5 h-5 text-primary-foreground" />
            </div>
            <p className="text-foreground font-medium">Cerrando sesión...</p>
            <p className="text-muted-foreground text-sm mt-1">Por favor espera un momento</p>
          </div>
        </div>
      )}
    </div>
  )
}
