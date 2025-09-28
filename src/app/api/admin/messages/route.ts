import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { ADMIN_AUTH_COOKIE } from '@/lib/admin-auth'

// GET /api/admin/messages - Get all messages for admin
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get(ADMIN_AUTH_COOKIE)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const messages = await prisma.message.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error('Failed to fetch messages:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}