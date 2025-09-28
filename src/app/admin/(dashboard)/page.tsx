import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Users, Settings, FileText, BarChart3, Shield, Database, Eye, GraduationCap, Award, MessageCircle } from 'lucide-react'

export default function AdminDashboard() {
  return (
    <div className="flex flex-col space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your portfolio content and settings
          </p>
        </div>
        <Button asChild>
          <Link href="/" target="_blank">View Site</Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skills</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">
              Technical skills displayed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">
              Portfolio projects
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Site Status</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Badge className="text-sm">Live</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Portfolio is online
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Badge variant="secondary" className="text-sm">Ready</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              System operational
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Management Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              Skills Management
            </CardTitle>
            <CardDescription>
              Manage your technical skills and proficiency levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/skills">Manage Skills</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-500" />
              Projects
            </CardTitle>
            <CardDescription>
              Add, edit, and organize your portfolio projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/projects">Manage Projects</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-purple-500" />
              Education
            </CardTitle>
            <CardDescription>
              Manage your educational background and qualifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/education">Manage Education</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              Certificates
            </CardTitle>
            <CardDescription>
              Track your professional certifications and achievements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/certificates">Manage Certificates</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-orange-500" />
              Messages
            </CardTitle>
            <CardDescription>
              View and respond to contact form messages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/messages">View Messages</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-500" />
              Home Content
            </CardTitle>
            <CardDescription>
              Manage the content displayed on your home page
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/home-content">Edit Home Content</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-gray-500" />
              Site Settings
            </CardTitle>
            <CardDescription>
              Configure site-wide settings and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" variant="secondary">
              <Link href="/admin/settings">Configure Settings</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Common tasks and helpful links
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button asChild variant="outline" className="h-auto p-4">
              <Link href="/" target="_blank" className="flex flex-col items-center gap-2">
                <Eye className="h-6 w-6" />
                <span>View Live Site</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4">
              <Link href="/skills" target="_blank" className="flex flex-col items-center gap-2">
                <BarChart3 className="h-6 w-6" />
                <span>View Skills</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4">
              <Link href="/projects" target="_blank" className="flex flex-col items-center gap-2">
                <FileText className="h-6 w-6" />
                <span>View Projects</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4">
              <Link href="/about" target="_blank" className="flex flex-col items-center gap-2">
                <Users className="h-6 w-6" />
                <span>View About</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Info */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>
            Current status of your portfolio system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="text-sm font-medium">Portfolio Status</div>
              <Badge className="text-sm">
                <Shield className="h-3 w-3 mr-1" />
                Online & Secure
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Theme</div>
              <Badge variant="secondary" className="text-sm">
                Light/Dark Mode
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Last Updated</div>
              <Badge variant="outline" className="text-sm">
                Today
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
