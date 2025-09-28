import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { ADMIN_AUTH_COOKIE } from '@/lib/admin-auth'

interface RouteParams {
  params: { id: string }
}

// PUT /api/admin/messages/[id] - Update message status
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get(ADMIN_AUTH_COOKIE)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const body = await request.json()

    // Check if message exists
    const existingMessage = await prisma.message.findUnique({
      where: { id }
    })

    if (!existingMessage) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    }

    const { status, isArchived } = body

    const message = await prisma.message.update({
      where: { id },
      data: {
        status: status || existingMessage.status,
        isArchived: isArchived !== undefined ? isArchived : existingMessage.isArchived
      }
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error('Failed to update message:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/messages/[id] - Delete message
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get(ADMIN_AUTH_COOKIE)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    // Check if message exists
    const existingMessage = await prisma.message.findUnique({
      where: { id }
    })

    if (!existingMessage) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    }

    await prisma.message.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Message deleted successfully' })
  } catch (error) {
    console.error('Failed to delete message:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}