'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Download, Mail, MapPin, Github, Linkedin, ExternalLink, Twitter, Instagram, Youtube, Globe, Facebook } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useProfile } from '@/hooks/use-profile'
import Image from 'next/image'
import { useState, useEffect } from 'react'

const socialPlatforms = [
  { icon: Github, label: 'GitHub', key: 'github', color: 'hover:bg-gray-900 hover:text-white' },
  { icon: Linkedin, label: 'LinkedIn', key: 'linkedIn', color: 'hover:bg-blue-600 hover:text-white' },
  { icon: Twitter, label: 'Twitter', key: 'twitter', color: 'hover:bg-blue-500 hover:text-white' },
  { icon: Instagram, label: 'Instagram', key: 'instagram', color: 'hover:bg-pink-600 hover:text-white' },
  { icon: Youtube, label: 'YouTube', key: 'youtube', color: 'hover:bg-red-600 hover:text-white' },
  { icon: Facebook, label: 'Facebook', key: 'facebook', color: 'hover:bg-blue-700 hover:text-white' },
  { icon: Globe, label: 'Website', key: 'website', color: 'hover:bg-purple-600 hover:text-white' },
]

export function HeroSection() {
  const { profile, isLoading } = useProfile()
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Professional fallback data - only use when profile is loaded and not available
  const displayName = profile?.fullName || 'Sathsara Karunarathne'
  const displayTitle = profile?.title || 'AI / ML Engineer'
  const displayBio = profile?.bio || 'Passionate AI/ML Engineer building intelligent systems that solve real-world problems. Specialized in deep learning, computer vision, and scalable ML infrastructure.'
  const displayLocation = profile?.location || 'Sri Lanka'

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
    <section className="relative min-h-screen py-20 md:py-24 lg:py-32 px-4 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />

      {/* Social Media - Fixed to viewport right edge, vertically centered */}
      <div className="fixed top-1/2 right-2 md:right-4 lg:right-6 transform -translate-y-1/2 z-50">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          className="flex flex-col gap-4"
        >
          {socialPlatforms.map((platform, index) => {
            const socialLink = platform.key === 'github' ? (profile?.github || 'https://github.com')
              : platform.key === 'linkedIn' ? (profile?.linkedIn || 'https://linkedin.com/in/sathsara')
              : platform.key === 'twitter' ? (profile?.twitter || '#')
              : platform.key === 'instagram' ? (profile?.instagram || '#')
              : platform.key === 'youtube' ? (profile?.youtube || '#')
              : platform.key === 'facebook' ? (profile?.facebook || '#')
              : platform.key === 'website' ? (profile?.website || '#')
              : '#'

            if (socialLink === '#') return null

            return (
              <motion.div
                key={platform.key}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1, type: "spring", stiffness: 300 }}
                whileHover={{ scale: 1.1, y: -2 }}
                className="group"
              >
                <Button
                  size="icon"
                  variant="ghost"
                  className={`
                    relative rounded-xl h-12 w-12
                    bg-white/90 dark:bg-slate-800/90
                    border border-slate-200/60 dark:border-slate-700/60
                    shadow-lg hover:shadow-xl
                    backdrop-blur-sm
                    transition-all duration-300 ease-out
                    ${platform.color}
                  `}
                  asChild
                >
                  <a
                    href={socialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={platform.label}
                  >
                    <platform.icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                  </a>
                </Button>
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      <div className="container max-w-7xl mx-auto relative z-10 h-full flex items-center">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center w-full">

          {/* Left Content - Takes 6 columns */}
          <div className="lg:col-span-6 space-y-8">
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
                <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800 text-sm px-4 py-2">
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
                  className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight"
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
                  className="space-y-3"
                >
                  <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-slate-700 dark:text-slate-300">
                    {displayTitle}
                  </p>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-lg">
                    <MapPin className="w-5 h-5" />
                    <span>{displayLocation}</span>
                  </div>
                </motion.div>
              </div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl"
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
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6" asChild>
                  <a href="#projects">
                    <ExternalLink className="w-5 h-5 mr-2" />
                    View Projects
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                  <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                    <Download className="w-5 h-5 mr-2" />
                    Download Resume
                  </a>
                </Button>
              </motion.div>

              {/* Contact Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="pt-4"
              >
                <Button variant="ghost" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 text-lg" asChild>
                  <a href={`mailto:${profile?.email || 'sathsara@example.com'}`} className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Get in touch
                  </a>
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Avatar - Takes 5 columns, positioned more left */}
          <div className="lg:col-span-5 lg:col-start-7 flex justify-center lg:justify-start lg:pl-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                {/* Background Effects */}
                <div className="absolute -inset-16">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-3xl opacity-60 animate-pulse" />
                  <div className="absolute bottom-0 left-0 w-56 h-56 bg-gradient-to-tr from-purple-100 to-pink-100 rounded-full blur-3xl opacity-40 animate-pulse delay-1000" />
                </div>

                {/* Main Avatar Container - Much Larger Size */}
                <motion.div
                  whileHover={{ y: -12, rotateY: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="relative w-80 h-80 md:w-96 md:h-96 lg:w-[26rem] lg:h-[26rem] xl:w-[28rem] xl:h-[28rem]"
                >
                  {/* Outer Ring */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 p-1.5 animate-spin-slow">
                    <div className="w-full h-full rounded-full bg-white dark:bg-slate-900" />
                  </div>

                  {/* Inner Avatar Circle */}
                  <div className="absolute inset-3 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 p-4 shadow-2xl">
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
                      <div className="absolute top-6 right-6 w-5 h-5 bg-emerald-400 rounded-full border-3 border-white shadow-lg animate-pulse" />
                    </div>
                  </div>

                  {/* Floating Elements */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0"
                  >
                    <div className="absolute top-16 right-8 w-5 h-5 bg-blue-400 rounded-full opacity-60" />
                    <div className="absolute bottom-20 left-12 w-4 h-4 bg-purple-400 rounded-full opacity-60" />
                    <div className="absolute top-1/2 left-6 w-4.5 h-4.5 bg-pink-400 rounded-full opacity-60" />
                  </motion.div>

                  {/* Modern Badge */}
                  <motion.div
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
                    className="absolute -bottom-10 -right-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-8 py-4 shadow-xl"
                  >
                    <span className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      AI/ML Expert
                    </span>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}