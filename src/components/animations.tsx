'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface AnimationProps {
  children: ReactNode
  className?: string
  delay?: number
}

// Fade in animation
export const FadeIn = ({ children, className = '', delay = 0 }: AnimationProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    className={className}
  >
    {children}
  </motion.div>
)

// Slide in from left
export const SlideInLeft = ({ children, className = '', delay = 0 }: AnimationProps) => (
  <motion.div
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, delay }}
    className={className}
  >
    {children}
  </motion.div>
)

// Slide in from right
export const SlideInRight = ({ children, className = '', delay = 0 }: AnimationProps) => (
  <motion.div
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, delay }}
    className={className}
  >
    {children}
  </motion.div>
)

// Scale animation
export const ScaleIn = ({ children, className = '', delay = 0 }: AnimationProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, delay }}
    className={className}
  >
    {children}
  </motion.div>
)

// Stagger children animation
export const StaggerContainer = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1
        }
      }
    }}
    className={className}
  >
    {children}
  </motion.div>
)

export const StaggerItem = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    }}
    transition={{ duration: 0.5 }}
    className={className}
  >
    {children}
  </motion.div>
)

// Hover animations
export const HoverScale = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    transition={{ duration: 0.2 }}
    className={className}
  >
    {children}
  </motion.div>
)

// Page transition wrapper
export const PageTransition = ({ children }: { children: ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.5 }}
  >
    {children}
  </motion.div>
)

// Floating animation
export const FloatingAnimation = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <motion.div
    animate={{
      y: [0, -10, 0],
    }}
    transition={{
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    className={className}
  >
    {children}
  </motion.div>
)

// Progress bar animation
export const ProgressBar = ({ 
  progress, 
  className = '',
  delay = 0 
}: { 
  progress: number; 
  className?: string;
  delay?: number;
}) => (
  <motion.div
    initial={{ width: 0 }}
    animate={{ width: `${progress}%` }}
    transition={{ duration: 1, delay, ease: "easeOut" }}
    className={className}
  />
)