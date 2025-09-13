import type React from "react"
import { AdminGuard } from "@/components/admin-guard"
import { AdminSidebar } from "@/components/admin-sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-950">
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 ml-64">
            <div className="p-8">{children}</div>
          </main>
        </div>
      </div>
    </AdminGuard>
  )
}
