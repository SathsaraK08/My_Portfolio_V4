import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
      where: { isVisible: true },
      orderBy: [
        { category: 'asc' },
        { order: 'asc' },
        { level: 'desc' },
        { name: 'asc' }
      ]
    })

    const skillsPayload = skills.map((skill) => ({
      id: skill.id,
      name: skill.name,
      category: skill.category ?? null,
      description: skill.description ?? null,
      icon: skill.icon ?? null,
      level: skill.level,
      proficiency: skill.level,
      imageUrl: skill.imageUrl,
      isVisible: skill.isVisible,
      order: skill.order,
    }))

    // Get skills section title and subtitle from page sections
    let title = "Technologies & Skills"
    let subtitle = "Expertise in modern technologies and frameworks"

    try {
      const homePage = await prisma.page.findFirst({
        where: { name: 'home' },
        include: {
          sections: {
            where: { name: 'skills_title' },
            take: 1
          }
        }
      })

      if (homePage?.sections?.[0]) {
        const skillsSection = homePage.sections[0]
        title = skillsSection.title || title
        subtitle = skillsSection.subtitle || subtitle
      }
    } catch (sectionError) {
      console.warn('Could not fetch skills section title/subtitle:', sectionError)
    }

    // Return format expected by SkillsMarquee component
    const response = {
      title,
      subtitle,
      skills: skillsPayload
    }

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=300'
      }
    })
  } catch (error) {
    console.error('Failed to load home skills:', error)

    // Return default data on error
    return NextResponse.json({
      title: "Technologies & Skills",
      subtitle: "Expertise in modern technologies and frameworks",
      skills: []
    }, { status: 500 })
  }
}