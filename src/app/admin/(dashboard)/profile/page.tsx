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
import { User, Mail, Phone, MapPin, Globe, Camera, FileText, Github, Linkedin, Twitter, Instagram, Youtube, Loader2, Save, Eye, EyeOff, Sparkles } from "lucide-react"
import { FileUpload, UploadedFile } from "@/components/file-upload"
import { motion, AnimatePresence } from "framer-motion"

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
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
          <p className="text-lg text-muted-foreground">Loading profile...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Animation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
            Profile & Home Content
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your personal information and home page content
          </p>
        </div>
        <div className="flex items-center gap-2">
          <AnimatePresence mode="wait">
            {watchedValues.isVisible ? (
              <motion.div
                key="visible"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                whileHover={{ scale: 1.05 }}
              >
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-md">
                  <Eye className="h-3 w-3 mr-1" />
                  Visible
                </Badge>
              </motion.div>
            ) : (
              <motion.div
                key="hidden"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                whileHover={{ scale: 1.05 }}
              >
                <Badge variant="secondary" className="shadow-sm">
                  <EyeOff className="h-3 w-3 mr-1" />
                  Hidden
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="basic" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-950 p-1 rounded-xl shadow-md">
              <TabsTrigger
                value="basic"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/30 transition-all duration-300 rounded-lg"
              >
                <motion.span whileHover={{ scale: 1.05 }} className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Basic Info
                </motion.span>
              </TabsTrigger>
              <TabsTrigger
                value="contact"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/30 transition-all duration-300 rounded-lg"
              >
                <motion.span whileHover={{ scale: 1.05 }} className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Contact & Social
                </motion.span>
              </TabsTrigger>
              <TabsTrigger
                value="assets"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/30 transition-all duration-300 rounded-lg"
              >
                <motion.span whileHover={{ scale: 1.05 }} className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Files & Assets
                </motion.span>
              </TabsTrigger>
            </TabsList>
          </motion.div>

          <TabsContent value="basic" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
            <Card className="group border border-border/60 bg-gradient-to-br from-background via-background to-background/50 backdrop-blur-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500 hover:border-blue-500/30 relative overflow-hidden">
              {/* Shimmer Effect */}
              <motion.div
                className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                initial={false}
              />

              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20"
                  >
                    <User className="h-5 w-5" />
                  </motion.div>
                  Basic Information
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Sparkles className="h-3 w-3 text-blue-600" />
                  Your basic personal information that appears on the home page
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 relative z-10">
                <div className="grid md:grid-cols-2 gap-4">
                  <motion.div className="space-y-2" whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
                    <label className="text-sm font-medium flex items-center gap-2">
                      <User className="h-3 w-3 text-blue-600" />
                      Full Name *
                    </label>
                    <Input
                      placeholder="John Doe"
                      {...register("fullName")}
                      className={`transition-all duration-300 hover:border-blue-500/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${errors.fullName ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}`}
                    />
                    {errors.fullName && (
                      <p className="text-sm text-red-500">{errors.fullName.message}</p>
                    )}
                  </motion.div>

                  <motion.div className="space-y-2" whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Sparkles className="h-3 w-3 text-purple-600" />
                      Professional Title *
                    </label>
                    <Input
                      placeholder="Full Stack Developer"
                      {...register("title")}
                      className={`transition-all duration-300 hover:border-purple-500/50 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${errors.title ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}`}
                    />
                    {errors.title && (
                      <p className="text-sm text-red-500">{errors.title.message}</p>
                    )}
                  </motion.div>
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
            </motion.div>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
            <Card className="group border border-border/60 bg-gradient-to-br from-background via-background to-background/50 backdrop-blur-sm hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-500 hover:border-purple-500/30 relative overflow-hidden">
              <motion.div
                className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                initial={false}
              />
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
            </motion.div>
          </TabsContent>

          <TabsContent value="assets" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
            <Card className="group border border-border/60 bg-gradient-to-br from-background via-background to-background/50 backdrop-blur-sm hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-500 hover:border-purple-500/30 relative overflow-hidden">
              <motion.div
                className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                initial={false}
              />
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20"
                  >
                    <FileText className="h-5 w-5" />
                  </motion.div>
                  Files & Assets
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Camera className="h-3 w-3 text-purple-600" />
                  Upload and manage your profile assets
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 relative z-10">
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
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Save Button - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center justify-between border-t border-border/50 pt-6 mt-6"
        >
          <div className="flex items-center gap-2">
            <AnimatePresence mode="wait">
              {saveStatus === 'success' && (
                <motion.div
                  key="success"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                >
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="mr-2"
                    >
                      ✓
                    </motion.div>
                    Changes saved successfully
                  </Badge>
                </motion.div>
              )}
              {saveStatus === 'error' && (
                <motion.div
                  key="error"
                  initial={{ scale: 0, x: -20 }}
                  animate={{ scale: 1, x: 0 }}
                  exit={{ scale: 0, x: 20 }}
                >
                  <Badge variant="destructive" className="shadow-lg">
                    Failed to save changes
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex gap-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" type="button" asChild className="hover:border-blue-500/50 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all duration-300">
                <a href="/" target="_blank">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Live Site
                </a>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="submit"
                disabled={isSaving || !isDirty}
                className="min-w-[140px] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                />
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin relative z-10" />
                    <span className="relative z-10">Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2 relative z-10" />
                    <span className="relative z-10">Save Changes</span>
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </form>
    </div>
  )
}
