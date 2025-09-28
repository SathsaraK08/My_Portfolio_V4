import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { ADMIN_AUTH_COOKIE } from '@/lib/admin-auth'

// GET /api/admin/home-content - Get home page content
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get(ADMIN_AUTH_COOKIE)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get home page content
    let homePage = await prisma.page.findFirst({
      where: { name: 'home' },
      include: {
        sections: {
          orderBy: { order: 'asc' }
        }
      }
    })

    // If no home page exists, create default one
    if (!homePage) {
      homePage = await prisma.page.create({
        data: {
          name: 'home',
          title: 'Home Page',
          slug: 'home',
          description: 'Portfolio home page content',
          isVisible: true,
          order: 0,
          sections: {
            create: [
              {
                name: 'skills_title',
                type: 'CONTENT',
                title: 'Technologies & Skills',
                subtitle: 'Expertise in modern technologies and frameworks',
                order: 0
              },
              {
                name: 'what_i_do_title',
                type: 'CONTENT',
                title: 'What I Do',
                subtitle: 'I specialize in building modern web applications using cutting-edge technologies',
                order: 1
              },
              {
                name: 'frontend_section',
                type: 'CONTENT',
                title: 'Frontend',
                content: { description: 'React, Next.js, TypeScript, Tailwind CSS' },
                order: 2
              },
              {
                name: 'backend_section',
                type: 'CONTENT',
                title: 'Backend',
                content: { description: 'Node.js, Python, PostgreSQL, MongoDB' },
                order: 3
              },
              {
                name: 'mobile_section',
                type: 'CONTENT',
                title: 'Mobile',
                content: { description: 'React Native, Flutter, Progressive Web Apps' },
                order: 4
              },
              {
                name: 'devops_section',
                type: 'CONTENT',
                title: 'DevOps',
                content: { description: 'Docker, AWS, CI/CD, Git' },
                order: 5
              },
              {
                name: 'projects_title',
                type: 'CONTENT',
                title: 'Featured Projects',
                subtitle: 'Here are some of my recent projects that showcase my skills and expertise',
                order: 6
              },
              {
                name: 'cta_section',
                type: 'CTA',
                title: 'Ready to Start Your Project?',
                subtitle: "Let's work together to bring your ideas to life. I'm always excited to take on new challenges and create amazing experiences.",
                content: {
                  primaryButton: 'Start a Conversation',
                  secondaryButton: 'Learn More About Me'
                },
                order: 7
              }
            ]
          }
        },
        include: {
          sections: {
            orderBy: { order: 'asc' }
          }
        }
      })
    }

    return NextResponse.json(homePage)
  } catch (error) {
    console.error('Failed to fetch home content:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/home-content - Update home page content
export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get(ADMIN_AUTH_COOKIE)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { sections } = body

    // Get home page
    let homePage = await prisma.page.findFirst({
      where: { name: 'home' }
    })

    if (!homePage) {
      return NextResponse.json({ error: 'Home page not found' }, { status: 404 })
    }

    // Update sections
    for (const section of sections) {
      await prisma.pageSection.upsert({
        where: {
          pageId_name: {
            pageId: homePage.id,
            name: section.name
          }
        },
        update: {
          title: section.title,
          subtitle: section.subtitle,
          content: section.content,
          isVisible: section.isVisible !== undefined ? section.isVisible : true
        },
        create: {
          pageId: homePage.id,
          name: section.name,
          type: section.type || 'CONTENT',
          title: section.title,
          subtitle: section.subtitle,
          content: section.content,
          isVisible: section.isVisible !== undefined ? section.isVisible : true,
          order: section.order || 0
        }
      })
    }

    // Fetch updated home page
    const updatedHomePage = await prisma.page.findFirst({
      where: { name: 'home' },
      include: {
        sections: {
          orderBy: { order: 'asc' }
        }
      }
    })

    return NextResponse.json(updatedHomePage)
  } catch (error) {
    console.error('Failed to update home content:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}