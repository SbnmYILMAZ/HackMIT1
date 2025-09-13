"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, MoreHorizontal, UserPlus, Shield, Ban, CheckCircle, Clock, Edit, Trash2, Eye } from "lucide-react"

// Mock user data
const mockUsers = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "user",
    status: "active",
    joinDate: "2024-01-15",
    lastActive: "2024-01-20",
    quizzesCompleted: 45,
    averageScore: 87,
    avatar: "/diverse-woman-portrait.png",
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    role: "admin",
    status: "active",
    joinDate: "2023-12-01",
    lastActive: "2024-01-20",
    quizzesCompleted: 23,
    averageScore: 92,
    avatar: "/thoughtful-man.png",
  },
  {
    id: 3,
    name: "Carol Davis",
    email: "carol@example.com",
    role: "user",
    status: "suspended",
    joinDate: "2024-01-10",
    lastActive: "2024-01-18",
    quizzesCompleted: 12,
    averageScore: 65,
    avatar: "/diverse-woman-portrait.png",
  },
  {
    id: 4,
    name: "David Wilson",
    email: "david@example.com",
    role: "user",
    status: "inactive",
    joinDate: "2023-11-20",
    lastActive: "2024-01-05",
    quizzesCompleted: 78,
    averageScore: 81,
    avatar: "/thoughtful-man.png",
  },
  {
    id: 5,
    name: "Eva Brown",
    email: "eva@example.com",
    role: "moderator",
    status: "active",
    joinDate: "2023-10-15",
    lastActive: "2024-01-19",
    quizzesCompleted: 156,
    averageScore: 94,
    avatar: "/diverse-woman-portrait.png",
  },
]

export function UserManagement() {
  const [users, setUsers] = useState(mockUsers)
  const [filteredUsers, setFilteredUsers] = useState(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let filtered = users

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((user) => user.status === statusFilter)
    }

    // Apply role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter)
    }

    setFilteredUsers(filtered)
  }, [users, searchTerm, statusFilter, roleFilter])

  const getStatusBadge = (status) => {
    const variants = {
      active: { variant: "default", icon: CheckCircle, color: "text-green-400" },
      inactive: { variant: "secondary", icon: Clock, color: "text-yellow-400" },
      suspended: { variant: "destructive", icon: Ban, color: "text-red-400" },
    }

    const config = variants[status] || variants.active
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getRoleBadge = (role) => {
    const colors = {
      admin: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      moderator: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      user: "bg-slate-500/20 text-slate-300 border-slate-500/30",
    }

    return <Badge className={colors[role] || colors.user}>{role.charAt(0).toUpperCase() + role.slice(1)}</Badge>
  }

  const handleUserAction = (action, userId) => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setUsers((prevUsers) =>
        prevUsers.map((user) => {
          if (user.id === userId) {
            switch (action) {
              case "activate":
                return { ...user, status: "active" }
              case "suspend":
                return { ...user, status: "suspended" }
              case "promote":
                return { ...user, role: user.role === "user" ? "moderator" : "admin" }
              case "demote":
                return { ...user, role: user.role === "admin" ? "moderator" : "user" }
              default:
                return user
            }
          }
          return user
        }),
      )
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">User Management</h1>
          <p className="text-slate-400 mt-1">Manage users, roles, and permissions</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
          <UserPlus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-white">{users.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Active Users</p>
                <p className="text-2xl font-bold text-white">{users.filter((u) => u.status === "active").length}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Admins</p>
                <p className="text-2xl font-bold text-white">{users.filter((u) => u.role === "admin").length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Suspended</p>
                <p className="text-2xl font-bold text-white">{users.filter((u) => u.status === "suspended").length}</p>
              </div>
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                <Ban className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-700 text-white"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-48 bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Users ({filteredUsers.length})</CardTitle>
          <CardDescription className="text-slate-400">Manage user accounts and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800">
                <TableHead className="text-slate-300">User</TableHead>
                <TableHead className="text-slate-300">Role</TableHead>
                <TableHead className="text-slate-300">Status</TableHead>
                <TableHead className="text-slate-300">Quizzes</TableHead>
                <TableHead className="text-slate-300">Avg Score</TableHead>
                <TableHead className="text-slate-300">Last Active</TableHead>
                <TableHead className="text-slate-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="border-slate-800">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback className="bg-slate-700 text-white">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-white font-medium">{user.name}</p>
                        <p className="text-slate-400 text-sm">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell className="text-slate-300">{user.quizzesCompleted}</TableCell>
                  <TableCell className="text-slate-300">{user.averageScore}%</TableCell>
                  <TableCell className="text-slate-400">{user.lastActive}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-slate-400 hover:text-white hover:bg-slate-800"
                          onClick={() => setSelectedUser(user)}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-900 border-slate-800 text-white">
                        <DialogHeader>
                          <DialogTitle>Manage User: {user.name}</DialogTitle>
                          <DialogDescription className="text-slate-400">
                            Choose an action to perform on this user account
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-3">
                            <Button
                              variant="outline"
                              className="border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent"
                              onClick={() => handleUserAction("view", user.id)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                            <Button
                              variant="outline"
                              className="border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent"
                              onClick={() => handleUserAction("edit", user.id)}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit User
                            </Button>
                            {user.status === "active" ? (
                              <Button
                                variant="outline"
                                className="border-red-700 text-red-300 hover:bg-red-900/20 bg-transparent"
                                onClick={() => handleUserAction("suspend", user.id)}
                                disabled={isLoading}
                              >
                                <Ban className="w-4 h-4 mr-2" />
                                Suspend
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                className="border-green-700 text-green-300 hover:bg-green-900/20 bg-transparent"
                                onClick={() => handleUserAction("activate", user.id)}
                                disabled={isLoading}
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Activate
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              className="border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent"
                              onClick={() => handleUserAction("promote", user.id)}
                              disabled={isLoading}
                            >
                              <Shield className="w-4 h-4 mr-2" />
                              {user.role === "user" ? "Promote" : "Change Role"}
                            </Button>
                          </div>
                          <Button
                            variant="destructive"
                            className="w-full"
                            onClick={() => handleUserAction("delete", user.id)}
                            disabled={isLoading}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete User
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
