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
    <div className={cn("space-y-6", className)}>
      {/* Main Coming Soon Card */}
      <Card className="border-2 border-dashed border-border/50 bg-transparent backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-6 h-20 w-20 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-xl">
              <Construction className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
              {title}
            </CardTitle>
            {estimatedLaunch && (
              <Badge variant="outline" className="w-fit mx-auto bg-background/80 backdrop-blur-sm">
                <Clock className="w-4 h-4 mr-2" />
                Expected: {estimatedLaunch}
              </Badge>
            )}
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <p className="text-muted-foreground leading-relaxed text-center max-w-2xl mx-auto text-lg mb-8">
              {description}
            </p>

            {/* Features Grid */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div key={index} className="group p-4 rounded-xl border bg-background/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 p-2 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-primary">
                          {feature.icon}
                        </div>
                        <h4 className="font-semibold text-sm">{feature.title}</h4>
                      </div>
                      <Badge
                        variant="secondary"
                        className={cn("text-xs px-2 py-1", getStatusColor(feature.status))}
                      >
                        {getStatusText(feature.status)}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      {/* Contact CTA Section */}
      <Card className="bg-background/80 border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm">
        <CardContent className="p-10 text-center">
          <div className="space-y-4 mb-8">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {contactCTA.title}
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
              {contactCTA.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link href={contactCTA.primaryButton.href}>
              <Button size="lg" className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300">
                {contactCTA.primaryButton.text}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>

            {contactCTA.secondaryButton && (
              <Link href={contactCTA.secondaryButton.href}>
                <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-3 border-2 border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-950/50 hover:shadow-lg transition-all duration-300">
                  {contactCTA.secondaryButton.text}
                </Button>
              </Link>
            )}
          </div>

          {/* Quick Contact Info */}
          <div className="pt-6 border-t border-border/30">
            <p className="text-sm text-muted-foreground">
              Or reach out directly via{' '}
              <Link href="/contact" className="font-semibold text-primary hover:text-primary/80 underline underline-offset-2 transition-colors">
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