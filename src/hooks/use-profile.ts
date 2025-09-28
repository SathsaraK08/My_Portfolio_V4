'use client'

import { useEffect, useState } from 'react'

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

export function useProfile() {
  // Start with the correct data immediately to avoid showing John Doe
  const [profile, setProfile] = useState<Profile | null>({
    fullName: 'Sathsara Karunarathne',
    title: 'Ai / ML Engineer',
    bio: 'Full Stack Developer passionate about creating exceptional digital experiences.',
    avatar: 'https://cowyzhxivrfixizgdugw.supabase.co/storage/v1/object/public/media/uploads/06729a38-2f99-47d1-9b0d-ec51743fc187-35A4424.JPG.JPG',
    location: 'Sri Lanka',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    website: 'https://johndoe.dev',
    linkedIn: 'https://linkedin.com/in/johndoe',
    github: 'https://github.com/johndoe',
    twitter: 'https://twitter.com/johndoe',
    instagram: null,
    youTube: null
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/public/profile?_t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        }
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(data)
        setError(null)
      }
    } catch (err) {
      console.error('Profile fetch error:', err)
      setError(err instanceof Error ? err.message : 'Failed to load profile')
      // Keep the default data on error
    }
  }

  useEffect(() => {
    // Fetch fresh data but don't show loading state since we have good defaults
    fetchProfile()

    // Listen for global refresh events
    const handleRefresh = () => {
      fetchProfile()
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('refresh-profile', handleRefresh)
      return () => window.removeEventListener('refresh-profile', handleRefresh)
    }
  }, [])

  return { profile, isLoading, error, refetch: fetchProfile }
}