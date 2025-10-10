"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, MapPin, Award, BookOpen, Loader2 } from "lucide-react"

type Education = {
  id: string
  institution: string
  degree: string
  field: string | null
  location: string | null
  startDate: string
  endDate: string | null
  isCurrent: boolean
  grade: string | null
  description: string | null
  achievements: string[]
}

export default function EducationPage() {
  const [education, setEducation] = useState<Education[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const response = await fetch('/api/public/education')
        if (response.ok) {
          const data = await response.json()
          setEducation(data)
        }
      } catch (error) {
        console.error('Failed to fetch education:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEducation()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-500" />
          <p className="text-muted-foreground">Loading education...</p>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/30 dark:to-purple-950/30">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pb-24 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/30 dark:to-purple-950/30">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-1/4 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10 space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
            Academic Background
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            My academic journey and continuous learning path in computer science and technology.
          </p>
        </div>
      </section>

      {/* Education Timeline */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 space-y-12">

          <div className="relative max-w-6xl mx-auto">
            {/* Modern Timeline line with gradient and glow effect */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 transform -translate-x-0.5">
              <div className="h-full bg-gradient-to-b from-blue-500 via-purple-500 to-blue-600 rounded-full shadow-lg"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-blue-400 via-purple-400 to-blue-500 rounded-full blur-sm opacity-60"></div>
            </div>

            <div className="space-y-16">
              {education.map((edu, index) => (
                <div key={edu.id} className="relative">
                  {/* Enhanced Timeline dot with pulsing animation */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 z-20">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-4 border-white dark:border-gray-900 shadow-xl">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-ping opacity-75"></div>
                    </div>
                  </div>

                  {/* Content alternating left and right */}
                  <div className={`flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                    <div className={`w-full md:w-7/12 lg:w-6/12 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
                      <div className={`transform transition-all duration-700 hover:scale-105 ${
                        index % 2 === 0 
                          ? 'md:translate-x-0' 
                          : 'md:translate-x-0'
                      }`}>
                        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/50 shadow-xl hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 group">
                          <CardHeader className="relative overflow-hidden">
                            {/* Card header with gradient background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 opacity-50"></div>
                            <div className="relative z-10">
                              <div className="flex flex-col space-y-3">
                                <div className="flex items-center justify-between flex-wrap gap-2">
                                  <CardTitle className="text-2xl font-bold group-hover:text-blue-600 transition-colors">{edu.degree}</CardTitle>
                                  <div className="flex items-center gap-2">
                                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 px-4 py-1 text-sm font-semibold">
                                      {new Date(edu.startDate).getFullYear()} - {edu.isCurrent ? 'Present' : edu.endDate ? new Date(edu.endDate).getFullYear() : 'N/A'}
                                    </Badge>
                                  </div>
                                </div>
                                <CardDescription className="text-xl font-semibold">
                                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    {edu.field}
                                  </span>
                                </CardDescription>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                                    <BookOpen className="h-4 w-4 text-blue-500" />
                                    <span className="font-medium">{edu.institution}</span>
                                  </div>
                                  <div className="flex items-center space-x-2 bg-purple-50 dark:bg-purple-900/30 px-3 py-1 rounded-full">
                                    <MapPin className="h-4 w-4 text-purple-500" />
                                    <span className="font-medium">{edu.location}</span>
                                  </div>
                                </div>
                                {edu.grade && (
                                  <div className="flex items-center space-x-2 bg-yellow-50 dark:bg-yellow-900/30 px-3 py-1 rounded-full w-fit">
                                    <Award className="h-4 w-4 text-yellow-500" />
                                    <span className="font-semibold text-yellow-700 dark:text-yellow-400">{edu.grade}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-6 relative">
                            <p className="text-muted-foreground text-lg leading-relaxed">{edu.description}</p>

                            {/* Enhanced Achievements */}
                            {edu.achievements && edu.achievements.length > 0 && (
                              <div className="space-y-4">
                                <h4 className="font-bold text-lg flex items-center gap-3">
                                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                    <Award className="h-4 w-4 text-white" />
                                  </div>
                                  Key Achievements
                                </h4>
                                <div className="grid gap-3">
                                  {edu.achievements.map((achievement, idx) => (
                                    <div key={idx} className="flex items-start space-x-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30">
                                      <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                      <span className="text-muted-foreground font-medium">{achievement}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Empty State */}
      {education.length === 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <BookOpen className="h-16 w-16 mx-auto text-muted-foreground" />
              <h3 className="text-2xl font-bold">No Education Records</h3>
              <p className="text-muted-foreground">
                Education information will be displayed here once added.
              </p>
            </div>
          </div>
        </section>
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