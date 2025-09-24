"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Search } from "lucide-react"

const skillSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  level: z.number().min(0).max(100),
  icon: z.string().optional(),
  description: z.string().optional(),
})

type SkillFormData = z.infer<typeof skillSchema>

const categories = ["Frontend", "Backend", "Database", "DevOps", "Design", "Tools"]

type Skill = {
  id: string
  name: string
  category: string
  level: number
  icon?: string
  description?: string
}

// Mock data - replace with actual API calls
const mockSkills: Skill[] = [
  { id: "1", name: "React", category: "Frontend", level: 95, icon: "react", description: "Advanced React development" },
  { id: "2", name: "Node.js", category: "Backend", level: 90, icon: "nodejs", description: "Server-side JavaScript" },
  { id: "3", name: "PostgreSQL", category: "Database", level: 85, icon: "postgresql", description: "Relational database" },
  { id: "4", name: "Docker", category: "DevOps", level: 80, icon: "docker", description: "Containerization" },
]

export default function SkillsPage() {
  const [skills, setSkills] = useState(mockSkills)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [editingSkill, setEditingSkill] = useState<any>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema)
  })

  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         skill.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || skill.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const onSubmit = async (data: SkillFormData) => {
    try {
      if (editingSkill) {
        // Update existing skill
        setSkills(skills.map(skill => 
          skill.id === editingSkill.id ? { ...skill, ...data } : skill
        ))
      } else {
        // Add new skill
        const newSkill: Skill = {
          id: Date.now().toString(),
          ...data
        }
        setSkills([...skills, newSkill])
      }
      
      setIsFormOpen(false)
      setEditingSkill(null)
      reset()
    } catch (error) {
      console.error("Failed to save skill:", error)
    }
  }

  const handleEdit = (skill: any) => {
    setEditingSkill(skill)
    setValue("name", skill.name)
    setValue("category", skill.category)
    setValue("level", skill.level)
    setValue("icon", skill.icon || "")
    setValue("description", skill.description || "")
    setIsFormOpen(true)
  }

  const handleDelete = async (skillId: string) => {
    if (confirm("Are you sure you want to delete this skill?")) {
      setSkills(skills.filter(skill => skill.id !== skillId))
    }
  }

  const handleCancel = () => {
    setIsFormOpen(false)
    setEditingSkill(null)
    reset()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Skills Management</h1>
          <p className="text-muted-foreground">Manage your technical skills and expertise levels</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Skill
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedCategory === "All" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("All")}
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredSkills.map((skill) => (
          <Card key={skill.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-semibold text-primary">
                      {skill.icon || skill.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">{skill.name}</CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {skill.category}
                    </Badge>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button size="sm" variant="ghost" onClick={() => handleEdit(skill)}>
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(skill.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Proficiency</span>
                  <span className="font-medium">{skill.level}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
              {skill.description && (
                <p className="text-sm text-muted-foreground">{skill.description}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>{editingSkill ? "Edit Skill" : "Add New Skill"}</CardTitle>
              <CardDescription>
                {editingSkill ? "Update skill information" : "Add a new skill to your portfolio"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name *</label>
                  <Input
                    placeholder="e.g., React, Node.js"
                    {...register("name")}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
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

                <div className="space-y-2">
                  <label className="text-sm font-medium">Proficiency Level (0-100) *</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="85"
                    {...register("level", { valueAsNumber: true })}
                    className={errors.level ? "border-red-500" : ""}
                  />
                  {errors.level && (
                    <p className="text-sm text-red-500">{errors.level.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Icon (optional)</label>
                  <Input
                    placeholder="Icon name or emoji"
                    {...register("icon")}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description (optional)</label>
                  <textarea
                    rows={3}
                    placeholder="Brief description of your experience with this skill"
                    {...register("description")}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingSkill ? "Update" : "Add"} Skill
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {filteredSkills.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <h3 className="text-lg font-semibold mb-2">No skills found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "Try adjusting your search" : "Start by adding your first skill"}
            </p>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Skill
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}