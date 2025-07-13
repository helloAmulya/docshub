import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { mockDatabase } from "@/lib/mock-data"
import { database } from "@/lib/database"
import { formatDate } from "@/lib/utils"
import { Calendar, ArrowRight, Code, Zap, Settings, Layers } from "lucide-react"

export default async function HomePage() {
  const posts = await mockDatabase.getAllPosts()
  const publishedPosts = posts.filter((post) => post.published)

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navigation />

      {/* Hero Section - Matching the image layout */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="space-y-8">
              <div>
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                  The story <span className="text-yellow-400">behind the code</span>
                </h1>
                <p className="text-gray-400 text-lg">(the human in the loop)</p>
              </div>

              <div className="space-y-6">
                <p className="text-gray-300 text-lg leading-relaxed">
                  Hi, I'm the creator of docsHub, a blogging platform built for dumping my thoughts, chaos, and tech.
                  I'm too concerned with my own stuff and just needed a place to speak out.
                  So yeah... this is the way.
                </p>

                <p className="text-gray-300 text-lg leading-relaxed">
                  i like building things that make sense to me.
                  maybe they'll help someone else. maybe not.
                  either way, it’s out there now.
                </p>
              </div>


              {/* Skill Badges */}
              <div className="grid grid-cols-2 gap-4">
                <div className="skill-badge">
                  <Code className="w-5 h-5 text-yellow-400" />
                  <span>Code That Breathes</span>
                </div>
                <div className="skill-badge">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <span>Fast AF</span>
                </div>
                <div className="skill-badge">
                  <Layers className="w-5 h-5 text-yellow-400" />
                  <span>System Driller</span>
                </div>
                <div className="skill-badge">
                  <Settings className="w-5 h-5 text-yellow-400" />
                  <span>Infra & Logic</span>
                </div>
              </div>
            </div>

            {/* Right Column - Hero Image */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl">
                <Image
                  src="/images/hero-image.png"
                  alt="A scenic tree-lined path representing the journey of coding"
                  width={600}
                  height={400}
                  className="w-full h-[400px] object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Latest Articles</h2>
            <p className="text-gray-400 text-lg">Insights, tutorials, and thoughts on tech & more </p>
          </div>

          {publishedPosts.length === 0 ? (
            <div className="text-center py-20">
              <div className="glass-card p-12 rounded-2xl max-w-md mx-auto">
                <h3 className="text-2xl font-semibold text-white mb-4">No posts yet</h3>
                <p className="text-gray-400 mb-8">Start creating amazing content for your readers.</p>
                <Link
                  href="/admin/create"
                  className="inline-flex items-center space-x-2 bg-yellow-400 text-black px-6 py-3 rounded-lg hover:bg-yellow-300 transition-all duration-300 font-medium"
                >
                  <span>Create First Post</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {publishedPosts.map((post) => (
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
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card p-12 rounded-2xl text-center">
            <h3 className="text-3xl font-bold text-white mb-4">
              Docs <span className="text-yellow-400">Hub</span>
            </h3>
            <p className="text-gray-400 mb-8 text-lg max-w-2xl mx-auto">
              A  little hub of docs and half-useful stuff. Made for devs, designers, and anyone tryna figure things out.
            </p>

            <div className="flex justify-center space-x-8 mb-8">
              <Link href="/" className="text-gray-400 hover:text-white transition-colors duration-200 text-lg">
                Home
              </Link>
              <Link href="/admin" className="text-gray-400 hover:text-white transition-colors duration-200 text-lg">
                Admin
              </Link>
            </div>
            <div className="pt-8 border-t border-white/10">
              <p className="text-gray-500">
                © 2025 DocsHub. Built with ❤️ using Next.js
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
