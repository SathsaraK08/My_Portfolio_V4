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
      <section className="py-16 relative">
        <div className="container mx-auto px-4 mb-8">
          <ScrollReveal>
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Technologies & Skills
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Expertise in modern technologies and frameworks
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
            </div>
          </ScrollReveal>
        </div>
        <ScrollReveal>
          <SkillsMarquee />
        </ScrollReveal>
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

      {/* Skills Overview */}
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ScrollReveal direction="up" delay={0.1}>
              <HoverGlow glowColor="rgb(59, 130, 246)">
                <ModernCard variant="gradient" hover="lift">
                  <Card className="text-center h-full border-0 bg-transparent shadow-none">
                    <CardHeader>
                      <FloatingAnimation>
                        <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                          <Globe className="h-8 w-8 text-white" />
                        </div>
                      </FloatingAnimation>
                      <CardTitle className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Frontend</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
                        React, Next.js, TypeScript, Tailwind CSS
                      </CardDescription>
                    </CardContent>
                  </Card>
                </ModernCard>
              </HoverGlow>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.2}>
              <HoverGlow glowColor="rgb(59, 130, 246)">
                <ModernCard variant="gradient" hover="lift">
                  <Card className="text-center h-full border-0 bg-transparent shadow-none">
                    <CardHeader>
                      <FloatingAnimation>
                        <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                          <Database className="h-8 w-8 text-white" />
                        </div>
                      </FloatingAnimation>
                      <CardTitle className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Backend</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
                        Node.js, Python, PostgreSQL, MongoDB
                      </CardDescription>
                    </CardContent>
                  </Card>
                </ModernCard>
              </HoverGlow>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.3}>
              <HoverGlow glowColor="rgb(59, 130, 246)">
                <ModernCard variant="gradient" hover="lift">
                  <Card className="text-center h-full border-0 bg-transparent shadow-none">
                    <CardHeader>
                      <FloatingAnimation>
                        <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                          <Smartphone className="h-8 w-8 text-white" />
                        </div>
                      </FloatingAnimation>
                      <CardTitle className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Mobile</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
                        React Native, Flutter, Progressive Web Apps
                      </CardDescription>
                    </CardContent>
                  </Card>
                </ModernCard>
              </HoverGlow>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.4}>
              <HoverGlow glowColor="rgb(59, 130, 246)">
                <ModernCard variant="gradient" hover="lift">
                  <Card className="text-center h-full border-0 bg-transparent shadow-none">
                    <CardHeader>
                      <FloatingAnimation>
                        <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                          <Code className="h-8 w-8 text-white" />
                        </div>
                      </FloatingAnimation>
                      <CardTitle className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">DevOps</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
                        Docker, AWS, CI/CD, Git
                      </CardDescription>
                    </CardContent>
                  </Card>
                </ModernCard>
              </HoverGlow>
            </ScrollReveal>
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

      {/* Featured Projects */}
      <section className="container mx-auto px-4 py-16 md:py-24 space-y-12">
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
              <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                Start a Conversation
              </button>
            </HoverScale>
            <HoverScale>
              <button className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105">
                Learn More About Me
              </button>
            </HoverScale>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}