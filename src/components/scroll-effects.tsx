"use client"

import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  direction?: "up" | "down" | "left" | "right"
  delay?: number
  duration?: number
}

export function ScrollReveal({ 
  children, 
  className = "", 
  direction = "up", 
  delay = 0,
  duration = 0.6 
}: ScrollRevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const directions = {
    up: { y: 50, x: 0 },
    down: { y: -50, x: 0 },
    left: { y: 0, x: 50 },
    right: { y: 0, x: -50 }
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ 
        opacity: 0, 
        ...directions[direction] 
      }}
      animate={isInView ? { 
        opacity: 1, 
        x: 0, 
        y: 0 
      } : {}}
      transition={{ 
        duration, 
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    >
      {children}
    </motion.div>
  )
}

interface ParallaxScrollProps {
  children: React.ReactNode
  offset?: number
  className?: string
}

export function ParallaxScroll({ children, offset = 50, className = "" }: ParallaxScrollProps) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset])

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  )
}

interface HoverGlowProps {
  children: React.ReactNode
  className?: string
  glowColor?: string
}

export function HoverGlow({ children, className = "", glowColor = "rgb(139, 92, 246)" }: HoverGlowProps) {
  return (
    <motion.div
      className={`relative ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <motion.div
        className="absolute inset-0 rounded-lg opacity-0"
        style={{
          background: `radial-gradient(circle, ${glowColor}20 0%, transparent 70%)`,
          filter: "blur(10px)",
        }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  )
}