'use client'

import { Card as BaseCard } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { ReactNode } from "react"

interface ModernCardProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'gradient' | 'glass' | 'elevated'
  hover?: 'scale' | 'lift' | 'glow'
}

const variants = {
  default: 'bg-card border border-border',
  gradient: 'bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-0 shadow-lg',
  glass: 'bg-white/10 backdrop-blur-md border border-white/20 shadow-xl',
  elevated: 'bg-card border-0 shadow-2xl'
}

const hoverEffects = {
  scale: 'hover:scale-105',
  lift: 'hover:-translate-y-2',
  glow: 'hover:shadow-2xl hover:shadow-purple-500/25'
}

export function ModernCard({ 
  children, 
  className, 
  variant = 'default',
  hover = 'scale'
}: ModernCardProps) {
  return (
    <motion.div
      whileHover={{ 
        scale: hover === 'scale' ? 1.02 : 1,
        y: hover === 'lift' ? -8 : 0,
      }}
      transition={{ duration: 0.2 }}
      className={cn(
        "rounded-xl transition-all duration-300",
        variants[variant],
        hoverEffects[hover],
        className
      )}
    >
      {children}
    </motion.div>
  )
}