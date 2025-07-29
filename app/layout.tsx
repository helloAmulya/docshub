import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@vercel/analytics/next"


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "docsHub ",
  description: "A beautiful, modern blog CMS built with Next.js",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-[#0a0a0a]">{children}</div>
        <Analytics />

        <Toaster />
      </body>
    </html>
  )
}
