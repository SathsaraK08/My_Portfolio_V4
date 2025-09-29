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
      <section id="projects" className="container mx-auto px-4 py-16 md:py-24 space-y-12">
        <ScrollReveal className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
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