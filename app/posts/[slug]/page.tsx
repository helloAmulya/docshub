import { notFound } from "next/navigation"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
// import { mockDatabase } from "@/lib/mock-data"
// using real data stored in mongo db
import { database } from "@/lib/database"
import { formatDate } from "@/lib/utils"
import { Calendar, ArrowLeft, User } from "lucide-react"
import type { Metadata } from "next"

interface PostPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = await database.getPostBySlug(params.slug)

  if (!post) {
    return {
      title: "Post Not Found - DocsHub",
    }
  }

  return {
    title: `${post.title} - DocsHub`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
    },
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await database.getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navigation />

      <article className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link
            href="/posts"
            className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200 mb-8 glass-card px-4 py-2 rounded-lg border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Posts</span>
          </Link>

          {/* Article Header */}
          <header className="mb-12">
            <div className="glass-card p-8 rounded-2xl border-white/10">
              <div className="flex items-center space-x-6 text-gray-500 text-sm mb-6">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(post.createdAt)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>DocsHub</span>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">{post.title}</h1>

              <p className="text-xl text-gray-300 leading-relaxed">{post.excerpt}</p>
            </div>
          </header>

          {/* Article Content */}
          <div className="glass-card p-8 md:p-12 rounded-2xl border-white/10">
            <div
              className="prose prose-lg prose-invert max-w-none
                prose-headings:text-white prose-headings:font-bold
                prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-8
                prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-8 prose-h2:text-yellow-400
                prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-6
                prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4
                prose-a:text-yellow-400 prose-a:no-underline hover:prose-a:text-yellow-300
                prose-strong:text-white prose-strong:font-semibold
                prose-ul:text-gray-300 prose-ol:text-gray-300
                prose-li:mb-2 prose-li:leading-relaxed
                prose-blockquote:border-l-yellow-400 prose-blockquote:bg-white/5 
                prose-blockquote:p-4 prose-blockquote:rounded-r-lg prose-blockquote:text-gray-300
                prose-code:bg-white/10 prose-code:text-yellow-400 prose-code:px-2 prose-code:py-1 prose-code:rounded
                prose-pre:bg-black/30 prose-pre:border prose-pre:border-white/20"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          {/* Article Footer */}
          <footer className="mt-12">
            <div className="glass-card p-6 rounded-2xl text-center border-white/10">
              <p className="text-gray-400 mb-4">Thanks for reading! Share your thoughts and feedback.</p>
              <Link
                href="/posts"
                className="inline-flex items-center space-x-2 text-yellow-400 hover:text-yellow-300 transition-colors duration-200"
              >
                <span>← Back to all posts</span>
              </Link>
            </div>
          </footer>
        </div>
      </article>
    </div>
  )
}
