import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Sparkles } from "lucide-react"

import { AdminLoginForm } from "./login-form"
import { ADMIN_AUTH_COOKIE } from "@/lib/admin-auth"

export default async function AdminLoginPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get(ADMIN_AUTH_COOKIE)

  if (session) {
    redirect("/admin")
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/30 dark:to-purple-950/30 px-4 py-12">
      {/* Animated Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-transparent rounded-full blur-3xl opacity-50 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[32rem] h-[32rem] bg-gradient-to-tl from-purple-500/20 via-blue-500/20 to-transparent rounded-full blur-3xl opacity-40 animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md z-10">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8 space-y-4">
          <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 shadow-2xl shadow-blue-600/30">
            <Sparkles className="w-8 h-8 text-white" />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/50 to-purple-400/50 blur-xl" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              Admin Portal
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Portfolio Management System
            </p>
          </div>
        </div>

        {/* Glass-morphism Login Card */}
        <div className="relative backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-2xl shadow-slate-900/10 dark:shadow-slate-900/50 overflow-hidden">
          {/* Gradient Border Effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 blur-xl opacity-50" />

          {/* Content */}
          <div className="relative p-8 space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Welcome Back
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Enter your credentials to manage your portfolio content
              </p>
            </div>

            <AdminLoginForm />

            {/* Tip Section */}
            <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
              <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200/30 dark:border-blue-800/30">
                <svg className="w-4 h-4 mt-0.5 text-blue-600 dark:text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
                  <span className="font-semibold">Environment Setup:</span> Configure <code className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/50 font-mono text-[10px]">ADMIN_USERNAME</code> and <code className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/50 font-mono text-[10px]">ADMIN_PASSWORD</code> variables.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-500">
            Secured with industry-standard encryption
          </p>
        </div>
      </div>
    </div>
  )
}
