"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Settings,
  BarChart3,
  Shield,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Quizzes", href: "/admin/quizzes", icon: BookOpen },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-slate-900 border-r border-slate-800 transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-semibold">Admin Panel</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-4 left-4 right-4">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  )
}
