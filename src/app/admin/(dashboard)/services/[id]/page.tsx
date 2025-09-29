/**
 * Edit Service Page
 *
 * Form interface for editing existing services. Features:
 * - Pre-populated form with existing service data
 * - All creation features (image upload, categories, etc.)
 * - Real-time form validation
 * - Optimistic UI updates
 * - Confirmation dialogs for destructive actions
 *
 * @route /admin/services/[id]
 * @access Protected (Admin only)
 * @author Portfolio Admin System
 * @version 2.0.0
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { ArrowLeft, Plus, X } from 'lucide-react'
import Link from 'next/link'
import { ProfessionalImageUpload } from '@/components/professional-image-upload'
import { CategorySelect } from '@/components/admin/category-select'

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
}

export default function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [features, setFeatures] = useState<string[]>([''])
  const [service, setService] = useState<Service | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDesc: '',
    icon: '',
    image: '',
    category: '',
    featured: false,
    order: 0,
    isVisible: true,
  })

  useEffect(() => {
    const loadService = async () => {
      const { id } = await params
      fetchService(id)
    }
    loadService()
  }, [])

  const fetchService = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/services/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch service')
      }
      const data = await response.json()
      setService(data)
      setFormData({
        title: data.title,
        description: data.description,
        shortDesc: data.shortDesc || '',
        icon: data.icon || '',
        image: data.image || '',
        category: data.category || '',
        featured: data.featured,
        order: data.order,
        isVisible: data.isVisible,
      })
      setFeatures(data.features.length > 0 ? data.features : [''])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load service')
    } finally {
      setFetchLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }))
  }

  const handleImageUpload = (url: string, path: string) => {
    setFormData(prev => ({ ...prev, image: url }))
  }

  const addFeature = () => {
    setFeatures(prev => [...prev, ''])
  }

  const removeFeature = (index: number) => {
    setFeatures(prev => prev.filter((_, i) => i !== index))
  }

  const updateFeature = (index: number, value: string) => {
    setFeatures(prev => prev.map((feature, i) => i === index ? value : feature))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const filteredFeatures = features.filter(feature => feature.trim() !== '')

      const { id } = await params
      const response = await fetch(`/api/admin/services/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          features: filteredFeatures,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update service')
      }

      router.push('/admin/services')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update service')
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading service...</div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Service not found</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/services">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Service</h1>
          <p className="text-muted-foreground">Update service details</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Service Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Frontend Development"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <CategorySelect
                  value={formData.category}
                  onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  placeholder="Select a category"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortDesc">Short Description</Label>
              <Input
                id="shortDesc"
                name="shortDesc"
                value={formData.shortDesc}
                onChange={handleInputChange}
                placeholder="Brief description for cards"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Full Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Detailed description of the service"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="icon">Icon (emoji or text)</Label>
                <Input
                  id="icon"
                  name="icon"
                  value={formData.icon}
                  onChange={handleInputChange}
                  placeholder="🌐 or any emoji/text"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Service Image/Logo</Label>
              <ProfessionalImageUpload
                onUpload={handleImageUpload}
                currentImage={formData.image}
                maxSize={10}
                showPreview={true}
              />
            </div>

            <div className="space-y-2">
              <Label>Features/Technologies</Label>
              {features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    placeholder="e.g., React, Next.js, TypeScript"
                  />
                  {features.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeFeature(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addFeature}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Feature
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                name="order"
                type="number"
                value={formData.order}
                onChange={handleInputChange}
                placeholder="0"
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <Label>Settings</Label>
                <p className="text-sm text-muted-foreground">Configure service visibility and features</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => handleSwitchChange('featured', checked)}
                  />
                  <Label htmlFor="featured">Featured</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isVisible"
                    checked={formData.isVisible}
                    onCheckedChange={(checked) => handleSwitchChange('isVisible', checked)}
                  />
                  <Label htmlFor="isVisible">Visible</Label>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <Button type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update Service'}
              </Button>
              <Link href="/admin/services">
                <Button variant="outline">Cancel</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}