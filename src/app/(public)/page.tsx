import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Code, Database, Globe, Smartphone } from "lucide-react"
import { FadeIn, SlideInLeft, SlideInRight, StaggerContainer, StaggerItem, HoverScale, FloatingAnimation } from "@/components/animations"
import { HeroSection } from "@/components/hero-section"
import { ModernButton } from "@/components/modern-button"
import { ModernCard } from "@/components/modern-card"
import { SkillsMarquee } from "@/components/skills-marquee"
import { ScrollReveal, ParallaxScroll, HoverGlow } from "@/components/scroll-effects"
import { ProjectsGrid } from "@/components/projects-grid"
import { ServicesSection } from "@/components/services-section"

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <HeroSection />

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

      {/* Skills Marquee Section */}
      <ScrollReveal>
        <SkillsMarquee />
      </ScrollReveal>

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

      {/* Dynamic Services Section */}
      <ServicesSection />

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

      {/* Featured Projects */}
      <section className="relative overflow-hidden py-12 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/30 dark:to-purple-950/30">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-1/4 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 space-y-8 relative z-10">
          <ScrollReveal className="text-center space-y-4 mb-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              Featured Projects
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Here are some of my recent projects that showcase my skills and expertise
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <ProjectsGrid limit={6} showFeatured={true} />
          </ScrollReveal>

          <ScrollReveal delay={0.5} className="text-center pt-8">
            <HoverScale>
              <ModernButton variant="gradient-2" size="lg" href="/projects">
                View All Projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </ModernButton>
            </HoverScale>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center space-y-8">
          <FadeIn className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Start Your Project?
            </h2>
            <p className="text-lg max-w-2xl mx-auto opacity-90">
              Let's work together to bring your ideas to life.
              I'm always excited to take on new challenges and create amazing experiences.
            </p>
          </FadeIn>

          <FadeIn delay={0.3} className="flex flex-col sm:flex-row gap-4 justify-center">
            <HoverScale>
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-50 font-semibold shadow-lg hover:shadow-xl">
                <Link href="/contact">
                  Start a Conversation
                </Link>
              </Button>
            </HoverScale>
            <HoverScale>
              <Button asChild size="lg" variant="outline" className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 text-white font-semibold">
                <Link href="/about">
                  Learn More About Me
                </Link>
              </Button>
            </HoverScale>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}