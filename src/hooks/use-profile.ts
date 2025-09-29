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

// Default fallback profile to prevent hydration mismatch - MUST MATCH DATABASE EXACTLY
const defaultProfile: Profile = {
  fullName: 'Sathsara Karunarathne',
  title: 'Ai / ML Engineer',
  bio: 'Bla nnkscfksvcsc',
  avatar: 'https://cowyzhxivrfixizgdugw.supabase.co/storage/v1/object/public/media/uploads/06729a38-2f99-47d1-9b0d-ec51743fc187-35A4424.JPG.JPG',
  location: 'Sri Lanka',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  website: 'https://johndoe.dev',
  linkedIn: 'https://linkedin.com/in/johndoe',
  github: 'https://github.com/johndoe',
  twitter: 'https://twitter.com/johndoe',
  instagram: '',
  youTube: ''
}

export function useProfile() {
  // Start with default profile to prevent hydration mismatch
  const [profile, setProfile] = useState<Profile | null>(defaultProfile)
  const [isLoading, setIsLoading] = useState(true)
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