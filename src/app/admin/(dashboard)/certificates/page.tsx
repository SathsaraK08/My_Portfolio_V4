"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Search, Award, Loader2, Eye, EyeOff, Calendar, ExternalLink } from "lucide-react"
import { FileUpload, UploadedFile } from "@/components/file-upload"

const certificateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  issuer: z.string().min(1, "Issuer is required"),
  description: z.string().optional(),
  image: z.string().optional(),
  imagePath: z.string().optional(),
  credentialId: z.string().optional(),
  credentialUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  issueDate: z.string().min(1, "Issue date is required"),
  expiryDate: z.string().optional(),
  skills: z.array(z.string()).optional(),
  category: z.string().optional(),
  isVerified: z.boolean().optional(),
  isVisible: z.boolean().optional()
})

type CertificateFormData = z.infer<typeof certificateSchema>

type Certificate = CertificateFormData & {
  id: string
  order: number
  createdAt: string
  updatedAt: string
  imagePath?: string | null
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<CertificateFormData>({
    resolver: zodResolver(certificateSchema),
    defaultValues: {
      title: "",
      issuer: "",
      description: "",
      image: "",
      imagePath: "",
      credentialId: "",
      credentialUrl: "",
      issueDate: "",
      expiryDate: "",
      skills: [],
      category: "",
      isVerified: false,
      isVisible: true
    }
  })

  // Load certificates
  useEffect(() => {
    const loadCertificates = async () => {
      try {
        const response = await fetch('/api/admin/certificates')
        if (response.ok) {
          const data = await response.json()
          setCertificates(data)
        }
      } catch (error) {
        console.error('Failed to load certificates:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCertificates()
  }, [])

  const filteredCertificates = certificates.filter(cert =>
    cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cert.issuer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const closeForm = () => {
    setIsFormOpen(false)
    setEditingCertificate(null)
    reset()
  }

  const openCreateForm = () => {
    setEditingCertificate(null)
    setIsFormOpen(true)
    reset()
  }

  const onSubmit = async (data: CertificateFormData) => {
    try {
      const certificateData = {
        ...data,
        skills: data.skills || []
      }

      if (editingCertificate) {
        const response = await fetch(`/api/admin/certificates/${editingCertificate.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(certificateData)
        })

        if (response.ok) {
          const updated = await response.json()
          setCertificates(certs => certs.map(c => c.id === editingCertificate.id ? updated : c))
        }
      } else {
        const response = await fetch('/api/admin/certificates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(certificateData)
        })

        if (response.ok) {
          const newCert = await response.json()
          setCertificates(certs => [...certs, newCert])
        }
      }

      closeForm()
    } catch (error) {
      console.error('Failed to save certificate:', error)
    }
  }

  const handleEdit = (certificate: Certificate) => {
    setEditingCertificate(certificate)
    setValue("title", certificate.title)
    setValue("issuer", certificate.issuer)
    setValue("description", certificate.description || "")
    setValue("image", certificate.image || "")
    setValue("imagePath", certificate.imagePath || "")
    setValue("credentialId", certificate.credentialId || "")
    setValue("credentialUrl", certificate.credentialUrl || "")
    setValue("issueDate", certificate.issueDate.split('T')[0])
    setValue("expiryDate", certificate.expiryDate ? certificate.expiryDate.split('T')[0] : "")
    setValue("skills", certificate.skills || [])
    setValue("category", certificate.category || "")
    setValue("isVerified", certificate.isVerified)
    setValue("isVisible", certificate.isVisible)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certificate?")) return

    try {
      const response = await fetch(`/api/admin/certificates/${id}`, { method: 'DELETE' })
      if (response.ok) {
        setCertificates(certs => certs.filter(c => c.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete certificate:', error)
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
      <div className="flex items-center justify-between pb-6 border-b">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Certificates Management</h1>
          <p className="text-muted-foreground">
            Manage your professional certificates and certifications
          </p>
        </div>
        <Button onClick={openCreateForm} disabled={isFormOpen} className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 transition-all duration-200">
          <Plus className="h-4 w-4 mr-2" />
          Add Certificate
        </Button>
      </div>

      {/* Search */}
      <Card className="border-l-4 border-l-amber-500 shadow-sm">
        <CardContent className="pt-6">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-amber-500 transition-colors" />
            <Input
              placeholder="Search certificates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 focus:border-amber-500 transition-colors"
            />
          </div>
        </CardContent>
      </Card>

      {/* Form Modal */}
      {isFormOpen && (
        <Card className="border-2 border-amber-500 shadow-lg animate-in slide-in-from-top">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950">
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
                <Award className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              {editingCertificate ? "Edit Certificate" : "Add New Certificate"}
            </CardTitle>
            <CardDescription>
              {editingCertificate ? "Update certificate information" : "Add a new certificate to your profile"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title *</label>
                  <Input
                    placeholder="AWS Certified Solutions Architect"
                    {...register("title")}
                    className={errors.title ? "border-red-500" : ""}
                  />
                  {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Issuer *</label>
                  <Input
                    placeholder="Amazon Web Services"
                    {...register("issuer")}
                    className={errors.issuer ? "border-red-500" : ""}
                  />
                  {errors.issuer && <p className="text-sm text-red-500">{errors.issuer.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Issue Date *</label>
                  <Input
                    type="date"
                    {...register("issueDate")}
                    className={errors.issueDate ? "border-red-500" : ""}
                  />
                  {errors.issueDate && <p className="text-sm text-red-500">{errors.issueDate.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Expiry Date</label>
                  <Input
                    type="date"
                    {...register("expiryDate")}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Credential ID</label>
                  <Input
                    placeholder="ABC123DEF456"
                    {...register("credentialId")}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Credential URL</label>
                  <Input
                    placeholder="https://verify.example.com/cert/123"
                    {...register("credentialUrl")}
                    className={errors.credentialUrl ? "border-red-500" : ""}
                  />
                  {errors.credentialUrl && <p className="text-sm text-red-500">{errors.credentialUrl.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Input
                    placeholder="Cloud Computing"
                    {...register("category")}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Certificate Image</label>
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
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  rows={3}
                  placeholder="Description of the certificate and what it validates..."
                  {...register("description")}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    {...register("isVerified")}
                    className="h-4 w-4 rounded border border-input"
                  />
                  <label className="text-sm font-medium">Verified Certificate</label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    {...register("isVisible")}
                    className="h-4 w-4 rounded border border-input"
                  />
                  <label className="text-sm font-medium">Publicly Visible</label>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
                  {editingCertificate ? "Update Certificate" : "Add Certificate"}
                </Button>
                <Button type="button" variant="outline" onClick={closeForm} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Certificates Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCertificates.map((certificate) => (
          <Card key={certificate.id} className="hover:shadow-lg hover:scale-[1.02] transition-all duration-200 border-l-4 border-l-amber-500">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{certificate.title}</CardTitle>
                    {certificate.isVerified && (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="font-medium text-muted-foreground">{certificate.issuer}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(certificate.issueDate).toLocaleDateString()}
                    </Badge>
                    {certificate.isVisible ? (
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
                  <Button size="sm" variant="ghost" onClick={() => handleEdit(certificate)}>
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(certificate.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {certificate.description && (
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {certificate.description}
                </p>
              )}

              {certificate.credentialUrl && (
                <Button size="sm" variant="outline" asChild>
                  <a href={certificate.credentialUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View Certificate
                  </a>
                </Button>
              )}

              {certificate.credentialId && (
                <p className="text-xs text-muted-foreground">
                  ID: {certificate.credentialId}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredCertificates.length === 0 && !isLoading && (
        <Card className="text-center py-12">
          <CardContent>
            <Award className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No certificates found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "Try adjusting your search" : "Start by adding your first certificate"}
            </p>
            <Button onClick={openCreateForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Certificate
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
