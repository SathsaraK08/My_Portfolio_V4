"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Home, Save, Eye, EyeOff, Loader2 } from "lucide-react"

interface Section {
  id?: string
  name: string
  type: string
  title?: string
  subtitle?: string
  content?: any
  isVisible?: boolean
  order?: number
}

interface HomeContent {
  id: string
  name: string
  title: string
  sections: Section[]
}

export default function HomeContentPage() {
  const [homeContent, setHomeContent] = useState<HomeContent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [sections, setSections] = useState<Section[]>([])

  // Load home content
  useEffect(() => {
    const loadHomeContent = async () => {
      try {
        const response = await fetch('/api/admin/home-content')
        if (response.ok) {
          const content = await response.json()
          setHomeContent(content)
          setSections(content.sections || [])
        }
      } catch (error) {
        console.error('Failed to load home content:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadHomeContent()
  }, [])

  const updateSection = (index: number, field: string, value: any) => {
    const updatedSections = [...sections]
    updatedSections[index] = {
      ...updatedSections[index],
      [field]: value
    }
    setSections(updatedSections)
  }

  const updateSectionContent = (index: number, field: string, value: string) => {
    const updatedSections = [...sections]
    updatedSections[index] = {
      ...updatedSections[index],
      content: {
        ...updatedSections[index].content,
        [field]: value
      }
    }
    setSections(updatedSections)
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveStatus('idle')

    try {
      const response = await fetch('/api/admin/home-content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sections }),
      })

      if (!response.ok) {
        throw new Error('Failed to save home content')
      }

      const savedContent = await response.json()
      setHomeContent(savedContent)
      setSections(savedContent.sections || [])
      setSaveStatus('success')

      // Clear success status after 3 seconds
      setTimeout(() => setSaveStatus('idle'), 3000)
    } catch (error) {
      console.error('Failed to save home content:', error)
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading home content...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Home Page Content</h1>
          <p className="text-muted-foreground">
            Manage the content displayed on your home page
          </p>
        </div>
        <div className="flex items-center gap-2">
          {saveStatus === 'success' && (
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <Eye className="h-3 w-3 mr-1" />
              Changes saved
            </Badge>
          )}
          {saveStatus === 'error' && (
            <Badge variant="destructive">
              <EyeOff className="h-3 w-3 mr-1" />
              Save failed
            </Badge>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {sections.map((section, index) => (
          <Card key={section.name}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                {section.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </CardTitle>
              <CardDescription>
                Section: {section.type}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={section.title || ''}
                    onChange={(e) => updateSection(index, 'title', e.target.value)}
                    placeholder="Section title"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Subtitle</label>
                  <Input
                    value={section.subtitle || ''}
                    onChange={(e) => updateSection(index, 'subtitle', e.target.value)}
                    placeholder="Section subtitle"
                  />
                </div>
              </div>

              {/* Specific content fields based on section type */}
              {section.content && (
                <div className="space-y-4">
                  {section.content.description && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Description</label>
                      <Input
                        value={section.content.description || ''}
                        onChange={(e) => updateSectionContent(index, 'description', e.target.value)}
                        placeholder="Section description"
                      />
                    </div>
                  )}

                  {section.content.primaryButton && (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Primary Button Text</label>
                        <Input
                          value={section.content.primaryButton || ''}
                          onChange={(e) => updateSectionContent(index, 'primaryButton', e.target.value)}
                          placeholder="Primary button text"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Secondary Button Text</label>
                        <Input
                          value={section.content.secondaryButton || ''}
                          onChange={(e) => updateSectionContent(index, 'secondaryButton', e.target.value)}
                          placeholder="Secondary button text"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={section.isVisible !== false}
                  onChange={(e) => updateSection(index, 'isVisible', e.target.checked)}
                  className="h-4 w-4 rounded border border-input"
                />
                <label className="text-sm font-medium">Section visible</label>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-between border-t pt-6">
        <div className="flex items-center gap-2">
          {saveStatus === 'success' && (
            <Badge className="bg-green-100 text-green-800 border-green-200">
              Changes saved successfully
            </Badge>
          )}
          {saveStatus === 'error' && (
            <Badge variant="destructive">
              Failed to save changes
            </Badge>
          )}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <a href="/" target="_blank">
              <Eye className="h-4 w-4 mr-2" />
              Preview Home Page
            </a>
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="min-w-[120px]"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}