"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { User, Lock, AlertCircle, ArrowRight, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function AdminLoginForm() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        setError(typeof payload.error === "string" ? payload.error : "Invalid credentials")
        setIsSubmitting(false)
        return
      }

      router.replace("/admin")
      router.refresh()
    } catch (requestError) {
      console.error("Failed to submit admin login", requestError)
      setError("Unable to reach the server. Please try again.")
      setIsSubmitting(false)
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {/* Username Field */}
      <div className="space-y-2">
        <label
          htmlFor="username"
          className="text-sm font-semibold text-slate-700 dark:text-slate-300"
        >
          Username
        </label>
        <div className="relative group">
          <div className={`absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none transition-colors duration-200 ${
            focusedField === 'username' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-600'
          }`}>
            <User className="w-5 h-5" />
          </div>
          <Input
            id="username"
            name="username"
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            onFocus={() => setFocusedField('username')}
            onBlur={() => setFocusedField(null)}
            placeholder="Enter your username"
            required
            disabled={isSubmitting}
            className="pl-12 h-12 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl transition-all duration-200"
          />
        </div>
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <label
          htmlFor="password"
          className="text-sm font-semibold text-slate-700 dark:text-slate-300"
        >
          Password
        </label>
        <div className="relative group">
          <div className={`absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none transition-colors duration-200 ${
            focusedField === 'password' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-600'
          }`}>
            <Lock className="w-5 h-5" />
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField(null)}
            placeholder="Enter your password"
            required
            disabled={isSubmitting}
            className="pl-12 h-12 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl transition-all duration-200"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/30"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 text-red-600 dark:text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
        </motion.div>
      )}

      {/* Submit Button */}
      <motion.div
        whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
        whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
      >
        <Button
          type="submit"
          className="w-full h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Signing in…
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Sign in
              <ArrowRight className="w-5 h-5" />
            </span>
          )}
        </Button>
      </motion.div>
    </form>
  )
}
