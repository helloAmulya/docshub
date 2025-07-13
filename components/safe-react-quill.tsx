"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import type { Quill } from "react-quill"

// Dynamically import react-quill with SSR disabled
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })

// Optional: fallback if needed
const fallback = <div className="text-white/50">Loading editor...</div>

type Props = React.ComponentProps<typeof ReactQuill>

export default function SafeReactQuill(props: Props) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return fallback

  return <ReactQuill {...props} />
}
