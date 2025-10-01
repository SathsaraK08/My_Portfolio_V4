"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ExternalLink, Calendar, Award, Filter, Eye, Loader2, FolderOpen } from "lucide-react"

interface Certificate {
  id: string
  title: string
  issuer: string
  description?: string | null
  image?: string | null
  imagePath?: string | null
  credentialId?: string | null
  credentialUrl?: string | null
  issueDate: string
  expiryDate?: string | null
  skills: string[]
  category?: string | null
  isVerified: boolean
  order: number
  isVisible: boolean
  createdAt: string
  updatedAt: string
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null)

  // Fetch certificates from API
  useEffect(() => {
    async function fetchCertificates() {
      try {
        setIsLoading(true)
        const response = await fetch('/api/public/certificates')

        if (!response.ok) {
          throw new Error('Failed to fetch certificates')
        }

        const data = await response.json()
        setCertificates(data)
      } catch (err) {
        console.error('Error fetching certificates:', err)
        setError('Failed to load certificates. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCertificates()
  }, [])

  // Get unique categories from certificates (dynamic, not hardcoded)
  const categories = ["All", ...Array.from(new Set(certificates.map(c => c.category).filter(Boolean)))] as string[]

  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cert.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cert.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "All" || cert.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const featuredCertificates = filteredCertificates.filter(cert => cert.isVerified)
  const otherCertificates = filteredCertificates.filter(cert => !cert.isVerified)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const isExpired = (expiryDate: string | null) => {
    if (!expiryDate) return false
    return new Date(expiryDate) < new Date()
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/30 dark:to-purple-950/30 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
          <p className="text-lg text-muted-foreground">Loading certificates...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/30 dark:to-purple-950/30 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-red-500 text-xl font-semibold">{error}</div>
          <Button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-600 to-purple-600"
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/30 dark:to-purple-950/30">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/30 dark:to-purple-950/30">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-1/4 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10 space-y-8">
          <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-card/50 backdrop-blur-sm rounded-full border border-border/50">
            <Award className="h-6 w-6 text-blue-500" />
            <span className="text-muted-foreground font-medium">Professional Certifications</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
            Certificates & Credentials
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Validated expertise across cloud computing, development, and emerging technologies
          </p>
          {certificates.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <div className="flex items-center gap-2 px-4 py-2 bg-card/50 backdrop-blur-sm rounded-full border border-border/50">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-muted-foreground text-sm">{certificates.filter(c => c.isVerified).length} Verified</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-card/50 backdrop-blur-sm rounded-full border border-border/50">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-muted-foreground text-sm">{categories.length - 1} Categories</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Section Divider */}
      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
        </div>
        <div className="relative flex justify-center">
          <div className="bg-white dark:bg-gray-900 px-6">
            <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {certificates.length === 0 ? (
        <section className="py-32">
          <div className="container mx-auto px-4 text-center space-y-6">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
              <FolderOpen className="h-12 w-12 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold">No Certificates Yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Certificates will appear here once they're added to the portfolio.
            </p>
          </div>
        </section>
      ) : (
        <>
          {/* Modern Search and Filters */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              {/* Modern Search Section with Glass Morphism */}
              <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-blue-200/50 dark:border-blue-800/50 mb-12">
                {/* Floating gradient background */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-3xl"></div>

                <div className="relative z-10 space-y-8">
                  {/* Search Header */}
                  <div className="text-center space-y-3">
                    <h3 className="text-2xl font-bold">
                      <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Find Your Certificate
                      </span>
                    </h3>
                    <p className="text-muted-foreground">Search through my professional certifications and credentials</p>
                  </div>

                  {/* Modern Search Bar */}
                  <div className="relative max-w-2xl mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-60"></div>
                    <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-blue-200/50 dark:border-blue-700/50">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg">
                          <Search className="h-5 w-5 text-white" />
                        </div>
                        <Input
                          placeholder="Search certificates, issuers, or skills..."
                          value={searchQuery}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                          className="flex-1 bg-transparent border-0 text-lg placeholder:text-muted-foreground/70 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                        />
                        <div className="flex items-center gap-3">
                          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
                            <Award className="h-4 w-4 text-blue-500" />
                            <span className="text-sm font-medium text-muted-foreground">
                              {filteredCertificates.length} certificate{filteredCertificates.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowFilters(!showFilters)}
                            className="lg:hidden h-12 w-12 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30"
                          >
                            <Filter className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Modern Category Pills */}
                  {categories.length > 1 && (
                    <div className={`${showFilters ? 'block' : 'hidden lg:block'} space-y-4`}>
                      <div className="text-center">
                        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Filter by Category</span>
                      </div>
                      <div className="flex flex-wrap justify-center gap-3">
                        {categories.map((category) => {
                          const isSelected = selectedCategory === category;
                          const certificateCount = category === "All"
                            ? certificates.length
                            : certificates.filter(cert => cert.category === category).length;

                          return (
                            <button
                              key={category}
                              onClick={() => setSelectedCategory(category)}
                              className={`relative group px-6 py-3 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                                isSelected
                                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25'
                                  : 'bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50 hover:bg-white/80 dark:hover:bg-gray-800/80 hover:border-blue-300/70 dark:hover:border-blue-600/70'
                              }`}
                            >
                              {/* Glow effect for selected */}
                              {isSelected && (
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
                              )}

                              <div className="relative flex items-center gap-3">
                                <span className="font-medium">{category}</span>
                                <div className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                                  isSelected
                                    ? 'bg-white/20 text-white'
                                    : 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 dark:text-blue-400'
                                }`}>
                                  {certificateCount}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="flex flex-wrap justify-center gap-4 pt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("All");
                      }}
                      className="text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl"
                    >
                      Clear All Filters
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Featured Certificates (Verified) */}
          {featuredCertificates.length > 0 && (
            <section className="py-12">
              <div className="container mx-auto px-4 space-y-8">
                <h2 className="text-3xl md:text-4xl font-bold text-center">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Verified Certifications
                  </span>
                </h2>
                <div className="grid lg:grid-cols-2 gap-8">
                  {featuredCertificates.map((certificate) => (
                    <Card key={certificate.id} className="group hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/50">
                      <CardHeader className="p-0">
                        <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-t-lg overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                          <div className="h-full flex items-center justify-center text-muted-foreground">
                            {certificate.image || certificate.imagePath ? (
                              <img src={certificate.image || certificate.imagePath || ''} alt={certificate.title} className="w-full h-full object-cover" />
                            ) : (
                              <span>Certificate Image</span>
                            )}
                          </div>
                          <div className="absolute top-4 right-4 z-20 flex gap-2">
                            <Badge className="bg-green-500 text-white border-0">
                              Verified
                            </Badge>
                            {certificate.category && (
                              <Badge className="bg-white/20 backdrop-blur-sm text-white border border-white/30">
                                {certificate.category}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6 space-y-4">
                        <div className="space-y-2">
                          <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">{certificate.title}</CardTitle>
                          <CardDescription className="text-base font-medium">
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                              {certificate.issuer}
                            </span>
                          </CardDescription>
                        </div>

                        {certificate.description && (
                          <p className="text-sm text-muted-foreground">{certificate.description}</p>
                        )}

                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-1 text-muted-foreground">
                              <Calendar className="h-4 w-4 text-blue-500" />
                              <span>Issued: {formatDate(certificate.issueDate)}</span>
                            </div>
                            {certificate.expiryDate && (
                              <div className={`flex items-center space-x-1 ${isExpired(certificate.expiryDate) ? 'text-red-500' : 'text-muted-foreground'}`}>
                                <span>Expires: {formatDate(certificate.expiryDate)}</span>
                              </div>
                            )}
                          </div>

                          {certificate.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {certificate.skills.slice(0, 4).map((skill) => (
                                <Badge key={skill} className="text-xs bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 dark:text-blue-300 border border-blue-200/50">
                                  {skill}
                                </Badge>
                              ))}
                              {certificate.skills.length > 4 && (
                                <Badge className="text-xs bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 dark:text-blue-300 border border-blue-200/50">
                                  +{certificate.skills.length - 4} more
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 border-0"
                            onClick={() => setSelectedCertificate(certificate)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          {certificate.credentialUrl && (
                            <Button size="sm" variant="outline" className="border-blue-200 hover:bg-blue-50 hover:border-blue-300" asChild>
                              <a href={certificate.credentialUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Verify
                              </a>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Other Certificates */}
          {otherCertificates.length > 0 && (
            <section className="py-12">
              <div className="container mx-auto px-4 space-y-8">
                <h2 className="text-3xl md:text-4xl font-bold text-center">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {featuredCertificates.length > 0 ? "Other Certifications" : "All Certifications"}
                  </span>
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {otherCertificates.map((certificate) => (
                    <Card key={certificate.id} className="group hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/50">
                      <CardHeader className="p-0">
                        <div className="relative h-40 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-t-lg overflow-hidden">
                          <div className="h-full flex items-center justify-center text-muted-foreground">
                            {certificate.image || certificate.imagePath ? (
                              <img src={certificate.image || certificate.imagePath || ''} alt={certificate.title} className="w-full h-full object-cover" />
                            ) : (
                              <span>Certificate</span>
                            )}
                          </div>
                          <div className="absolute top-2 right-2 flex gap-1">
                            {certificate.isVerified && (
                              <Badge className="text-xs bg-green-500 text-white border-0">
                                ✓
                              </Badge>
                            )}
                            {certificate.category && (
                              <Badge className="text-xs bg-white/20 backdrop-blur-sm text-white border border-white/30">
                                {certificate.category}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 space-y-3">
                        <div className="space-y-1">
                          <CardTitle className="text-lg leading-tight group-hover:text-blue-600 transition-colors">{certificate.title}</CardTitle>
                          <CardDescription className="text-sm font-medium">
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                              {certificate.issuer}
                            </span>
                          </CardDescription>
                        </div>

                        <div className="text-xs text-muted-foreground">
                          <div>Issued: {formatDate(certificate.issueDate)}</div>
                          {certificate.expiryDate && (
                            <div className={isExpired(certificate.expiryDate) ? 'text-red-500' : ''}>
                              Expires: {formatDate(certificate.expiryDate)}
                            </div>
                          )}
                        </div>

                        {certificate.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {certificate.skills.slice(0, 3).map((skill) => (
                              <Badge key={skill} className="text-xs bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 dark:text-blue-300 border border-blue-200/50">
                                {skill}
                              </Badge>
                            ))}
                            {certificate.skills.length > 3 && (
                              <Badge className="text-xs bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 dark:text-blue-300 border border-blue-200/50">
                                +{certificate.skills.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 border-0 text-xs"
                            onClick={() => setSelectedCertificate(certificate)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          {certificate.credentialUrl && (
                            <Button size="sm" variant="outline" className="flex-1 border-blue-200 hover:bg-blue-50 hover:border-blue-300 text-xs" asChild>
                              <a href={certificate.credentialUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Verify
                              </a>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* No Certificates Found */}
          {filteredCertificates.length === 0 && (
            <section className="py-16">
              <div className="container mx-auto px-4 text-center">
                <h3 className="text-2xl font-semibold mb-4">No certificates found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search or filters to see more certificates.
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory("All")
                  }}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 border-0"
                >
                  Clear Search & Filters
                </Button>
              </div>
            </section>
          )}

          {/* Stats */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl p-8 border border-blue-200/50 dark:border-blue-800/50">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                  <div className="space-y-2">
                    <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{certificates.length}</div>
                    <div className="text-sm text-muted-foreground">Total Certificates</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {certificates.filter(c => c.isVerified).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Verified</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {categories.length - 1}
                    </div>
                    <div className="text-sm text-muted-foreground">Categories</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {certificates.filter(c => !c.expiryDate || !isExpired(c.expiryDate)).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Active</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Certificate Detail Modal */}
          {selectedCertificate && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedCertificate(null)}>
              <Card className="max-w-2xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-2xl">{selectedCertificate.title}</CardTitle>
                      <CardDescription className="text-lg font-medium text-primary">
                        {selectedCertificate.issuer}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedCertificate(null)}
                    >
                      ✕
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="h-64 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                    {selectedCertificate.image || selectedCertificate.imagePath ? (
                      <img src={selectedCertificate.image || selectedCertificate.imagePath || ''} alt={selectedCertificate.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-muted-foreground">Certificate Image</span>
                    )}
                  </div>

                  {selectedCertificate.description && (
                    <p className="text-muted-foreground">{selectedCertificate.description}</p>
                  )}

                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="font-medium">Issue Date</div>
                      <div className="text-muted-foreground">
                        {formatDate(selectedCertificate.issueDate)}
                      </div>
                    </div>
                    {selectedCertificate.expiryDate && (
                      <div className="space-y-2">
                        <div className="font-medium">Expiry Date</div>
                        <div className={`${isExpired(selectedCertificate.expiryDate) ? 'text-red-500' : 'text-muted-foreground'}`}>
                          {formatDate(selectedCertificate.expiryDate)}
                        </div>
                      </div>
                    )}
                    {selectedCertificate.credentialId && (
                      <div className="space-y-2">
                        <div className="font-medium">Credential ID</div>
                        <div className="text-muted-foreground font-mono text-xs">
                          {selectedCertificate.credentialId}
                        </div>
                      </div>
                    )}
                    {selectedCertificate.category && (
                      <div className="space-y-2">
                        <div className="font-medium">Category</div>
                        <Badge variant="outline">{selectedCertificate.category}</Badge>
                      </div>
                    )}
                  </div>

                  {selectedCertificate.skills.length > 0 && (
                    <div className="space-y-2">
                      <div className="font-medium">Skills Covered</div>
                      <div className="flex flex-wrap gap-2">
                        {selectedCertificate.skills.map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {selectedCertificate.credentialUrl && (
                      <Button asChild>
                        <a href={selectedCertificate.credentialUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Verify Certificate
                        </a>
                      </Button>
                    )}
                    <Button variant="outline" onClick={() => setSelectedCertificate(null)}>
                      Close
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}

      {/* Section Divider */}
      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
        </div>
        <div className="relative flex justify-center">
          <div className="bg-white dark:bg-gray-900 px-6">
            <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
