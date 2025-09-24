"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ExternalLink, Calendar, Award, Filter, Eye } from "lucide-react"

const certificates = [
  {
    id: 1,
    title: "AWS Certified Solutions Architect - Professional",
    issuer: "Amazon Web Services",
    description: "Advanced certification demonstrating expertise in designing distributed systems and architectures on AWS.",
    image: "/api/placeholder/400/300",
    credentialId: "AWS-PSA-12345",
    credentialUrl: "https://aws.amazon.com/verification/12345",
    issueDate: "2023-08-15",
    expiryDate: "2026-08-15",
    skills: ["AWS", "Cloud Architecture", "Distributed Systems", "Security", "Cost Optimization"],
    category: "Cloud",
    isVerified: true,
    featured: true
  },
  {
    id: 2,
    title: "Google Cloud Professional Developer",
    issuer: "Google Cloud",
    description: "Professional-level certification for developing scalable and highly available applications on Google Cloud Platform.",
    image: "/api/placeholder/400/300",
    credentialId: "GCP-PD-67890",
    credentialUrl: "https://cloud.google.com/certification/verify/67890",
    issueDate: "2023-06-20",
    expiryDate: "2025-06-20",
    skills: ["Google Cloud", "Kubernetes", "Microservices", "DevOps", "Monitoring"],
    category: "Cloud",
    isVerified: true,
    featured: true
  },
  {
    id: 3,
    title: "Certified Kubernetes Administrator (CKA)",
    issuer: "Cloud Native Computing Foundation",
    description: "Hands-on certification that demonstrates skills in Kubernetes cluster administration and troubleshooting.",
    image: "/api/placeholder/400/300",
    credentialId: "CKA-2023-456789",
    credentialUrl: "https://training.linuxfoundation.org/certification/verify/456789",
    issueDate: "2023-04-10",
    expiryDate: "2026-04-10",
    skills: ["Kubernetes", "Container Orchestration", "Linux", "Networking", "Storage"],
    category: "DevOps",
    isVerified: true,
    featured: false
  },
  {
    id: 4,
    title: "MongoDB Certified Developer Associate",
    issuer: "MongoDB Inc.",
    description: "Certification validating skills in MongoDB database development, including data modeling and query optimization.",
    image: "/api/placeholder/400/300",
    credentialId: "MONGODB-DEV-2023-123",
    credentialUrl: "https://university.mongodb.com/certification/verify/123",
    issueDate: "2023-02-28",
    expiryDate: "2025-02-28",
    skills: ["MongoDB", "NoSQL", "Database Design", "Aggregation", "Performance Tuning"],
    category: "Database",
    isVerified: true,
    featured: false
  },
  {
    id: 5,
    title: "React Developer Certification",
    issuer: "Meta (Facebook)",
    description: "Professional certification demonstrating proficiency in React.js development and modern frontend practices.",
    image: "/api/placeholder/400/300",
    credentialId: "META-REACT-2022-789",
    credentialUrl: "https://www.coursera.org/account/accomplishments/verify/789",
    issueDate: "2022-11-15",
    expiryDate: null,
    skills: ["React", "JavaScript", "Frontend Development", "State Management", "Testing"],
    category: "Frontend",
    isVerified: true,
    featured: false
  },
  {
    id: 6,
    title: "Machine Learning Engineer Certificate",
    issuer: "Stanford University",
    description: "Comprehensive program covering machine learning algorithms, deep learning, and practical implementation.",
    image: "/api/placeholder/400/300",
    credentialId: "STANFORD-ML-2022-456",
    credentialUrl: "https://online.stanford.edu/verify/456",
    issueDate: "2022-09-30",
    expiryDate: null,
    skills: ["Machine Learning", "Deep Learning", "Python", "TensorFlow", "Data Science"],
    category: "AI/ML",
    isVerified: true,
    featured: true
  },
  {
    id: 7,
    title: "Cybersecurity Fundamentals",
    issuer: "CompTIA",
    description: "Foundation certification covering essential cybersecurity principles, threat analysis, and security protocols.",
    image: "/api/placeholder/400/300",
    credentialId: "COMPTIA-SEC-2022-321",
    credentialUrl: "https://www.certmetrics.com/comptia/verify/321",
    issueDate: "2022-07-20",
    expiryDate: "2025-07-20",
    skills: ["Cybersecurity", "Network Security", "Risk Assessment", "Compliance", "Incident Response"],
    category: "Security",
    isVerified: true,
    featured: false
  },
  {
    id: 8,
    title: "Docker Certified Associate",
    issuer: "Docker Inc.",
    description: "Certification demonstrating proficiency in containerization technologies and Docker ecosystem.",
    image: "/api/placeholder/400/300",
    credentialId: "DOCKER-DCA-2022-654",
    credentialUrl: "https://docker.com/certification/verify/654",
    issueDate: "2022-05-12",
    expiryDate: "2024-05-12",
    skills: ["Docker", "Containerization", "CI/CD", "Microservices", "DevOps"],
    category: "DevOps",
    isVerified: true,
    featured: false
  }
]

