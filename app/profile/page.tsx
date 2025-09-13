"use client"

import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Globe, Volume2, Save, Target, Zap, Star } from "lucide-react"
import { useState, useEffect } from "react"

interface UserProfile {
  name: string
  email: string
  avatar?: string
  language: string
  voiceEnabled: boolean
  textSize: string
  theme: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    language: "en",
    voiceEnabled: false,
    textSize: "medium",
    theme: "light",
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const user = JSON.parse(userData)
      setProfile((prev) => ({
        ...prev,
        name: user.name,
        email: user.email,
      }))
    }
  }, [])

  const handleSave = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Update localStorage
    const userData = { name: profile.name, email: profile.email }
    localStorage.setItem("user", JSON.stringify(userData))

    setIsLoading(false)
  }

  const updateProfile = (field: keyof UserProfile, value: string | boolean) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  const stats = {
    totalQuizzes: 24,
    averageScore: 87,
    currentStreak: 5,
    badgesEarned: 3,
  }

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
            <p className="text-muted-foreground mt-1">Manage your account and learning preferences</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Overview */}
            <Card className="border-border">
              <CardHeader className="text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {profile.name.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <CardTitle>{profile.name}</CardTitle>
                <CardDescription>{profile.email}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-foreground">{stats.totalQuizzes}</div>
                    <div className="text-sm text-muted-foreground">Quizzes</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{stats.averageScore}%</div>
                    <div className="text-sm text-muted-foreground">Avg Score</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{stats.currentStreak}</div>
                    <div className="text-sm text-muted-foreground">Day Streak</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{stats.badgesEarned}</div>
                    <div className="text-sm text-muted-foreground">Badges</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Settings */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>Update your basic profile information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => updateProfile("name", e.target.value)}
                        placeholder="Enter your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => updateProfile("email", e.target.value)}
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Language & Accessibility */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Language & Accessibility
                  </CardTitle>
                  <CardDescription>Customize your learning experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select value={profile.language} onValueChange={(value) => updateProfile("language", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                          <SelectItem value="zh">Chinese</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="textSize">Text Size</Label>
                      <Select value={profile.textSize} onValueChange={(value) => updateProfile("textSize", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select text size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                          <SelectItem value="extra-large">Extra Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="flex items-center gap-2">
                        <Volume2 className="w-4 h-4" />
                        Voice Commands
                      </Label>
                      <p className="text-sm text-muted-foreground">Enable voice navigation and quiz answering</p>
                    </div>
                    <Switch
                      checked={profile.voiceEnabled}
                      onCheckedChange={(checked) => updateProfile("voiceEnabled", checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Recent Badges */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Recent Achievements</CardTitle>
                  <CardDescription>Your latest earned badges</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-2 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      First Steps
                    </Badge>
                    <Badge className="bg-secondary/10 text-secondary border-secondary/20 px-3 py-2 flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Streak Master
                    </Badge>
                    <Badge className="bg-accent/10 text-accent border-accent/20 px-3 py-2 flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Perfect Score
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Save Button */}
              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isLoading} className="px-8">
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
