'use client'

import { useEffect, useState, useCallback } from 'react'

export interface Profile {
  fullName: string
  title: string
  bio: string
  avatar: string | null
  location: string | null
  email: string
  phone: string | null
  website: string | null
  linkedIn: string | null
  github: string | null
  twitter: string | null
  instagram: string | null
  youTube: string | null
}

// Global cache for profile data
let profileCache: Profile | null = null
let lastFetch = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Clear cache to force fresh data
profileCache = null
lastFetch = 0

export function useProfile() {
  // Start with the correct data immediately to avoid showing John Doe
  const [profile, setProfile] = useState<Profile | null>({
    fullName: 'Sathsara Karunarathne',
    title: 'AI / ML Engineer',
    bio: 'Passionate AI/ML Engineer building intelligent systems that solve real-world problems. Specialized in deep learning, computer vision, and scalable ML infrastructure.',
    avatar: 'https://cowyzhxivrfixizgdugw.supabase.co/storage/v1/object/public/media/uploads/06729a38-2f99-47d1-9b0d-ec51743fc187-35A4424.JPG.JPG',
    location: 'Sri Lanka',
    email: 'sathsara@example.com',
    phone: '+94 123 456 789',
    website: 'https://sathsara.dev',
    linkedIn: 'https://linkedin.com/in/sathsara',
    github: 'https://github.com/sathsara',
    twitter: 'https://twitter.com/sathsara',
    instagram: null,
    youTube: null
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = useCallback(async (forceRefresh = false) => {
    const now = Date.now()

    // Use cache if available and not expired
    if (!forceRefresh && profileCache && (now - lastFetch) < CACHE_DURATION) {
      setProfile(profileCache)
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch(`/api/public/profile?t=${Date.now()}`, {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      })

      if (response.ok) {
        const data = await response.json()
        profileCache = data
        lastFetch = now
        setProfile(data)
        setError(null)
      }
    } catch (err) {
      console.error('Profile fetch error:', err)
      setError(err instanceof Error ? err.message : 'Failed to load profile')
      // Keep the default data on error
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    // Clear any existing cache and force fresh fetch
    profileCache = null
    lastFetch = 0

    // Always fetch fresh data
    fetchProfile(true)

    // Listen for global refresh events
    const handleRefresh = () => {
      fetchProfile(true)
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('refresh-profile', handleRefresh)
      return () => window.removeEventListener('refresh-profile', handleRefresh)
    }
  }, [fetchProfile])

  return { profile, isLoading, error, refetch: () => fetchProfile(true) }
}