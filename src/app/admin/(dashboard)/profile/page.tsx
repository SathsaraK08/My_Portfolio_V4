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
import { User, Mail, Phone, MapPin, Globe, Camera, FileText, Github, Linkedin, Twitter, Instagram, Youtube, Loader2, Save, Eye, EyeOff } from "lucide-react"
import { FileUpload, UploadedFile } from "@/components/file-upload"

const profileSchema = z.object({
  fullName: z.string().optional().or(z.literal("")),
  title: z.string().optional().or(z.literal("")),
  bio: z.string().optional().or(z.literal("")),
  avatar: z.string().optional().or(z.literal("")),
  avatarPath: z.string().optional().or(z.literal("")),
  resume: z.string().optional().or(z.literal("")),
  resumePath: z.string().optional().or(z.literal("")),
  location: z.string().optional().or(z.literal("")),
  email: z.string().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  website: z.string().optional().or(z.literal("")),
  linkedIn: z.string().optional().or(z.literal("")),
  github: z.string().optional().or(z.literal("")),
  twitter: z.string().optional().or(z.literal("")),
  instagram: z.string().optional().or(z.literal("")),
  youTube: z.string().optional().or(z.literal("")),
  isVisible: z.boolean().optional()
})

type ProfileFormData = z.infer<typeof profileSchema>

