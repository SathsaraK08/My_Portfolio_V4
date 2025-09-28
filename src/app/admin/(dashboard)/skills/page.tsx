"use client"

import { useCallback, useEffect, useMemo, useState, memo, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Plus, Edit, Trash2, Search, Gauge, Layers, Eye, EyeOff, Star, TrendingUp, Filter, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { IconUpload } from "@/components/icon-upload"
import { ErrorBoundary } from "@/components/error-boundary"
import Image from "next/image"

type Skill = {
  id: string
  name: string
  category: string | null
  level: number
  icon: string | null
  description: string | null
  imageUrl?: string | null
  imagePath?: string | null
  isVisible: boolean
  order?: number
}

const categories = ["Frontend", "Backend", "Database", "DevOps", "Design", "Mobile", "Tools", "Other"]

const skillSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  level: z.number().min(0).max(100),
  icon: z.string().optional(),
  imageUrl: z.string().optional(),
  description: z.string().optional(),
})

type SkillFormData = z.infer<typeof skillSchema>

// localStorage cache utilities
const CACHE_KEY = 'admin-skills-cache'
const CACHE_TIMESTAMP_KEY = 'admin-skills-cache-timestamp'
const CACHE_DURATION = 60000 // 60 seconds

interface SkillsCache {
  data: Skill[]
  timestamp: number
}

function getCachedSkills(): SkillsCache | null {
  if (typeof window === 'undefined') return null

  try {
    const cached = localStorage.getItem(CACHE_KEY)
    const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY)

    if (cached && timestamp) {
      const parsedData = JSON.parse(cached)
      const parsedTimestamp = parseInt(timestamp, 10)

      console.log(`📦 Found cache with ${parsedData.length} skills, timestamp: ${new Date(parsedTimestamp).toLocaleTimeString()}`)

      return {
        data: parsedData,
        timestamp: parsedTimestamp
      }
    } else {
      console.log('💾 No cache found in localStorage')
    }
  } catch (error) {
    console.error('Failed to read from localStorage cache:', error)
    // Clear corrupted cache
    try {
      localStorage.removeItem(CACHE_KEY)
      localStorage.removeItem(CACHE_TIMESTAMP_KEY)
    } catch (clearError) {
      console.error('Failed to clear corrupted cache:', clearError)
    }
  }

  return null
}

function setCachedSkills(skills: Skill[]): void {
  if (typeof window === 'undefined') return

  try {
    const timestamp = Date.now()
    localStorage.setItem(CACHE_KEY, JSON.stringify(skills))
    localStorage.setItem(CACHE_TIMESTAMP_KEY, timestamp.toString())
    console.log(`💾 Cached ${skills.length} skills at ${new Date(timestamp).toLocaleTimeString()}`)
  } catch (error) {
    console.error('Failed to write to localStorage cache:', error)
  }
}

function isCacheValid(timestamp: number): boolean {
  return Date.now() - timestamp < CACHE_DURATION
}

