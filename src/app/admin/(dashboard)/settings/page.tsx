"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Globe, Palette, Share2, Mail, Phone, MapPin, Loader2, Save, Eye, Upload, FileImage } from "lucide-react"
import { FileUpload, UploadedFile } from "@/components/file-upload"

const settingsSchema = z.object({
  siteName: z.string().min(1, "Site name is required"),
  siteDescription: z.string().optional(),
  logo: z.string().optional(),
  logoPath: z.string().optional(),
  favicon: z.string().optional(),
  faviconPath: z.string().optional(),
  colors: z.object({
    primary: z.string().optional(),
    secondary: z.string().optional()
  }).optional(),
  social: z.object({
    github: z.string().optional(),
    linkedin: z.string().optional(),
    twitter: z.string().optional(),
    email: z.string().optional()
  }).optional(),
  contact: z.object({
    email: z.string().email("Invalid email").optional(),
    phone: z.string().optional()
  }).optional(),
  maintenance: z.boolean().optional()
})

type SettingsFormData = z.infer<typeof settingsSchema>

interface SiteSettings extends SettingsFormData {
  id: string
  createdAt?: string
  updatedAt?: string
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
    setValue
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      siteName: "",
      siteDescription: "",
      logo: "",
      logoPath: "",
      favicon: "",
      faviconPath: "",
      colors: {
        primary: "#3b82f6",
        secondary: "#64748b"
      },
      social: {
        github: "",
        linkedin: "",
        twitter: "",
        email: ""
      },
      contact: {
        email: "",
        phone: ""
      },
      maintenance: false
    }
  })

  const watchedValues = watch()

  // Load settings data
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/admin/site-settings')
        if (response.ok) {
          const settingsData = await response.json()
          setSettings(settingsData)
          reset(settingsData)
        }
      } catch (error) {
        console.error('Failed to load settings:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSettings()
  }, [reset])

  const onSubmit = async (data: SettingsFormData) => {
    setIsSaving(true)
    setSaveStatus('idle')

    try {
      const response = await fetch('/api/admin/site-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to save settings')
      }

      const savedSettings = await response.json()
      setSettings(savedSettings)
      reset(savedSettings)
      setSaveStatus('success')

      // Clear success status after 3 seconds
      setTimeout(() => setSaveStatus('idle'), 3000)
    } catch (error) {
      console.error('Failed to save settings:', error)
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
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Site Settings</h1>
          <p className="text-muted-foreground">
            Configure your website's appearance and functionality
          </p>
        </div>
        <div className="flex items-center gap-2">
          {watchedValues.maintenance ? (
            <Badge variant="destructive">
              <Settings className="h-3 w-3 mr-1" />
              Maintenance Mode
            </Badge>
          ) : (
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <Eye className="h-3 w-3 mr-1" />
              Live
            </Badge>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="social">Social & Contact</TabsTrigger>
            <TabsTrigger value="footer">Footer Content</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  General Settings
                </CardTitle>
                <CardDescription>
                  Basic information about your website
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Site Name *</label>
                    <Input
                      placeholder="Portfolio"
                      {...register("siteName")}
                      className={errors.siteName ? "border-red-500" : ""}
                    />
                    {errors.siteName && (
                      <p className="text-sm text-red-500">{errors.siteName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Site Description</label>
                    <Input
                      placeholder="Building amazing web experiences..."
                      {...register("siteDescription")}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    {...register("maintenance")}
                    className="h-4 w-4 rounded border border-input"
                  />
                  <label className="text-sm font-medium">Enable maintenance mode</label>
                  <Badge variant="outline" className="text-xs">
                    This will show a maintenance page to visitors
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="branding" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileImage className="h-5 w-5" />
                  Branding Assets
                </CardTitle>
                <CardDescription>
                  Upload your logo and favicon
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="text-sm font-medium">Site Logo</label>
                    {watch("logo") ? (
                      <UploadedFile
                        url={watch("logo")!}
                        path={watch("logoPath")!}
                        onRemove={() => {
                          setValue("logo", "", { shouldDirty: true })
                          setValue("logoPath", "", { shouldDirty: true })
                        }}
                      />
                    ) : (
                      <FileUpload
                        onUpload={(url, path) => {
                          setValue("logo", url, { shouldDirty: true })
                          setValue("logoPath", path, { shouldDirty: true })
                        }}
                        accept="image/*"
                        maxSize={50}
                      />
                    )}
                    <p className="text-xs text-muted-foreground">
                      Recommended: PNG or SVG, max 50MB
                    </p>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-medium">Favicon</label>
                    {watch("favicon") ? (
                      <UploadedFile
                        url={watch("favicon")!}
                        path={watch("faviconPath")!}
                        onRemove={() => {
                          setValue("favicon", "", { shouldDirty: true })
                          setValue("faviconPath", "", { shouldDirty: true })
                        }}
                      />
                    ) : (
                      <FileUpload
                        onUpload={(url, path) => {
                          setValue("favicon", url, { shouldDirty: true })
                          setValue("faviconPath", path, { shouldDirty: true })
                        }}
                        accept="image/*"
                        maxSize={50}
                      />
                    )}
                    <p className="text-xs text-muted-foreground">
                      Recommended: ICO or PNG, 32x32px, max 50MB
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-medium">Brand Colors</label>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground">Primary Color</label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          {...register("colors.primary")}
                          className="w-16 h-10 p-1 border-2"
                        />
                        <Input
                          placeholder="#3b82f6"
                          {...register("colors.primary")}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground">Secondary Color</label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          {...register("colors.secondary")}
                          className="w-16 h-10 p-1 border-2"
                        />
                        <Input
                          placeholder="#64748b"
                          {...register("colors.secondary")}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  Social Media Links
                </CardTitle>
                <CardDescription>
                  Configure your social media profiles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">GitHub URL</label>
                    <Input
                      placeholder="https://github.com/username"
                      {...register("social.github")}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">LinkedIn URL</label>
                    <Input
                      placeholder="https://linkedin.com/in/username"
                      {...register("social.linkedin")}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Twitter URL</label>
                    <Input
                      placeholder="https://twitter.com/username"
                      {...register("social.twitter")}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      placeholder="contact@example.com"
                      {...register("social.email")}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Contact Information
                </CardTitle>
                <CardDescription>
                  Business contact details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Contact Email</label>
                    <Input
                      type="email"
                      placeholder="hello@example.com"
                      {...register("contact.email")}
                      className={errors.contact?.email ? "border-red-500" : ""}
                    />
                    {errors.contact?.email && (
                      <p className="text-sm text-red-500">{errors.contact.email.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone Number</label>
                    <Input
                      placeholder="+1 (555) 123-4567"
                      {...register("contact.phone")}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="footer" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Footer Content</CardTitle>
                <CardDescription>
                  Manage the content displayed in your website footer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Footer Preview</h4>
                    <div className="text-sm space-y-2">
                      <p><strong>Brand:</strong> {watchedValues.siteName || "Portfolio"}</p>
                      <p><strong>Description:</strong> {watchedValues.siteDescription || "Building amazing web experiences with modern technologies."}</p>
                      <div className="flex gap-4 mt-2">
                        {watchedValues.social?.github && <span>GitHub</span>}
                        {watchedValues.social?.linkedin && <span>LinkedIn</span>}
                        {watchedValues.social?.twitter && <span>Twitter</span>}
                        {watchedValues.social?.email && <span>Email</span>}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    The footer automatically uses your site name, description, and social links configured above.
                    Navigation links are automatically generated from your site structure.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex items-center justify-between border-t pt-6">
          <div className="flex items-center gap-2">
            {saveStatus === 'success' && (
              <Badge className="bg-green-100 text-green-800 border-green-200">
                Settings saved successfully
              </Badge>
            )}
            {saveStatus === 'error' && (
              <Badge variant="destructive">
                Failed to save settings
              </Badge>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <a href="/" target="_blank">
                <Eye className="h-4 w-4 mr-2" />
                Preview Site
              </a>
            </Button>
            <Button
              type="submit"
              disabled={isSaving || !isDirty}
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
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}