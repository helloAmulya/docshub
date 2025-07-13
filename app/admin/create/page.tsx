"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { FloatingLabelInput } from "@/components/floating-label-input"
import { RichTextEditor } from "@/components/rich-text-editor"
import { generateSlug } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { Save, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CreatePostPage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const slug = generateSlug(title)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !content.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          slug,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Post created successfully",
        })
        router.push("/admin")
      } else {
        const error = await response.json()
        throw new Error(error.message || "Failed to create post")
      }
    } catch (error) {
      console.error("Error creating post:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create post",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Create New Post</h1>
              <p className="text-white/70">Write and publish your next blog post</p>
            </div>
            <Link href="/admin">
              <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="glass p-8 rounded-2xl space-y-6">
              {/* Title Input */}
              <FloatingLabelInput label="Post Title" value={title} onChange={setTitle} required />

              {/* Auto-generated Slug */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">URL Slug (auto-generated)</label>
                <div className="glass p-3 rounded-lg">
                  <code className="text-purple-300 text-sm">{slug || "your-post-slug-will-appear-here"}</code>
                </div>
              </div>

              {/* Content Editor */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-4">
                  Content <span className="text-red-400">*</span>
                </label>
                <RichTextEditor value={content} onChange={setContent} placeholder="Start writing your blog post..." />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button type="submit" variant="glass" size="lg" disabled={loading} className="min-w-[150px]">
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    <span>Creating...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Save className="w-4 h-4" />
                    <span>Create Post</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
