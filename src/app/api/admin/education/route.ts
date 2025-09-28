import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { ADMIN_AUTH_COOKIE } from '@/lib/admin-auth'

// GET /api/admin/education - Get all education records for admin
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get(ADMIN_AUTH_COOKIE)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const education = await prisma.education.findMany({
      orderBy: [
        { order: 'asc' },
        { startDate: 'desc' }
      ]
    })

    return NextResponse.json(education)
  } catch (error) {
    console.error('Failed to fetch education:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/admin/education - Create new education record
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get(ADMIN_AUTH_COOKIE)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      institution,
      degree,
      field,
      description,
      grade,
      startDate,
      endDate,
      isCurrent,
      location,
      achievements,
      order,
      isVisible
    } = body

    // Validate required fields
    if (!institution || !degree || !startDate) {
      return NextResponse.json(
        { error: 'Institution, degree, and start date are required' },
        { status: 400 }
      )
    }

    const education = await prisma.education.create({
      data: {
        institution,
        degree,
        field: field || null,
        description: description || null,
        grade: grade || null,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        isCurrent: isCurrent || false,
        location: location || null,
        achievements: achievements || [],
        order: order || 0,
        isVisible: isVisible !== undefined ? isVisible : true
      }
    })

    return NextResponse.json(education, { status: 201 })
  } catch (error) {
    console.error('Failed to create education:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}