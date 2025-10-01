import { Metadata } from 'next'
import { headers } from 'next/headers'
import Link from 'next/link'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skill } from '@/types/skill'
import Image from 'next/image'
import { ScrollReveal, HoverGlow } from '@/components/scroll-effects'
import { ModernCard } from '@/components/modern-card'
import { FloatingAnimation } from '@/components/animations'

export const metadata: Metadata = {
  title: 'Skills | Portfolio',
}

export const revalidate = 60

const CATEGORY_META: Record<string, { icon: string; gradient: string; blurb: string }> = {
  Frontend: {
    icon: '🎨',
    gradient: 'from-sky-500/20 to-purple-500/10',
    blurb: 'Interfaces, animation, and component systems.',
  },
  Backend: {
    icon: '⚙️',
    gradient: 'from-emerald-500/20 to-teal-500/10',
    blurb: 'APIs, databases, and core business logic.',
  },
  Database: {
    icon: '🗄️',
    gradient: 'from-indigo-500/20 to-blue-500/10',
    blurb: 'Persistent storage, migrations, and query optimisation.',
  },
  DevOps: {
    icon: '🛠️',
    gradient: 'from-amber-500/20 to-orange-500/10',
    blurb: 'Tooling, deployment, and observability.',
  },
  Design: {
    icon: '✨',
    gradient: 'from-pink-500/20 to-purple-500/10',
    blurb: 'UX thinking and collaborative workflows.',
  },
  Mobile: {
    icon: '📱',
    gradient: 'from-violet-500/20 to-fuchsia-500/10',
    blurb: 'Cross-platform experiences on the go.',
  },
  Tools: {
    icon: '🧰',
    gradient: 'from-slate-500/20 to-stone-500/10',
    blurb: 'Everyday utilities that keep the work flowing.',
  },
  Other: {
    icon: '🚀',
    gradient: 'from-cyan-500/20 to-blue-500/10',
    blurb: 'Supporting skills that round out the toolkit.',
  },
}

async function getSkills(): Promise<Skill[]> {
  const headerStore = await headers()
  const host = headerStore.get('host') ?? ''
  const protocol = headerStore.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https')

  const explicitBase = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '')
  const vercelBase = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null
  const runtimeBase = host ? `${protocol}://${host}` : null

  const baseUrl = explicitBase || vercelBase || runtimeBase || 'http://localhost:3000'

  const response = await fetch(`${baseUrl}/api/public/skills`, {
    cache: 'no-store',
  })

  if (!response.ok) {
    console.error('Failed to load skills', await response.text())
    return []
  }

  return response.json()
}

function groupSkills(skills: Skill[]) {
  return skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    const category = skill.category ?? 'Other'
    acc[category] = acc[category] ?? []
    acc[category].push(skill)
    return acc
  }, {})
}

function sortGroups(groups: Record<string, Skill[]>) {
  return Object.entries(groups)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([category, items]) => ({
      category,
      items: items.sort((a, b) => (b.level ?? 0) - (a.level ?? 0) || a.name.localeCompare(b.name)),
    }))
}

export default async function SkillsPage() {
  const skills = await getSkills()
  const groups = sortGroups(groupSkills(skills))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/30 dark:to-purple-950/30">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/30 dark:to-purple-950/30">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-1/4 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10 space-y-8">
          <ScrollReveal>
            <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-card/50 backdrop-blur-sm rounded-full border border-border/50">
              <span className="text-2xl">⚡</span>
              <span className="text-muted-foreground font-medium">Technical Expertise</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              Skills & Technologies
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A comprehensive overview of my technical skills and expertise across different domains
            </p>
          </ScrollReveal>
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
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
          {groups.map(({ category, items }, index) => {
            const meta = CATEGORY_META[category] ?? CATEGORY_META.Other

            return (
              <ScrollReveal key={category} direction="up" delay={index * 0.1}>
                <HoverGlow glowColor="rgb(59, 130, 246)">
                  <ModernCard variant="gradient" hover="lift">
                    <Card className="h-full border-0 bg-transparent shadow-none">
                      <CardHeader className="space-y-4">
                        <div className="flex items-center gap-4">
                          <FloatingAnimation>
                            <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center text-2xl border border-white/20`}>
                              {meta.icon}
                            </div>
                          </FloatingAnimation>
                          <div>
                            <CardTitle className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                              {category}
                            </CardTitle>
                            <CardDescription className="text-base">
                              {meta.blurb}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {items.map((skill) => (
                          <div key={skill.id} className="space-y-3 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-border/20">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-6 h-6 flex items-center justify-center">
                                  {skill.imageUrl ? (
                                    <Image
                                      src={skill.imageUrl}
                                      alt={skill.name}
                                      width={24}
                                      height={24}
                                      className="object-contain"
                                    />
                                  ) : (
                                    <span className="text-base">{skill.icon ?? '•'}</span>
                                  )}
                                </div>
                                <span className="font-medium">{skill.name}</span>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {skill.level ?? 0}%
                              </Badge>
                            </div>
                            <Progress value={skill.level ?? 0} className="h-2">
                              <span className="sr-only">{skill.name} proficiency</span>
                            </Progress>
                            {skill.description && (
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {skill.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </ModernCard>
                </HoverGlow>
              </ScrollReveal>
            )
          })}
        </div>

        {groups.length === 0 && (
          <ScrollReveal>
            <div className="text-center py-12">
              <div className="max-w-md mx-auto space-y-4">
                <div className="h-16 w-16 mx-auto rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <span className="text-2xl">🚀</span>
                </div>
                <h3 className="text-xl font-semibold">No skills published yet</h3>
                <p className="text-muted-foreground">
                  Skills will appear here automatically when published from the admin dashboard.
                </p>
              </div>
            </div>
          </ScrollReveal>
        )}
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
    </div>
  )
}
