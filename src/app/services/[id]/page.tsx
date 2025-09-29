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
import { ArrowLeft, Star, Globe, Database, Smartphone, Code, Monitor, Settings } from 'lucide-react'
import Link from 'next/link'
import { ScrollReveal, HoverGlow, ParallaxScroll } from '@/components/scroll-effects'
import { FloatingAnimation, FadeIn, SlideInLeft, SlideInRight } from '@/components/animations'
import { ComingSoonTemplate } from '@/components/templates/coming-soon-template'

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
    <div className="min-h-screen bg-background">
      {/* Enhanced Header with Gradient */}
      <header className="border-b bg-gradient-to-r from-background via-background to-muted/20 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 sticky top-0 z-50">
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
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12 items-start">
            {/* Service Information - Enhanced */}
            <div className="lg:col-span-2 space-y-12">
              <SlideInLeft>
                <div className="space-y-6">
                  {/* Hero Section */}
                  <div className="relative p-8 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 border border-border/50 backdrop-blur-sm">
                    <div className="flex items-start gap-6">
                      {/* Enhanced Icon/Image */}
                      <FloatingAnimation>
                        <div className="flex-shrink-0">
                          {service.image && service.image.trim() !== '' ? (
                            <div className="h-20 w-20 rounded-2xl overflow-hidden bg-gradient-to-r from-blue-500 to-purple-500 p-1 shadow-2xl">
                              <img
                                src={service.image}
                                alt={service.title}
                                className="w-full h-full object-cover object-center rounded-xl bg-white"
                              />
                            </div>
                          ) : (
                            <div className="h-20 w-20 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-2xl">
                              {getIconComponent(service.icon, service.category)}
                            </div>
                          )}
                        </div>
                      </FloatingAnimation>

                      {/* Title and Meta */}
                      <div className="flex-1 space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-start gap-3 flex-wrap">
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
                            <Badge variant="outline" className="bg-background/50 backdrop-blur-sm">
                              {service.category}
                            </Badge>
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
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {service.features.map((feature, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="px-4 py-2 text-center justify-center bg-gradient-to-r from-secondary/80 to-secondary hover:from-secondary hover:to-secondary/80 transition-all"
                            >
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </SlideInLeft>
            </div>

            {/* Enhanced Coming Soon Section */}
            <div className="lg:sticky lg:top-24">
              <SlideInRight>
                <ComingSoonTemplate
                  title="Enhanced Features"
                  description="Advanced service features and booking capabilities are being developed to provide you with the best possible experience."
                  estimatedLaunch="Q2 2024"
                />
              </SlideInRight>
            </div>
          </div>
        </div>
      </main>
      {/* Background Decorations */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>
    </div>
  )
}