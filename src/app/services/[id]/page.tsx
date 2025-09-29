'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Star, Globe, Database, Smartphone, Code, Monitor, Settings, Construction } from 'lucide-react'
import Link from 'next/link'
import { ScrollReveal, HoverGlow } from '@/components/scroll-effects'
import { FloatingAnimation } from '@/components/animations'

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
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="h-6 w-px bg-border" />
            <div>
              <h1 className="text-xl font-semibold">Service Details</h1>
              <p className="text-sm text-muted-foreground">Learn more about our services</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Service Info */}
              <div className="space-y-8">
                <div className="space-y-4">
                  {/* Icon/Image */}
                  <FloatingAnimation>
                    <div className="flex justify-start">
                      {service.image && service.image.trim() !== '' ? (
                        <div className="h-24 w-24 rounded-2xl overflow-hidden bg-gradient-to-r from-blue-500 to-purple-500 p-1 shadow-xl">
                          <img
                            src={service.image}
                            alt={service.title}
                            className="w-full h-full object-cover object-center rounded-xl bg-white"
                          />
                        </div>
                      ) : (
                        <div className="h-24 w-24 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-xl">
                          {getIconComponent(service.icon, service.category)}
                        </div>
                      )}
                    </div>
                  </FloatingAnimation>

                  {/* Title and Badges */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {service.title}
                      </h1>
                      {service.featured && (
                        <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600 text-yellow-50">
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          Featured
                        </Badge>
                      )}
                    </div>

                    {service.category && (
                      <Badge variant="outline" className="w-fit">
                        {service.category}
                      </Badge>
                    )}

                    {service.shortDesc && (
                      <p className="text-xl text-muted-foreground">
                        {service.shortDesc}
                      </p>
                    )}
                  </div>
                </div>

                {/* Description */}
                {service.description && service.description.trim() !== '' && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-semibold">About This Service</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                )}

                {/* Technologies */}
                {service.features.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-semibold">Technologies & Tools</h2>
                    <div className="flex flex-wrap gap-2">
                      {service.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="px-3 py-1">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Coming Soon Card */}
              <div className="lg:sticky lg:top-8">
                <HoverGlow glowColor="rgb(59, 130, 246)">
                  <Card className="border-2 border-dashed">
                    <CardHeader className="text-center pb-4">
                      <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                        <Construction className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <CardTitle className="text-xl">Coming Soon</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                      <p className="text-muted-foreground">
                        Detailed service information, pricing, and booking functionality will be available soon.
                      </p>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">What's coming:</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Detailed service breakdown</li>
                          <li>• Pricing information</li>
                          <li>• Portfolio examples</li>
                          <li>• Direct booking system</li>
                          <li>• Client testimonials</li>
                        </ul>
                      </div>
                      <div className="pt-4">
                        <Link href="/contact">
                          <Button className="w-full">
                            Get in Touch
                            <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </HoverGlow>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </main>
    </div>
  )
}