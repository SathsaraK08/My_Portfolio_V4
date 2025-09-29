'use client'

import { Button as BaseButton } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { ReactNode } from "react"

interface ModernButtonProps {
  children: ReactNode
  variant?: 'gradient' | 'gradient-2' | 'gradient-3' | 'gradient-4' | 'glass' | 'outline-gradient'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  onClick?: () => void
  href?: string
  target?: string
  rel?: string
  disabled?: boolean
  asChild?: boolean
}

const gradients = {
  gradient: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500',
  'gradient-2': 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-cyan-500 hover:to-blue-500',
  'gradient-3': 'bg-gradient-to-r from-green-400 to-blue-500 hover:from-blue-500 hover:to-green-400',
  'gradient-4': 'bg-gradient-to-r from-pink-400 to-red-500 hover:from-red-500 hover:to-pink-400',
  glass: 'bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20',
  'outline-gradient': 'bg-transparent border-2 border-transparent bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-border hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500'
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
  xl: 'px-10 py-5 text-xl'
}

export function ModernButton({ 
  children, 
  variant = 'gradient', 
  size = 'md',
  className,
  onClick,
  href,
  target,
  rel,
  disabled,
  asChild,
  ...props 
}: ModernButtonProps) {
  const Component = href ? motion.a : motion.button
  
  return (
    <Component
      href={href}
      target={target}
      rel={rel}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ 
        scale: 1.05,
        y: -2
      }}
      whileTap={{ 
        scale: 0.95 
      }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 17 
      }}
      className={cn(
        // Base styles
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold",
        "transition-all duration-300 ease-out",
        "transform hover:shadow-lg active:scale-95",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
        // Size
        sizes[size],
        // Variant
        gradients[variant],
        // Text color
        variant === 'outline-gradient' ? 'text-transparent bg-clip-text' : 'text-white',
        // Custom className
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

// Specialized button components
export function GradientButton(props: Omit<ModernButtonProps, 'variant'>) {
  return <ModernButton variant="gradient" {...props} />
}

export function GlassButton(props: Omit<ModernButtonProps, 'variant'>) {
  return <ModernButton variant="glass" {...props} />
}

export function OutlineGradientButton(props: Omit<ModernButtonProps, 'variant'>) {
  return <ModernButton variant="outline-gradient" {...props} />
}