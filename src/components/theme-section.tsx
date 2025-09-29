/**
 * Theme Section Component
 *
 * Reusable section component that applies consistent theme styling
 * across all pages to ensure design consistency.
 *
 * @author Portfolio System
 * @version 1.0.0
 */

import { cn } from '@/lib/utils'

interface ThemeSectionProps {
  children: React.ReactNode
  className?: string
  hasDecorations?: boolean
  decorationVariant?: 'default' | 'minimal' | 'full'
}

export function ThemeSection({
  children,
  className,
  hasDecorations = true,
  decorationVariant = 'default'
}: ThemeSectionProps) {
  return (
    <section className={cn(
      "relative overflow-hidden py-12 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/30 dark:to-purple-950/30",
      className
    )}>
      {hasDecorations && (
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-1/4 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          {decorationVariant === 'full' && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl" />
          )}
        </div>
      )}
      <div className="relative z-10">
        {children}
      </div>
    </section>
  )
}

/**
 * Themed Container Component
 *
 * Container with consistent spacing and z-index positioning
 */
interface ThemedContainerProps {
  children: React.ReactNode
  className?: string
}

export function ThemedContainer({ children, className }: ThemedContainerProps) {
  return (
    <div className={cn("container mx-auto px-4", className)}>
      {children}
    </div>
  )
}

/**
 * Themed Page Wrapper
 *
 * Full page wrapper with consistent background
 */
interface ThemedPageProps {
  children: React.ReactNode
  className?: string
}

export function ThemedPage({ children, className }: ThemedPageProps) {
  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/30 dark:to-purple-950/30",
      className
    )}>
      {children}
    </div>
  )
}