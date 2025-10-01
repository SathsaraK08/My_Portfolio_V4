import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Users, Settings, FileText, BarChart3, Shield, Database, Eye, GraduationCap, Award, MessageCircle, TrendingUp, Activity } from 'lucide-react'

export default function AdminDashboard() {
  return (
    <div className="flex flex-col space-y-6">
      {/* Modern Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage your portfolio content and settings
          </p>
        </div>
        <Button
          asChild
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-sm"
        >
          <Link href="/" target="_blank" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            View Site
          </Link>
        </Button>
      </div>

      {/* Clean Stats Cards - Blue/Purple Only */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-all duration-300 border-blue-100 dark:border-blue-900/30 bg-gradient-to-br from-blue-50/50 to-white dark:from-blue-950/20 dark:to-slate-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-100">Skills</CardTitle>
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-md shadow-blue-500/25">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">4</div>
            <p className="text-xs text-muted-foreground mt-1">
              Technical skills displayed
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-purple-100 dark:border-purple-900/30 bg-gradient-to-br from-purple-50/50 to-white dark:from-purple-950/20 dark:to-slate-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900 dark:text-purple-100">Projects</CardTitle>
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-md shadow-purple-500/25">
              <FileText className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">6</div>
            <p className="text-xs text-muted-foreground mt-1">
              Portfolio projects
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-green-100 dark:border-green-900/30 bg-gradient-to-br from-green-50/50 to-white dark:from-green-950/20 dark:to-slate-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900 dark:text-green-100">Site Status</CardTitle>
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-md shadow-green-500/25">
              <Shield className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <Badge className="text-sm bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-sm">
              <div className="w-2 h-2 bg-white rounded-full mr-1.5 animate-pulse" />
              Live
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">
              Portfolio is online
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-blue-100 dark:border-blue-900/30 bg-gradient-to-br from-blue-50/50 to-white dark:from-blue-950/20 dark:to-slate-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-100">Database</CardTitle>
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 shadow-md shadow-blue-500/25">
              <Database className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <Badge className="text-sm bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-sm">Online & Secure</Badge>
            <p className="text-xs text-muted-foreground mt-1">
              System operational
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Management Cards - Clean Design */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border-l-4 border-l-blue-500 bg-gradient-to-br from-slate-50/50 to-white dark:from-slate-900/50 dark:to-slate-900">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-lg">Skills Management</CardTitle>
            </div>
            <CardDescription className="text-sm">
              Manage your technical skills and proficiency levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all">
              <Link href="/admin/skills">Manage Skills</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border-l-4 border-l-purple-500 bg-gradient-to-br from-slate-50/50 to-white dark:from-slate-900/50 dark:to-slate-900">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/30">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-lg">Projects</CardTitle>
            </div>
            <CardDescription className="text-sm">
              Add, edit, and organize your portfolio projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all">
              <Link href="/admin/projects">Manage Projects</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border-l-4 border-l-blue-500 bg-gradient-to-br from-slate-50/50 to-white dark:from-slate-900/50 dark:to-slate-900">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 shadow-lg shadow-blue-500/30">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-lg">Education</CardTitle>
            </div>
            <CardDescription className="text-sm">
              Manage your educational background and qualifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-md hover:shadow-lg transition-all">
              <Link href="/admin/education">Manage Education</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border-l-4 border-l-purple-500 bg-gradient-to-br from-slate-50/50 to-white dark:from-slate-900/50 dark:to-slate-900">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg shadow-purple-500/30">
                <Award className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-lg">Certificates</CardTitle>
            </div>
            <CardDescription className="text-sm">
              Track your professional certifications and achievements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-md hover:shadow-lg transition-all">
              <Link href="/admin/certificates">Manage Certificates</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border-l-4 border-l-blue-500 bg-gradient-to-br from-slate-50/50 to-white dark:from-slate-900/50 dark:to-slate-900">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-lg">Messages</CardTitle>
            </div>
            <CardDescription className="text-sm">
              View and respond to contact form messages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all">
              <Link href="/admin/messages">View Messages</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border-l-4 border-l-purple-500 bg-gradient-to-br from-slate-50/50 to-white dark:from-slate-900/50 dark:to-slate-900">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 shadow-lg shadow-purple-500/30">
                <Users className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-lg">Home Content</CardTitle>
            </div>
            <CardDescription className="text-sm">
              Manage the content displayed on your home page
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all">
              <Link href="/admin/home-content">Edit Home Content</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border-l-4 border-l-blue-500 bg-gradient-to-br from-slate-50/50 to-white dark:from-slate-900/50 dark:to-slate-900">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-slate-600 to-slate-700 shadow-lg shadow-slate-500/30">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-lg">Site Settings</CardTitle>
            </div>
            <CardDescription className="text-sm">
              Configure site-wide settings and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white shadow-md hover:shadow-lg transition-all">
              <Link href="/admin/settings">Configure Settings</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions - Modern Design */}
      <Card className="border-t-4 border-t-blue-500 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <Eye className="h-5 w-5 text-white" />
            </div>
            Quick Actions
          </CardTitle>
          <CardDescription>
            Common tasks and helpful links
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button asChild className="h-auto p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/40 dark:hover:to-purple-900/40 border-2 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 shadow-md hover:shadow-lg transition-all">
              <Link href="/" target="_blank" className="flex flex-col items-center gap-2">
                <Eye className="h-6 w-6" />
                <span className="font-medium">View Live Site</span>
              </Link>
            </Button>
            <Button asChild className="h-auto p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 hover:from-purple-100 hover:to-blue-100 dark:hover:from-purple-900/40 dark:hover:to-blue-900/40 border-2 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 shadow-md hover:shadow-lg transition-all">
              <Link href="/skills" target="_blank" className="flex flex-col items-center gap-2">
                <BarChart3 className="h-6 w-6" />
                <span className="font-medium">View Skills</span>
              </Link>
            </Button>
            <Button asChild className="h-auto p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 hover:from-blue-100 hover:to-cyan-100 dark:hover:from-blue-900/40 dark:hover:to-cyan-900/40 border-2 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 shadow-md hover:shadow-lg transition-all">
              <Link href="/projects" target="_blank" className="flex flex-col items-center gap-2">
                <FileText className="h-6 w-6" />
                <span className="font-medium">View Projects</span>
              </Link>
            </Button>
            <Button asChild className="h-auto p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/40 dark:hover:to-pink-900/40 border-2 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 shadow-md hover:shadow-lg transition-all">
              <Link href="/about" target="_blank" className="flex flex-col items-center gap-2">
                <Users className="h-6 w-6" />
                <span className="font-medium">View About</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Info - Modern Design */}
      <Card className="border-t-4 border-t-purple-500 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600">
              <Activity className="h-5 w-5 text-white" />
            </div>
            System Information
          </CardTitle>
          <CardDescription>
            Current status of your portfolio system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-3 p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-800">
              <div className="text-sm font-semibold text-green-900 dark:text-green-100">Portfolio Status</div>
              <Badge className="text-sm bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                <Shield className="h-3 w-3 mr-1" />
                Online & Secure
              </Badge>
            </div>
            <div className="space-y-3 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border border-blue-200 dark:border-blue-800">
              <div className="text-sm font-semibold text-blue-900 dark:text-blue-100">Theme</div>
              <Badge className="text-sm bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                <TrendingUp className="h-3 w-3 mr-1" />
                Light/Dark Mode
              </Badge>
            </div>
            <div className="space-y-3 p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border border-purple-200 dark:border-purple-800">
              <div className="text-sm font-semibold text-purple-900 dark:text-purple-100">Last Updated</div>
              <Badge className="text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                <Activity className="h-3 w-3 mr-1" />
                Today
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
