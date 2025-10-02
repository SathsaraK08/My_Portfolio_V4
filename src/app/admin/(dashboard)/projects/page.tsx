"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Search, ExternalLink, Github } from "lucide-react"
import { FileUpload, UploadedFile } from "@/components/file-upload"

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  shortDesc: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  techStack: z.string().min(1, "Tech stack is required"),
  githubUrl: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),
  liveUrl: z.string().url("Invalid live URL").optional().or(z.literal("")),
  status: z.enum(["completed", "in-progress", "planned"]),
  featured: z.boolean(),
  image: z.string().optional(),
  imagePath: z.string().optional()
})

type ProjectFormData = z.infer<typeof projectSchema>

type Project = {
  id: string
  title: string
  description: string
  shortDesc?: string | null
  category: string
  techStack: string[]
  githubUrl?: string | null
  liveUrl?: string | null
  status: "completed" | "in-progress" | "planned"
  featured: boolean
  image?: string | null
  imagePath?: string | null
  createdAt: string
  updatedAt: string
  order: number
  isVisible: boolean
}

const categories = ["Web App", "Mobile App", "API", "Website", "Desktop App"]
const statuses = ["completed", "in-progress", "planned"]

// Fetch projects from API
const fetchProjects = async (): Promise<Project[]> => {
  try {
    const response = await fetch('/api/admin/projects', {
      cache: 'no-store'
    })
    if (!response.ok) {
      throw new Error('Failed to fetch projects')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching projects:', error)
    return []
  }
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      shortDesc: "",
      category: "",
      techStack: "",
      githubUrl: "",
      liveUrl: "",
      status: "completed",
      featured: false,
      image: "",
      imagePath: ""
    }
  })

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || project.category === selectedCategory
    const matchesStatus = selectedStatus === "All" || project.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  // Load projects on component mount
  useEffect(() => {
    const loadProjects = async () => {
      setIsLoading(true)
      const fetchedProjects = await fetchProjects()
      setProjects(fetchedProjects)
      setIsLoading(false)
    }
    loadProjects()
  }, [])

  useEffect(() => {
    if (searchParams.get("create") === "1") {
      setEditingProject(null)
      setIsFormOpen(true)
      reset()
    }
  }, [searchParams, reset])

  const closeForm = () => {
    setIsFormOpen(false)
    setEditingProject(null)
    reset()
    router.replace("/admin/projects", { scroll: false })
  }

  const openCreateForm = () => {
    setEditingProject(null)
    setIsFormOpen(true)
    reset()
    router.replace("/admin/projects?create=1", { scroll: false })
  }

  const onSubmit = async (data: ProjectFormData) => {
    try {
      const techStackArray = data.techStack.split(",").map(tech => tech.trim())

      const projectData = {
        title: data.title,
        description: data.description,
        shortDesc: data.shortDesc || null,
        category: data.category,
        techStack: techStackArray,
        githubUrl: data.githubUrl || null,
        liveUrl: data.liveUrl || null,
        status: data.status,
        featured: data.featured,
        image: data.image || null,
        imagePath: data.imagePath || null
      }

      if (editingProject) {
        const response = await fetch(`/api/admin/projects/${editingProject.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(projectData),
        })

        if (!response.ok) {
          throw new Error('Failed to update project')
        }

        const updatedProject = await response.json()
        setProjects(projects.map(project =>
          project.id === editingProject.id ? updatedProject : project
        ))
      } else {
        const response = await fetch('/api/admin/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(projectData),
        })

        if (!response.ok) {
          throw new Error('Failed to create project')
        }

        const newProject = await response.json()
        setProjects([...projects, newProject])
      }

      closeForm()
    } catch (error) {
      console.error("Failed to save project:", error)
      alert('Failed to save project. Please try again.')
    }
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setValue("title", project.title)
    setValue("description", project.description)
    setValue("shortDesc", project.shortDesc || "")
    setValue("category", project.category)
    setValue("techStack", project.techStack.join(", "))
    setValue("githubUrl", project.githubUrl || "")
    setValue("liveUrl", project.liveUrl || "")
    setValue("status", project.status)
    setValue("featured", project.featured)
    setValue("image", project.image || "")
    setValue("imagePath", project.imagePath || "")
    setIsFormOpen(true)
  }

  const handleDelete = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) {
      return
    }

    try {
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete project')
      }

      setProjects(projects.filter(project => project.id !== projectId))
    } catch (error) {
      console.error("Failed to delete project:", error)
      alert('Failed to delete project. Please try again.')
    }
  }

  const handleCancel = () => {
    closeForm()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Projects Management</h1>
          <p className="text-muted-foreground">
            Manage your portfolio projects
            {!isLoading && projects.length > 0 && (
              <span className="ml-2 text-sm">({projects.length} total)</span>
            )}
          </p>
        </div>
        <Button onClick={openCreateForm} disabled={isLoading} className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 transition-all duration-200">
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-l-4 border-l-violet-500 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-violet-500 transition-colors" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 focus:border-violet-500 transition-colors"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="flex h-9 rounded-md border-2 border-input bg-background px-3 py-1 text-sm hover:border-violet-400 focus:border-violet-500 transition-colors"
              >
                <option value="All">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="flex h-9 rounded-md border-2 border-input bg-background px-3 py-1 text-sm hover:border-violet-400 focus:border-violet-500 transition-colors"
              >
                <option value="All">All Status</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={`skeleton-${index}`} className="animate-pulse">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                    <div className="flex gap-2">
                      <div className="h-5 bg-muted rounded w-20"></div>
                      <div className="h-5 bg-muted rounded w-24"></div>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <div className="h-8 w-8 bg-muted rounded"></div>
                    <div className="h-8 w-8 bg-muted rounded"></div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="flex gap-1">
                  <div className="h-5 bg-muted rounded w-16"></div>
                  <div className="h-5 bg-muted rounded w-20"></div>
                  <div className="h-5 bg-muted rounded w-18"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-8 bg-muted rounded w-16"></div>
                  <div className="h-8 bg-muted rounded w-16"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          filteredProjects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg hover:scale-[1.02] transition-all duration-200 border-l-4 border-l-violet-500">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-xl">{project.title}</CardTitle>
                    {project.featured && (
                      <Badge variant="secondary">Featured</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{project.category}</Badge>
                    <Badge 
                      variant={
                        project.status === "completed" ? "default" :
                        project.status === "in-progress" ? "secondary" : "outline"
                      }
                    >
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </Badge>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button size="sm" variant="ghost" onClick={() => handleEdit(project)}>
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(project.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{project.description}</p>
              
              <div className="flex flex-wrap gap-1">
                {project.techStack.map((tech) => (
                  <Badge key={tech} variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                {project.githubUrl && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="h-3 w-3 mr-1" />
                      Code
                    </a>
                  </Button>
                )}
                {project.liveUrl && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Live
                    </a>
                  </Button>
                )}
              </div>

              <div className="text-xs text-muted-foreground">
                Created: {new Date(project.createdAt).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
          ))
        )}
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto animate-in fade-in">
          <Card className="w-full max-w-2xl my-8 border-2 border-violet-500 shadow-2xl animate-in slide-in-from-bottom">
            <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950 dark:to-purple-950">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-violet-100 dark:bg-violet-900 rounded-lg">
                  <Plus className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                </div>
                {editingProject ? "Edit Project" : "Add New Project"}
              </CardTitle>
              <CardDescription>
                {editingProject ? "Update project information" : "Add a new project to your portfolio"}
              </CardDescription>
            </CardHeader>
            <CardContent className="max-h-[70vh] overflow-y-auto">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Title *</label>
                    <Input
                      placeholder="Project title"
                      {...register("title")}
                      className={errors.title ? "border-red-500" : ""}
                    />
                    {errors.title && (
                      <p className="text-sm text-red-500">{errors.title.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category *</label>
                    <select
                      {...register("category")}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">Select category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-sm text-red-500">{errors.category.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Short Description</label>
                  <Input
                    placeholder="Brief one-line description"
                    {...register("shortDesc")}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description *</label>
                  <textarea
                    rows={4}
                    placeholder="Detailed project description"
                    {...register("description")}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">{errors.description.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tech Stack *</label>
                  <Input
                    placeholder="React, Node.js, PostgreSQL (comma separated)"
                    {...register("techStack")}
                    className={errors.techStack ? "border-red-500" : ""}
                  />
                  {errors.techStack && (
                    <p className="text-sm text-red-500">{errors.techStack.message}</p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">GitHub URL</label>
                    <Input
                      placeholder="https://github.com/user/repo"
                      {...register("githubUrl")}
                      className={errors.githubUrl ? "border-red-500" : ""}
                    />
                    {errors.githubUrl && (
                      <p className="text-sm text-red-500">{errors.githubUrl.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Live URL</label>
                    <Input
                      placeholder="https://yourproject.com"
                      {...register("liveUrl")}
                      className={errors.liveUrl ? "border-red-500" : ""}
                    />
                    {errors.liveUrl && (
                      <p className="text-sm text-red-500">{errors.liveUrl.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status *</label>
                    <select
                      {...register("status")}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center space-x-2 pt-7">
                    <input
                      type="checkbox"
                      {...register("featured")}
                      className="h-4 w-4 rounded border border-input"
                    />
                    <label className="text-sm font-medium">Featured Project</label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Project Image</label>
                  {watch("image") ? (
                    <UploadedFile
                      url={watch("image")!}
                      path={watch("imagePath")!}
                      onRemove={() => {
                        setValue("image", "", { shouldDirty: true })
                        setValue("imagePath", "", { shouldDirty: true })
                      }}
                    />
                  ) : (
                    <FileUpload
                      onUpload={(url, path) => {
                        setValue("image", url, { shouldDirty: true })
                        setValue("imagePath", path, { shouldDirty: true })
                      }}
                    />
                  )}
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700">
                    {editingProject ? "Update" : "Add"} Project
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancel} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <h3 className="text-lg font-semibold mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "Try adjusting your search" : "Start by adding your first project"}
            </p>
            <Button onClick={openCreateForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
