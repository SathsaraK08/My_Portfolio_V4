'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { useProfile, Profile } from '@/hooks/use-profile'

interface ProfileContextType {
  profile: Profile | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

interface ProfileProviderProps {
  children: ReactNode
}

export function ProfileProvider({ children }: ProfileProviderProps) {
  const { profile, isLoading, error, refetch } = useProfile()

  return (
    <ProfileContext.Provider value={{ profile, isLoading, error, refetch }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfileContext() {
  const context = useContext(ProfileContext)
  if (context === undefined) {
    throw new Error('useProfileContext must be used within a ProfileProvider')
  }
  return context
}

// Global refresh function that can be called from anywhere
export function refreshProfile() {
  if (typeof window !== 'undefined') {
    // Dispatch a custom event to trigger profile refresh
    window.dispatchEvent(new CustomEvent('refresh-profile'))
  }
}