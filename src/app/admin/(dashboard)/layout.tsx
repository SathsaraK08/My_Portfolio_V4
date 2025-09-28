import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { AdminLayout } from "@/components/admin-layout"
import { ADMIN_AUTH_COOKIE } from "@/lib/admin-auth"

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const session = cookieStore.get(ADMIN_AUTH_COOKIE)

  if (!session) {
    redirect("/admin/login")
  }

  return <AdminLayout>{children}</AdminLayout>
}