const SkillCard = memo(({ skill, onEdit, onDelete }: {
  skill: Skill
  onEdit: (skill: Skill) => void
  onDelete: (skillId: string) => void
}) => (
  <Card className="group border border-border/60 bg-background/80 backdrop-blur-sm hover:shadow-lg hover:border-border transition-all duration-300">
    <CardHeader className="flex flex-row items-start justify-between gap-3 pb-3">
      <div className="space-y-2 flex-1">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/20">
            {skill.imageUrl ? (
              <Image
                src={skill.imageUrl}
                alt={skill.name}
                width={28}
                height={28}
                className="object-contain"
              />
            ) : (
              <span className="text-sm font-semibold text-primary">
                {skill.icon || skill.name.charAt(0)}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg leading-tight truncate">
              {skill.name}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {skill.category ?? 'Other'}
              </Badge>
              <div className="flex items-center gap-1">
                {skill.isVisible ? (
                  <Eye className="h-3 w-3 text-green-500" />
                ) : (
                  <EyeOff className="h-3 w-3 text-muted-foreground" />
                )}
                {skill.level >= 90 && (
                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Button size="sm" variant="ghost" onClick={() => onEdit(skill)} className="h-8 w-8 p-0">
          <Edit className="h-3 w-3" />
        </Button>
        <Button size="sm" variant="ghost" onClick={() => onDelete(skill.id)} className="h-8 w-8 p-0 text-destructive hover:text-destructive">
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </CardHeader>
    <CardContent className="space-y-4 pt-0">
      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="flex items-center gap-1 text-muted-foreground">
            <Gauge className="h-3 w-3" />
            Proficiency
          </span>
          <span className="font-semibold text-base">
            {skill.level}%
          </span>
        </div>
        <div className="relative">
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                skill.level >= 90 ? 'bg-green-500' :
                skill.level >= 70 ? 'bg-blue-500' :
                skill.level >= 50 ? 'bg-yellow-500' : 'bg-gray-400'
              }`}
              style={{ width: `${skill.level}%` }}
            />
          </div>
        </div>
      </div>
      {skill.description && (
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {skill.description}
        </p>
      )}
    </CardContent>
  </Card>
))

SkillCard.displayName = 'SkillCard'

function SkillsPageContent() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isValidating, setIsValidating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isUploadingIcon, setIsUploadingIcon] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const abortControllerRef = useRef<AbortController | null>(null)

  // Handle mounting to prevent hydration issues
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Fetch skills with SWR pattern
  const fetchSkills = useCallback(async (showLoadingState = false) => {
    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController()

    try {
      if (showLoadingState) {
        setIsLoading(true)
      } else {
        setIsValidating(true)
      }
      setError(null)

      const response = await fetch('/api/admin/skills', {
        signal: abortControllerRef.current.signal,
        headers: {
          'Cache-Control': 'no-cache'
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch skills: ${response.status}`)
      }

      const fetchedSkills = await response.json()
      setSkills(fetchedSkills)

      // Cache in localStorage
      setCachedSkills(fetchedSkills)

      console.log(`✅ Fetched ${fetchedSkills.length} skills from API`)
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        console.log('🚫 Request was cancelled')
        return
      }

      console.error('Failed to fetch skills:', err)
      setError('Failed to load skills')
    } finally {
      setIsLoading(false)
      setIsValidating(false)
    }
  }, [])

  // Load cached data immediately, then fetch fresh data
  useEffect(() => {
    if (!isMounted) return

    const cached = getCachedSkills()

    if (cached) {
      console.log(`📦 Loaded ${cached.data.length} skills from cache`)
      setSkills(cached.data)
      setIsLoading(false)

      if (!isCacheValid(cached.timestamp)) {
        // Cache is stale, fetch fresh data in background
        console.log('🔄 Cache is stale, fetching fresh data in background')
        fetchSkills(false)
      } else {
        console.log('✅ Cache is valid, using cached data')
      }
    } else {
      // No cache, fetch with loading state
      console.log('💾 No cache found, fetching from API')
      fetchSkills(true)
    }

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [isMounted]) // Only run after component is mounted

  // Optimistic create function
  const createSkill = useCallback(async (skillData: Omit<Skill, 'id'>) => {
    const tempId = `temp-${Date.now()}`
    const tempSkill: Skill = { ...skillData, id: tempId }

    try {
      // Optimistically add the skill
      setSkills(prev => [...prev, tempSkill])

      // Make the actual API call
      const response = await fetch('/api/admin/skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(skillData),
      })

      if (!response.ok) {
        throw new Error('Failed to create skill')
      }

      const createdSkill: Skill = await response.json()

      // Update with real data
      setSkills(prev => prev.map(skill =>
        skill.id === tempId ? createdSkill : skill
      ))

      // Update cache
      const updatedSkills = skills.map(skill =>
        skill.id === tempId ? createdSkill : skill
      )
      setCachedSkills([...updatedSkills.filter(s => s.id !== tempId), createdSkill])

      return createdSkill
    } catch (error) {
      // Revert optimistic update on error
      setSkills(prev => prev.filter(skill => skill.id !== tempId))
      throw error
    }
  }, [skills])

  // Optimistic update function
  const updateSkill = useCallback(async (id: string, updates: Partial<Skill>) => {
    const originalSkills = [...skills]

    try {
      // Optimistically update the skill
      setSkills(prev => prev.map(skill =>
        skill.id === id ? { ...skill, ...updates } : skill
      ))

      // Make the actual API call
      const response = await fetch(`/api/admin/skills/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error('Failed to update skill')
      }

      const updatedSkill: Skill = await response.json()

      // Update with real data from server
      setSkills(prev => prev.map(skill =>
        skill.id === id ? updatedSkill : skill
      ))

      // Update cache
      const updatedSkills = skills.map(skill =>
        skill.id === id ? updatedSkill : skill
      )
      setCachedSkills(updatedSkills)

      return updatedSkill
    } catch (error) {
      // Revert optimistic update on error
      setSkills(originalSkills)
      throw error
    }
  }, [skills])

  // Optimistic delete function
  const deleteSkill = useCallback(async (id: string) => {
    const originalSkills = [...skills]
    const deletedSkill = skills.find(skill => skill.id === id)

    try {
      // Optimistically remove the skill
      setSkills(prev => prev.filter(skill => skill.id !== id))

      // Make the actual API call
      const response = await fetch(`/api/admin/skills/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete skill')
      }

      // Update cache
      const updatedSkills = skills.filter(skill => skill.id !== id)
      setCachedSkills(updatedSkills)

      return true
    } catch (error) {
      // Revert optimistic delete on error
      setSkills(originalSkills)
      throw error
    }
  }, [skills])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: "",
      category: "",
      level: 80,
      icon: "",
      imageUrl: "",
      description: "",
    },
  })

  const rawLevel = watch("level")
  const normalizedLevel = (() => {
    if (typeof rawLevel === "number" && Number.isFinite(rawLevel)) {
      return Math.min(100, Math.max(0, rawLevel))
    }
    if (rawLevel === undefined) return 80
    return 0
  })()
  const watchedName = watch("name")?.trim() || "Untitled Skill"
  const watchedCategory = watch("category") || "Select a category"
  const watchedDescription =
    watch("description")?.trim() ||
    "Craft a short summary so visitors know how you apply this skill in real projects."
  const watchedIcon = watch("icon")?.trim()

  // Debounce search query to improve performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const filteredSkills = useMemo(() => {
    return skills.filter((skill) => {
      const matchesSearch =
        skill.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        (skill.category ?? '').toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      const matchesCategory =
        selectedCategory === 'All' || (skill.category ?? 'Other') === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [skills, debouncedSearchQuery, selectedCategory])

  useEffect(() => {
    if (searchParams.get("create") === "1") {
      setEditingSkill(null)
      setIsFormOpen(true)
      reset()
    }
  }, [searchParams, reset])

  const closeForm = () => {
    setIsFormOpen(false)
    setEditingSkill(null)
    reset()
    router.replace("/admin/skills", { scroll: false })
  }

  const openCreateForm = () => {
    setEditingSkill(null)
    setIsFormOpen(true)
    reset()
    router.replace("/admin/skills?create=1", { scroll: false })
  }

  const onSubmit = async (data: SkillFormData) => {
    // Prevent submission if an upload is in progress
    if (isUploadingIcon) {
      alert('Please wait for the icon upload to complete before submitting.')
      return
    }

    try {
      setIsLoading(true) // Show loading state during submission

      const skillData = {
        name: data.name,
        category: data.category,
        level: data.level,
        icon: data.icon || null,
        imageUrl: data.imageUrl || null,
        description: data.description || null,
        isVisible: true, // Default to visible
        order: 0 // Default order
      }

      if (editingSkill) {
        // Update existing skill using optimistic updates
        await updateSkill(editingSkill.id, skillData)
      } else {
        // Create new skill using optimistic updates
        await createSkill(skillData)
      }

      // Only close form after successful submission
      closeForm()
    } catch (error) {
      console.error('Failed to save skill', error)
      alert('Unable to save the skill. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = useCallback((skill: Skill) => {
    setEditingSkill(skill)
    setValue("name", skill.name)
    setValue("category", skill.category ?? "")
    setValue("level", skill.level)
    setValue("icon", skill.imageUrl || skill.icon || "")
    setValue("imageUrl", skill.imageUrl ?? "")
    setValue("description", skill.description ?? "")
    setIsFormOpen(true)
  }, [setValue])

  const handleDelete = useCallback(async (skillId: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return

    try {
      // Use optimistic delete from SWR hook
      await deleteSkill(skillId)
    } catch (error) {
      console.error('Failed to delete skill', error)
      alert('Unable to delete the skill. Please try again.')
    }
  }, [deleteSkill])

  const handleCancel = () => closeForm()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Skills Management</h1>
          <p className="text-muted-foreground">Manage your technical skills and expertise levels</p>
          {!isLoading && skills.length > 0 && (
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {skills.length} skills total
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {skills.filter(s => s.isVisible).length} visible
              </span>
            </div>
          )}
          {isValidating && !isLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              Syncing...
            </div>
          )}
        </div>
        <Button onClick={openCreateForm} size="lg" className="shadow-md" disabled={isLoading}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Skill
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search skills by name or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Filter className="h-3 w-3" />
                Filter by category
              </div>
              <div className="flex flex-wrap gap-2">
                {['All', ...categories].map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="capitalize transition-all duration-200"
                  >
                    {category}
                    {selectedCategory === category && skills.filter(s => s.category === category || category === 'All').length > 0 && (
                      <span className="ml-1 text-xs opacity-70">
                        ({category === 'All' ? skills.length : skills.filter(s => s.category === category).length})
                      </span>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive/30 bg-destructive/10">
          <CardHeader>
            <CardTitle className="text-destructive">Something went wrong</CardTitle>
            <CardDescription className="text-destructive/80">{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => fetchSkills(true)} variant="secondary">
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {isLoading && skills.length === 0 ? (
          Array.from({ length: 6 }).map((_, index) => (
            <Card key={`skeleton-${index}`} className="border border-border/60 bg-background/80 backdrop-blur-sm animate-pulse">
              <CardHeader className="flex flex-row items-start justify-between gap-3 pb-3">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-muted border border-border/20"></div>
                    <div className="flex-1 min-w-0">
                      <div className="h-5 bg-muted rounded w-24 mb-2"></div>
                      <div className="h-4 bg-muted rounded w-16"></div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-muted rounded w-20"></div>
                    <div className="h-4 bg-muted rounded w-8"></div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded w-full"></div>
                  <div className="h-3 bg-muted rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          filteredSkills.map((skill) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {filteredSkills.length === 0 && !isLoading && !error && (
        <Card className="text-center py-12">
          <CardContent>
            <h3 className="text-lg font-semibold mb-2">No skills found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "Try adjusting your search" : "Start by adding your first skill"}
            </p>
            <Button onClick={openCreateForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Skill
            </Button>
          </CardContent>
        </Card>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-background/95 backdrop-blur-sm overflow-y-auto">
          <div className="w-full min-h-screen flex items-start justify-center p-4 sm:p-6 lg:p-8">
            <Card className="w-full max-w-6xl border border-border/60 shadow-2xl bg-background/98 backdrop-blur my-4 sm:my-8">
              <CardHeader className="space-y-0 border-b border-border/50 bg-gradient-to-r from-primary/10 via-background to-transparent px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary border border-primary/20 shrink-0">
                      {editingSkill ? <Edit className="h-5 w-5 sm:h-6 sm:w-6" /> : <Plus className="h-5 w-5 sm:h-6 sm:w-6" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-xl sm:text-2xl font-bold truncate">
                        {editingSkill ? "Edit Skill" : "Add New Skill"}
                      </CardTitle>
                      <CardDescription className="text-sm sm:text-base mt-1 line-clamp-2">
                        {editingSkill
                          ? "Fine-tune the details to keep your stack up to date."
                          : "Capture the essentials and add a short story behind the skill."}
                      </CardDescription>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleCancel} className="h-8 w-8 p-0 shrink-0">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="p-0">
                  <div className="flex flex-col xl:flex-row gap-0">
                    <div className="flex-1 space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                      <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Name *</label>
                        <Input
                          placeholder="e.g., React, Node.js"
                          {...register("name")}
                          className={errors.name ? "border-red-500 focus-visible:ring-red-500/40" : ""}
                        />
                        {errors.name ? (
                          <p className="text-sm text-red-500">{errors.name.message}</p>
                        ) : (
                          <p className="text-xs text-muted-foreground">Pick the title visitors will recognise instantly.</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Category *</label>
                        <select
                          {...register("category")}
                          className={`flex h-10 w-full rounded-md border bg-background/95 px-3 py-2 text-sm shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                            errors.category ? "border-red-500" : "border-border/60"
                          }`}
                        >
                          <option value="">Select category</option>
                          {categories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                        {errors.category ? (
                          <p className="text-sm text-red-500">{errors.category.message}</p>
                        ) : (
                          <p className="text-xs text-muted-foreground">Group related skills to improve filtering on the public site.</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-medium text-foreground">Proficiency Level (0-100) *</label>
                      <div className="flex items-center gap-3">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          step="1"
                          placeholder="85"
                          {...register("level", { valueAsNumber: true })}
                          className={`w-24 text-center ${errors.level ? "border-red-500 focus-visible:ring-red-500/40" : ""}`}
                        />
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={normalizedLevel}
                          onChange={(event) =>
                            setValue("level", Number(event.target.value), {
                              shouldDirty: true,
                              shouldValidate: true,
                            })
                          }
                          className="flex-1 accent-primary"
                        />
                      </div>
                      {errors.level ? (
                        <p className="text-sm text-red-500">{errors.level.message}</p>
                      ) : (
                        <p className="text-xs text-muted-foreground">Keep it honest - anything above 80 signals confident, independent work.</p>
                      )}
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Icon
                          {isUploadingIcon && (
                            <span className="ml-2 text-xs text-primary">
                              (Uploading...)
                            </span>
                          )}
                        </label>
                        <IconUpload
                          value={watch("icon") || watch("imageUrl") || ""}
                          onUploadStateChange={({ isUploading, imageUrl }) => {
                            setIsUploadingIcon(isUploading)
                            if (imageUrl) {
                              setValue("imageUrl", imageUrl, { shouldDirty: true })
                            }
                          }}
                          onChange={(iconData) => {
                            if (iconData.type === 'upload' && iconData.imageUrl) {
                              setValue("imageUrl", iconData.imageUrl, { shouldDirty: true })
                              setValue("icon", "", { shouldDirty: true })
                            } else {
                              setValue("icon", iconData.value, { shouldDirty: true })
                              setValue("imageUrl", iconData.imageUrl || "", { shouldDirty: true })
                            }
                          }}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Description (optional)</label>
                        <textarea
                          rows={3}
                          placeholder="Brief description of your experience with this skill"
                          aria-label="Skill description"
                          {...register("description")}
                          className="flex w-full rounded-md border border-border/60 bg-background/95 px-3 py-2 text-sm shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                        />
                        <p className="text-xs text-muted-foreground">Share your experience or key projects where you used this skill.</p>
                      </div>
                    </div>

                      <div className="flex flex-col-reverse gap-3 pt-6 sm:flex-row sm:justify-end sm:gap-4 border-t border-border/30">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleCancel}
                          className="min-w-0 sm:min-w-[120px] h-10 sm:h-11"
                          disabled={isUploadingIcon}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="min-w-0 sm:min-w-[160px] h-10 sm:h-11 shadow-md"
                          disabled={isUploadingIcon || isLoading}
                        >
                          {isUploadingIcon ? (
                            <>
                              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                              Uploading...
                            </>
                          ) : isLoading ? (
                            <>
                              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                              Saving...
                            </>
                          ) : (
                            editingSkill ? "Save Changes" : "Add Skill"
                          )}
                        </Button>
                      </div>
                    </div>

                    <aside className="xl:w-80 xl:shrink-0 space-y-4 sm:space-y-6 border-t border-border/50 bg-muted/3 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 xl:border-t-0 xl:border-l">
                      <div className="rounded-xl sm:rounded-2xl border border-border/50 bg-background/90 p-4 sm:p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                          <span className="rounded-full bg-primary/10 px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs font-medium text-primary">
                            Live Preview
                          </span>
                        </div>

                        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                          <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-primary/15 text-base sm:text-lg font-semibold text-primary overflow-hidden border border-primary/20 shrink-0">
                            {watch("imageUrl") ? (
                              <Image
                                src={watch("imageUrl") || ""}
                                alt="Icon preview"
                                width={32}
                                height={32}
                                className="object-contain sm:w-9 sm:h-9"
                              />
                            ) : (
                              watchedIcon || watchedName.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-lg sm:text-xl font-bold leading-tight truncate">{watchedName}</p>
                            <p className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                              <Layers className="h-3 w-3 shrink-0" />
                              <span className="truncate">{watchedCategory}</span>
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3 sm:space-y-4">
                          <div className="flex items-center justify-between text-sm font-medium">
                            <span className="flex items-center gap-2 text-muted-foreground">
                              <Gauge className="h-4 w-4 shrink-0" /> Proficiency Level
                            </span>
                            <span className="text-base sm:text-lg font-bold">{normalizedLevel}%</span>
                          </div>
                          <div className="relative">
                            <Progress value={normalizedLevel} className="h-2.5 sm:h-3" />
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                              <span>Beginner</span>
                              <span>Expert</span>
                            </div>
                          </div>
                        </div>

                        {watchedDescription && (
                          <div className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg bg-muted/50">
                            <p className="text-sm leading-relaxed text-muted-foreground">
                              {watchedDescription}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="rounded-lg sm:rounded-xl border border-border/40 bg-background/60 p-4 sm:p-5 text-xs text-muted-foreground space-y-2 sm:space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0"></div>
                          <p className="font-medium text-foreground">Pro Tips</p>
                        </div>
                        <ul className="space-y-1.5 sm:space-y-2 leading-relaxed">
                          <li>• Share a specific project where this skill made a difference</li>
                          <li>• Keep categories balanced for meaningful analytics</li>
                          <li>• Use consistent icons for a professional look</li>
                          <li>• Be honest about proficiency levels - they guide expectations</li>
                        </ul>
                      </div>
                    </aside>
                  </div>
                </CardContent>
              </form>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

export default function SkillsPage() {
  return (
    <ErrorBoundary>
      <SkillsPageContent />
    </ErrorBoundary>
  )
}
