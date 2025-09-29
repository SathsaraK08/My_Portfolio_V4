"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useEffect, useState } from "react"

interface Skill {
  id: number
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
}

export function SkillsMarquee() {
  const [skillsData, setSkillsData] = useState<SkillsSection>({
    title: "Technologies & Skills",
    subtitle: "Expertise in modern technologies and frameworks",
    skills: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSkills() {
      try {
        const response = await fetch('/api/public/home-skills')

        if (!response.ok) {
          throw new Error(`Failed to fetch skills: ${response.status}`)
        }

        const data = await response.json()
        setSkillsData(data)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch skills:', err)
        setError(err instanceof Error ? err.message : 'Failed to load skills')
      } finally {
        setLoading(false)
      }
    }

    fetchSkills()
  }, [])

  const hasSkills = skillsData.skills.length > 0

  console.log('SkillsMarquee render:', { loading, error, hasSkills, skillsCount: skillsData.skills.length })

  return (
    <>
      <style jsx>{`
        .marquee-container {
          display: flex;
          align-items: center;
          height: 100px;
          width: 100%;
          position: relative;
        }

        .marquee-content {
          display: flex;
          align-items: center;
          animation: scroll 20s linear infinite;
          white-space: nowrap;
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

        {loading ? (
          // Loading state
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <motion.div
                className="w-3 h-3 bg-blue-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0 }}
              />
              <motion.div
                className="w-3 h-3 bg-purple-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div
                className="w-3 h-3 bg-blue-600 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
              />
            </div>
          </div>
        ) : error ? (
          // Error state
          <div className="container mx-auto px-4 text-center">
            <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg max-w-md mx-auto">
              <p className="text-red-600 dark:text-red-400 text-sm">
                Unable to load skills: {error}
              </p>
            </div>
          </div>
        ) : !hasSkills ? (
          // No skills state
          <div className="container mx-auto px-4 text-center">
            <div className="p-8 bg-yellow-100 dark:bg-yellow-800/50 rounded-2xl max-w-md mx-auto">
              <p className="text-yellow-800 dark:text-yellow-200">
                No skills found (skillsData.skills.length = {skillsData.skills.length})
              </p>
            </div>
          </div>
        ) : (
          // Clean skills marquee - just pure logos with colors
          <div className="w-full overflow-hidden relative">
            <div className="marquee-container">
              <div className="marquee-content">
                {/* Duplicate skills for seamless loop */}
                {[...skillsData.skills, ...skillsData.skills, ...skillsData.skills].map((skill, index) => (
                  <div
                    key={`skill-${index}`}
                    className="flex-shrink-0 group cursor-pointer inline-block mx-8"
                    title={skill.name}
                  >
                    {skill.imageUrl || skill.icon ? (
                      <Image
                        src={skill.imageUrl || skill.icon || ''}
                        alt={`${skill.name} logo`}
                        width={56}
                        height={56}
                        className="w-14 h-14 object-contain transition-all duration-300 hover:scale-110"
                      />
                    ) : (
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg transition-all duration-300 hover:scale-110">
                        {skill.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
    </>
  )
}