type Profile = ProfileFormData & {
  id: string | null
  createdAt?: string
  updatedAt?: string
  avatarPath?: string | null
  resumePath?: string | null
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
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
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      title: "",
      bio: "",
      avatar: "",
      avatarPath: "",
      resume: "",
      resumePath: "",
      location: "",
      email: "",
      phone: "",
      website: "",
      linkedIn: "",
      github: "",
      twitter: "",
      instagram: "",
      youTube: "",
      isVisible: true
    }
  })

  const watchedValues = watch()

  // Load profile data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch('/api/admin/profile')
        if (response.ok) {
          const profileData = await response.json()
          setProfile(profileData)

          // Convert null values to empty strings for form compatibility
          const sanitizedData = {
            ...profileData,
            fullName: profileData.fullName || "",
            title: profileData.title || "",
            bio: profileData.bio || "",
            avatar: profileData.avatar || "",
            avatarPath: profileData.avatarPath || "",
            resume: profileData.resume || "",
            resumePath: profileData.resumePath || "",
            location: profileData.location || "",
            email: profileData.email || "",
            phone: profileData.phone || "",
            website: profileData.website || "",
            linkedIn: profileData.linkedIn || "",
            github: profileData.github || "",
            twitter: profileData.twitter || "",
            instagram: profileData.instagram || "",
            youTube: profileData.youTube || "",
            isVisible: profileData.isVisible !== undefined ? profileData.isVisible : true
          }

          reset(sanitizedData)
        }
      } catch (error) {
        console.error('Failed to load profile:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [reset])

  const onSubmit = async (data: ProfileFormData) => {
    setIsSaving(true)
    setSaveStatus('idle')

    try {
      const response = await fetch('/api/admin/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to save profile')
      }

      const savedProfile = await response.json()
      setProfile(savedProfile)

      // Convert null values to empty strings for form compatibility
      const sanitizedSavedData = {
        ...savedProfile,
        fullName: savedProfile.fullName || "",
        title: savedProfile.title || "",
        bio: savedProfile.bio || "",
        avatar: savedProfile.avatar || "",
        avatarPath: savedProfile.avatarPath || "",
        resume: savedProfile.resume || "",
        resumePath: savedProfile.resumePath || "",
        location: savedProfile.location || "",
        email: savedProfile.email || "",
        phone: savedProfile.phone || "",
        website: savedProfile.website || "",
        linkedIn: savedProfile.linkedIn || "",
        github: savedProfile.github || "",
        twitter: savedProfile.twitter || "",
        instagram: savedProfile.instagram || "",
        youTube: savedProfile.youTube || "",
        isVisible: savedProfile.isVisible !== undefined ? savedProfile.isVisible : true
      }

      reset(sanitizedSavedData)
      setSaveStatus('success')

      // Refresh the public profile data
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('refresh-profile'))
      }

      // Clear success status after 3 seconds
      setTimeout(() => setSaveStatus('idle'), 3000)
    } catch (error) {
      console.error('Failed to save profile:', error)
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
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Profile & Home Content</h1>
          <p className="text-muted-foreground">
            Manage your personal information and home page content
          </p>
        </div>
        <div className="flex items-center gap-2">
          {watchedValues.isVisible ? (
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <Eye className="h-3 w-3 mr-1" />
              Visible
            </Badge>
          ) : (
            <Badge variant="secondary">
              <EyeOff className="h-3 w-3 mr-1" />
              Hidden
            </Badge>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="contact">Contact & Social</TabsTrigger>
            <TabsTrigger value="assets">Files & Assets</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Basic Information
                </CardTitle>
                <CardDescription>
                  Your basic personal information that appears on the home page
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name *</label>
                    <Input
                      placeholder="John Doe"
                      {...register("fullName")}
                      className={errors.fullName ? "border-red-500" : ""}
                    />
                    {errors.fullName && (
                      <p className="text-sm text-red-500">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Professional Title *</label>
                    <Input
                      placeholder="Full Stack Developer"
                      {...register("title")}
                      className={errors.title ? "border-red-500" : ""}
                    />
                    {errors.title && (
                      <p className="text-sm text-red-500">{errors.title.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Bio *</label>
                  <textarea
                    rows={4}
                    placeholder="Tell visitors about yourself and what you do..."
                    {...register("bio")}
                    className={`flex w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      errors.bio ? "border-red-500" : "border-input"
                    }`}
                  />
                  {errors.bio && (
                    <p className="text-sm text-red-500">{errors.bio.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <Input
                    placeholder="San Francisco, CA"
                    {...register("location")}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    {...register("isVisible")}
                    className="h-4 w-4 rounded border border-input"
                  />
                  <label className="text-sm font-medium">Make profile publicly visible</label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Contact Information
                </CardTitle>
                <CardDescription>
                  How people can reach you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email *</label>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      {...register("email")}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <Input
                      placeholder="+1 (555) 123-4567"
                      {...register("phone")}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Website</label>
                  <Input
                    placeholder="https://yourwebsite.com"
                    {...register("website")}
                    className={errors.website ? "border-red-500" : ""}
                  />
                  {errors.website && (
                    <p className="text-sm text-red-500">{errors.website.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Social Media Links
                </CardTitle>
                <CardDescription>
                  Your social media profiles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </label>
                    <Input
                      placeholder="https://linkedin.com/in/username"
                      {...register("linkedIn")}
                      className={errors.linkedIn ? "border-red-500" : ""}
                    />
                    {errors.linkedIn && (
                      <p className="text-sm text-red-500">{errors.linkedIn.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Github className="h-4 w-4" />
                      GitHub
                    </label>
                    <Input
                      placeholder="https://github.com/username"
                      {...register("github")}
                      className={errors.github ? "border-red-500" : ""}
                    />
                    {errors.github && (
                      <p className="text-sm text-red-500">{errors.github.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Twitter className="h-4 w-4" />
                      Twitter
                    </label>
                    <Input
                      placeholder="https://twitter.com/username"
                      {...register("twitter")}
                      className={errors.twitter ? "border-red-500" : ""}
                    />
                    {errors.twitter && (
                      <p className="text-sm text-red-500">{errors.twitter.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Instagram className="h-4 w-4" />
                      Instagram
                    </label>
                    <Input
                      placeholder="https://instagram.com/username"
                      {...register("instagram")}
                      className={errors.instagram ? "border-red-500" : ""}
                    />
                    {errors.instagram && (
                      <p className="text-sm text-red-500">{errors.instagram.message}</p>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Youtube className="h-4 w-4" />
                      YouTube
                    </label>
                    <Input
                      placeholder="https://youtube.com/@username"
                      {...register("youTube")}
                      className={errors.youTube ? "border-red-500" : ""}
                    />
                    {errors.youTube && (
                      <p className="text-sm text-red-500">{errors.youTube.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assets" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Files & Assets
                </CardTitle>
                <CardDescription>
                  Upload and manage your profile assets
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    Profile Avatar
                  </label>
                  {watch("avatar") ? (
                    <UploadedFile
                      url={watch("avatar")!}
                      path={watch("avatarPath")!}
                      onRemove={() => {
                        setValue("avatar", "", { shouldDirty: true })
                        setValue("avatarPath", "", { shouldDirty: true })
                      }}
                    />
                  ) : (
                    <FileUpload
                      onUpload={(url, path) => {
                        setValue("avatar", url, { shouldDirty: true })
                        setValue("avatarPath", path, { shouldDirty: true })
                      }}
                      maxSize={50}
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Resume
                  </label>
                  {watch("resume") ? (
                    <UploadedFile
                      url={watch("resume")!}
                      path={watch("resumePath")!}
                      onRemove={() => {
                        setValue("resume", "", { shouldDirty: true })
                        setValue("resumePath", "", { shouldDirty: true })
                      }}
                    />
                  ) : (
                    <FileUpload
                      onUpload={(url, path) => {
                        setValue("resume", url, { shouldDirty: true })
                        setValue("resumePath", path, { shouldDirty: true })
                      }}
                      accept=".pdf"
                      maxSize={50}
                    />
                  )}
                </div>

                {/* Preview section */}
                {watchedValues.avatar && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Avatar Preview</label>
                    <div className="w-24 h-24 rounded-full overflow-hidden border border-border">
                      <img
                        src={watchedValues.avatar}
                        alt="Avatar preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

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
            <Button variant="outline" type="button" asChild>
              <a href="/" target="_blank">
                <Eye className="h-4 w-4 mr-2" />
                Preview Live Site
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
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
