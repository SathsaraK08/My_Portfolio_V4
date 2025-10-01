"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, MapPin, Phone, Send, Github, Linkedin, Twitter, Calendar, Clock } from "lucide-react"
import Link from "next/link"

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters").max(200, "Subject is too long"),
  message: z.string().min(10, "Message must be at least 10 characters").max(1000, "Message is too long")
})

type ContactFormData = z.infer<typeof contactFormSchema>

const socialLinks = [
  {
    name: "GitHub",
    url: "https://github.com/johndoe",
    icon: Github,
    username: "@johndoe"
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/johndoe",
    icon: Linkedin,
    username: "/in/johndoe"
  },
  {
    name: "Twitter",
    url: "https://twitter.com/johndoe",
    icon: Twitter,
    username: "@johndoe"
  }
]

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "john.doe@example.com",
    href: "mailto:john.doe@example.com"
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+1 (555) 123-4567",
    href: "tel:+15551234567"
  },
  {
    icon: MapPin,
    label: "Location",
    value: "San Francisco, CA",
    href: "https://maps.google.com/?q=San Francisco, CA"
  }
]

const workingHours = [
  { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM PST" },
  { day: "Saturday", hours: "10:00 AM - 2:00 PM PST" },
  { day: "Sunday", hours: "Closed" }
]

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema)
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Here you would typically send the data to your API
      console.log("Form data:", data)
      
      setSubmitStatus("success")
      reset()
    } catch (error) {
      console.error("Failed to send message:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
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
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
            Get In Touch
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind or want to collaborate? I'd love to hear from you.
            Let's discuss how we can bring your ideas to life.
          </p>
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

      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <section className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Send me a message</h2>
            <p className="text-muted-foreground">
              Fill out the form below and I'll get back to you as soon as possible.
              Usually within 24 hours.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Contact Form</CardTitle>
              <CardDescription>
                I'm always interested in new opportunities and exciting projects.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Name *
                    </label>
                    <Input
                      id="name"
                      placeholder="Your full name"
                      {...register("name")}
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email *
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      {...register("email")}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject *
                  </label>
                  <Input
                    id="subject"
                    placeholder="Project inquiry, collaboration, etc."
                    {...register("subject")}
                    className={errors.subject ? "border-red-500" : ""}
                  />
                  {errors.subject && (
                    <p className="text-sm text-red-500">{errors.subject.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    placeholder="Tell me about your project, timeline, budget, and any specific requirements..."
                    {...register("message")}
                    className={`flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none ${
                      errors.message ? "border-red-500" : ""
                    }`}
                  />
                  {errors.message && (
                    <p className="text-sm text-red-500">{errors.message.message}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>

                {/* Status Messages */}
                {submitStatus === "success" && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-green-800 text-sm">
                      ✅ Message sent successfully! I'll get back to you soon.
                    </p>
                  </div>
                )}

                {submitStatus === "error" && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-800 text-sm">
                      ❌ Failed to send message. Please try again or contact me directly.
                    </p>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </section>

        {/* Contact Information */}
        <section className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Let's connect</h2>
            <p className="text-muted-foreground">
              Prefer to reach out directly? You can find me through any of these channels.
            </p>
          </div>

          {/* Contact Details */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {contactInfo.map((info) => (
                <div key={info.label} className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <info.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{info.label}</div>
                    <a 
                      href={info.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {info.value}
                    </a>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card>
            <CardHeader>
              <CardTitle>Social Media</CardTitle>
              <CardDescription>
                Follow me on social media for updates and insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <social.icon className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{social.name}</div>
                      <div className="text-xs text-muted-foreground">{social.username}</div>
                    </div>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Working Hours */}
          <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-green-200/50 dark:border-green-800/50">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-blue-500/5 rounded-3xl"></div>
            
            <div className="relative z-10">
              <div className="text-center space-y-3 mb-8">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/30 dark:to-blue-900/30 rounded-full border border-green-200/50 dark:border-green-700/50">
                  <Clock className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-semibold text-muted-foreground">Working Hours</span>
                </div>
                <p className="text-muted-foreground text-sm">
                  When you can expect a response from me
                </p>
              </div>

              <div className="space-y-4">
                {workingHours.map((schedule, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-green-50/50 to-blue-50/50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200/30 dark:border-green-700/30">
                    <span className="font-semibold">{schedule.day}</span>
                    <span className="text-muted-foreground font-medium">{schedule.hours}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/30 dark:to-blue-900/30 rounded-2xl border border-green-200/50 dark:border-green-700/50">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">🌍</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    All times are in Pacific Standard Time (PST). For urgent matters, feel free to email me anytime.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Project Types */}
          <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-orange-200/50 dark:border-orange-800/50">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-purple-500/5 rounded-3xl"></div>
            
            <div className="relative z-10">
              <div className="text-center space-y-3 mb-8">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-orange-50 to-purple-50 dark:from-orange-900/30 dark:to-purple-900/30 rounded-full border border-orange-200/50 dark:border-orange-700/50">
                  <Calendar className="h-5 w-5 text-orange-500" />
                  <span className="text-sm font-semibold text-muted-foreground">Project Types</span>
                </div>
                <p className="text-muted-foreground text-sm">
                  I'm interested in working on these types of projects
                </p>
              </div>

              <div className="flex flex-wrap gap-3 justify-center">
                {[
                  "Web Applications",
                  "Mobile Apps", 
                  "API Development",
                  "E-commerce",
                  "SaaS Products",
                  "Consulting",
                  "Code Reviews",
                  "Technical Writing"
                ].map((type) => (
                  <Badge key={type} className="px-4 py-2 bg-gradient-to-r from-orange-500/10 to-purple-500/10 text-orange-700 dark:text-orange-300 border border-orange-200/50 dark:border-orange-700/50 hover:from-orange-500/20 hover:to-purple-500/20 transition-all duration-300 rounded-full">
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800" />
        <div className="absolute inset-0 bg-black/10" />
        
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Ready to start your project?
          </h2>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-12 leading-relaxed">
            Whether you have a clear vision or just an idea, I'm here to help turn it into reality.
            Let's schedule a call to discuss your project in detail.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 border-0 font-semibold" asChild>
              <a href="mailto:john.doe@example.com?subject=Project Inquiry">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule a Call
              </a>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
              <Link href="/projects">View My Work</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}