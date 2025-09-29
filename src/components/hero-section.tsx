'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Download, Mail, MapPin, Github, Linkedin, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useProfile } from '@/hooks/use-profile'
import Image from 'next/image'
import { useState, useEffect } from 'react'

export function HeroSection() {
  const { profile, isLoading } = useProfile()
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Professional fallback data - only use when profile is loaded and not available
  const displayName = profile?.fullName || 'Sathsara Karunarathne'
  const displayTitle = profile?.title || 'AI / ML Engineer'
  const displayBio = profile?.bio || 'Passionate AI/ML Engineer building intelligent systems that solve real-world problems. Specialized in deep learning, computer vision, and scalable ML infrastructure.'
  const displayLocation = profile?.location || 'Sri Lanka'

  // Always render with fallback data, smooth transitions when data loads

  // Smart image fallback system
  const getDisplayAvatar = () => {
    if (imageError || !profile?.avatar) {
      // Fallback to generated avatar with user's name
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&size=400&background=6366f1&color=ffffff&bold=true&font-size=0.6`
    }
    return profile.avatar
  }

  const displayAvatar = getDisplayAvatar()

  // Timeout fallback for slow loading images
  useEffect(() => {
    if (profile?.avatar && !imageLoaded && !imageError) {
      const timeout = setTimeout(() => {
        setImageError(true)
      }, 5000) // 5 second timeout

      return () => clearTimeout(timeout)
    }
  }, [profile?.avatar, imageLoaded, imageError])


  return (
    <section className="relative min-h-screen flex items-center justify-center py-16 px-4 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />

      <div className="container max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Status Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                Available for new opportunities
              </Badge>
            </motion.div>

            {/* Main Heading */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
              >
                <span className="text-slate-900 dark:text-slate-100">
                  Hi, I'm{' '}
                </span>
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                  {displayName.split(' ')[0]}
                </span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <p className="text-xl md:text-2xl font-semibold text-slate-700 dark:text-slate-300">
                  {displayTitle}
                </p>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <MapPin className="w-4 h-4" />
                  <span>{displayLocation}</span>
                </div>
              </motion.div>
            </div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl"
            >
              {displayBio}
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" asChild>
                <a href="#projects">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Projects
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                  <Download className="w-4 h-4 mr-2" />
                  Download Resume
                </a>
              </Button>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex gap-4 pt-4"
            >
              {(profile?.github || 'https://github.com') && (
                <Button size="icon" variant="ghost" className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800" asChild>
                  <a href={profile?.github || 'https://github.com'} target="_blank" rel="noopener noreferrer">
                    <Github className="w-5 h-5" />
                  </a>
                </Button>
              )}
              {(profile?.linkedIn || 'https://linkedin.com/in/sathsara') && (
                <Button size="icon" variant="ghost" className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800" asChild>
                  <a href={profile?.linkedIn || 'https://linkedin.com/in/sathsara'} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="w-5 h-5" />
                  </a>
                </Button>
              )}
              {(profile?.email || 'sathsara@example.com') && (
                <Button size="icon" variant="ghost" className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800" asChild>
                  <a href={`mailto:${profile?.email || 'sathsara@example.com'}`}>
                    <Mail className="w-5 h-5" />
                  </a>
                </Button>
              )}
            </motion.div>
          </motion.div>

          {/* Right Side - Modern Professional Avatar */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Modern Background Effects */}
              <div className="absolute -inset-8">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-2xl opacity-60 animate-pulse" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-purple-100 to-pink-100 rounded-full blur-3xl opacity-40 animate-pulse delay-1000" />
              </div>

              {/* Main Avatar Container */}
              <motion.div
                whileHover={{ y: -10, rotateY: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative w-80 h-80 lg:w-96 lg:h-96"
              >
                {/* Outer Ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 p-1 animate-spin-slow">
                  <div className="w-full h-full rounded-full bg-white dark:bg-slate-900" />
                </div>

                {/* Middle Ring */}
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 p-3 shadow-2xl">
                  {/* Inner Avatar Circle */}
                  <div className="relative w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 shadow-inner">
                    <img
                      src={displayAvatar}
                      alt={displayName}
                      className="w-full h-full object-cover object-center scale-105 hover:scale-110 transition-transform duration-500"
                      onError={() => {
                        setImageError(true)
                        setImageLoaded(false)
                      }}
                      onLoad={() => {
                        setImageError(false)
                        setImageLoaded(true)
                      }}
                    />

                    {/* Elegant Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/5" />

                    {/* Status Indicator */}
                    <div className="absolute top-6 right-6 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white shadow-lg animate-pulse" />
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0"
                >
                  <div className="absolute top-8 right-2 w-3 h-3 bg-blue-400 rounded-full opacity-60" />
                  <div className="absolute bottom-12 left-4 w-2 h-2 bg-purple-400 rounded-full opacity-60" />
                  <div className="absolute top-1/2 left-2 w-2.5 h-2.5 bg-pink-400 rounded-full opacity-60" />
                </motion.div>

                {/* Modern Badge */}
                <motion.div
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
                  className="absolute -bottom-6 -right-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2 shadow-xl"
                >
                  <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    AI/ML Expert
                  </span>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}