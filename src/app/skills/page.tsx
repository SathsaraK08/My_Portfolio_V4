"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollReveal, HoverGlow } from "@/components/scroll-effects"
import { FloatingAnimation, FadeIn, StaggerContainer, StaggerItem, HoverScale } from "@/components/animations"
import { motion } from "framer-motion"

const skillCategories = [
  {
    title: "Frontend Development",
    icon: "🎨",
    color: "from-blue-500 to-cyan-500",
    skills: [
      { name: "React.js", level: 95, icon: "⚛️" },
      { name: "Next.js", level: 90, icon: "▲" },
      { name: "TypeScript", level: 88, icon: "📘" },
      { name: "Tailwind CSS", level: 92, icon: "🎨" },
      { name: "JavaScript", level: 94, icon: "⚡" },
      { name: "HTML5", level: 96, icon: "🌐" },
      { name: "CSS3", level: 90, icon: "🎨" },
      { name: "Vue.js", level: 75, icon: "💚" },
    ]
  },
  {
    title: "Backend Development",
    icon: "⚙️",
    color: "from-green-500 to-emerald-500",
    skills: [
      { name: "Node.js", level: 90, icon: "💚" },
      { name: "Python", level: 85, icon: "🐍" },
      { name: "Express.js", level: 88, icon: "🚀" },
      { name: "FastAPI", level: 80, icon: "⚡" },
      { name: "GraphQL", level: 75, icon: "📊" },
      { name: "REST APIs", level: 92, icon: "🔗" },
      { name: "Microservices", level: 78, icon: "🔧" },
      { name: "PHP", level: 70, icon: "🐘" },
    ]
  },
  {
    title: "Database & Storage",
    icon: "🗄️",
    color: "from-purple-500 to-pink-500",
    skills: [
      { name: "PostgreSQL", level: 85, icon: "🐘" },
      { name: "MongoDB", level: 88, icon: "🍃" },
      { name: "Redis", level: 80, icon: "🔴" },
      { name: "MySQL", level: 82, icon: "🐬" },
      { name: "Firebase", level: 75, icon: "🔥" },
      { name: "Supabase", level: 78, icon: "⚡" },
      { name: "Prisma", level: 85, icon: "💎" },
      { name: "SQLite", level: 80, icon: "📱" },
    ]
  },
  {
    title: "DevOps & Tools",
    icon: "🛠️",
    color: "from-orange-500 to-red-500",
    skills: [
      { name: "Docker", level: 85, icon: "🐳" },
      { name: "AWS", level: 80, icon: "☁️" },
      { name: "Git", level: 95, icon: "🔧" },
      { name: "CI/CD", level: 78, icon: "🔄" },
      { name: "Vercel", level: 88, icon: "▲" },
      { name: "Netlify", level: 82, icon: "🌐" },
      { name: "Linux", level: 85, icon: "🐧" },
      { name: "Kubernetes", level: 65, icon: "⚙️" },
    ]
  },
  {
    title: "Mobile Development",
    icon: "📱",
    color: "from-indigo-500 to-purple-500",
    skills: [
      { name: "React Native", level: 82, icon: "📱" },
      { name: "Flutter", level: 70, icon: "🦋" },
      { name: "Expo", level: 85, icon: "📱" },
      { name: "PWA", level: 88, icon: "🔧" },
      { name: "Ionic", level: 65, icon: "⚡" },
      { name: "Cordova", level: 60, icon: "📱" },
    ]
  },
  {
    title: "Design & UI/UX",
    icon: "🎨",
    color: "from-pink-500 to-rose-500",
    skills: [
      { name: "Figma", level: 80, icon: "🎨" },
      { name: "Adobe XD", level: 75, icon: "🎨" },
      { name: "Sketch", level: 70, icon: "✏️" },
      { name: "Framer Motion", level: 85, icon: "🎭" },
      { name: "GSAP", level: 75, icon: "⚡" },
      { name: "Three.js", level: 65, icon: "🎲" },
    ]
  }
]

