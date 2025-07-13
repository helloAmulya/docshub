"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { FloatingLabelInput } from "@/components/floating-label-input"

import { RichTextEditor } from "@/components/rich-text-editor"

import { generateSlug } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import type { BlogPost } from "@/lib/types"
import { Save, ArrowLeft, Trash2 } from "lucide-react"
import Link from "next/link"

export default function EditPostPage() {
  const { slug } = useParams() as { slug: string }
  const [post, setPost] = useState<BlogPost | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [slugState, setSlug] = useState("")
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (slug) fetchPost(slug)
  }, [slug])

  const fetchPost = async (slug: string) => {
    try {
      const response = await fetch(`/api/posts/${slug}`)
      if (response.ok) {
        const postData = await response.json()
        setPost(postData)
        setTitle(postData.title)
        setContent(postData.content)
        setSlug(postData.slug)
      } else {
        toast({
          title: "Error",
          description: "Post not found",
          variant: "destructive",
        })
        router.push("/admin")
      }
    } catch (error) {
      console.error("Error fetching post:", error)
      toast({
        title: "Error",
        description: "Failed to load post",
        variant: "destructive",
      })
    } finally {
      setInitialLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !content.trim() || !slugState.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/posts/${post?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          slug: slugState.trim(),
        }),
      })

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Post updated successfully",
        })
        router.push("/admin")
      } else {
        const error = await response.json()
        throw new Error(error.message || "Failed to update post")
      }
    } catch (error) {
      console.error("Error updating post:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update post",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return

    try {
      const response = await fetch(`/api/posts/${post?.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Post deleted successfully",
        })
        router.push("/admin")
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

  const generateSlugFromTitle = () => {
    setSlug(generateSlug(title))
  }

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass p-8 rounded-2xl">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400 mx-auto"></div>
          <p className="text-white/70 mt-4 text-center">Loading post...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass p-8 rounded-2xl text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Post Not Found</h2>
          <p className="text-white/70 mb-6">The post you're looking for doesn't exist.</p>
          <Link href="/admin">
            <Button variant="glass">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Edit Post</h1>
              <p className="text-white/70">Update your blog post content</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={handleDelete}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
              <Link href="/admin">
                <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="glass p-8 rounded-2xl space-y-6">
              <FloatingLabelInput label="Post Title" value={title} onChange={setTitle} required />

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  URL Slug <span className="text-red-400">*</span>
                </label>
                <div className="flex space-x-2">
                  <FloatingLabelInput label="URL Slug" value={slugState} onChange={setSlug} required />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={generateSlugFromTitle}
                    className="text-white/70 hover:text-white hover:bg-white/10 whitespace-nowrap"
                  >
                    Generate from Title
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-4">
                  Content <span className="text-red-400">*</span>
                </label>
                <RichTextEditor value={content} onChange={setContent} placeholder="Start writing your blog post..." />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Link href="/admin">
                <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" variant="glass" size="lg" disabled={loading} className="min-w-[150px]">
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
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




// "use client"

// import type React from "react"


// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Navigation } from "@/components/navigation"
// import { FloatingLabelInput } from "@/components/floating-label-input"
// import { RichTextEditor } from "@/components/rich-text-editor"
// import { generateSlug } from "@/lib/utils"
// import { useToast } from "@/hooks/use-toast"
// import type { BlogPost } from "@/lib/types"
// import { Save, ArrowLeft, Trash2 } from "lucide-react"
// import Link from "next/link"

// interface EditPostPageProps {
//   params: {
//     slug: string
//   }
// }

// export default function EditPostPage({ params }: EditPostPageProps) {
//   const [post, setPost] = useState<BlogPost | null>(null)
//   const [title, setTitle] = useState("")
//   const [content, setContent] = useState("")
//   const [slug, setSlug] = useState("")
//   const [loading, setLoading] = useState(false)
//   const [initialLoading, setInitialLoading] = useState(true)
//   const router = useRouter()
//   const { toast } = useToast()

//   useEffect(() => {
//     fetchPost()
//   }, [params.slug])

//   const fetchPost = async () => {
//     try {
//       const response = await fetch(`/api/posts/${params.slug}`)
//       if (response.ok) {
//         const postData = await response.json()
//         setPost(postData)
//         setTitle(postData.title)
//         setContent(postData.content)
//         setSlug(postData.slug)
//       } else {
//         toast({
//           title: "Error",
//           description: "Post not found",
//           variant: "destructive",
//         })
//         router.push("/admin")
//       }
//     } catch (error) {
//       console.error("Error fetching post:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load post",
//         variant: "destructive",
//       })
//     } finally {
//       setInitialLoading(false)
//     }
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!title.trim() || !content.trim() || !slug.trim()) {
//       toast({
//         title: "Validation Error",
//         description: "Please fill in all required fields",
//         variant: "destructive",
//       })
//       return
//     }

//     setLoading(true)

//     try {
//       const response = await fetch(`/api/posts/${post?.id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           title: title.trim(),
//           content: content.trim(),
//           slug: slug.trim(),
//         }),
//       })

//       if (response.ok) {
//         toast({
//           title: "Success!",
//           description: "Post updated successfully",
//         })
//         router.push("/admin")
//       } else {
//         const error = await response.json()
//         throw new Error(error.message || "Failed to update post")
//       }
//     } catch (error) {
//       console.error("Error updating post:", error)
//       toast({
//         title: "Error",
//         description: error instanceof Error ? error.message : "Failed to update post",
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleDelete = async () => {
//     if (!confirm(`Are you sure you want to delete "${title}"?`)) return

//     try {
//       const response = await fetch(`/api/posts/${post?.id}`, {
//         method: "DELETE",
//       })

//       if (response.ok) {
//         toast({
//           title: "Success",
//           description: "Post deleted successfully",
//         })
//         router.push("/admin")
//       } else {
//         throw new Error("Failed to delete post")
//       }
//     } catch (error) {
//       console.error("Error deleting post:", error)
//       toast({
//         title: "Error",
//         description: "Failed to delete post",
//         variant: "destructive",
//       })
//     }
//   }

//   const generateSlugFromTitle = () => {
//     setSlug(generateSlug(title))
//   }

//   if (initialLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="glass p-8 rounded-2xl">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400 mx-auto"></div>
//           <p className="text-white/70 mt-4 text-center">Loading post...</p>
//         </div>
//       </div>
//     )
//   }

//   if (!post) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="glass p-8 rounded-2xl text-center">
//           <h2 className="text-2xl font-bold text-white mb-4">Post Not Found</h2>
//           <p className="text-white/70 mb-6">The post you're looking for doesn't exist.</p>
//           <Link href="/admin">
//             <Button variant="glass">Back to Dashboard</Button>
//           </Link>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen">
//       <Navigation />

//       <div className="pt-32 pb-20 px-4">
//         <div className="max-w-4xl mx-auto">
//           {/* Header */}
//           <div className="flex items-center justify-between mb-12">
//             <div>
//               <h1 className="text-4xl font-bold text-white mb-2">Edit Post</h1>
//               <p className="text-white/70">Update your blog post content</p>
//             </div>
//             <div className="flex items-center space-x-4">
//               <Button
//                 variant="ghost"
//                 onClick={handleDelete}
//                 className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
//               >
//                 <Trash2 className="w-4 h-4 mr-2" />
//                 Delete
//               </Button>
//               <Link href="/admin">
//                 <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
//                   <ArrowLeft className="w-4 h-4 mr-2" />
//                   Back to Dashboard
//                 </Button>
//               </Link>
//             </div>
//           </div>

//           {/* Form */}
//           <form onSubmit={handleSubmit} className="space-y-8">
//             <div className="glass p-8 rounded-2xl space-y-6">
//               {/* Title Input */}
//               <FloatingLabelInput label="Post Title" value={title} onChange={setTitle} required />

//               {/* Slug Input */}
//               <div>
//                 <label className="block text-sm font-medium text-white/70 mb-2">
//                   URL Slug <span className="text-red-400">*</span>
//                 </label>
//                 <div className="flex space-x-2">
//                   <FloatingLabelInput label="URL Slug" value={slug} onChange={setSlug} required />
//                   <Button
//                     type="button"
//                     variant="ghost"
//                     onClick={generateSlugFromTitle}
//                     className="text-white/70 hover:text-white hover:bg-white/10 whitespace-nowrap"
//                   >
//                     Generate from Title
//                   </Button>
//                 </div>
//               </div>

//               {/* Content Editor */}
//               <div>
//                 <label className="block text-sm font-medium text-white/70 mb-4">
//                   Content <span className="text-red-400">*</span>
//                 </label>
//                 <RichTextEditor value={content} onChange={setContent} placeholder="Start writing your blog post..." />
//               </div>
//             </div>

//             {/* Submit Button */}
//             <div className="flex justify-end space-x-4">
//               <Link href="/admin">
//                 <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
//                   Cancel
//                 </Button>
//               </Link>
//               <Button type="submit" variant="glass" size="lg" disabled={loading} className="min-w-[150px]">
//                 {loading ? (
//                   <div className="flex items-center space-x-2">
//                     <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
//                     <span>Saving...</span>
//                   </div>
//                 ) : (
//                   <div className="flex items-center space-x-2">
//                     <Save className="w-4 h-4" />
//                     <span>Save Changes</span>
//                   </div>
//                 )}
//               </Button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   )
// }
