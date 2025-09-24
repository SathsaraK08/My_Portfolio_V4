"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  FolderOpen, 
  GraduationCap, 
  Award, 
  MessageCircle,
  TrendingUp,
  Eye,
  Star,
  Activity
} from "lucide-react"
import Link from "next/link"

// Mock data for demonstration
const stats = [
  {
    title: "Total Projects",
    value: "12",
    change: "+2 this month",
    trend: "up",
    icon: FolderOpen,
    href: "/admin/projects"
  },
  {
    title: "Skills",
    value: "24",
    change: "+3 new skills",
    trend: "up",
    icon: Users,
    href: "/admin/skills"
  },
  {
    title: "Certificates",
    value: "8",
    change: "+1 this quarter",
    trend: "up",
    icon: Award,
    href: "/admin/certificates"
  },
  {
    title: "Messages",
    value: "15",
    change: "5 unread",
    trend: "neutral",
    icon: MessageCircle,
    href: "/admin/messages"
  }
]

const recentProjects = [
  {
    name: "E-Commerce Platform",
    status: "completed",
    lastUpdated: "2 days ago",
    views: 234
  },
  {
    name: "Task Management App",
    status: "in-progress",
    lastUpdated: "1 week ago",
    views: 156
  },
  {
    name: "Weather Dashboard",
    status: "completed",
    lastUpdated: "2 weeks ago",
    views: 89
  }
]

const recentMessages = [
  {
    name: "John Smith",
    subject: "Project Inquiry",
    time: "2 hours ago",
    status: "unread"
  },
  {
    name: "Sarah Johnson",
    subject: "Collaboration Opportunity",
    time: "1 day ago",
    status: "read"
  },
  {
    name: "Mike Davis",
    subject: "Technical Question",
    time: "3 days ago",
    status: "replied"
  }
]

const quickActions = [
  {
    title: "Add New Project",
    description: "Create a new project entry",
    href: "/admin/projects/new",
    icon: FolderOpen,
    color: "bg-blue-500"
  },
  {
    title: "Add Skill",
    description: "Add a new skill to your profile",
    href: "/admin/skills/new",
    icon: Users,
    color: "bg-green-500"
  },
  {
    title: "Add Certificate",
    description: "Upload a new certificate",
    href: "/admin/certificates/new",
    icon: Award,
    color: "bg-purple-500"
  },
  {
    title: "View Messages",
    description: "Check new contact messages",
    href: "/admin/messages",
    icon: MessageCircle,
    color: "bg-orange-500"
  }
]

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Welcome back, Admin! 👋</h1>
        <p className="text-muted-foreground">
          Here's what's happening with your portfolio today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <TrendingUp className={`h-3 w-3 ${stat.trend === 'up' ? 'text-green-500' : ''}`} />
                <span>{stat.change}</span>
              </div>
              <Button size="sm" variant="outline" className="mt-3 w-full" asChild>
                <Link href={stat.href}>Manage</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>
              Your latest project updates and performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects.map((project, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <div className="font-medium">{project.name}</div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Badge 
                        variant={project.status === 'completed' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {project.status}
                      </Badge>
                      <span>•</span>
                      <span>{project.lastUpdated}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    <span>{project.views}</span>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link href="/admin/projects">View All Projects</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Messages</CardTitle>
            <CardDescription>
              Latest contact form submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMessages.map((message, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <div className="font-medium">{message.name}</div>
                    <div className="text-sm text-muted-foreground">{message.subject}</div>
                    <div className="text-xs text-muted-foreground">{message.time}</div>
                  </div>
                  <Badge 
                    variant={
                      message.status === 'unread' ? 'default' : 
                      message.status === 'replied' ? 'secondary' : 'outline'
                    }
                    className="text-xs"
                  >
                    {message.status}
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link href="/admin/messages">View All Messages</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks you might want to perform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 flex flex-col items-start space-y-2"
                asChild
              >
                <Link href={action.href}>
                  <div className={`h-8 w-8 rounded-lg ${action.color} flex items-center justify-center mb-2`}>
                    <action.icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="space-y-1 text-left">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-xs text-muted-foreground">{action.description}</div>
                  </div>
                </Link>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Portfolio Analytics</span>
          </CardTitle>
          <CardDescription>
            Overview of your portfolio performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <div className="text-2xl font-bold">1,234</div>
              <div className="text-sm text-muted-foreground">Total Page Views</div>
              <div className="text-xs text-green-600">+12% from last month</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold">89</div>
              <div className="text-sm text-muted-foreground">Contact Inquiries</div>
              <div className="text-xs text-green-600">+8% from last month</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold">24</div>
              <div className="text-sm text-muted-foreground">Project Views</div>
              <div className="text-xs text-blue-600">Most popular: E-Commerce Platform</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}