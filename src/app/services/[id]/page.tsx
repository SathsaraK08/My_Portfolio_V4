/**
 * Service Details Page
 *
 * Individual service detail page with comprehensive information display
 * and coming soon template for enhanced features.
 *
 * @author Portfolio System
 * @version 2.0.0
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Star, Globe, Database, Smartphone, Code, Monitor, Settings, Clock } from 'lucide-react'
import Link from 'next/link'
import { ScrollReveal, HoverGlow, ParallaxScroll } from '@/components/scroll-effects'
import { FloatingAnimation, FadeIn, SlideInLeft, SlideInRight } from '@/components/animations'

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
    const categoryLower = category?.toLowerCase() || ''
    const IconComponent = iconMapping[categoryLower] || Code
    return <IconComponent className="h-8 w-8 text-white" />
  }

  if (iconString.length <= 2) {
    return <span className="text-2xl">{iconString}</span>
  }

  const IconComponent = iconMapping[iconString.toLowerCase()] || Code
  return <IconComponent className="h-8 w-8 text-white" />
}

export default function ServiceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const loadService = async () => {
      try {
        const { id } = await params
        const response = await fetch(`/api/public/services`)
        if (!response.ok) {
          throw new Error('Failed to fetch services')
        }
        const services = await response.json()
        const foundService = services.find((s: Service) => s.id === id)

        if (!foundService) {
          throw new Error('Service not found')
        }

        setService(foundService)
      } catch (err) {
        console.error('Failed to load service:', err)
        setError(err instanceof Error ? err.message : 'Failed to load service')
      } finally {
        setLoading(false)
      }
    }

    loadService()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading service details...</p>
        </div>
      </div>
    )
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Service Not Found</h1>
          <p className="text-muted-foreground">The service you're looking for doesn't exist.</p>
          <Link href="/">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/30 dark:to-purple-950/30">
      {/* Enhanced Header with Gradient */}
      <header className="border-b bg-gradient-to-r from-slate-50/95 via-blue-50/30 to-purple-50/30 dark:from-slate-950/95 dark:via-blue-950/30 dark:to-purple-950/30 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-50/80 dark:supports-[backdrop-filter]:bg-slate-950/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <FadeIn>
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="hover:bg-primary/10 transition-colors">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="h-6 w-px bg-gradient-to-b from-transparent via-border to-transparent" />
              <div>
                <h1 className="text-xl font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Service Details
                </h1>
                <p className="text-sm text-muted-foreground">Comprehensive service information</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </header>

      {/* Enhanced Main Content */}
      <main className="relative overflow-hidden py-12 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/30 dark:to-purple-950/30">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-1/4 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-4xl mx-auto space-y-8">
            {/* Service Information - Enhanced */}
            <SlideInLeft>
              <div className="space-y-6">
                {/* Hero Section */}
                <div className="relative p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 border border-border/50 backdrop-blur-sm">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                    {/* Enhanced Icon/Image */}
                    <FloatingAnimation>
                      <div className="flex-shrink-0">
                        {service.image && service.image.trim() !== '' ? (
                          <div className="h-24 w-24 rounded-2xl overflow-hidden bg-gradient-to-r from-blue-500 to-purple-500 p-1 shadow-2xl mx-auto sm:mx-0">
                            <img
                              src={service.image}
                              alt={service.title}
                              className="w-full h-full object-cover object-center rounded-xl bg-white"
                            />
                          </div>
                        ) : (
                          <div className="h-24 w-24 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-2xl mx-auto sm:mx-0">
                            {getIconComponent(service.icon, service.category)}
                          </div>
                        )}
                      </div>
                    </FloatingAnimation>

                    {/* Title and Meta */}
                    <div className="flex-1 space-y-4 w-full">
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
                          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                            {service.title}
                          </h1>
                          {service.featured && (
                            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg">
                              <Star className="w-3 h-3 mr-1 fill-current" />
                              Featured
                            </Badge>
                          )}
                        </div>

                        {service.category && (
                          <div className="flex justify-center sm:justify-start">
                            <Badge variant="outline" className="bg-background/50 backdrop-blur-sm">
                              {service.category}
                            </Badge>
                          </div>
                        )}
                      </div>

                      {service.shortDesc && (
                        <p className="text-lg text-muted-foreground leading-relaxed">
                          {service.shortDesc}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description Section */}
                {service.description && service.description.trim() !== '' && (
                  <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-2xl font-semibold flex items-center gap-2">
                        <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
                        About This Service
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed text-lg">
                        {service.description}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Technologies Section */}
                {service.features.length > 0 && (
                  <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-2xl font-semibold flex items-center gap-2">
                        <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-blue-500 rounded-full" />
                        Technologies & Tools
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {service.features.map((feature, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="px-4 py-3 text-center justify-center bg-gradient-to-r from-secondary/80 to-secondary hover:from-secondary hover:to-secondary/80 transition-all shadow-sm"
                          >
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Simple Coming Soon Message */}
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-8 text-center">
                    <div className="space-y-4">
                      <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                        <Settings className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        More Features Coming Soon
                      </h3>
                      <p className="text-muted-foreground max-w-lg mx-auto">
                        Enhanced service features including pricing details, portfolio examples, and booking capabilities will be available in the future.
                      </p>
                      <Badge variant="outline" className="bg-background/50">
                        <Clock className="w-3 h-3 mr-1" />
                        In Development
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </SlideInLeft>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}