/**
 * Coming Soon Template Component
 *
 * A reusable template for service detail pages that are not yet fully implemented.
 * Matches the website's design system with proper light/dark theme support.
 *
 * @author Portfolio Admin System
 * @version 1.0.0
 */

'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  Star,
  Construction,
  Calendar,
  CheckCircle,
  Clock,
  Mail,
  Phone
} from 'lucide-react'
import Link from 'next/link'
import { HoverGlow } from '@/components/scroll-effects'
import { cn } from '@/lib/utils'

interface ComingSoonFeature {
  icon: React.ReactNode
  title: string
  description: string
  status: 'planned' | 'in-progress' | 'coming-soon'
}

interface ComingSoonTemplateProps {
  title?: string
  description?: string
  estimatedLaunch?: string
  features?: ComingSoonFeature[]
  contactCTA?: {
    title: string
    description: string
    primaryButton: {
      text: string
      href: string
    }
    secondaryButton?: {
      text: string
      href: string
    }
  }
  className?: string
}

// Default features for service pages
const DEFAULT_FEATURES: ComingSoonFeature[] = [
  {
    icon: <CheckCircle className="h-5 w-5" />,
    title: "Detailed Service Breakdown",
    description: "Comprehensive overview of what's included in this service",
    status: 'planned'
  },
  {
    icon: <Star className="h-5 w-5" />,
    title: "Pricing Information",
    description: "Transparent pricing tiers and package options",
    status: 'planned'
  },
  {
    icon: <Construction className="h-5 w-5" />,
    title: "Portfolio Examples",
    description: "Real-world examples and case studies",
    status: 'in-progress'
  },
  {
    icon: <Calendar className="h-5 w-5" />,
    title: "Direct Booking System",
    description: "Schedule consultations and project kickoffs online",
    status: 'coming-soon'
  },
  {
    icon: <Mail className="h-5 w-5" />,
    title: "Client Testimonials",
    description: "Reviews and feedback from satisfied clients",
    status: 'planned'
  },
  {
    icon: <Clock className="h-5 w-5" />,
    title: "Project Timeline Tool",
    description: "Interactive timeline and milestone tracking",
    status: 'coming-soon'
  }
]

const DEFAULT_CONTACT_CTA = {
  title: "Ready to Get Started?",
  description: "Let's discuss your project and see how I can help bring your ideas to life.",
  primaryButton: {
    text: "Get in Touch",
    href: "/contact"
  },
  secondaryButton: {
    text: "View Portfolio",
    href: "/projects"
  }
}

/**
 * ComingSoonTemplate Component
 *
 * Displays a professional coming soon page with features list and CTA
 */
export function ComingSoonTemplate({
  title = "Enhanced Service Details",
  description = "Detailed service information, pricing, and booking functionality will be available soon.",
  estimatedLaunch = "Q2 2024",
  features = DEFAULT_FEATURES,
  contactCTA = DEFAULT_CONTACT_CTA,
  className
}: ComingSoonTemplateProps) {

  const getStatusColor = (status: ComingSoonFeature['status']) => {
    switch (status) {
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'planned':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'coming-soon':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    }
  }

  const getStatusText = (status: ComingSoonFeature['status']) => {
    switch (status) {
      case 'in-progress':
        return 'In Progress'
      case 'planned':
        return 'Planned'
      case 'coming-soon':
        return 'Coming Soon'
      default:
        return 'TBD'
    }
  }

  return (
    <div className={cn("space-y-8", className)}>
      {/* Main Coming Soon Card */}
      <HoverGlow glowColor="rgb(59, 130, 246)">
        <Card className="border-2 border-dashed border-border/50 bg-gradient-to-br from-background to-muted/20">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
              <Construction className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {title}
            </CardTitle>
            {estimatedLaunch && (
              <Badge variant="outline" className="w-fit mx-auto mt-2">
                <Clock className="w-3 h-3 mr-1" />
                Expected: {estimatedLaunch}
              </Badge>
            )}
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-muted-foreground leading-relaxed max-w-lg mx-auto">
              {description}
            </p>

            {/* Features Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-8">
              {features.map((feature, index) => (
                <div key={index} className="p-4 rounded-lg border bg-card/50 backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 p-2 rounded-md bg-primary/10 text-primary">
                      {feature.icon}
                    </div>
                    <div className="space-y-1 text-left">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm">{feature.title}</h4>
                        <Badge
                          variant="secondary"
                          className={cn("text-xs px-1.5 py-0.5", getStatusColor(feature.status))}
                        >
                          {getStatusText(feature.status)}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </HoverGlow>

      {/* Contact CTA Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 border-blue-200 dark:border-blue-800">
        <CardContent className="p-8 text-center space-y-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-foreground">
              {contactCTA.title}
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {contactCTA.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={contactCTA.primaryButton.href}>
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
                {contactCTA.primaryButton.text}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>

            {contactCTA.secondaryButton && (
              <Link href={contactCTA.secondaryButton.href}>
                <Button variant="outline" size="lg" className="border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-950/50">
                  {contactCTA.secondaryButton.text}
                </Button>
              </Link>
            )}
          </div>

          {/* Quick Contact Info */}
          <div className="pt-4 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              Or reach out directly via{' '}
              <Link href="/contact" className="font-medium text-primary hover:underline">
                email
              </Link>
              {' '}for immediate assistance
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export type { ComingSoonTemplateProps, ComingSoonFeature }
export { DEFAULT_FEATURES, DEFAULT_CONTACT_CTA }