const certifications = [
  {
    title: "AWS Certified Developer",
    issuer: "Amazon Web Services",
    date: "2023",
    icon: "☁️",
    badge: "aws"
  },
  {
    title: "React Developer Certification",
    issuer: "Meta",
    date: "2023",
    icon: "⚛️",
    badge: "react"
  },
  {
    title: "Google Cloud Professional",
    issuer: "Google Cloud",
    date: "2022",
    icon: "☁️",
    badge: "gcp"
  },
  {
    title: "MongoDB Developer Path",
    issuer: "MongoDB University",
    date: "2023",
    icon: "🍃",
    badge: "mongodb"
  }
]

export default function SkillsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800" />
        <div className="absolute inset-0 bg-black/10" />
        
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <FadeIn>
            <motion.div
              className="inline-block p-4 bg-white/20 backdrop-blur-sm rounded-full mb-8 border border-white/30"
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <span className="text-4xl">🚀</span>
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
              Skills & Expertise
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              A comprehensive overview of my technical skills, tools, and technologies I work with 
              to create exceptional digital experiences.
            </p>
          </FadeIn>
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

      {/* Skills Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <FadeIn className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Technical Skills
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Proficiency across the full stack of modern web development
            </p>
          </FadeIn>
          
          <StaggerContainer className="grid lg:grid-cols-2 gap-8">
            {skillCategories.map((category, categoryIndex) => (
              <StaggerItem key={category.title}>
                <HoverScale>
                  <Card className="h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/50 shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 group">
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <FloatingAnimation>
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-2xl shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300">
                            {category.icon}
                          </div>
                        </FloatingAnimation>
                        <div>
                          <CardTitle className="text-xl">{category.title}</CardTitle>
                          <CardDescription>
                            {category.skills.length} technologies
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {category.skills.map((skill, skillIndex) => (
                        <motion.div
                          key={skill.name}
                          className="space-y-2"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: skillIndex * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">{skill.icon}</span>
                              <span className="font-medium">{skill.name}</span>
                            </div>
                            <span className="text-sm text-muted-foreground font-medium">
                              {skill.level}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                            <motion.div 
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.level}%` }}
                              transition={{ delay: skillIndex * 0.1, duration: 1, ease: "easeOut" }}
                              viewport={{ once: true }}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>
                </HoverScale>
              </StaggerItem>
            ))}
          </StaggerContainer>
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

      {/* Certifications */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <FadeIn className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Certifications & Achievements
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional certifications that validate my expertise in various technologies.
            </p>
          </FadeIn>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <StaggerItem key={cert.title}>
                <HoverScale>
                  <Card className="text-center h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/50 shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 group">
                    <CardHeader>
                      <FloatingAnimation>
                        <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-3xl mb-4 shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300">
                          {cert.icon}
                        </div>
                      </FloatingAnimation>
                      <CardTitle className="text-lg">{cert.title}</CardTitle>
                      <CardDescription>{cert.issuer}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Badge className="mb-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                        {cert.date}
                      </Badge>
                    </CardContent>
                  </Card>
                </HoverScale>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800" />
        <div className="absolute inset-0 bg-black/10" />
        
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Ready to Build Something Amazing?
            </h2>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-12 leading-relaxed">
              Let's combine these skills to create exceptional digital experiences that make a difference.
            </p>
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              {[
                { number: "50+", label: "Technologies Mastered", icon: "🛠️" },
                { number: "100+", label: "Projects Completed", icon: "🚀" },
                { number: "5+", label: "Years Experience", icon: "📅" },
                { number: "20+", label: "Happy Clients", icon: "😊" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="text-4xl mb-2">{stat.icon}</div>
                  <div className="text-4xl font-bold mb-2 text-white">{stat.number}</div>
                  <div className="text-lg text-blue-100">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}