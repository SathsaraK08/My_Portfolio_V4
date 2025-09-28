import { NextResponse } from "next/server"

import { ADMIN_AUTH_COOKIE } from "@/lib/admin-auth"

export async function POST() {
  const response = NextResponse.json({ success: true })

  response.cookies.set({
    name: ADMIN_AUTH_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  })

  return response
}
