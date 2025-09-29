"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useEffect, useState, useMemo, useCallback } from "react"

interface Skill {
  id: string
  name: string
  category: string | null
  level: number
  icon?: string | null
  imageUrl?: string | null
  order: number
  isVisible: boolean
}

interface SkillsSection {
  title: string
  subtitle: string
  skills: Skill[]
  _meta?: {
    queryDuration: number
    skillsCount: number
    activeConnections: number
    timestamp: string
    error?: boolean
  }
}

// Optimized Image Component with better loading
function SkillImage({ skill, index }: { skill: Skill; index: number }) {
  const [imageError, setImageError] = useState(false)

  const handleError = useCallback(() => {
    setImageError(true)
  }, [])

  if (imageError || (!skill.imageUrl && !skill.icon)) {
    return (
      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg transition-all duration-300 hover:scale-110">
        {skill.name.charAt(0).toUpperCase()}
      </div>
    )
  }

  return (
    <Image
      src={skill.imageUrl || skill.icon || ''}
      alt={`${skill.name} logo`}
      width={56}
      height={56}
      className="w-14 h-14 object-contain transition-all duration-300 hover:scale-110"
      loading={index < 10 ? "eager" : "lazy"}
      onError={handleError}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+JNqva9+0+LRdD1+0CmMGwUZABVBONzpCr4z0zNzNHhkNwA+8RcDLwQGYOJmXMJuYFiXc2yBWjfYOWOvz6zDkbDOOhfQYOX8/7KFU+iQaJJpWu1Bv+RzZGRjHk83rF+r9+OhVuRxr1sZGqG7FjXhMUf8ACRwAxNFXPy/Lnp8WKrKN7qDhpQzaBMJNKqXEklm4EHamhOqEWYqfGg9nLsQw2kY7uRgEVnZnQ5y2fk7CpJQJbqvlJQIDNaKOyZhKIGmLRz+sN7iyM5Q8+4mJEjzqjvdTT0MWc/TrJCPCANkgpPccALWPYW2VNjaqmQ=="
    />
  )
}

// Request deduplication cache
const skillsCache = new Map<string, { data: SkillsSection; timestamp: number }>()
const CACHE_DURATION = 60000 // 1 minute

async function fetchSkillsWithCache(): Promise<SkillsSection> {
  const cacheKey = 'home-skills'
  const cached = skillsCache.get(cacheKey)

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }

  const response = await fetch('/api/public/home-skills', {
    next: { revalidate: 60 }
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch skills: ${response.status}`)
  }

  const data = await response.json()
  skillsCache.set(cacheKey, { data, timestamp: Date.now() })
  return data
}

export function SkillsMarqueeOptimized() {
  const [skillsData, setSkillsData] = useState<SkillsSection>({
    title: "Technologies & Skills",
    subtitle: "Expertise in modern technologies and frameworks",
    skills: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchSkills() {
      try {
        const data = await fetchSkillsWithCache()
        if (!cancelled) {
          setSkillsData(data)
          setError(null)
        }
      } catch (err) {
        console.error('Failed to fetch skills:', err)
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load skills')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchSkills()

    return () => {
      cancelled = true
    }
  }, [])

  // Memoize computed values
  const hasSkills = useMemo(() => skillsData.skills.length > 0, [skillsData.skills.length])
  const duplicatedSkills = useMemo(() =>
    hasSkills ? [...skillsData.skills, ...skillsData.skills, ...skillsData.skills] : [],
    [skillsData.skills, hasSkills]
  )

  console.log('SkillsMarquee render:', {
    loading,
    error,
    hasSkills,
    skillsCount: skillsData.skills.length,
    meta: skillsData._meta
  })

  if (loading) {
    return <SkillsLoadingSkeleton />
  }

  if (error) {
    return <SkillsErrorState error={error} />
  }

  if (!hasSkills) {
    return <SkillsEmptyState skillsData={skillsData} />
  }

  return <SkillsContent skillsData={skillsData} duplicatedSkills={duplicatedSkills} />
}

// Loading skeleton component
function SkillsLoadingSkeleton() {
  return (
    <section className="relative overflow-hidden py-16 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/30 dark:to-purple-950/30">
      <div className="container mx-auto px-4 text-center">
        <div className="space-y-4 mb-12">
          <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg animate-pulse max-w-md mx-auto" />
          <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg animate-pulse max-w-lg mx-auto" />
        </div>
        <div className="flex items-center justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-blue-500 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// Error state component
function SkillsErrorState({ error }: { error: string }) {
  return (
    <section className="relative overflow-hidden py-16 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/30 dark:to-purple-950/30">
      <div className="container mx-auto px-4 text-center">
        <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg max-w-md mx-auto">
          <p className="text-red-600 dark:text-red-400 text-sm">
            Unable to load skills: {error}
          </p>
        </div>
      </div>
    </section>
  )
}

// Empty state component
function SkillsEmptyState({ skillsData }: { skillsData: SkillsSection }) {
  return (
    <section className="relative overflow-hidden py-16 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/30 dark:to-purple-950/30">
      <div className="container mx-auto px-4 text-center">
        <div className="p-8 bg-yellow-100 dark:bg-yellow-800/50 rounded-2xl max-w-md mx-auto">
          <p className="text-yellow-800 dark:text-yellow-200">
            No skills found (skillsData.skills.length = {skillsData.skills.length})
          </p>
        </div>
      </div>
    </section>
  )
}

// Main skills content component
function SkillsContent({ skillsData, duplicatedSkills }: { skillsData: SkillsSection; duplicatedSkills: Skill[] }) {
  return (
    <>
      <style jsx>{`
        .marquee-container {
          display: flex;
          align-items: center;
          height: 100px;
          width: 100%;
          position: relative;
          overflow: hidden;
        }

        .marquee-content {
          display: flex;
          align-items: center;
          animation: scroll 30s linear infinite;
          white-space: nowrap;
          will-change: transform;
        }

        @keyframes scroll {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        .marquee-container:hover .marquee-content {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          .marquee-content {
            animation: none;
          }
        }
      `}</style>
      <section className="relative overflow-hidden py-16 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/30 dark:to-purple-950/30">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-1/4 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl" />
        </div>

        {/* Header */}
        <div className="container mx-auto px-4 text-center mb-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              {skillsData.title}
            </h2>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto font-light">
              {skillsData.subtitle}
            </p>
          </motion.div>
        </div>

        {/* Skills Marquee */}
        <div className="relative min-h-[120px] flex items-center">
          <div className="w-full overflow-hidden relative">
            <div className="marquee-container">
              <div className="marquee-content">
                {duplicatedSkills.map((skill, index) => (
                  <div
                    key={`skill-${skill.id}-${index}`}
                    className="flex-shrink-0 group cursor-pointer inline-block mx-8"
                    title={skill.name}
                  >
                    <SkillImage skill={skill} index={index} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Performance metrics (only in development) */}
        {process.env.NODE_ENV === 'development' && skillsData._meta && (
          <div className="container mx-auto px-4 mt-8">
            <details className="text-xs text-gray-500 dark:text-gray-400">
              <summary>Performance Metrics</summary>
              <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                {JSON.stringify(skillsData._meta, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </section>
    </>
  )
}