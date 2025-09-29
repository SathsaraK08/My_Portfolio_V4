'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollReveal, HoverGlow } from '@/components/scroll-effects'
import { FloatingAnimation } from '@/components/animations'
import { ModernCard } from '@/components/modern-card'
import { Globe, Database, Smartphone, Code, Monitor, Settings } from 'lucide-react'

interface Service {
  id: string
  title: string
  description: string
  shortDesc?: string
  icon?: string
  image?: string
  features: string[]
  category?: string
  featured: boolean
  order: number
  isVisible: boolean
}

// Icon mapping for common service types
const iconMapping: { [key: string]: any } = {
  'frontend': Globe,
  'backend': Database,
  'mobile': Smartphone,
  'devops': Code,
  'web': Monitor,
  'api': Settings,
  'fullstack': Code,
  'ui': Monitor,
  'ux': Monitor,
}

function getIconComponent(iconString?: string, category?: string) {
  if (!iconString) {
    // Try to map based on category or title
    const categoryLower = category?.toLowerCase() || ''
    const IconComponent = iconMapping[categoryLower] || Code
    return <IconComponent className="h-8 w-8 text-white" />
  }

  // If it's an emoji or single character, return as text
  if (iconString.length <= 2) {
    return <span className="text-2xl">{iconString}</span>
  }

  // If it's a lucide icon name, try to map it
  const IconComponent = iconMapping[iconString.toLowerCase()] || Code
  return <IconComponent className="h-8 w-8 text-white" />
}

export function ServicesSection() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await fetch('/api/public/services')
        if (!response.ok) {
          throw new Error('Failed to fetch services')
        }
        const data = await response.json()
        setServices(data)
      } catch (err) {
        console.error('Failed to load services:', err)
        setError(err instanceof Error ? err.message : 'Failed to load services')
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  if (loading) {
    return (
      <section className="bg-muted/50 py-16 md:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse">Loading services...</div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="bg-muted/50 py-16 md:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <div className="text-red-600">Failed to load services</div>
        </div>
      </section>
    )
  }

  if (services.length === 0) {
    return null // Don't render anything if no services
  }

  return (
    <section className="bg-muted/50 py-16 md:py-24 relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-blue-500 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-pink-500 rounded-full animate-spin"></div>
      </div>

      <div className="container mx-auto px-4 space-y-12 relative z-10">
        <ScrollReveal className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            What I Do
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            I specialize in building modern web applications using cutting-edge technologies
          </p>
        </ScrollReveal>

        <div className={`grid gap-6 ${
          services.length === 1 ? 'max-w-md mx-auto' :
          services.length === 2 ? 'md:grid-cols-2 max-w-2xl mx-auto' :
          services.length === 3 ? 'md:grid-cols-2 lg:grid-cols-3' :
          'md:grid-cols-2 lg:grid-cols-4'
        }`}>
          {services.map((service, index) => (
            <ScrollReveal key={service.id} direction="up" delay={0.1 * (index + 1)}>
              <HoverGlow glowColor="rgb(59, 130, 246)">
                <ModernCard variant="gradient" hover="lift">
                  <Card className="text-center h-full border-0 bg-transparent shadow-none">
                    <CardHeader>
                      <FloatingAnimation>
                        <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                          {getIconComponent(service.icon, service.category)}
                        </div>
                      </FloatingAnimation>
                      <CardTitle className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {service.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
                        {service.shortDesc || service.features.join(', ')}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </ModernCard>
              </HoverGlow>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}