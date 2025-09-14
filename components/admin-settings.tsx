"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Settings, Globe, Shield, Bell, Palette, Save, RefreshCw, CheckCircle } from "lucide-react"

export function AdminSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState({
    general: {
      siteName: "Luminara",
      siteDescription: "Master Any Subject with Interactive Learning",
      maintenanceMode: false,
      registrationEnabled: true,
      guestAccess: true,
    },
    security: {
      passwordMinLength: 8,
      requireEmailVerification: true,
      enableTwoFactor: false,
      sessionTimeout: 24,
      maxLoginAttempts: 5,
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: false,
      adminAlerts: true,
      userWelcomeEmail: true,
      quizCompletionEmail: false,
    },
    content: {
      autoModeration: true,
      requireQuizApproval: true,
      allowUserQuizzes: true,
      maxQuestionsPerQuiz: 50,
      defaultQuizTime: 30,
    },
    appearance: {
      theme: "dark",
      primaryColor: "#8b5cf6",
      accentColor: "#06b6d4",
      logoUrl: "",
      faviconUrl: "",
    },
  })

  const handleSave = async (section) => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      console.log(`Saved ${section} settings:`, settings[section])
    }, 1000)
  }

  const handleReset = (section) => {
    // Reset to default values
    console.log(`Reset ${section} settings`)
  }

  const updateSetting = (section, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-slate-400 mt-1">Configure platform settings and preferences</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            All Systems Operational
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-slate-900 border-slate-800">
          <TabsTrigger value="general" className="data-[state=active]:bg-slate-800">
            <Globe className="w-4 h-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-slate-800">
            <Shield className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-slate-800">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="content" className="data-[state=active]:bg-slate-800">
            <Settings className="w-4 h-4 mr-2" />
            Content
          </TabsTrigger>
          <TabsTrigger value="appearance" className="data-[state=active]:bg-slate-800">
            <Palette className="w-4 h-4 mr-2" />
            Appearance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">General Settings</CardTitle>
              <CardDescription className="text-slate-400">Basic platform configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="siteName" className="text-slate-300">
                    Site Name
                  </Label>
                  <Input
                    id="siteName"
                    value={settings.general.siteName}
                    onChange={(e) => updateSetting("general", "siteName", e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteDescription" className="text-slate-300">
                    Site Description
                  </Label>
                  <Input
                    id="siteDescription"
                    value={settings.general.siteDescription}
                    onChange={(e) => updateSetting("general", "siteDescription", e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
              </div>

              <Separator className="bg-slate-800" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-slate-300">Maintenance Mode</Label>
                    <p className="text-sm text-slate-400">Temporarily disable site access for maintenance</p>
                  </div>
                  <Switch
                    checked={settings.general.maintenanceMode}
                    onCheckedChange={(checked) => updateSetting("general", "maintenanceMode", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-slate-300">User Registration</Label>
                    <p className="text-sm text-slate-400">Allow new users to create accounts</p>
                  </div>
                  <Switch
                    checked={settings.general.registrationEnabled}
                    onCheckedChange={(checked) => updateSetting("general", "registrationEnabled", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-slate-300">Guest Access</Label>
                    <p className="text-sm text-slate-400">Allow users to take quizzes without registration</p>
                  </div>
                  <Switch
                    checked={settings.general.guestAccess}
                    onCheckedChange={(checked) => updateSetting("general", "guestAccess", checked)}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => handleReset("general")}
                  className="border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button
                  onClick={() => handleSave("general")}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Security Settings</CardTitle>
              <CardDescription className="text-slate-400">
                Configure authentication and security policies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength" className="text-slate-300">
                    Minimum Password Length
                  </Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={settings.security.passwordMinLength}
                    onChange={(e) => updateSetting("security", "passwordMinLength", Number.parseInt(e.target.value))}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout" className="text-slate-300">
                    Session Timeout (hours)
                  </Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => updateSetting("security", "sessionTimeout", Number.parseInt(e.target.value))}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-slate-300">Email Verification Required</Label>
                    <p className="text-sm text-slate-400">Require users to verify their email address</p>
                  </div>
                  <Switch
                    checked={settings.security.requireEmailVerification}
                    onCheckedChange={(checked) => updateSetting("security", "requireEmailVerification", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-slate-300">Two-Factor Authentication</Label>
                    <p className="text-sm text-slate-400">Enable 2FA for admin accounts</p>
                  </div>
                  <Switch
                    checked={settings.security.enableTwoFactor}
                    onCheckedChange={(checked) => updateSetting("security", "enableTwoFactor", checked)}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => handleReset("security")}
                  className="border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button
                  onClick={() => handleSave("security")}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Notification Settings</CardTitle>
              <CardDescription className="text-slate-400">Configure email and push notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-slate-300">Email Notifications</Label>
                    <p className="text-sm text-slate-400">Send email notifications to users</p>
                  </div>
                  <Switch
                    checked={settings.notifications.emailNotifications}
                    onCheckedChange={(checked) => updateSetting("notifications", "emailNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-slate-300">Admin Alerts</Label>
                    <p className="text-sm text-slate-400">Receive alerts for important system events</p>
                  </div>
                  <Switch
                    checked={settings.notifications.adminAlerts}
                    onCheckedChange={(checked) => updateSetting("notifications", "adminAlerts", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-slate-300">Welcome Emails</Label>
                    <p className="text-sm text-slate-400">Send welcome email to new users</p>
                  </div>
                  <Switch
                    checked={settings.notifications.userWelcomeEmail}
                    onCheckedChange={(checked) => updateSetting("notifications", "userWelcomeEmail", checked)}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => handleReset("notifications")}
                  className="border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button
                  onClick={() => handleSave("notifications")}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Content Management</CardTitle>
              <CardDescription className="text-slate-400">Configure quiz and content policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="maxQuestions" className="text-slate-300">
                    Max Questions Per Quiz
                  </Label>
                  <Input
                    id="maxQuestions"
                    type="number"
                    value={settings.content.maxQuestionsPerQuiz}
                    onChange={(e) => updateSetting("content", "maxQuestionsPerQuiz", Number.parseInt(e.target.value))}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultTime" className="text-slate-300">
                    Default Quiz Time (minutes)
                  </Label>
                  <Input
                    id="defaultTime"
                    type="number"
                    value={settings.content.defaultQuizTime}
                    onChange={(e) => updateSetting("content", "defaultQuizTime", Number.parseInt(e.target.value))}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-slate-300">Auto Moderation</Label>
                    <p className="text-sm text-slate-400">Automatically flag inappropriate content</p>
                  </div>
                  <Switch
                    checked={settings.content.autoModeration}
                    onCheckedChange={(checked) => updateSetting("content", "autoModeration", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-slate-300">Require Quiz Approval</Label>
                    <p className="text-sm text-slate-400">All user-created quizzes need admin approval</p>
                  </div>
                  <Switch
                    checked={settings.content.requireQuizApproval}
                    onCheckedChange={(checked) => updateSetting("content", "requireQuizApproval", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-slate-300">Allow User Quizzes</Label>
                    <p className="text-sm text-slate-400">Let users create their own quizzes</p>
                  </div>
                  <Switch
                    checked={settings.content.allowUserQuizzes}
                    onCheckedChange={(checked) => updateSetting("content", "allowUserQuizzes", checked)}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => handleReset("content")}
                  className="border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button
                  onClick={() => handleSave("content")}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Appearance Settings</CardTitle>
              <CardDescription className="text-slate-400">Customize the platform's visual appearance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="theme" className="text-slate-300">
                    Theme
                  </Label>
                  <Select
                    value={settings.appearance.theme}
                    onValueChange={(value) => updateSetting("appearance", "theme", value)}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="auto">Auto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="primaryColor" className="text-slate-300">
                    Primary Color
                  </Label>
                  <Input
                    id="primaryColor"
                    type="color"
                    value={settings.appearance.primaryColor}
                    onChange={(e) => updateSetting("appearance", "primaryColor", e.target.value)}
                    className="bg-slate-800 border-slate-700 h-10"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => handleReset("appearance")}
                  className="border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button
                  onClick={() => handleSave("appearance")}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
