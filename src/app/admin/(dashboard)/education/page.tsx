"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Search, GraduationCap, Loader2, Eye, EyeOff, Calendar, MapPin } from "lucide-react"

const educationSchema = z.object({
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  field: z.string().optional(),
  description: z.string().optional(),
  grade: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  isCurrent: z.boolean().default(false),
  location: z.string().optional(),
  achievements: z.array(z.string()).default([]),
  isVisible: z.boolean().default(true)
})

type EducationFormData = z.infer<typeof educationSchema>

type Education = EducationFormData & {
  id: string
  order: number
  createdAt: string
  updatedAt: string
}

export default function EducationPage() {
  const [education, setEducation] = useState<Education[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [editingEducation, setEditingEducation] = useState<Education | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      institution: "",
      degree: "",
      field: "",
      description: "",
      grade: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      location: "",
      achievements: [],
      isVisible: true
    }
  })

  const watchIsCurrent = watch("isCurrent")

  // Load education
  useEffect(() => {
    const loadEducation = async () => {
      try {
        const response = await fetch('/api/admin/education')
        if (response.ok) {
          const data = await response.json()
          setEducation(data)
        }
      } catch (error) {
        console.error('Failed to load education:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadEducation()
  }, [])

  const filteredEducation = education.filter(edu =>
    edu.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
    edu.degree.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (edu.field && edu.field.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const closeForm = () => {
    setIsFormOpen(false)
    setEditingEducation(null)
    reset()
  }

  const openCreateForm = () => {
    setEditingEducation(null)
    setIsFormOpen(true)
    reset()
  }

  const onSubmit = async (data: EducationFormData) => {
    try {
      const educationData = {
        ...data,
        achievements: data.achievements || []
      }

      if (editingEducation) {
        const response = await fetch(`/api/admin/education/${editingEducation.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(educationData)
        })

        if (response.ok) {
          const updated = await response.json()
          setEducation(edus => edus.map(e => e.id === editingEducation.id ? updated : e))
        }
      } else {
        const response = await fetch('/api/admin/education', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(educationData)
        })

        if (response.ok) {
          const newEdu = await response.json()
          setEducation(edus => [...edus, newEdu])
        }
      }

      closeForm()
    } catch (error) {
      console.error('Failed to save education:', error)
    }
  }

  const handleEdit = (edu: Education) => {
    setEditingEducation(edu)
    setValue("institution", edu.institution)
    setValue("degree", edu.degree)
    setValue("field", edu.field || "")
    setValue("description", edu.description || "")
    setValue("grade", edu.grade || "")
    setValue("startDate", edu.startDate.split('T')[0])
    setValue("endDate", edu.endDate ? edu.endDate.split('T')[0] : "")
    setValue("isCurrent", edu.isCurrent)
    setValue("location", edu.location || "")
    setValue("achievements", edu.achievements)
    setValue("isVisible", edu.isVisible)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this education record?")) return

    try {
      const response = await fetch(`/api/admin/education/${id}`, { method: 'DELETE' })
      if (response.ok) {
        setEducation(edus => edus.filter(e => e.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete education:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Education Management</h1>
          <p className="text-muted-foreground">
            Manage your educational background and qualifications
          </p>
        </div>
        <Button onClick={openCreateForm} disabled={isFormOpen}>
          <Plus className="h-4 w-4 mr-2" />
          Add Education
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search education records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Form Modal */}
      {isFormOpen && (
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle>{editingEducation ? "Edit Education" : "Add New Education"}</CardTitle>
            <CardDescription>
              {editingEducation ? "Update education information" : "Add a new education record to your profile"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Institution *</label>
                  <Input
                    placeholder="University of Technology"
                    {...register("institution")}
                    className={errors.institution ? "border-red-500" : ""}
                  />
                  {errors.institution && <p className="text-sm text-red-500">{errors.institution.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Degree *</label>
                  <Input
                    placeholder="Bachelor of Science"
                    {...register("degree")}
                    className={errors.degree ? "border-red-500" : ""}
                  />
                  {errors.degree && <p className="text-sm text-red-500">{errors.degree.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Field of Study</label>
                  <Input
                    placeholder="Computer Science"
                    {...register("field")}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <Input
                    placeholder="San Francisco, CA"
                    {...register("location")}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date *</label>
                  <Input
                    type="date"
                    {...register("startDate")}
                    className={errors.startDate ? "border-red-500" : ""}
                  />
                  {errors.startDate && <p className="text-sm text-red-500">{errors.startDate.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date</label>
                  <Input
                    type="date"
                    {...register("endDate")}
                    disabled={watchIsCurrent}
                  />
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      {...register("isCurrent")}
                      className="h-4 w-4 rounded border border-input"
                    />
                    <label className="text-sm">Currently studying here</label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Grade/GPA</label>
                  <Input
                    placeholder="3.8 GPA or First Class Honours"
                    {...register("grade")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe your studies, key courses, achievements..."
                  {...register("description")}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register("isVisible")}
                  className="h-4 w-4 rounded border border-input"
                />
                <label className="text-sm font-medium">Publicly Visible</label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit">
                  {editingEducation ? "Update Education" : "Add Education"}
                </Button>
                <Button type="button" variant="outline" onClick={closeForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Education Grid */}
      <div className="grid gap-6">
        {filteredEducation.map((edu) => (
          <Card key={edu.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-xl">{edu.degree}</CardTitle>
                    {edu.isCurrent && (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        Current
                      </Badge>
                    )}
                  </div>
                  <p className="text-lg font-medium text-muted-foreground">{edu.institution}</p>
                  {edu.field && (
                    <p className="text-sm text-muted-foreground">Field: {edu.field}</p>
                  )}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="text-xs">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(edu.startDate).toLocaleDateString()} - {
                        edu.isCurrent ? "Present" :
                        edu.endDate ? new Date(edu.endDate).toLocaleDateString() : "N/A"
                      }
                    </Badge>
                    {edu.location && (
                      <Badge variant="outline" className="text-xs">
                        <MapPin className="h-3 w-3 mr-1" />
                        {edu.location}
                      </Badge>
                    )}
                    {edu.grade && (
                      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs">
                        {edu.grade}
                      </Badge>
                    )}
                    {edu.isVisible ? (
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
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
                <div className="flex space-x-1">
                  <Button size="sm" variant="ghost" onClick={() => handleEdit(edu)}>
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(edu.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            {edu.description && (
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {edu.description}
                </p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredEducation.length === 0 && !isLoading && (
        <Card className="text-center py-12">
          <CardContent>
            <GraduationCap className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No education records found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "Try adjusting your search" : "Start by adding your educational background"}
            </p>
            <Button onClick={openCreateForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Education
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}