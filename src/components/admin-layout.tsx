"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
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

      {/* Sidebar - Modern & Professional with Glassmorphism */}
      <motion.div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-slate-50/95 via-white/95 to-slate-50/95 dark:from-slate-900/95 dark:via-slate-900/95 dark:to-slate-950/95 backdrop-blur-xl border-r border-border/50 shadow-2xl shadow-slate-900/10 dark:shadow-black/50 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
        initial={{ x: -256 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="flex h-full flex-col">
          {/* Logo - Enhanced with Animation */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-border">
            <Link href="/admin" className="flex items-center space-x-3 group">
              <motion.div
                className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-xl group-hover:shadow-blue-500/40"
                whileHover={{ scale: 1.05, rotate: 360 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <LayoutDashboard className="h-5 w-5 text-white" />
                <motion.div
                  className="absolute inset-0 rounded-xl bg-gradient-to-tr from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100"
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              </motion.div>
              <motion.span
                className="text-lg font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:via-purple-700 group-hover:to-blue-900 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
              >
                Admin Panel
              </motion.span>
            </Link>
            <motion.div
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-300"
              >
                <X className="h-5 w-5" />
              </Button>
            </motion.div>
          </div>

          {/* Navigation - Modern with Advanced Hover Effects */}
          <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
            {navigation.map((item, index) => {
              const isActive = pathname === item.href
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "group relative flex items-center space-x-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-300 overflow-hidden",
                      isActive
                        ? "bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 dark:from-blue-400/10 dark:via-purple-400/10 dark:to-blue-400/10 text-blue-700 dark:text-blue-300 shadow-lg shadow-blue-500/10 dark:shadow-blue-400/10"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {/* Animated Background on Hover */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-blue-950/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={false}
                    />

                    {/* Glassmorphism Effect on Hover */}
                    <div className="absolute inset-0 bg-white/5 dark:bg-white/5 backdrop-blur-sm rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Shimmer Effect */}
                    <motion.div
                      className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent"
                      initial={false}
                    />

                    {/* Active Indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-600 via-purple-600 to-blue-600 rounded-r-full shadow-lg shadow-blue-500/50"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}

                    {/* Icon with Advanced Animation */}
                    <motion.div
                      className="relative z-10"
                      whileHover={{
                        scale: 1.2,
                        rotate: isActive ? 0 : [0, -10, 10, -10, 0],
                      }}
                      transition={{
                        duration: 0.5,
                        ease: "easeInOut"
                      }}
                    >
                      <item.icon
                        className={cn(
                          "h-5 w-5 flex-shrink-0 transition-all duration-300",
                          isActive
                            ? "text-blue-600 dark:text-blue-400 drop-shadow-lg"
                            : "group-hover:text-blue-600 dark:group-hover:text-blue-400"
                        )}
                      />
                    </motion.div>

                    {/* Text with Slide Animation */}
                    <motion.span
                      className="relative z-10 group-hover:translate-x-1 transition-transform duration-300"
                      whileHover={{ fontWeight: 600 }}
                    >
                      {item.name}
                    </motion.span>

                    {/* Hover Indicator Arrow */}
                    <motion.div
                      className="relative z-10 ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300"
                      initial={{ x: -10 }}
                      whileHover={{ x: 0 }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                    </motion.div>
                  </Link>
                </motion.div>
              )
            })}
          </nav>

          {/* User Menu - Enhanced with Hover Effects */}
          <div className="border-t border-border p-4">
            <motion.div
              className="flex items-center space-x-3 mb-4 p-2 rounded-xl hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 dark:hover:from-blue-950/20 dark:hover:to-purple-950/20 transition-all duration-300 cursor-pointer group"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              <motion.div
                className="relative h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:shadow-blue-500/20 transition-shadow duration-300"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </motion.div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">Admin User</p>
                <p className="text-xs text-muted-foreground truncate">admin@example.com</p>
              </div>
            </motion.div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <motion.div
                  className="flex-1"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    size="sm"
                    className="w-full justify-start bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 relative overflow-hidden group"
                    asChild
                  >
                    <Link href="/">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                      />
                      <User className="h-4 w-4 mr-2 relative z-10" />
                      <span className="relative z-10">View Site</span>
                    </Link>
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  transition={{ duration: 0.3 }}
                >
                  <ThemeToggle />
                </motion.div>
              </div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  size="sm"
                  className="w-full justify-start bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 hover:from-red-100 hover:to-red-200 dark:hover:from-red-900/30 dark:hover:to-red-800/30 text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-red-200/30 dark:via-red-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                  />
                  <motion.div
                    className="relative z-10"
                    animate={isSigningOut ? { rotate: 360 } : {}}
                    transition={{ duration: 1, repeat: isSigningOut ? Infinity : 0 }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                  </motion.div>
                  <span className="relative z-10">{isSigningOut ? "Signing out…" : "Sign Out"}</span>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar - Enhanced */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 px-6 shadow-sm">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </motion.div>

          <div className="flex items-center space-x-4">
            <motion.h1
              className="text-lg font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {navigation.find(item => item.href === pathname)?.name || "Admin Panel"}
            </motion.h1>
          </div>

          <div className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <ThemeToggle />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 relative overflow-hidden group"
                asChild
              >
                <Link href="/">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                  />
                  <span className="relative z-10">View Site</span>
                </Link>
              </Button>
            </motion.div>
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
