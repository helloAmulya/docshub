"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BookOpen, PlusCircle, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

export function Navigation() {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith("/admin")

  if (isAdmin) {
    // Admin navigation
    return (
      <nav className="glass-card fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-full border-white/10">
        <div className="flex items-center space-x-6">
          <Link
            href="/admin"
            className={cn(
              "text-gray-400 hover:text-white transition-colors duration-200 flex items-center space-x-2",
              pathname === "/admin" && "text-white",
            )}
          >
            <BookOpen className="w-4 h-4" />
            <span>Posts</span>
          </Link>
          <Link
            href="/admin/create"
            className={cn(
              "text-gray-400 hover:text-white transition-colors duration-200 flex items-center space-x-2",
              pathname === "/admin/create" && "text-white",
            )}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create</span>
          </Link>
          <Link
            href="/"
            className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center space-x-2"
          >
            <Home className="w-4 h-4" />
            <span>View Site</span>
          </Link>
        </div>
      </nav>
    )
  }

  // Public navigation
  return (
    <nav className="glass-card fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-full border-white/10">
      <div className="flex items-center space-x-6">
        <Link
          href="/"
          className={cn(
            "text-gray-400 hover:text-white transition-colors duration-200 flex items-center space-x-2",
            pathname === "/" && "text-white",
          )}
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </Link>
        <Link
          href="/posts"
          className={cn(
            "text-gray-400 hover:text-white transition-colors duration-200 flex items-center space-x-2",
            pathname === "/posts" && "text-white",
          )}
        >
          <BookOpen className="w-4 h-4" />
          <span>Posts</span>
        </Link>
        <Link
          href="/admin/login"
          className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center space-x-2"
        >
          <Lock className="w-4 h-4" />
          <span className="text-xs">Admin</span>
        </Link>
      </div>
    </nav>
  )
}
