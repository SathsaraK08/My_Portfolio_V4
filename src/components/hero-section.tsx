'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Download, Mail, MapPin, Sparkles } from 'lucide-react'
import { ModernButton } from './modern-button'
import { SlideInLeft, SlideInRight, FloatingAnimation } from './animations'
import { useProfile } from '@/hooks/use-profile'

export function HeroSection() {
  const { profile, isLoading } = useProfile()

  // Show loading state or fallback to actual user data
  const displayName = profile?.fullName || 'Sathsara Karunarathne'
  const displayTitle = profile?.title || 'Ai / ML Engineer'
  const displayBio = profile?.bio || 'Full Stack Developer passionate about creating exceptional digital experiences.'
  const displayLocation = profile?.location || 'Sri Lanka'
  const displayAvatar = profile?.avatar || 'https://cowyzhxivrfixizgdugw.supabase.co/storage/v1/object/public/media/uploads/06729a38-2f99-47d1-9b0d-ec51743fc187-35A4424.JPG.JPG'

  // Get initials for avatar fallback
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase()
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      </div>

      <div className="container relative z-10 px-4 mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <SlideInLeft className="space-y-8">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full border border-purple-200"
              >
                <Sparkles className="w-4 h-4 text-purple-500 mr-2" />
                <span className="text-sm font-medium text-purple-700">Available for hire</span>
              </motion.div>
              
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                <span className="block text-gray-800 dark:text-white">Hi, I'm</span>
                <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                  {displayName}
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed">
                {displayBio}
              </p>

              <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>{displayLocation}</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Available for work</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <ModernButton variant="gradient" size="lg" href="/projects">
                View My Work <ArrowRight className="w-5 h-5" />
              </ModernButton>
              <ModernButton variant="glass" size="lg" href="/contact">
                <Mail className="w-5 h-5" /> Get In Touch
              </ModernButton>
            </div>
          </SlideInLeft>
          
          {/* Right side - Modern hero image */}
          <SlideInRight className="relative">
            <FloatingAnimation>
              <div className="relative">
                {/* Animated background elements */}
                <div className="absolute inset-0 animate-pulse">
                  <div className="absolute top-4 left-4 w-20 h-20 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full animate-blob"></div>
                  <div className="absolute bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 rounded-full animate-blob animation-delay-2000"></div>
                  <div className="absolute top-1/2 right-4 w-12 h-12 bg-gradient-to-br from-green-400/30 to-emerald-400/30 rounded-full animate-blob animation-delay-4000"></div>
                </div>
                
                {/* Modern geometric frame */}
                <div className="relative p-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-3xl">
                  <div className="bg-white dark:bg-gray-900 p-3 rounded-3xl">
                    <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl overflow-hidden">
                      {/* Glass morphism overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent backdrop-blur-sm"></div>
                      
                      {/* Content */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center space-y-4">
                          <div className="w-32 h-32 mx-auto relative">
                            {/* Clean professional border */}
                            <div className="w-full h-full rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl relative">
                              <img
                                src={displayAvatar}
                                alt={displayName}
                                className="w-full h-full object-cover object-center"
                                style={{
                                  objectFit: 'cover',
                                  objectPosition: 'center center'
                                }}
                                onError={(e) => {
                                  console.log('Image failed to load:', displayAvatar)
                                  const target = e.target as HTMLImageElement
                                  target.style.display = 'none'
                                  target.nextElementSibling?.classList.remove('hidden')
                                }}
                              />
                              {/* Fallback with initials */}
                              <div className="hidden absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                <span className="text-2xl font-bold text-white">{initials}</span>
                              </div>
                            </div>

                            {/* Simple status indicator */}
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-3 border-white dark:border-gray-800 rounded-full"></div>
                          </div>
                          <div className="space-y-1">
                            <p className="text-lg font-semibold text-gray-800 dark:text-white">{displayName}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{displayTitle}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Floating elements */}
                      <div className="absolute top-4 right-4 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                      <div className="absolute bottom-6 left-6 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      
                      {/* Tech icons floating around */}
                      <div className="absolute top-8 left-8 text-2xl animate-bounce">⚛️</div>
                      <div className="absolute bottom-8 right-8 text-xl animate-pulse">🐍</div>
                      <div className="absolute top-1/3 left-4 text-lg animate-ping">⚡</div>
                    </div>
                  </div>
                </div>
                
                {/* Floating status badges */}
                <motion.div
                  className="absolute -top-4 -right-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg"
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Available
                </motion.div>
                
                <motion.div
                  className="absolute -bottom-4 -left-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg"
                  animate={{ y: [5, -5, 5] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  5+ Years
                </motion.div>
              </div>
            </FloatingAnimation>
          </SlideInRight>
        </div>
      </div>
    </section>
  )
}