import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { SkipNavigation } from "@/components/skip-navigation"
import { AuthProvider } from "@/hooks/use-auth"
import "./globals.css"

export const metadata: Metadata = {
  title: "QuizMaster - Learn Through Interactive Quizzes",
  description:
    "An engaging educational platform for creating and taking interactive quizzes with accessibility features"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AuthProvider>
          <SkipNavigation />
          <Suspense fallback={null}>{children}</Suspense>
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  )
}
