import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { ADMIN_AUTH_COOKIE } from '@/lib/admin-auth'

// GET /api/admin/site-settings - Get site settings
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get(ADMIN_AUTH_COOKIE)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get site settings (assuming single settings record)
    let settings = await prisma.siteSettings.findFirst()

    // If no settings exist, create default ones
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          siteName: 'Portfolio',
          siteDescription: 'Building amazing web experiences with modern technologies.',
          logo: null,
          favicon: null,
          colors: {
            primary: '#3b82f6',
            secondary: '#64748b'
          },
          fonts: {
            heading: 'Inter',
            body: 'Inter'
          },
          social: {
            github: '#',
            linkedin: '#',
            twitter: '#',
            email: '#'
          },
          contact: {
            email: 'contact@example.com',
            phone: '+1 (555) 123-4567'
          },
          analytics: {
            enabled: false
          },
          maintenance: false
        }
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Failed to fetch site settings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/admin/site-settings - Update site settings
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get(ADMIN_AUTH_COOKIE)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      siteName,
      siteDescription,
      logo,
      logoPath,
      favicon,
      faviconPath,
      colors,
      fonts,
      social,
      contact,
      analytics,
      maintenance
    } = body

    // Validate required fields
    if (!siteName) {
      return NextResponse.json(
        { error: 'Site name is required' },
        { status: 400 }
      )
    }

    // Check if settings exist
    const existingSettings = await prisma.siteSettings.findFirst()

    let settings
    if (existingSettings) {
      // Update existing settings
      settings = await prisma.siteSettings.update({
        where: { id: existingSettings.id },
        data: {
          siteName,
          siteDescription: siteDescription || null,
          logo: logo || null,
          favicon: favicon || null,
          colors: colors || existingSettings.colors,
          fonts: fonts || existingSettings.fonts,
          social: social || existingSettings.social,
          contact: contact || existingSettings.contact,
          analytics: analytics || existingSettings.analytics,
          maintenance: maintenance !== undefined ? maintenance : false
        }
      })
    } else {
      // Create new settings
      settings = await prisma.siteSettings.create({
        data: {
          siteName,
          siteDescription: siteDescription || null,
          logo: logo || null,
          favicon: favicon || null,
          colors: colors || {
            primary: '#3b82f6',
            secondary: '#64748b'
          },
          fonts: fonts || {
            heading: 'Inter',
            body: 'Inter'
          },
          social: social || {
            github: '#',
            linkedin: '#',
            twitter: '#',
            email: '#'
          },
          contact: contact || {
            email: 'contact@example.com',
            phone: '+1 (555) 123-4567'
          },
          analytics: analytics || {
            enabled: false
          },
          maintenance: maintenance !== undefined ? maintenance : false
        }
      })
    }

    return NextResponse.json(settings, { status: existingSettings ? 200 : 201 })
  } catch (error) {
    console.error('Failed to save site settings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}