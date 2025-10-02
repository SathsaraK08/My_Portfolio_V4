"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Mail, MailOpen, Archive, Trash2, Reply, Star } from "lucide-react"

type Message = {
  id: string
  name: string
  email: string
  subject?: string
  message: string
  status: "UNREAD" | "READ" | "REPLIED" | "ARCHIVED"
  isArchived: boolean
  createdAt: string
}

// Mock data
const mockMessages: Message[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john@example.com",
    subject: "Project Inquiry",
    message: "Hi, I'm interested in hiring you for a web development project. Can we discuss the details?",
    status: "UNREAD",
    isArchived: false,
    createdAt: "2023-12-15T10:30:00Z"
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@company.com",
    subject: "Collaboration Opportunity",
    message: "We're looking for a developer to join our team on a exciting project. Your portfolio impressed us!",
    status: "READ",
    isArchived: false,
    createdAt: "2023-12-14T15:45:00Z"
  },
  {
    id: "3",
    name: "Mike Davis",
    email: "mike.davis@tech.com",
    subject: "Technical Question",
    message: "I saw your React project and have some questions about the implementation. Could you help?",
    status: "REPLIED",
    isArchived: false,
    createdAt: "2023-12-13T09:15:00Z"
  },
  {
    id: "4",
    name: "Emma Wilson",
    email: "emma@startup.io",
    subject: "Freelance Work",
    message: "We need help with our mobile app development. Are you available for freelance work?",
    status: "ARCHIVED",
    isArchived: true,
    createdAt: "2023-12-10T14:20:00Z"
  }
]

const statusColors = {
  UNREAD: "bg-blue-100 text-blue-800",
  READ: "bg-gray-100 text-gray-800", 
  REPLIED: "bg-green-100 text-green-800",
  ARCHIVED: "bg-yellow-100 text-yellow-800"
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.message.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = selectedStatus === "All" || message.status === selectedStatus

    return matchesSearch && matchesStatus && !message.isArchived
  })

  // Load messages
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await fetch('/api/admin/messages')
        if (response.ok) {
          const data = await response.json()
          setMessages(data)
        }
      } catch (error) {
        console.error('Failed to load messages:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadMessages()
  }, [])

  const updateMessageStatus = async (messageId: string, status: Message["status"]) => {
    try {
      const response = await fetch(`/api/admin/messages/${messageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        setMessages(messages.map(msg =>
          msg.id === messageId ? { ...msg, status } : msg
        ))
      }
    } catch (error) {
      console.error('Failed to update message status:', error)
    }
  }

  const archiveMessage = async (messageId: string) => {
    try {
      const response = await fetch(`/api/admin/messages/${messageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: "ARCHIVED", isArchived: true })
      })

      if (response.ok) {
        setMessages(messages.map(msg =>
          msg.id === messageId ? { ...msg, isArchived: true, status: "ARCHIVED" } : msg
        ))
      }
    } catch (error) {
      console.error('Failed to archive message:', error)
    }
  }

  const deleteMessage = async (messageId: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return

    try {
      const response = await fetch(`/api/admin/messages/${messageId}`, { method: 'DELETE' })
      if (response.ok) {
        setMessages(messages.filter(msg => msg.id !== messageId))
      }
    } catch (error) {
      console.error('Failed to delete message:', error)
    }
  }

  const markAsRead = (message: Message) => {
    if (message.status === "UNREAD") {
      updateMessageStatus(message.id, "READ")
    }
    setSelectedMessage(message)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const unreadCount = messages.filter(msg => msg.status === "UNREAD" && !msg.isArchived).length
  const totalCount = messages.filter(msg => !msg.isArchived).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Messages</h1>
          <p className="text-muted-foreground">
            Manage contact form submissions ({unreadCount} unread of {totalCount} total)
          </p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 animate-pulse">
              {unreadCount} Unread
            </Badge>
          )}
          <Badge variant="outline" className="border-2">{totalCount} Total</Badge>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-l-4 border-l-blue-500 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
                <Input
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="flex h-10 rounded-md border-2 border-input bg-background px-3 py-2 text-sm hover:border-blue-400 focus:border-blue-500 transition-colors"
            >
              <option value="All">All Status</option>
              <option value="UNREAD">Unread</option>
              <option value="READ">Read</option>
              <option value="REPLIED">Replied</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Messages List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Inbox ({filteredMessages.length})</h2>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredMessages.map((message) => (
              <Card 
                key={message.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedMessage?.id === message.id ? "ring-2 ring-primary" : ""
                } ${message.status === "UNREAD" ? "border-l-4 border-l-blue-500" : ""}`}
                onClick={() => markAsRead(message)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-sm font-medium">{message.name}</CardTitle>
                        {message.status === "UNREAD" && (
                          <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{message.email}</p>
                      {message.subject && (
                        <p className="text-sm font-medium">{message.subject}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Badge className={`text-xs ${statusColors[message.status]}`}>
                        {message.status.toLowerCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground line-clamp-2">{message.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {formatDate(message.createdAt)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredMessages.length === 0 && (
            <Card className="text-center py-8">
              <CardContent>
                <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No messages found</h3>
                <p className="text-muted-foreground">
                  {searchQuery ? "Try adjusting your search" : "No messages match the current filter"}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Message Detail */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Message Details</h2>
          {selectedMessage ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle>{selectedMessage.subject || "No Subject"}</CardTitle>
                    <CardDescription>
                      From: {selectedMessage.name} ({selectedMessage.email})
                    </CardDescription>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(selectedMessage.createdAt)}
                    </p>
                  </div>
                  <Badge className={`${statusColors[selectedMessage.status]}`}>
                    {selectedMessage.status.toLowerCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedMessage.status === "UNREAD" && (
                    <Button 
                      size="sm"
                      onClick={() => updateMessageStatus(selectedMessage.id, "READ")}
                    >
                      <MailOpen className="h-3 w-3 mr-1" />
                      Mark as Read
                    </Button>
                  )}
                  
                  {selectedMessage.status !== "REPLIED" && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => updateMessageStatus(selectedMessage.id, "REPLIED")}
                    >
                      <Reply className="h-3 w-3 mr-1" />
                      Mark as Replied
                    </Button>
                  )}

                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => archiveMessage(selectedMessage.id)}
                  >
                    <Archive className="h-3 w-3 mr-1" />
                    Archive
                  </Button>

                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => deleteMessage(selectedMessage.id)}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>

                  <Button 
                    size="sm" 
                    variant="outline"
                    asChild
                  >
                    <a href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || "Your inquiry"}`}>
                      <Mail className="h-3 w-3 mr-1" />
                      Reply via Email
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Select a message</h3>
                <p className="text-muted-foreground">
                  Click on a message from the list to view its details
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Stats */}
      <Card className="border-t-4 border-t-gradient-to-r from-blue-500 to-purple-500 shadow-md">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
          <CardTitle>Message Statistics</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-950 hover:scale-105 transition-transform">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{unreadCount}</div>
              <div className="text-sm text-muted-foreground mt-1">Unread</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-950 hover:scale-105 transition-transform">
              <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {messages.filter(msg => msg.status === "REPLIED").length}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Replied</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950 hover:scale-105 transition-transform">
              <div className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                {messages.filter(msg => msg.isArchived).length}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Archived</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-900 hover:scale-105 transition-transform">
              <div className="text-3xl font-bold bg-gradient-to-r from-gray-600 to-slate-600 bg-clip-text text-transparent">{messages.length}</div>
              <div className="text-sm text-muted-foreground mt-1">Total</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}