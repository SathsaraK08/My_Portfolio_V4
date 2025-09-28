import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { ADMIN_AUTH_COOKIE } from '@/lib/admin-auth'

// GET /api/admin/profile - Get profile data for admin
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get(ADMIN_AUTH_COOKIE)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the first profile (assuming single profile setup)
    const profile = await prisma.profile.findFirst()

    if (!profile) {
      // Return default profile structure if none exists
      return NextResponse.json({
        id: null,
        fullName: 'Sathsara Karunarathne',
        title: 'AI / ML Engineer',
        bio: 'Passionate AI/ML Engineer building intelligent systems that solve real-world problems. Specialized in deep learning, computer vision, and scalable ML infrastructure.',
        avatar: 'https://cowyzhxivrfixizgdugw.supabase.co/storage/v1/object/public/media/uploads/06729a38-2f99-47d1-9b0d-ec51743fc187-35A4424.JPG.JPG',
        resume: null,
        location: 'Sri Lanka',
        email: 'sathsara@example.com',
        phone: '+94 123 456 789',
        website: 'https://sathsara.dev',
        linkedIn: 'https://linkedin.com/in/sathsara',
        github: 'https://github.com/sathsara',
        twitter: 'https://twitter.com/sathsara',
        instagram: null,
        youTube: null,
        isVisible: true
      })
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Failed to fetch profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/admin/profile - Create or update profile
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get(ADMIN_AUTH_COOKIE)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      fullName,
      title,
      bio,
      avatar,
      avatarPath,
      resume,
      resumePath,
      location,
      email,
      phone,
      website,
      linkedIn,
      github,
      twitter,
      instagram,
      youTube,
      isVisible
    } = body

    // No mandatory field validation - allow saving with any combination of fields

    // Check if profile exists
    const existingProfile = await prisma.profile.findFirst()

    let profile
    if (existingProfile) {
      // Update existing profile
      profile = await prisma.profile.update({
        where: { id: existingProfile.id },
        data: {
          fullName: fullName || existingProfile.fullName,
          title: title || existingProfile.title,
          bio: bio || existingProfile.bio,
          avatar: avatar !== undefined ? avatar : existingProfile.avatar,
          avatarPath: avatarPath !== undefined ? avatarPath : existingProfile.avatarPath,
          resume: resume !== undefined ? resume : existingProfile.resume,
          resumePath: resumePath !== undefined ? resumePath : existingProfile.resumePath,
          location: location !== undefined ? location : existingProfile.location,
          email: email || existingProfile.email,
          phone: phone !== undefined ? phone : existingProfile.phone,
          website: website !== undefined ? website : existingProfile.website,
          linkedIn: linkedIn !== undefined ? linkedIn : existingProfile.linkedIn,
          github: github !== undefined ? github : existingProfile.github,
          twitter: twitter !== undefined ? twitter : existingProfile.twitter,
          instagram: instagram !== undefined ? instagram : existingProfile.instagram,
          youTube: youTube !== undefined ? youTube : existingProfile.youTube,
          isVisible: isVisible !== undefined ? isVisible : existingProfile.isVisible
        }
      })
    } else {
      // Create new profile
      profile = await prisma.profile.create({
        data: {
          fullName: fullName || 'Portfolio Owner',
          title: title || 'Professional',
          bio: bio || 'Welcome to my portfolio.',
          avatar: avatar || null,
          avatarPath: avatarPath || null,
          resume: resume || null,
          resumePath: resumePath || null,
          location: location || null,
          email: email || 'contact@example.com',
          phone: phone || null,
          website: website || null,
          linkedIn: linkedIn || null,
          github: github || null,
          twitter: twitter || null,
          instagram: instagram || null,
          youTube: youTube || null,
          isVisible: isVisible !== undefined ? isVisible : true
        }
      })
    }

    return NextResponse.json(profile, { status: existingProfile ? 200 : 201 })
  } catch (error) {
    console.error('Failed to save profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}