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
import { Brain, Home, BookOpen, Plus, Trophy, User, Settings, LogOut, Menu, Mic, MicOff } from "lucide-react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled)
    // In a real app, this would enable/disable voice recognition
  }

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Browse Quizzes", href: "/catalog", icon: BookOpen },
    { name: "Create Quiz", href: "/create-quiz", icon: Plus },
    { name: "My Results", href: "/results", icon: Trophy },
    { name: "Profile", href: "/profile", icon: User },
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
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive(item.href)
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
            aria-current={isActive(item.href) ? "page" : undefined}
            aria-label={`Navigate to ${item.name}`}
          >
            <Icon className="w-4 h-4" aria-hidden="true" />
            {item.name}
          </Link>
        )
      })}
    </>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
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

          {/* Voice Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleVoice}
            className={voiceEnabled ? "text-primary" : "text-muted-foreground"}
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
              <Button variant="ghost" className="relative h-8 w-8 rounded-full" aria-label="User account menu">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt={user?.name || "User avatar"} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name || "User"}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card">
          <nav className="flex-1 space-y-2 p-4" aria-label="Main navigation">
            <NavigationItems />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6" id="main-content" role="main">
          {children}
        </main>
      </div>

      {/* Voice Accessibility Overlay */}
      {voiceEnabled && (
        <div className="fixed bottom-4 right-4 z-50" role="status" aria-label="Voice commands are active">
          <div className="bg-primary text-primary-foreground p-3 rounded-full shadow-lg animate-pulse">
            <Mic className="w-6 h-6" aria-hidden="true" />
          </div>
        </div>
      )}
    </div>
  )
}
