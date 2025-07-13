"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Navigation } from "@/components/navigation"
import type { BlogPost } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import { Search, Calendar, ArrowRight } from "lucide-react"

export default function PostsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  useEffect(() => {
    const filtered = posts.filter((post) => post.title.toLowerCase().includes(searchQuery.toLowerCase()))
    setFilteredPosts(filtered)
  }, [posts, searchQuery])

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts/public")
      const data = await response.json()
      setPosts(data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching posts:", error)
      setLoading(false)
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
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navigation />

      <div className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-4">
              All <span className="text-yellow-400">Posts</span>
            </h1>
            <p className="text-gray-400 text-lg">Explore our latest articles and insights</p>
          </div>

          {/* Search Bar */}
          <div className="mb-12 max-w-md mx-auto">
            <div className="relative">
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
                <p className="text-gray-400 mb-8">
                  {searchQuery ? "Try adjusting your search terms" : "Check back soon for new content"}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Link key={post.id} href={`/posts/${post.slug}`}>
                  <Card className="glass-card hover:bg-[#1a1a1a] transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl group cursor-pointer h-full border-white/10">
                    <CardHeader>
                      <div className="flex items-center space-x-2 text-gray-500 text-sm mb-3">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(post.createdAt)}</span>
                      </div>
                      <CardTitle className="text-white group-hover:text-yellow-400 transition-colors duration-200 line-clamp-2 text-xl">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-400 line-clamp-3 mb-6 text-base leading-relaxed">
                        {post.excerpt}
                      </CardDescription>
                      <div className="flex items-center space-x-2 text-yellow-400 text-sm font-medium group-hover:text-yellow-300 transition-colors duration-200">
                        <span>Read more</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
