"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Navigation } from "@/components/navigation"
import { AdminHeader } from "@/components/admin-header"
import type { BlogPost } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import { Search, Plus, Edit, Trash2, Eye, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AdminDashboard() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchPosts()
  }, [])

  useEffect(() => {
    const filtered = posts.filter((post) => post.title.toLowerCase().includes(searchQuery.toLowerCase()))
    setFilteredPosts(filtered)
  }, [posts, searchQuery])

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts", {
        credentials: "include", // Include cookies for authentication
      })

      if (response.status === 401) {
        toast({
          title: "Session Expired",
          description: "Please log in again",
          variant: "destructive",
        })
        window.location.href = "/admin/login"
        return
      }

      const data = await response.json()
      setPosts(data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching posts:", error)
      toast({
        title: "Error",
        description: "Failed to fetch posts",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (response.status === 401) {
        toast({
          title: "Session Expired",
          description: "Please log in again",
          variant: "destructive",
        })
        window.location.href = "/admin/login"
        return
      }

      if (response.ok) {
        setPosts(posts.filter((post) => post.id !== id))
        toast({
          title: "Success",
          description: "Post deleted successfully",
        })
      } else {
        throw new Error("Failed to delete post")
      }
    } catch (error) {
      console.error("Error deleting post:", error)
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 rounded-2xl">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="text-white/70 mt-4 text-center">Loading posts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Admin Header with Logout */}
          <AdminHeader />

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 space-y-4 md:space-y-0">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Blog Management</h1>
              <p className="text-white/70">Manage your blog posts and content</p>
            </div>
            <Link href="/admin/create">
              <Button variant="default" size="lg" className="flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>New Post</span>
              </Button>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-card pl-10 text-white placeholder-white/50 border-white/20 focus:border-yellow-400/50"
              />
            </div>
          </div>

          {/* Posts Grid */}
          {filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <div className="glass-card p-12 rounded-2xl max-w-md mx-auto">
                <h3 className="text-2xl font-semibold text-white mb-4">
                  {searchQuery ? "No posts found" : "No posts yet"}
                </h3>
                <p className="text-white/70 mb-8">
                  {searchQuery ? "Try adjusting your search terms" : "Create your first blog post to get started"}
                </p>
                {!searchQuery && (
                  <Link href="/admin/create">
                    <Button variant="default" size="lg">
                      <Plus className="w-5 h-5 mr-2" />
                      Create First Post
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <Card
                  key={post.id}
                  className="glass-card border-white/20 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
                >
                  <CardHeader>
                    <div className="flex items-center space-x-2 text-white/60 text-sm mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                    <CardTitle className="text-white group-hover:text-yellow-400 transition-colors duration-200 line-clamp-2">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/70 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                    <div className="text-xs text-white/50 mb-4">
                      Slug: <code className="bg-white/10 px-2 py-1 rounded">{post.slug}</code>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                      <Link href={`/posts/${post.slug}`} target="_blank">
                        <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href={`/admin/edit/${post.slug}`}>
                        <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(post.id, post.title)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
