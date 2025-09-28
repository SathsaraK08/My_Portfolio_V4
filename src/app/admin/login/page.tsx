import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminLoginForm } from "./login-form"
import { ADMIN_AUTH_COOKIE } from "@/lib/admin-auth"

export default async function AdminLoginPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get(ADMIN_AUTH_COOKIE)

  if (session) {
    redirect("/admin")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Admin sign in</CardTitle>
            <CardDescription>
              Enter the credentials configured for this site to manage your portfolio content.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <AdminLoginForm />
            <p className="text-xs text-muted-foreground">
              Tip: set the `ADMIN_USERNAME` and `ADMIN_PASSWORD` environment variables to control access.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
