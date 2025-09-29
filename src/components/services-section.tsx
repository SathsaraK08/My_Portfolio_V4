/**
 * Services Section Component
 *
 * Displays dynamic services from the database in a responsive grid layout.
 * Features include:
 * - Dynamic service fetching from API
 * - Responsive grid layout (1-4 columns based on screen size)
 * - Service images with fallback to icons
 * - Featured service badges
 * - Technology/feature tags
 * - Navigation to individual service detail pages
 * - Error handling and loading states
 *
 * @author Portfolio System
 * @version 2.0.0
 * @since 1.0.0
 */

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollReveal, HoverGlow } from '@/components/scroll-effects'
import { FloatingAnimation } from '@/components/animations'
import { ModernCard } from '@/components/modern-card'
import { Globe, Database, Smartphone, Code, Monitor, Settings, Star, ArrowRight } from 'lucide-react'

/**
 * Service Interface
 * Defines the structure of a service object
 */
interface Service {
  id: string              // Unique identifier
  title: string           // Service name/title
  description: string     // Full service description
  shortDesc?: string      // Brief description for cards
  icon?: string          // Emoji or icon identifier
  image?: string         // Service image/logo URL
  features: string[]     // Technologies/tools used
  category?: string      // Service category
  featured: boolean      // Whether service is featured
  order: number         // Display order
  isVisible: boolean    // Whether service is published
}

/**
 * Icon Mapping Configuration
 * Maps service categories/types to Lucide React icons for fallback display
 * when no custom image is provided
 */
const iconMapping: { [key: string]: any } = {
  'frontend': Globe,        // Frontend development services
  'backend': Database,      // Backend/server-side services
  'mobile': Smartphone,     // Mobile app development
  'devops': Code,          // DevOps and deployment services
  'web': Monitor,          // General web development
  'api': Settings,         // API development services
  'fullstack': Code,       // Full-stack development
  'ui': Monitor,           // UI design services
  'ux': Monitor,           // UX design services
}

/**
 * Get Icon Component
 *
 * Determines what icon to display based on available data:
 * 1. Custom icon/emoji from service data
 * 2. Category-based icon mapping
 * 3. Default Code icon as fallback
 *
 * @param iconString - Custom icon/emoji string from service
 * @param category - Service category for icon mapping
 * @returns JSX element with appropriate icon
 */
function getIconComponent(iconString?: string, category?: string) {
  // No custom icon provided - use category mapping
  if (!iconString) {
    const categoryLower = category?.toLowerCase() || ''
    const IconComponent = iconMapping[categoryLower] || Code
    return <IconComponent className="h-8 w-8 text-white" />
  }

  // Short string (likely emoji) - render as text
  if (iconString.length <= 2) {
    return <span className="text-2xl">{iconString}</span>
  }

  // Try to match as lucide icon name, fallback to Code icon
  const IconComponent = iconMapping[iconString.toLowerCase()] || Code
  return <IconComponent className="h-8 w-8 text-white" />
}

/**
 * ServicesSection Component
 *
 * Main component that fetches and displays all visible services in a grid layout.
 * Handles loading states, errors, and responsive design automatically.
 */
export function ServicesSection() {
  // Component state management
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
    <section id="services" className="relative overflow-hidden py-12 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/30 dark:to-purple-950/30">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-1/4 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 space-y-8 relative z-10">
        <ScrollReveal className="text-center space-y-4 mb-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
            What I Do
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            I specialize in building modern web applications using cutting-edge technologies
          </p>
        </ScrollReveal>

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <ScrollReveal key={service.id} direction="up" delay={0.1 * (index + 1)}>
              <HoverGlow glowColor="rgb(59, 130, 246)">
                <ModernCard variant="gradient" hover="lift">
                  <Card className="h-full border-0 bg-transparent shadow-none group overflow-hidden">
                    <CardHeader className="text-center pb-3 px-6 pt-6">
                      {/* Service Image or Icon */}
                      <FloatingAnimation>
                        <div className="flex justify-center mb-3 relative">
                          {service.image && service.image.trim() !== '' ? (
                            <div className="h-20 w-20 rounded-2xl overflow-hidden bg-gradient-to-r from-blue-500 to-purple-500 p-0.5 shadow-lg">
                              <img
                                src={service.image}
                                alt={service.title}
                                className="w-full h-full object-cover object-center rounded-xl bg-white"
                                onError={(e) => {
                                  console.log('Image failed to load:', service.image)
                                  e.currentTarget.style.display = 'none'
                                  e.currentTarget.nextElementSibling?.classList.remove('hidden')
                                }}
                              />
                              <div className="hidden h-20 w-20 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                                {getIconComponent(service.icon, service.category)}
                              </div>
                            </div>
                          ) : (
                            <div className="h-20 w-20 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                              {getIconComponent(service.icon, service.category)}
                            </div>
                          )}
                          {service.featured && (
                            <div className="absolute -top-1 -right-1">
                              <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600 text-yellow-50 text-[10px] px-1.5 py-0.5 shadow-md">
                                <Star className="w-2.5 h-2.5 mr-0.5 fill-current" />
                                Featured
                              </Badge>
                            </div>
                          )}
                        </div>
                      </FloatingAnimation>

                      {/* Title and Category */}
                      <div className="space-y-1.5">
                        <CardTitle className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                          {service.title}
                        </CardTitle>
                        {service.category && (
                          <Badge variant="outline" className="text-[10px] px-2 py-0.5">
                            {service.category}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3 text-center px-6 pb-6">
                      {/* Description - Show both shortDesc AND description */}
                      <div className="space-y-1">
                        {service.shortDesc && service.shortDesc.trim() !== '' && (
                          <p className="text-sm font-medium text-foreground">
                            {service.shortDesc}
                          </p>
                        )}
                        {service.description && service.description.trim() !== '' && service.description !== service.shortDesc && (
                          <CardDescription className="text-xs leading-relaxed">
                            {service.description}
                          </CardDescription>
                        )}
                      </div>

                      {/* Features/Technologies */}
                      {service.features.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                            Technologies
                          </p>
                          <div className="flex flex-wrap gap-1 justify-center">
                            {service.features.slice(0, 3).map((feature, featureIndex) => (
                              <Badge key={featureIndex} variant="secondary" className="text-[10px] px-1.5 py-0.5">
                                {feature}
                              </Badge>
                            ))}
                            {service.features.length > 3 && (
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">
                                +{service.features.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Learn More Button */}
                      <div className="pt-2">
                        <a
                          href={`/services/${service.id}`}
                          className="inline-flex items-center text-xs text-primary hover:text-primary/80 font-medium transition-colors duration-200 group-hover:underline"
                        >
                          Learn More
                          <ArrowRight className="w-3 h-3 ml-1 transition-transform duration-200 group-hover:translate-x-0.5" />
                        </a>
                      </div>
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