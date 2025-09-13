"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Users, BookOpen, Target, Clock, Download, RefreshCw } from "lucide-react"
import {
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

// Mock analytics data
const mockAnalytics = {
  overview: {
    totalSessions: 45678,
    avgSessionTime: "12m 34s",
    bounceRate: 23.5,
    conversionRate: 8.7,
    topPerformingQuiz: "Advanced Calculus",
    peakHour: "2:00 PM - 3:00 PM",
  },
  userEngagement: [
    { date: "2024-01-14", sessions: 1200, users: 890, pageViews: 3400 },
    { date: "2024-01-15", sessions: 1350, users: 980, pageViews: 3800 },
    { date: "2024-01-16", sessions: 1100, users: 820, pageViews: 3100 },
    { date: "2024-01-17", sessions: 1450, users: 1100, pageViews: 4200 },
    { date: "2024-01-18", sessions: 1600, users: 1200, pageViews: 4600 },
    { date: "2024-01-19", sessions: 1380, users: 1050, pageViews: 4100 },
    { date: "2024-01-20", sessions: 1520, users: 1150, pageViews: 4400 },
  ],
  quizPerformance: [
    { category: "Mathematics", completed: 2400, started: 3200, avgScore: 78 },
    { category: "Science", completed: 1800, started: 2400, avgScore: 82 },
    { category: "History", completed: 1200, started: 1600, avgScore: 75 },
    { category: "Literature", completed: 900, started: 1200, avgScore: 80 },
    { category: "Other", completed: 600, started: 800, avgScore: 73 },
  ],
  deviceBreakdown: [
    { name: "Desktop", value: 45, color: "#8b5cf6" },
    { name: "Mobile", value: 35, color: "#06b6d4" },
    { name: "Tablet", value: 20, color: "#f59e0b" },
  ],
  topQuizzes: [
    { title: "Advanced Calculus", attempts: 1247, avgScore: 73.5, completion: 89 },
    { title: "World War II History", attempts: 892, avgScore: 81.2, completion: 92 },
    { title: "Basic Chemistry", attempts: 756, avgScore: 78.9, completion: 85 },
    { title: "Shakespeare Literature", attempts: 634, avgScore: 82.1, completion: 94 },
    { title: "Physics Fundamentals", attempts: 589, avgScore: 76.3, completion: 87 },
  ],
}

export function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState("7d")
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState(mockAnalytics)

  const refreshData = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1000)
  }

  const exportData = () => {
    // Simulate export functionality
    console.log("Exporting analytics data...")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <p className="text-slate-400 mt-1">Detailed platform performance insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32 bg-slate-800 border-slate-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={refreshData}
            variant="outline"
            size="sm"
            className="border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            onClick={exportData}
            variant="outline"
            size="sm"
            className="border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Sessions</p>
                <p className="text-2xl font-bold text-white">{data.overview.totalSessions.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                  <span className="text-green-400 text-sm">+12.5%</span>
                </div>
              </div>
              <Users className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Avg Session Time</p>
                <p className="text-2xl font-bold text-white">{data.overview.avgSessionTime}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                  <span className="text-green-400 text-sm">+8.3%</span>
                </div>
              </div>
              <Clock className="w-8 h-8 text-cyan-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Bounce Rate</p>
                <p className="text-2xl font-bold text-white">{data.overview.bounceRate}%</p>
                <div className="flex items-center mt-2">
                  <TrendingDown className="w-4 h-4 text-green-400 mr-1" />
                  <span className="text-green-400 text-sm">-3.2%</span>
                </div>
              </div>
              <Target className="w-8 h-8 text-amber-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Conversion Rate</p>
                <p className="text-2xl font-bold text-white">{data.overview.conversionRate}%</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                  <span className="text-green-400 text-sm">+1.8%</span>
                </div>
              </div>
              <BookOpen className="w-8 h-8 text-pink-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="engagement" className="space-y-6">
        <TabsList className="bg-slate-900 border-slate-800">
          <TabsTrigger value="engagement" className="data-[state=active]:bg-slate-800">
            User Engagement
          </TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-slate-800">
            Quiz Performance
          </TabsTrigger>
          <TabsTrigger value="devices" className="data-[state=active]:bg-slate-800">
            Device Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="engagement" className="space-y-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">User Engagement Trends</CardTitle>
              <CardDescription className="text-slate-400">Daily sessions, users, and page views</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={data.userEngagement}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="pageViews"
                    stackId="1"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.3}
                  />
                  <Area
                    type="monotone"
                    dataKey="sessions"
                    stackId="2"
                    stroke="#06b6d4"
                    fill="#06b6d4"
                    fillOpacity={0.3}
                  />
                  <Area type="monotone" dataKey="users" stackId="3" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Quiz Completion Rates</CardTitle>
                <CardDescription className="text-slate-400">Started vs completed by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.quizPerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="category" stroke="#9ca3af" />
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

            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Top Performing Quizzes</CardTitle>
                <CardDescription className="text-slate-400">Most popular quizzes by attempts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.topQuizzes.map((quiz, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">#{index + 1}</Badge>
                          <span className="text-white font-medium">{quiz.title}</span>
                        </div>
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-sm text-slate-400 mb-1">
                            <span>Completion Rate</span>
                            <span>{quiz.completion}%</span>
                          </div>
                          <Progress value={quiz.completion} className="h-2" />
                        </div>
                      </div>
                      <div className="ml-4 text-right">
                        <p className="text-white font-semibold">{quiz.attempts}</p>
                        <p className="text-slate-400 text-sm">attempts</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="devices" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Device Distribution</CardTitle>
                <CardDescription className="text-slate-400">User sessions by device type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.deviceBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {data.deviceBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Key Insights</CardTitle>
                <CardDescription className="text-slate-400">Platform performance highlights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-800 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Top Performing Quiz</h4>
                    <p className="text-slate-300">{data.overview.topPerformingQuiz}</p>
                    <p className="text-slate-400 text-sm mt-1">Highest completion rate this week</p>
                  </div>
                  <div className="p-4 bg-slate-800 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Peak Usage Time</h4>
                    <p className="text-slate-300">{data.overview.peakHour}</p>
                    <p className="text-slate-400 text-sm mt-1">Most active user period</p>
                  </div>
                  <div className="p-4 bg-slate-800 rounded-lg">
                    <h4 className="text-white font-medium mb-2">User Retention</h4>
                    <p className="text-slate-300">78.5% weekly retention</p>
                    <p className="text-slate-400 text-sm mt-1">Users returning within 7 days</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
