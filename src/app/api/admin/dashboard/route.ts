import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

type DashboardProject = {
  id: string
  title: string
  status: string
  updatedAt: string
  category: string
  isVisible: boolean
}

type DashboardMessage = {
  id: string
  name: string
  subject: string | null
  status: string
  createdAt: string
}

export async function GET() {
  if (!process.env.DATABASE_URL?.trim()) {
    console.error("DATABASE_URL is not configured for the admin dashboard API")
    return NextResponse.json(
      {
        error:
          "Set DATABASE_URL in your environment before loading the admin dashboard.",
      },
      { status: 503 }
    )
  }

  try {
    const now = new Date()
    const thirtyDaysAgo = new Date(now)
    thirtyDaysAgo.setDate(now.getDate() - 30)

    const [
      totalProjects,
      visibleProjects,
      featuredProjects,
      projectsCreatedThisMonth,
      totalSkills,
      visibleSkills,
      skillsCreatedThisMonth,
      totalMessages,
      unreadMessages,
      messagesReceivedThisMonth,
    ] = await prisma.$transaction([
      prisma.project.count(),
      prisma.project.count({ where: { isVisible: true } }),
      prisma.project.count({ where: { featured: true } }),
      prisma.project.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.skill.count(),
      prisma.skill.count({ where: { isVisible: true } }),
      prisma.skill.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.message.count({ where: { isArchived: false } }),
      prisma.message.count({ where: { status: "UNREAD", isArchived: false } }),
      prisma.message.count({ where: { createdAt: { gte: thirtyDaysAgo }, isArchived: false } }),
    ])

    const recentProjects = await prisma.project.findMany({
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        status: true,
        updatedAt: true,
        category: true,
        isVisible: true,
      },
    })

    const recentMessages = await prisma.message.findMany({
      where: { isArchived: false },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        subject: true,
        status: true,
        createdAt: true,
      },
    })

    return NextResponse.json({
      projects: {
        total: totalProjects,
        visible: visibleProjects,
        featured: featuredProjects,
        createdThisMonth: projectsCreatedThisMonth,
        recent: recentProjects.map<DashboardProject>((project) => ({
          id: project.id,
          title: project.title,
          status: project.status,
          updatedAt: project.updatedAt.toISOString(),
          category: project.category,
          isVisible: project.isVisible,
        })),
      },
      skills: {
        total: totalSkills,
        visible: visibleSkills,
        createdThisMonth: skillsCreatedThisMonth,
      },
      messages: {
        total: totalMessages,
        unread: unreadMessages,
        receivedThisMonth: messagesReceivedThisMonth,
        recent: recentMessages.map<DashboardMessage>((message) => ({
          id: message.id,
          name: message.name,
          subject: message.subject ?? null,
          status: message.status,
          createdAt: message.createdAt.toISOString(),
        })),
      },
    })
  } catch (error) {
    console.error("Failed to load admin dashboard data", error)
    return NextResponse.json(
      { error: "Failed to load admin dashboard data" },
      { status: 500 }
    )
  }
}