const categories = ["All", "Cloud", "DevOps", "Database", "Frontend", "AI/ML", "Security"]

export default function CertificatesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCertificate, setSelectedCertificate] = useState<typeof certificates[0] | null>(null)

  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cert.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cert.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = selectedCategory === "All" || cert.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const featuredCertificates = filteredCertificates.filter(cert => cert.featured)
  const otherCertificates = filteredCertificates.filter(cert => !cert.featured)

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800" />
        <div className="absolute inset-0 bg-black/10" />
        
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <Award className="h-6 w-6 text-blue-200" />
            <span className="text-blue-100 font-medium">Professional Certifications</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
            Certificates & Credentials
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Validated expertise across cloud computing, development, and emerging technologies
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-blue-100 text-sm">{certificates.filter(c => c.isVerified).length} Verified</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-blue-100 text-sm">{categories.length - 1} Categories</span>
            </div>
          </div>
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCategory("Cloud")}
                  className="text-muted-foreground hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-xl"
                >
                  View Cloud Certs
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Certificates */}
      {featuredCertificates.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4 space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Featured Certifications
              </span>
            </h2>
            <div className="grid lg:grid-cols-2 gap-8">
              {featuredCertificates.map((certificate) => (
                <Card key={certificate.id} className="group hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/50">
                  <CardHeader className="p-0">
                    <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-t-lg overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                      <div className="h-full flex items-center justify-center text-muted-foreground">
                        Certificate Image
                      </div>
                      <div className="absolute top-4 right-4 z-20 flex gap-2">
                        {certificate.isVerified && (
                          <Badge className="bg-green-500 text-white border-0">
                            Verified
                          </Badge>
                        )}
                        <Badge className="bg-white/20 backdrop-blur-sm text-white border border-white/30">
                          {certificate.category}
                        </Badge>
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

                    <p className="text-sm text-muted-foreground">{certificate.description}</p>

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
                        Certificate
                      </div>
                      <div className="absolute top-2 right-2 flex gap-1">
                        {certificate.isVerified && (
                          <Badge className="text-xs bg-green-500 text-white border-0">
                            ✓
                          </Badge>
                        )}
                        <Badge className="text-xs bg-white/20 backdrop-blur-sm text-white border border-white/30">
                          {certificate.category}
                        </Badge>
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-auto">
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
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground">Certificate Image</span>
              </div>

              <p className="text-muted-foreground">{selectedCertificate.description}</p>

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
                <div className="space-y-2">
                  <div className="font-medium">Credential ID</div>
                  <div className="text-muted-foreground font-mono text-xs">
                    {selectedCertificate.credentialId}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="font-medium">Category</div>
                  <Badge variant="outline">{selectedCertificate.category}</Badge>
                </div>
              </div>

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
    </div>
  )
}