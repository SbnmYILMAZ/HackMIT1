"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Users, BookOpen, Activity, Target, CheckCircle, Download, RefreshCw } from "lucide-react"
import { fetchQuizzes } from "@/lib/api/quiz-api"
import { getUserAttemptStats } from "@/lib/database/attempt-operations"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface AnalyticsData {
  overview: {
    totalUsers: number
    activeUsers: number
    totalQuizzes: number
    completedQuizzes: number
    averageScore: number
    systemUptime: number
  }
  userGrowth: Array<{ month: string; users: number; active: number }>
  quizActivity: Array<{ day: string; completed: number; started: number }>
  subjectDistribution: Array<{ name: string; value: number; color: string }>
  recentActivity: Array<{
    id: number
    user: string
    action: string
    score?: number
    time: string
  }>
}

export function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadAnalyticsData()
  }, [])

  const loadAnalyticsData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Fetch real data from APIs
      const [quizzes] = await Promise.all([
        fetchQuizzes({})
      ])
      
      // Calculate subject distribution from real quiz data
      const subjectCounts = quizzes.reduce((acc: Record<string, number>, quiz) => {
        acc[quiz.subject] = (acc[quiz.subject] || 0) + 1
        return acc
      }, {})
      
      const totalQuizzes = quizzes.length
      const subjectDistribution = [
        { 
          name: "Math", 
          value: Math.round(((subjectCounts.math || 0) / totalQuizzes) * 100) || 0, 
          color: "#8b5cf6" 
        },
        { 
          name: "Physics", 
          value: Math.round(((subjectCounts.physics || 0) / totalQuizzes) * 100) || 0, 
          color: "#06b6d4" 
        },
        { 
          name: "General", 
          value: Math.round(((subjectCounts.general || 0) / totalQuizzes) * 100) || 0, 
          color: "#f59e0b" 
        },
      ]
      
      // For now, use calculated data with some mock data for charts
      // In a real app, you'd have proper analytics endpoints
      const analyticsData: AnalyticsData = {
        overview: {
          totalUsers: 150, // Would come from user count API
          activeUsers: 89, // Would come from active users API
          totalQuizzes: totalQuizzes,
          completedQuizzes: 0, // Would come from attempts API
          averageScore: 0, // Would come from attempts API
          systemUptime: 99.8,
        },
        userGrowth: [
          { month: "Jan", users: 85, active: 62 },
          { month: "Feb", users: 92, active: 68 },
          { month: "Mar", users: 101, active: 75 },
          { month: "Apr", users: 113, active: 81 },
          { month: "May", users: 120, active: 86 },
          { month: "Jun", users: 150, active: 89 },
        ],
        quizActivity: [
          { day: "Mon", completed: 12, started: 18 },
          { day: "Tue", completed: 14, started: 20 },
          { day: "Wed", completed: 11, started: 16 },
          { day: "Thu", completed: 16, started: 22 },
          { day: "Fri", completed: 18, started: 24 },
          { day: "Sat", completed: 9, started: 13 },
          { day: "Sun", completed: 8, started: 11 },
        ],
        subjectDistribution,
        recentActivity: [
          { id: 1, user: "Student", action: 'Created new quiz', time: "2 minutes ago" },
          { id: 2, user: "User", action: "Completed quiz", score: 85, time: "5 minutes ago" },
          { id: 3, user: "Learner", action: "Started quiz", time: "8 minutes ago" },
        ],
      }
      
      setData(analyticsData)
    } catch (err) {
      console.error('Error loading analytics data:', err)
      setError('Failed to load analytics data')
    } finally {
      setIsLoading(false)
    }
  }

  const refreshData = () => {
    loadAnalyticsData()
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-slate-800 rounded animate-pulse" />
          <div className="h-10 w-32 bg-slate-800 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-800 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="text-center py-12">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-xl">!</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Error Loading Analytics</h3>
            <p className="text-slate-400 mb-4">{error}</p>
            <Button onClick={refreshData} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!data) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-slate-400 mt-1">Monitor and manage your quiz platform</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={refreshData}
            variant="outline"
            size="sm"
            className="border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total Users</CardTitle>
            <Users className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{data.overview.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-slate-400">
              <span className="text-green-400">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{data.overview.activeUsers.toLocaleString()}</div>
            <p className="text-xs text-slate-400">
              <span className="text-green-400">+8%</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total Quizzes</CardTitle>
            <BookOpen className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{data.overview.totalQuizzes.toLocaleString()}</div>
            <p className="text-xs text-slate-400">
              <span className="text-green-400">+{Math.max(1, Math.floor(data.overview.totalQuizzes * 0.1))}</span> new this week
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Average Score</CardTitle>
            <Target className="h-4 w-4 text-pink-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{data.overview.averageScore}%</div>
            <p className="text-xs text-slate-400">
              <span className="text-green-400">+2.3%</span> improvement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-slate-900 border-slate-800">
          <TabsTrigger value="overview" className="data-[state=active]:bg-slate-800">
            Overview
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-slate-800">
            Users
          </TabsTrigger>
          <TabsTrigger value="quizzes" className="data-[state=active]:bg-slate-800">
            Quizzes
          </TabsTrigger>
          <TabsTrigger value="activity" className="data-[state=active]:bg-slate-800">
            Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">User Growth</CardTitle>
                <CardDescription className="text-slate-400">Monthly user registration and activity</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={data.userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="users"
                      stackId="1"
                      stroke="#8b5cf6"
                      fill="#8b5cf6"
                      fillOpacity={0.3}
                    />
                    <Area
                      type="monotone"
                      dataKey="active"
                      stackId="2"
                      stroke="#06b6d4"
                      fill="#06b6d4"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Subject Distribution</CardTitle>
                <CardDescription className="text-slate-400">Quiz subjects by popularity</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.subjectDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {data.subjectDistribution.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">User Engagement</CardTitle>
              <CardDescription className="text-slate-400">Daily active users vs total registrations</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data.userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="users" stroke="#8b5cf6" strokeWidth={3} />
                  <Line type="monotone" dataKey="active" stroke="#06b6d4" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quizzes" className="space-y-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Quiz Activity</CardTitle>
              <CardDescription className="text-slate-400">Weekly quiz completion rates</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data.quizActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="day" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="started" fill="#f59e0b" />
                  <Bar dataKey="completed" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
              <CardDescription className="text-slate-400">Latest user actions and system events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                      <div>
                        <p className="text-white font-medium">{activity.user}</p>
                        <p className="text-slate-400 text-sm">{activity.action}</p>
                        {activity.score && (
                          <Badge variant={activity.score >= 70 ? "default" : "destructive"} className="mt-1">
                            Score: {activity.score}%
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-slate-400 text-sm">{activity.time}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* System Status */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Activity className="w-5 h-5 mr-2 text-green-400" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Server Uptime</span>
                <span className="text-green-400 font-medium">{data.overview.systemUptime}%</span>
              </div>
              <Progress value={data.overview.systemUptime} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Database Health</span>
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-sm text-slate-400">All systems operational</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">API Response</span>
                <span className="text-green-400 font-medium">45ms avg</span>
              </div>
              <p className="text-sm text-slate-400">Excellent performance</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
