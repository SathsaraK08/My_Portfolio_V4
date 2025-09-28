"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Github, ExternalLink, Calendar, Clock } from 'lucide-react'

interface Project {
  id: string
  title: string
  description: string
  shortDesc?: string
  image?: string
  techStack: string[]
  category: string
  githubUrl?: string
  liveUrl?: string
  status: string
  featured: boolean
  startDate?: string
  endDate?: string
}

interface ProjectsGridProps {
  limit?: number
  showFeatured?: boolean
  category?: string
}

export function ProjectsGrid({ limit, showFeatured = false, category }: ProjectsGridProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProjects() {
      try {
        const params = new URLSearchParams()
        if (limit) params.append('limit', limit.toString())
        if (showFeatured) params.append('featured', 'true')
        if (category) params.append('category', category)

        const response = await fetch(`/api/public/projects?${params}`)
        if (response.ok) {
          const data = await response.json()
          setProjects(data)
        } else {
          // Fallback to static projects when API fails
          console.warn('API unavailable, showing static projects')
          setProjects(getStaticProjects())
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error)
        // Fallback to static projects when fetch fails
        setProjects(getStaticProjects())
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [limit, showFeatured, category])

  // Static fallback projects when database is unavailable
  function getStaticProjects(): Project[] {
    const staticProjects: Project[] = [
      {
        id: 'static-1',
        title: 'E-Commerce Platform',
        description: 'A full-stack e-commerce solution with modern payment integration and real-time inventory management.',
        shortDesc: 'Modern e-commerce platform with Stripe integration',
        image: '/placeholder-project1.jpg',
        techStack: ['React', 'Next.js', 'TypeScript', 'Stripe', 'PostgreSQL'],
        category: 'Full Stack',
        githubUrl: 'https://github.com',
        liveUrl: 'https://demo.com',
        status: 'completed',
        featured: true,
        startDate: '2024-01-01',
        endDate: '2024-03-01'
      },
      {
        id: 'static-2',
        title: 'Task Management App',
        description: 'Collaborative project management tool with real-time updates, team collaboration features, and advanced analytics.',
        shortDesc: 'Real-time collaborative task management',
        image: '/placeholder-project2.jpg',
        techStack: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'Express'],
        category: 'Full Stack',
        githubUrl: 'https://github.com',
        status: 'completed',
        featured: true,
        startDate: '2024-02-01',
        endDate: '2024-04-01'
      },
      {
        id: 'static-3',
        title: 'Weather Dashboard',
        description: 'Beautiful weather application with forecasts, interactive maps, and location-based services.',
        shortDesc: 'Interactive weather app with forecasts',
        image: '/placeholder-project3.jpg',
        techStack: ['Vue.js', 'API Integration', 'Charts.js', 'CSS3'],
        category: 'Frontend',
        githubUrl: 'https://github.com',
        liveUrl: 'https://weather-demo.com',
        status: 'completed',
        featured: false,
        startDate: '2024-03-01',
        endDate: '2024-04-01'
      },
      {
        id: 'static-4',
        title: 'AI Chat Application',
        description: 'Modern chat application with AI integration, real-time messaging, and smart responses.',
        shortDesc: 'AI-powered chat application',
        image: '/placeholder-project4.jpg',
        techStack: ['React', 'Python', 'OpenAI', 'WebSocket', 'FastAPI'],
        category: 'AI/ML',
        githubUrl: 'https://github.com',
        status: 'ongoing',
        featured: true,
        startDate: '2024-04-01'
      },
      {
        id: 'static-5',
        title: 'Portfolio Website',
        description: 'Modern portfolio website with dynamic content management, dark mode, and responsive design.',
        shortDesc: 'Personal portfolio with CMS',
        image: '/placeholder-project5.jpg',
        techStack: ['Next.js', 'TypeScript', 'Tailwind', 'Prisma', 'PostgreSQL'],
        category: 'Frontend',
        githubUrl: 'https://github.com',
        liveUrl: 'https://portfolio-demo.com',
        status: 'completed',
        featured: false,
        startDate: '2024-05-01',
        endDate: '2024-06-01'
      },
      {
        id: 'static-6',
        title: 'Learning Management System',
        description: 'Comprehensive LMS with course management, video streaming, progress tracking, and certificates.',
        shortDesc: 'Full-featured learning management system',
        image: '/placeholder-project6.jpg',
        techStack: ['React', 'Node.js', 'PostgreSQL', 'AWS', 'Redis'],
        category: 'Full Stack',
        githubUrl: 'https://github.com',
        status: 'ongoing',
        featured: false,
        startDate: '2024-06-01'
      }
    ]

    let filteredProjects = staticProjects

    if (showFeatured) {
      filteredProjects = filteredProjects.filter(p => p.featured)
    }

    if (category && category !== 'all') {
      filteredProjects = filteredProjects.filter(p => p.category.toLowerCase() === category.toLowerCase())
    }

    if (limit) {
      filteredProjects = filteredProjects.slice(0, limit)
    }

    return filteredProjects
  }

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: limit || 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-0">
              <div className="aspect-video bg-muted rounded-t-lg"></div>
              <div className="p-6 space-y-3">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-3 bg-muted rounded w-3/4"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-muted rounded w-16"></div>
                  <div className="h-6 bg-muted rounded w-20"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No projects found.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Card key={project.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
          <CardContent className="p-0">
            {project.image && (
              <div className="aspect-video overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  width={400}
                  height={225}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}

            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-1 group-hover:text-primary transition-colors">
                    {project.title}
                  </CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {project.category}
                  </Badge>
                </div>
                {project.featured && (
                  <Badge className="ml-2">Featured</Badge>
                )}
              </div>

              <CardDescription className="mb-4 line-clamp-2">
                {project.shortDesc || project.description}
              </CardDescription>

              <div className="flex flex-wrap gap-1 mb-4">
                {project.techStack.slice(0, 3).map((tech) => (
                  <Badge key={tech} variant="outline" className="text-xs">
                    {tech}
                  </Badge>
                ))}
                {project.techStack.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{project.techStack.length - 3}
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {project.endDate ? (
                    <span>{new Date(project.endDate).getFullYear()}</span>
                  ) : (
                    <span>Ongoing</span>
                  )}
                  <Clock className="h-3 w-3 ml-2" />
                  <span className="capitalize">{project.status}</span>
                </div>

                <div className="flex gap-2">
                  {project.githubUrl && (
                    <Button size="sm" variant="outline" asChild>
                      <Link href={project.githubUrl} target="_blank">
                        <Github className="h-3 w-3" />
                      </Link>
                    </Button>
                  )}
                  {project.liveUrl && (
                    <Button size="sm" variant="outline" asChild>
                      <Link href={project.liveUrl} target="_blank">
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}