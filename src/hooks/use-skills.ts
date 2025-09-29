'use client'

import { useState, useEffect } from 'react'

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
}

export function useSkills() {
  const [skillsData, setSkillsData] = useState<SkillsSection>({
    title: "Technologies & Skills",
    subtitle: "Expertise in modern technologies and frameworks",
    skills: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    async function fetchSkills() {
      try {
        const response = await fetch('/api/public/home-skills')

        if (!mounted) return

        if (!response.ok) {
          throw new Error(`Failed to fetch skills: ${response.status}`)
        }

        const data = await response.json()
        if (mounted) {
          setSkillsData(data)
          setError(null)
        }
      } catch (err) {
        if (mounted) {
          console.error('Failed to fetch skills:', err)
          setError(err instanceof Error ? err.message : 'Failed to load skills')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchSkills()

    return () => {
      mounted = false
    }
  }, [])

  return { skillsData, loading, error }
}