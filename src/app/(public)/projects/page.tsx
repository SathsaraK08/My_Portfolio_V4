"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ExternalLink, Github, Filter, Search, Code2, Folder } from "lucide-react"
import { FadeIn, StaggerContainer, StaggerItem, HoverScale } from "@/components/animations"

const projects = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "A full-stack e-commerce solution built with Next.js and Stripe integration. Features include user authentication, product management, shopping cart, and secure payment processing.",
    shortDesc: "Modern e-commerce platform with secure payments",
    image: "/api/placeholder/600/400",
    category: "Web App",
    techStack: ["Next.js", "React", "TypeScript", "Prisma", "PostgreSQL", "Stripe", "Tailwind CSS"],
    githubUrl: "https://github.com/johndoe/ecommerce-platform",
    liveUrl: "https://ecommerce-demo.vercel.app",
    featured: true,
    status: "completed"
  },
  {
    id: 2,
    title: "Task Management Dashboard",
    description: "A collaborative project management tool with real-time updates, drag-and-drop functionality, and team collaboration features. Built with modern React patterns and Socket.io for real-time communication.",
    shortDesc: "Collaborative task management with real-time updates",
    image: "/api/placeholder/600/400",
    category: "Web App",
    techStack: ["React", "Node.js", "Socket.io", "MongoDB", "Express", "Material-UI"],
    githubUrl: "https://github.com/johndoe/task-manager",
    liveUrl: "https://taskflow-demo.netlify.app",
    featured: true,
    status: "completed"
  },
  {
    id: 3,
    title: "Weather Analytics Dashboard",
    description: "Beautiful weather dashboard with interactive charts, forecasts, and location-based weather data. Integrates with multiple weather APIs and provides detailed analytics.",
    shortDesc: "Interactive weather dashboard with analytics",
    image: "/api/placeholder/600/400",
    category: "Web App",
    techStack: ["Vue.js", "Chart.js", "Weather API", "Vuetify", "JavaScript"],
    githubUrl: "https://github.com/johndoe/weather-dashboard",
    liveUrl: "https://weather-analytics.surge.sh",
    featured: false,
    status: "completed"
  },
  {
    id: 4,
    title: "Restaurant Mobile App",
    description: "Cross-platform mobile application for restaurant ordering with real-time menu updates, order tracking, and payment integration. Built with React Native for iOS and Android.",
    shortDesc: "Cross-platform restaurant ordering app",
    image: "/api/placeholder/600/400",
    category: "Mobile App",
    techStack: ["React Native", "Expo", "Firebase", "Stripe", "Redux"],
    githubUrl: "https://github.com/johndoe/restaurant-app",
    liveUrl: null,
    featured: true,
    status: "completed"
  },
  {
    id: 5,
    title: "Blog CMS API",
    description: "RESTful API for a content management system with user authentication, role-based permissions, and rich text editing capabilities. Built with Express.js and MongoDB.",
    shortDesc: "RESTful CMS API with authentication",
    image: "/api/placeholder/600/400",
    category: "API",
    techStack: ["Node.js", "Express", "MongoDB", "JWT", "Multer", "Swagger"],
    githubUrl: "https://github.com/johndoe/blog-cms-api",
    liveUrl: "https://blog-cms-api.herokuapp.com/docs",
    featured: false,
    status: "completed"
  },
  {
    id: 6,
    title: "Portfolio Website",
    description: "Personal portfolio website showcasing projects, skills, and experience. Features a modern design, dark mode toggle, and responsive layout across all devices.",
    shortDesc: "Personal portfolio with modern design",
    image: "/api/placeholder/600/400",
    category: "Website",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "MDX"],
    githubUrl: "https://github.com/johndoe/portfolio",
    liveUrl: "https://johndoe.dev",
    featured: false,
    status: "completed"
  },
  {
    id: 7,
    title: "AI Chat Application",
    description: "Real-time chat application with AI integration for smart responses and conversation analysis. Features include message encryption, file sharing, and AI-powered suggestions.",
    shortDesc: "AI-powered chat application",
    image: "/api/placeholder/600/400",
    category: "Web App",
    techStack: ["React", "Python", "FastAPI", "WebSocket", "OpenAI API", "Redis"],
    githubUrl: "https://github.com/johndoe/ai-chat",
    liveUrl: null,
    featured: false,
    status: "in-progress"
  },
  {
    id: 8,
    title: "Fitness Tracker PWA",
    description: "Progressive Web App for fitness tracking with offline capabilities, workout planning, and progress analytics. Includes integration with wearable devices and social features.",
    shortDesc: "PWA for fitness tracking and analytics",
    image: "/api/placeholder/600/400",
    category: "Web App",
    techStack: ["React", "PWA", "IndexedDB", "Chart.js", "Service Workers"],
    githubUrl: "https://github.com/johndoe/fitness-tracker",
    liveUrl: "https://fit-track-pwa.netlify.app",
    featured: false,
    status: "completed"
  }
]

