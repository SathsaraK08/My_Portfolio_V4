"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Skill } from "@/types/skill"
import { useEffect, useState } from "react"

interface SkillsMarqueeDynamicProps {
  className?: string
  speed?: number
}

export function SkillsMarqueeDynamic({ className = "", speed = 25 }: SkillsMarqueeDynamicProps) {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch('/api/public/skills')
        if (response.ok) {
          const data = await response.json()
          // Filter visible skills and limit to top skills
          const visibleSkills = data
            .filter((skill: Skill) => skill.isVisible)
            .sort((a: Skill, b: Skill) => (b.level || 0) - (a.level || 0))
            .slice(0, 12) // Show top 12 skills
          setSkills(visibleSkills)
        }
      } catch (error) {
        console.error('Failed to fetch skills:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSkills()
  }, [])

  if (loading) {
    return (
      <div className={`relative overflow-hidden bg-gradient-to-r from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 ${className}`}>
        <div className="flex gap-8 items-center justify-center">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 animate-pulse">
              <div className="bg-gray-200 dark:bg-gray-700 p-6 rounded-2xl shadow-lg min-w-[140px] h-[120px] text-center"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (skills.length === 0) {
    return null
  }

  return (
    <div className={`relative overflow-hidden bg-gradient-to-r from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white dark:from-gray-900 dark:via-transparent dark:to-gray-900 z-10"></div>

      <motion.div
        className="flex gap-8 items-center whitespace-nowrap"
        initial={{ x: 0 }}
        animate={{ x: "-100%" }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop"
        }}
        style={{
          width: "200%"
        }}
      >
        {/* First set */}
        <div className="flex gap-8 items-center flex-shrink-0">
          {skills.map((skill, index) => (
            <motion.div
              key={`first-${skill.id}-${index}`}
              className="flex-shrink-0 group cursor-pointer"
              whileHover={{ scale: 1.1, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className={`bg-gradient-to-br from-primary/20 to-primary/10 p-6 rounded-2xl shadow-lg min-w-[140px] text-center backdrop-blur-sm border border-white/20 hover:shadow-2xl transition-all duration-300`}>
                <div className="mb-3 flex justify-center">
                  <div className="w-12 h-12 bg-white/90 rounded-xl flex items-center justify-center p-2">
                    {skill.imageUrl ? (
                      <Image
                        src={skill.imageUrl}
                        alt={`${skill.name} icon`}
                        width={32}
                        height={32}
                        className="w-8 h-8 object-contain"
                      />
                    ) : (
                      <span className="text-2xl">
                        {skill.icon || skill.name.charAt(0)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-foreground font-semibold text-sm drop-shadow-sm">
                  {skill.name}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {skill.level}%
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Second set for seamless loop */}
        <div className="flex gap-8 items-center flex-shrink-0">
          {skills.map((skill, index) => (
            <motion.div
              key={`second-${skill.id}-${index}`}
              className="flex-shrink-0 group cursor-pointer"
              whileHover={{ scale: 1.1, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className={`bg-gradient-to-br from-primary/20 to-primary/10 p-6 rounded-2xl shadow-lg min-w-[140px] text-center backdrop-blur-sm border border-white/20 hover:shadow-2xl transition-all duration-300`}>
                <div className="mb-3 flex justify-center">
                  <div className="w-12 h-12 bg-white/90 rounded-xl flex items-center justify-center p-2">
                    {skill.imageUrl ? (
                      <Image
                        src={skill.imageUrl}
                        alt={`${skill.name} icon`}
                        width={32}
                        height={32}
                        className="w-8 h-8 object-contain"
                      />
                    ) : (
                      <span className="text-2xl">
                        {skill.icon || skill.name.charAt(0)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-foreground font-semibold text-sm drop-shadow-sm">
                  {skill.name}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {skill.level}%
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}