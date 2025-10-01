/**
 * Admin Services Management Page - Enhanced with Modern UI/UX
 *
 * Main dashboard page for managing services. Features:
 * - List all services with status indicators
 * - Quick toggle for visibility and featured status
 * - Create, edit, and delete operations
 * - Responsive card-based layout with modern hover effects
 * - Search and filtering capabilities
 * - Glassmorphism and micro-interactions (2025 trends)
 *
 * @route /admin/services
 * @access Protected (Admin only)
 * @author Portfolio Admin System
 * @version 3.0.0 - Enhanced UI/UX
 */

'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, Eye, EyeOff, Star, Loader2, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

interface Service {
  id: string
  title: string
  description: string
  shortDesc?: string
  icon?: string
  image?: string
  features: string[]
  category?: string
  featured: boolean
  order: number
  isVisible: boolean
  createdAt: string
  updatedAt: string
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/admin/services')
      if (!response.ok) {
        throw new Error('Failed to fetch services')
      }
      const data = await response.json()
      setServices(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load services')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/services/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete service')
      }

      setServices(services.filter(service => service.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete service')
    }
  }

  const toggleVisibility = async (id: string, isVisible: boolean) => {
    try {
      const service = services.find(s => s.id === id)
      if (!service) return

      const response = await fetch(`/api/admin/services/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...service,
          isVisible: !isVisible,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update service')
      }

      const updatedService = await response.json()
      setServices(services.map(s => s.id === id ? updatedService : s))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update service')
    }
  }

  const toggleFeatured = async (id: string, featured: boolean) => {
    try {
      const service = services.find(s => s.id === id)
      if (!service) return

      const response = await fetch(`/api/admin/services/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...service,
          featured: !featured,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update service')
      }

      const updatedService = await response.json()
      setServices(services.map(s => s.id === id ? updatedService : s))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update service')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          <p className="text-lg text-muted-foreground">Loading services...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header with Modern Gradient */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
            Services Management
          </h1>
          <p className="text-muted-foreground mt-2">Manage the "What I Do" section services</p>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link href="/admin/services/new">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 relative overflow-hidden group">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
              />
              <Plus className="w-4 h-4 mr-2 relative z-10" />
              <span className="relative z-10">Add Service</span>
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Error Alert with Animation */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Services Grid with Modern Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card
                className={`group relative border border-border/60 bg-gradient-to-br from-background via-background to-background/50 backdrop-blur-sm hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-400/10 transition-all duration-500 hover:border-blue-500/30 overflow-hidden ${
                  !service.isVisible ? 'opacity-60' : ''
                }`}
              >
                {/* Animated Background Gradient on Hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={false}
                />

                {/* Shimmer Effect */}
                <motion.div
                  className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  initial={false}
                />

                <CardHeader className="pb-3 relative z-10">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {service.icon && (
                        <motion.div
                          className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:shadow-blue-500/20 transition-all duration-300"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <span className="text-2xl">{service.icon}</span>
                        </motion.div>
                      )}
                      <div>
                        <CardTitle className="text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                          {service.title}
                        </CardTitle>
                        {service.category && (
                          <Badge variant="outline" className="w-fit mt-1 text-xs">
                            {service.category}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {service.featured && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          whileHover={{ scale: 1.1, rotate: 10 }}
                        >
                          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-md">
                            <Star className="w-3 h-3 mr-1 fill-current" />
                            Featured
                          </Badge>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 relative z-10">
                  <p className="text-sm text-muted-foreground line-clamp-3 group-hover:text-foreground transition-colors duration-300">
                    {service.shortDesc || service.description}
                  </p>

                  {service.features.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Sparkles className="h-3 w-3 text-blue-600" />
                        Features:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {service.features.slice(0, 3).map((feature, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          >
                            <Badge variant="secondary" className="text-xs hover:bg-blue-100 dark:hover:bg-blue-950/30 transition-colors duration-200">
                              {feature}
                            </Badge>
                          </motion.div>
                        ))}
                        {service.features.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{service.features.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <div className="flex items-center gap-1">
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleVisibility(service.id, service.isVisible)}
                          className="hover:bg-blue-100 dark:hover:bg-blue-950/30 transition-colors duration-200"
                        >
                          {service.isVisible ? (
                            <Eye className="w-4 h-4 text-green-600" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-gray-400" />
                          )}
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFeatured(service.id, service.featured)}
                          className="hover:bg-yellow-100 dark:hover:bg-yellow-950/30 transition-colors duration-200"
                        >
                          <Star className={`w-4 h-4 ${service.featured ? 'fill-current text-yellow-500' : 'text-gray-400'} transition-colors duration-200`} />
                        </Button>
                      </motion.div>
                    </div>
                    <div className="flex gap-2">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link href={`/admin/services/${service.id}`}>
                          <Button variant="outline" size="sm" className="hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(service.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 hover:border-red-500/50 transition-all duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State with Animation */}
      {services.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="mb-6"
          >
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
              <Plus className="w-12 h-12 text-blue-600" />
            </div>
          </motion.div>
          <h3 className="text-xl font-semibold mb-2">No services found</h3>
          <p className="text-muted-foreground mb-6">Start by creating your first service</p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/admin/services/new">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Service
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