const categories = ["All", "Web App", "Mobile App", "API", "Website"]
const statuses = ["All", "completed", "in-progress", "planned"]

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [showFilters, setShowFilters] = useState(false)

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.techStack.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()))
    const categoryMatch = selectedCategory === "All" || project.category === selectedCategory
    const statusMatch = selectedStatus === "All" || project.status === selectedStatus
    return matchesSearch && categoryMatch && statusMatch
  })

  const featuredProjects = filteredProjects.filter(project => project.featured)
  const otherProjects = filteredProjects.filter(project => !project.featured)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/30 dark:to-purple-950/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/30 dark:to-purple-950/30">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-1/4 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10 space-y-8">
          <FadeIn className="space-y-4 mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              My Projects
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Innovative solutions and creative implementations across web, mobile, and API development
            </p>
          </FadeIn>

          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-card/50 backdrop-blur-sm rounded-full border border-border/50">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-muted-foreground text-sm">{projects.filter(p => p.status === 'completed').length} Completed</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-card/50 backdrop-blur-sm rounded-full border border-border/50">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-muted-foreground text-sm">{categories.length - 1} Categories</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-card/50 backdrop-blur-sm rounded-full border border-border/50">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="text-muted-foreground text-sm">{projects.filter(p => p.featured).length} Featured</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Section Divider */}
      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
        </div>
        <div className="relative flex justify-center">
          <div className="bg-white dark:bg-gray-900 px-6">
            <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Modern Search and Filters */}
      <section className="relative overflow-hidden py-12 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/30 dark:to-purple-950/30">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-1/4 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          {/* Modern Search Section with Glass Morphism */}
          <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-blue-200/50 dark:border-blue-800/50 mb-12">
            {/* Floating gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-3xl"></div>
            
            <div className="relative z-10 space-y-8">
              {/* Search Header */}
              <div className="text-center space-y-3">
                <h3 className="text-2xl font-bold">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Explore My Work
                  </span>
                </h3>
                <p className="text-muted-foreground">Search through my portfolio of projects and applications</p>
              </div>

              {/* Modern Search Bar */}
              <div className="relative max-w-2xl mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-60"></div>
                <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-blue-200/50 dark:border-blue-700/50">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg">
                      <Search className="h-5 w-5 text-white" />
                    </div>
                    <Input
                      placeholder="Search projects, technologies, or descriptions..."
                      value={searchQuery}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                      className="flex-1 bg-transparent border-0 text-lg placeholder:text-muted-foreground/70 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                    />
                    <div className="flex items-center gap-3">
                      <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
                        <Folder className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium text-muted-foreground">
                          {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowFilters(!showFilters)}
                        className="lg:hidden h-12 w-12 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30"
                      >
                        <Filter className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modern Filter Pills */}
              <div className={`${showFilters ? 'block' : 'hidden lg:block'} space-y-6`}>
                {/* Category Filter */}
                <div className="space-y-4">
                  <div className="text-center">
                    <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Filter by Category</span>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3">
                    {categories.map((category) => {
                      const isSelected = selectedCategory === category;
                      const projectCount = category === "All" 
                        ? projects.length 
                        : projects.filter(project => project.category === category).length;
                      
                      return (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`relative group px-6 py-3 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                            isSelected 
                              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25' 
                              : 'bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50 hover:bg-white/80 dark:hover:bg-gray-800/80 hover:border-blue-300/70 dark:hover:border-blue-600/70'
                          }`}
                        >
                          {/* Glow effect for selected */}
                          {isSelected && (
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
                          )}
                          
                          <div className="relative flex items-center gap-3">
                            <span className="font-medium">{category}</span>
                            <div className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                              isSelected 
                                ? 'bg-white/20 text-white' 
                                : 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 dark:text-blue-400'
                            }`}>
                              {projectCount}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Status Filter */}
                <div className="space-y-4">
                  <div className="text-center">
                    <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Filter by Status</span>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3">
                    {statuses.map((status) => {
                      const isSelected = selectedStatus === status;
                      const projectCount = status === "All" 
                        ? projects.length 
                        : projects.filter(project => project.status === status).length;
                      
                      return (
                        <button
                          key={status}
                          onClick={() => setSelectedStatus(status)}
                          className={`relative group px-6 py-3 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                            isSelected 
                              ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg shadow-green-500/25' 
                              : 'bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-green-200/50 dark:border-green-700/50 hover:bg-white/80 dark:hover:bg-gray-800/80 hover:border-green-300/70 dark:hover:border-green-600/70'
                          }`}
                        >
                          {/* Glow effect for selected */}
                          {isSelected && (
                            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
                          )}
                          
                          <div className="relative flex items-center gap-3">
                            <span className="font-medium">
                              {status === "All" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
                            </span>
                            <div className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                              isSelected 
                                ? 'bg-white/20 text-white' 
                                : 'bg-gradient-to-r from-green-500/10 to-blue-500/10 text-green-600 dark:text-green-400'
                            }`}>
                              {projectCount}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                    setSelectedStatus("All");
                  }}
                  className="text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl"
                >
                  Clear All Filters
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCategory("Web App")}
                  className="text-muted-foreground hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-xl"
                >
                  View Web Apps
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedStatus("completed")}
                  className="text-muted-foreground hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-xl"
                >
                  Completed Projects
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="relative overflow-hidden py-12 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/30 dark:to-purple-950/30">
          {/* Background decorations */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-1/4 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>
          <div className="container mx-auto px-4 space-y-8 relative z-10">
            <FadeIn>
              <h2 className="text-3xl md:text-4xl font-bold text-center">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Featured Projects
                </span>
              </h2>
            </FadeIn>
            <StaggerContainer className="grid lg:grid-cols-2 gap-8">
              {featuredProjects.map((project) => (
                <StaggerItem key={project.id}>
                  <HoverScale>
                    <Card className="group hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/50">
                      <CardHeader className="p-0">
                        <div className="relative h-64 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-t-lg overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                          <div className="h-full flex items-center justify-center text-muted-foreground">
                            Project Screenshot
                          </div>
                          <div className="absolute top-4 right-4 z-20">
                            <Badge className={`${project.status === 'completed' ? 'bg-green-500' : project.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-500'} text-white border-0`}>
                              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6 space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">{project.title}</CardTitle>
                            <Badge variant="outline" className="border-blue-200 text-blue-600">{project.category}</Badge>
                          </div>
                          <CardDescription className="text-base text-muted-foreground">
                            {project.shortDesc}
                          </CardDescription>
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {project.description}
                        </p>

                        <div className="flex flex-wrap gap-1">
                          {project.techStack.slice(0, 4).map((tech) => (
                            <Badge key={tech} className="text-xs bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 dark:text-blue-300 border border-blue-200/50">
                              {tech}
                            </Badge>
                          ))}
                          {project.techStack.length > 4 && (
                            <Badge className="text-xs bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 dark:text-blue-300 border border-blue-200/50">
                              +{project.techStack.length - 4} more
                            </Badge>
                          )}
                        </div>

                        <div className="flex gap-2 pt-2">
                          {project.liveUrl && (
                            <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 border-0" asChild>
                              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Live Demo
                              </a>
                            </Button>
                          )}
                          <Button size="sm" variant="outline" className="border-blue-200 hover:bg-blue-50 hover:border-blue-300" asChild>
                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                              <Github className="h-4 w-4 mr-2" />
                              Code
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </HoverScale>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )}

      {/* Other Projects */}
      {otherProjects.length > 0 && (
        <section className="relative overflow-hidden py-12 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/30 dark:to-purple-950/30">
          {/* Background decorations */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-1/4 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>
          <div className="container mx-auto px-4 space-y-8 relative z-10">
            <FadeIn>
              <h2 className="text-3xl md:text-4xl font-bold text-center">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {featuredProjects.length > 0 ? "Other Projects" : "All Projects"}
                </span>
              </h2>
            </FadeIn>
            <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherProjects.map((project) => (
                <StaggerItem key={project.id}>
                  <HoverScale>
                    <Card className="group hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/50">
                      <CardHeader className="p-0">
                        <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-t-lg overflow-hidden">
                          <div className="h-full flex items-center justify-center text-muted-foreground">
                            Project Image
                          </div>
                          <div className="absolute top-2 right-2">
                            <Badge className={`text-xs ${project.status === 'completed' ? 'bg-green-500' : project.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-500'} text-white border-0`}>
                              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 space-y-3">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">{project.title}</CardTitle>
                            <Badge variant="outline" className="text-xs border-blue-200 text-blue-600">{project.category}</Badge>
                          </div>
                          <CardDescription className="text-sm">
                            {project.shortDesc}
                          </CardDescription>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {project.techStack.slice(0, 3).map((tech) => (
                            <Badge key={tech} className="text-xs bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 dark:text-blue-300 border border-blue-200/50">
                              {tech}
                            </Badge>
                          ))}
                          {project.techStack.length > 3 && (
                            <Badge className="text-xs bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 dark:text-blue-300 border border-blue-200/50">
                              +{project.techStack.length - 3}
                            </Badge>
                          )}
                        </div>

                        <div className="flex gap-2">
                          {project.liveUrl && (
                            <Button size="sm" className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 border-0 text-xs" asChild>
                              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Demo
                              </a>
                            </Button>
                          )}
                          <Button size="sm" variant="outline" className="flex-1 border-blue-200 hover:bg-blue-50 hover:border-blue-300 text-xs" asChild>
                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                              <Github className="h-3 w-3 mr-1" />
                              Code
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </HoverScale>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )}

      {/* No Projects Found */}
      {filteredProjects.length === 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <FadeIn>
              <h3 className="text-2xl font-semibold mb-4">No projects found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters to see more projects.
              </p>
              <Button 
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("All")
                  setSelectedStatus("All")
                }}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 border-0"
              >
                Clear Filters
              </Button>
            </FadeIn>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800" />
        <div className="absolute inset-0 bg-black/10" />
        
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Interested in Working Together?
            </h2>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-12 leading-relaxed">
              I'm always excited to take on new challenges and create innovative solutions.
              Let's discuss how we can bring your ideas to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 border-0 font-semibold" asChild>
                <Link href="/contact">Start a Project</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                <Link href="/about">Learn More About Me</Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}