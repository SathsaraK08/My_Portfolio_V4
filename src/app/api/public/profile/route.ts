import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withDatabaseRetry } from '@/lib/db-utils'

// GET /api/public/profile - Get public profile data
export async function GET(request: NextRequest) {
  try {
    const profile = await withDatabaseRetry(async () => {
      return await prisma.profile.findFirst({
        where: {
          isVisible: true
        }
      })
    })

    if (!profile) {
      // Return default profile if none exists
      return NextResponse.json({
        fullName: 'John Doe',
        title: 'Full Stack Developer',
        bio: 'Full Stack Developer passionate about creating exceptional digital experiences.',
        avatar: null,
        location: 'San Francisco, CA',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        website: 'https://johndoe.dev',
        linkedIn: 'https://linkedin.com/in/johndoe',
        github: 'https://github.com/johndoe',
        twitter: 'https://twitter.com/johndoe',
        instagram: null,
        youTube: null
      })
    }

    // Return only public fields
    return NextResponse.json({
      fullName: profile.fullName,
      title: profile.title,
      bio: profile.bio,
      avatar: profile.avatar,
      location: profile.location,
      email: profile.email,
      phone: profile.phone,
      website: profile.website,
      linkedIn: profile.linkedIn,
      github: profile.github,
      twitter: profile.twitter,
      instagram: profile.instagram,
      youTube: profile.youTube
    })
  } catch (error) {
    console.error('Failed to fetch public profile:', error)

    // Return default profile on error
    return NextResponse.json({
      fullName: 'John Doe',
      title: 'Full Stack Developer',
      bio: 'Full Stack Developer passionate about creating exceptional digital experiences.',
      avatar: null,
      location: 'San Francisco, CA',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      website: 'https://johndoe.dev',
      linkedIn: 'https://linkedin.com/in/johndoe',
      github: 'https://github.com/johndoe',
      twitter: 'https://twitter.com/johndoe',
      instagram: null,
      youTube: null
    })
  }
}