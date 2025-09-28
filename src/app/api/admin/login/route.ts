import { randomUUID } from "crypto"
import { NextResponse } from "next/server"

import { ADMIN_AUTH_COOKIE } from "@/lib/admin-auth"

const DEFAULT_USERNAME = "admin"
const DEFAULT_PASSWORD = "admin123"

export async function POST(request: Request) {
  const { username, password } = (await request.json()) as {
    username?: string
    password?: string
  }

  if (!username || !password) {
    return NextResponse.json(
      { error: "Username and password are required." },
      { status: 400 }
    )
  }

  const expectedUsername = process.env.ADMIN_USERNAME ?? DEFAULT_USERNAME
  const expectedPassword = process.env.ADMIN_PASSWORD ?? DEFAULT_PASSWORD

  if (username !== expectedUsername || password !== expectedPassword) {
    return NextResponse.json(
      { error: "Invalid credentials." },
      { status: 401 }
    )
  }

  const response = NextResponse.json({ success: true })

  response.cookies.set({
    name: ADMIN_AUTH_COOKIE,
    value: randomUUID(),
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 8,
  })

  return response
}
