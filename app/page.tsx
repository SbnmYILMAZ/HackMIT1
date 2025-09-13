import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Brain, Trophy, Users, Mic, Zap } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen cyberpunk-bg relative overflow-hidden">
      <div className="absolute inset-0 geometric-pattern opacity-40"></div>
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full blur-xl float-animation"></div>
      <div
        className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-cyan-500/30 to-blue-500/30 rounded-full blur-xl float-animation"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute bottom-40 left-1/4 w-40 h-40 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-full blur-xl float-animation"
        style={{ animationDelay: "4s" }}
      ></div>
      <div
        className="absolute top-1/2 right-1/4 w-20 h-20 bg-gradient-to-br from-yellow-500/25 to-orange-500/25 rounded-full blur-xl float-animation"
        style={{ animationDelay: "6s" }}
      ></div>

      <div className="absolute inset-0 dot-pattern opacity-30"></div>

      <header className="relative z-10 border-b border-purple-500/40 bg-card/90 backdrop-blur-md border-glow-animation">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 slide-in-animation">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center neon-glow">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent [&]:text-white supports-[background-clip:text]:text-transparent">
              QuizMaster
            </h1>
          </div>
          <div className="flex items-center gap-4 scale-in-animation" style={{ animationDelay: "0.2s" }}>
            <Button
              variant="outline"
              className="border-purple-500/60 hover:bg-purple-500/30 text-white bg-transparent cyberpunk-button border-glow-animation"
              asChild
            >
              <Link href="/login">Login</Link>
            </Button>
            <Button
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 neon-glow cyberpunk-button"
              asChild
            >
              <Link href="/register">Register</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="relative z-10 py-24 px-4">
        <div className="container mx-auto text-center max-w-5xl">
          <Badge className="mb-8 bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0 neon-glow scale-in-animation text-lg px-6 py-2">
            <Zap className="w-5 h-5 mr-2" />
            Learn Smarter, Not Harder
          </Badge>
          <h2
            className="text-6xl md:text-7xl font-bold mb-8 text-balance text-white bg-gradient-to-r from-gray-100 via-purple-200 via-pink-200 to-cyan-200 bg-clip-text text-transparent [&]:text-white supports-[background-clip:text]:text-transparent slide-in-animation"
            style={{ animationDelay: "0.1s" }}
          >
            Master Any Subject with Interactive Quizzes
          </h2>
          <p
            className="text-xl md:text-2xl text-gray-300 mb-12 text-pretty max-w-3xl mx-auto leading-relaxed slide-in-animation"
            style={{ animationDelay: "0.2s" }}
          >
            Create custom quizzes, track your progress, and learn with voice accessibility features. Join thousands of
            students already improving their knowledge.
          </p>
          <div
            className="flex flex-col sm:flex-row gap-6 justify-center slide-in-animation"
            style={{ animationDelay: "0.3s" }}
          >
            <Button
              size="lg"
              className="text-xl px-12 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 neon-glow cyberpunk-button"
              asChild
            >
              <Link href="/register">Start Learning Free</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-xl px-12 py-4 border-cyan-500/60 hover:bg-cyan-500/30 text-white bg-transparent cyberpunk-button border-glow-animation"
              asChild
            >
              <Link href="/catalog">Browse Quizzes</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-4 pb-24">
        <div className="container mx-auto">
          <div
            className="bg-card/90 backdrop-blur-md rounded-3xl p-10 border border-purple-500/40 shadow-2xl neon-glow interactive-card scale-in-animation"
            style={{ animationDelay: "0.4s" }}
          >
            <img
              src="/students-taking-interactive-quiz-on-tablet-with-co.jpg"
              alt="Students using QuizMaster interactive learning platform"
              className="w-full h-[500px] object-cover rounded-2xl border border-purple-500/30"
            />
          </div>
        </div>
      </section>

      <section className="relative z-10 py-24 px-4 bg-card/60 backdrop-blur-md border-y border-purple-500/30">
        <div className="container mx-auto">
          <div className="text-center mb-20 slide-in-animation">
            <h3 className="text-4xl md:text-5xl font-bold mb-6 text-white bg-gradient-to-r from-gray-100 via-purple-200 to-pink-200 bg-clip-text text-transparent [&]:text-white supports-[background-clip:text]:text-transparent">
              Everything You Need to Excel
            </h3>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Our platform combines the best learning techniques with modern technology to create an engaging
              educational experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: "Custom Quiz Creation",
                desc: "Paste your notes and instantly generate personalized quizzes tailored to your study material.",
                gradient: "from-purple-500 to-pink-500",
                delay: "0.1s",
              },
              {
                icon: Mic,
                title: "Voice Accessibility",
                desc: "Navigate and answer quizzes using voice commands for a fully accessible learning experience.",
                gradient: "from-pink-500 to-red-500",
                delay: "0.2s",
              },
              {
                icon: Trophy,
                title: "Progress Tracking",
                desc: "Earn badges, maintain streaks, and visualize your learning progress with detailed analytics.",
                gradient: "from-cyan-500 to-blue-500",
                delay: "0.3s",
              },
              {
                icon: Users,
                title: "Community Learning",
                desc: "Share your custom quizzes with others and discover new subjects from the community.",
                gradient: "from-green-500 to-emerald-500",
                delay: "0.4s",
              },
              {
                icon: Zap,
                title: "Smart Difficulty",
                desc: "Adaptive difficulty levels that adjust based on your performance to optimize learning.",
                gradient: "from-yellow-500 to-orange-500",
                delay: "0.5s",
              },
              {
                icon: Brain,
                title: "Instant Explanations",
                desc: "Get detailed explanations for every answer to deepen your understanding of the material.",
                gradient: "from-purple-500 to-indigo-500",
                delay: "0.6s",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="border-purple-500/40 bg-card/90 backdrop-blur-md interactive-card scale-in-animation"
                style={{ animationDelay: feature.delay }}
              >
                <CardHeader className="p-8">
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6 neon-glow`}
                  >
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-white text-xl mb-3">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-300 text-base leading-relaxed">{feature.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-24 px-4">
        <div className="container mx-auto text-center">
          <Card className="max-w-3xl mx-auto border-purple-500/40 bg-gradient-to-br from-purple-900/60 to-pink-900/60 backdrop-blur-md neon-glow interactive-card scale-in-animation">
            <CardContent className="p-16">
              <h3 className="text-4xl md:text-5xl font-bold mb-6 text-white bg-gradient-to-r from-gray-100 via-purple-200 to-pink-200 bg-clip-text text-transparent [&]:text-white supports-[background-clip:text]:text-transparent">
                Ready to Transform Your Learning?
              </h3>
              <p className="text-xl text-gray-300 mb-10 leading-relaxed">
                Join thousands of students who have already improved their grades and knowledge retention.
              </p>
              <Button
                size="lg"
                className="text-xl px-12 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 neon-glow cyberpunk-button"
                asChild
              >
                <Link href="/register">Get Started Today</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="relative z-10 border-t border-purple-500/40 bg-card/90 backdrop-blur-md py-16 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6 scale-in-animation">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center neon-glow">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent [&]:text-white supports-[background-clip:text]:text-transparent">
              QuizMaster
            </span>
          </div>
          <p className="text-gray-400 text-lg">© 2024 QuizMaster. Empowering learners worldwide.</p>
        </div>
      </footer>
    </div>
  )
}
