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
        fullName: 'Sathsara Karunarathne',
        title: 'AI / ML Engineer',
        bio: 'Passionate AI/ML Engineer building intelligent systems that solve real-world problems. Specialized in deep learning, computer vision, and scalable ML infrastructure.',
        avatar: 'https://cowyzhxivrfixizgdugw.supabase.co/storage/v1/object/public/media/uploads/06729a38-2f99-47d1-9b0d-ec51743fc187-35A4424.JPG.JPG',
        location: 'Sri Lanka',
        email: 'sathsara@example.com',
        phone: '+94 123 456 789',
        website: 'https://sathsara.dev',
        linkedIn: 'https://linkedin.com/in/sathsara',
        github: 'https://github.com/sathsara',
        twitter: 'https://twitter.com/sathsara',
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
      fullName: 'Sathsara Karunarathne',
      title: 'AI / ML Engineer',
      bio: 'Passionate AI/ML Engineer building intelligent systems that solve real-world problems. Specialized in deep learning, computer vision, and scalable ML infrastructure.',
      avatar: 'https://cowyzhxivrfixizgdugw.supabase.co/storage/v1/object/public/media/uploads/06729a38-2f99-47d1-9b0d-ec51743fc187-35A4424.JPG.JPG',
      location: 'Sri Lanka',
      email: 'sathsara@example.com',
      phone: '+94 123 456 789',
      website: 'https://sathsara.dev',
      linkedIn: 'https://linkedin.com/in/sathsara',
      github: 'https://github.com/sathsara',
      twitter: 'https://twitter.com/sathsara',
      instagram: null,
      youTube: null
    })
  }
}