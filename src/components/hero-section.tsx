'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Download, Mail, MapPin, Github, Linkedin, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useProfile } from '@/hooks/use-profile'
import Image from 'next/image'

export function HeroSection() {
  const { profile, isLoading } = useProfile()

  // Professional fallback data
  const displayName = profile?.fullName || 'Sathsara Karunarathne'
  const displayTitle = profile?.title || 'AI / ML Engineer'
  const displayBio = profile?.bio || 'Passionate AI/ML Engineer building intelligent systems that solve real-world problems. Specialized in deep learning, computer vision, and scalable ML infrastructure.'
  const displayLocation = profile?.location || 'Sri Lanka'
  const displayAvatar = profile?.avatar || 'https://cowyzhxivrfixizgdugw.supabase.co/storage/v1/object/public/media/uploads/06729a38-2f99-47d1-9b0d-ec51743fc187-35A4424.JPG.JPG'

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
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Projects
              </Button>
              <Button size="lg" variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download Resume
              </Button>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex gap-4 pt-4"
            >
              <Button size="icon" variant="ghost" className="rounded-full">
                <Github className="w-5 h-5" />
              </Button>
              <Button size="icon" variant="ghost" className="rounded-full">
                <Linkedin className="w-5 h-5" />
              </Button>
              <Button size="icon" variant="ghost" className="rounded-full">
                <Mail className="w-5 h-5" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Side - Professional Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Main Image Container - Professional and Clean */}
              <div className="relative w-80 h-80 lg:w-96 lg:h-96">
                {/* Subtle background glow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-purple-600/10 rounded-full blur-2xl" />

                {/* Professional frame */}
                <div className="relative bg-white dark:bg-slate-800 rounded-full p-3 shadow-2xl border border-slate-200/50 dark:border-slate-700/50">
                  <div className="relative w-full h-full rounded-full overflow-hidden">
                    <Image
                      src={displayAvatar}
                      alt={displayName}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 320px, 384px"
                      priority
                    />
                    {/* Professional overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
                  </div>
                </div>
              </div>

              {/* Static Professional Elements */}
              <div className="absolute -top-3 -right-3 bg-white dark:bg-slate-800 rounded-xl p-2 shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="text-lg">🤖</div>
              </div>

              <div className="absolute -bottom-3 -left-3 bg-white dark:bg-slate-800 rounded-xl p-2 shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="text-lg">⚡</div>
              </div>

              <div className="absolute top-1/2 -left-6 bg-white dark:bg-slate-800 rounded-xl p-2 shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="text-lg">🎯</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}