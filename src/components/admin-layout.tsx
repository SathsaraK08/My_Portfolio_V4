"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  GraduationCap,
  Award,
  MessageCircle,
  Settings,
  Menu,
  X,
  LogOut,
  User,
  Briefcase
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Profile", href: "/admin/profile", icon: User },
  { name: "Skills", href: "/admin/skills", icon: Users },
  { name: "Services", href: "/admin/services", icon: Briefcase },
  { name: "Projects", href: "/admin/projects", icon: FolderOpen },
  { name: "Education", href: "/admin/education", icon: GraduationCap },
  { name: "Certificates", href: "/admin/certificates", icon: Award },
  { name: "Messages", href: "/admin/messages", icon: MessageCircle },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    if (isSigningOut) return

    try {
      setIsSigningOut(true)
      await fetch("/api/admin/logout", { method: "POST" })
      router.replace("/admin/login")
      router.refresh()
    } catch (error) {
      console.error("Failed to sign out", error)
      setIsSigningOut(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Clean & Professional */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 border-r border-border transform transition-transform duration-200 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo - Minimal */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-border">
            <Link href="/admin" className="flex items-center space-x-3">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-md">
                <LayoutDashboard className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-semibold">Admin Panel</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation - Minimal with Icons */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 text-blue-700 dark:text-blue-300 shadow-sm"
                      : "text-muted-foreground hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 dark:hover:from-blue-950/20 dark:hover:to-purple-950/20 hover:text-foreground hover:translate-x-1"
                  )}
                >
                  <item.icon className={cn(
                    "h-4 w-4 flex-shrink-0 transition-transform duration-200",
                    !isActive && "group-hover:scale-110"
                  )} />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* User Menu */}
          <div className="border-t border-border p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
                <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Admin User</p>
                <p className="text-xs text-muted-foreground truncate">admin@example.com</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  className="flex-1 justify-start bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-sm"
                  asChild
                >
                  <Link href="/">
                    <User className="h-4 w-4 mr-2" />
                    View Site
                  </Link>
                </Button>
                <ThemeToggle />
              </div>
              <Button
                size="sm"
                className="w-full justify-start bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 hover:from-slate-200 hover:to-slate-300 dark:hover:from-slate-700 dark:hover:to-slate-600 text-slate-700 dark:text-slate-300 shadow-sm"
                onClick={handleSignOut}
                disabled={isSigningOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                {isSigningOut ? "Signing out…" : "Sign Out"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-semibold">
              {navigation.find(item => item.href === pathname)?.name || "Admin Panel"}
            </h1>
          </div>

          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Button
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-sm"
              asChild
            >
              <Link href="/">View Site</Link>
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="min-h-screen p-6 bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/20 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20">
          {children}
        </main>
      </div>
    </div>
  )
}
