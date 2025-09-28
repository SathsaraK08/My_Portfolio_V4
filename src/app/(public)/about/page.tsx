'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, MapPin, Mail, Phone } from "lucide-react"
import { FadeIn, SlideInLeft, SlideInRight, HoverScale } from "@/components/animations"
import { ModernButton } from "@/components/modern-button"
import { useProfile } from "@/hooks/use-profile"

const skills = [
  { name: "JavaScript/TypeScript", level: 95, category: "Frontend" },
  { name: "React & Next.js", level: 90, category: "Frontend" },
  { name: "Node.js", level: 85, category: "Backend" },
  { name: "Python", level: 80, category: "Backend" },
  { name: "PostgreSQL", level: 85, category: "Database" },
  { name: "MongoDB", level: 75, category: "Database" },
  { name: "AWS", level: 70, category: "Cloud" },
  { name: "Docker", level: 75, category: "DevOps" },
]

const experiences = [
  {
    title: "Senior Full Stack Developer",
    company: "Tech Solutions Inc.",
    period: "2022 - Present",
    description: "Leading development of enterprise web applications using React, Node.js, and AWS. Mentoring junior developers and architecting scalable solutions.",
    technologies: ["React", "Node.js", "AWS", "PostgreSQL"]
  },
  {
    title: "Full Stack Developer",
    company: "Digital Agency",
    period: "2020 - 2022",
    description: "Developed responsive web applications for various clients. Worked with modern frameworks and implemented CI/CD pipelines.",
    technologies: ["Vue.js", "Python", "Docker", "MongoDB"]
  },
  {
    title: "Frontend Developer",
    company: "StartupXYZ",
    period: "2019 - 2020",
    description: "Built user interfaces for a SaaS platform. Collaborated with designers to create pixel-perfect implementations.",
    technologies: ["React", "TypeScript", "Sass", "Redux"]
  },
]

export default function AboutPage() {
  const { profile } = useProfile()

  const displayName = profile?.fullName || 'Sathsara Karunarathne'
  const displayLocation = profile?.location || 'Sri Lanka'
  const displayEmail = profile?.email || 'sathsara@example.com'
  const displayPhone = profile?.phone || '+94 70 123 4567'
  const displayAvatar = profile?.avatar
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800" />
        <div className="absolute inset-0 bg-black/10" />
        
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <FadeIn>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
              About Me
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              I'm a passionate full-stack developer with 5+ years of experience building
              modern web applications that make a difference.
            </p>
          </FadeIn>
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

      {/* Bio Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <SlideInLeft className="space-y-6">
              <FadeIn>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    My Story
                  </span>
                </h2>
              </FadeIn>
              <div className="prose prose-lg text-muted-foreground space-y-6">
                <p className="text-lg leading-relaxed">
                  I started my journey in web development 5 years ago, driven by curiosity
                  and a passion for creating digital solutions. What began as a hobby
                  quickly evolved into a career dedicated to building exceptional user experiences.
                </p>
                <p className="text-lg leading-relaxed">
                  I specialize in modern JavaScript frameworks, particularly React and Next.js,
                  combined with robust backend technologies like Node.js and Python. 
                  I believe in writing clean, maintainable code and following best practices
                  to ensure scalable and performant applications.
                </p>
                <p className="text-lg leading-relaxed">
                  When I'm not coding, you can find me exploring new technologies,
                  contributing to open-source projects, or sharing knowledge through
                  blog posts and mentoring.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4 pt-6">
                <ModernButton variant="gradient" size="lg" href="/contact">
                  <Mail className="mr-2 h-4 w-4" />
                  Get In Touch
                </ModernButton>
                <ModernButton variant="glass" size="lg" href="/resume.pdf" target="_blank">
                  <Download className="mr-2 h-4 w-4" />
                  Download Resume
                </ModernButton>
              </div>
            </SlideInLeft>
            
            <SlideInRight className="space-y-6">
              {/* Profile Image */}
              <FadeIn delay={0.3}>
                <HoverScale>
                  <div className="mx-auto w-80 h-80">
                    <div className="w-full h-full rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800">
                      {displayAvatar ? (
                        <img
                          src={displayAvatar}
                          alt={displayName}
                          className="w-full h-full object-cover"
                          style={{
                            objectFit: 'cover',
                            objectPosition: 'center center'
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 flex items-center justify-center">
                          <span className="text-muted-foreground text-lg">Profile Photo</span>
                        </div>
                      )}
                    </div>
                  </div>
                </HoverScale>
              </FadeIn>
              
              {/* Contact Info */}
              <FadeIn delay={0.5}>
                <HoverScale>
                  <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/50 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></span>
                        Contact Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-3 group">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <MapPin className="h-4 w-4 text-white" />
                        </div>
                        <span className="group-hover:text-blue-600 transition-colors">{displayLocation}</span>
                      </div>
                      <div className="flex items-center space-x-3 group">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <Mail className="h-4 w-4 text-white" />
                        </div>
                        <span className="group-hover:text-blue-600 transition-colors">{displayEmail}</span>
                      </div>
                      <div className="flex items-center space-x-3 group">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <Phone className="h-4 w-4 text-white" />
                        </div>
                        <span className="group-hover:text-blue-600 transition-colors">{displayPhone}</span>
                      </div>
                    </CardContent>
                  </Card>
                </HoverScale>
              </FadeIn>
            </SlideInRight>
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
              Let's Work Together
            </h2>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-12 leading-relaxed">
              I'm always interested in new opportunities and exciting projects.
              Feel free to reach out if you'd like to collaborate!
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <ModernButton variant="glass" size="lg" href="/contact">
                Start a Project
              </ModernButton>
              <ModernButton variant="glass" size="lg" href="/projects">
                View My Work
              </ModernButton>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}