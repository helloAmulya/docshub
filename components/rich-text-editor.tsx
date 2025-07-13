"use client"

import dynamic from "next/dynamic"
import { useMemo } from "react"

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false })
import "react-quill-new/dist/quill.snow.css"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["blockquote", "code-block"],
        ["link"],
        ["clean"],
      ],
      clipboard: { matchVisual: false },
    }),
    []
  )

  const formats = useMemo(
    () => ["header", "bold", "italic", "underline", "strike", "list", "bullet", "blockquote", "code-block", "link"],
    []
  )

  return (
    <div className="glass-card rounded-lg overflow-hidden border-white/10">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{ backgroundColor: "transparent" }}
      />
    </div>
  )
}


// "use client"

// /**
//  * Rich Text Editor Component using React Quill
//  *
//  * DEPLOYMENT REQUIREMENTS:
//  * 1. React Quill is already included in package.json
//  * 2. CSS is imported from 'react-quill/dist/quill.snow.css'
//  * 3. Component is dynamically imported to avoid SSR issues
//  *
//  * Features:
//  * - Rich text formatting (bold, italic, underline, etc.)
//  * - Headers (H1, H2, H3)
//  * - Lists (ordered and unordered)
//  * - Links and blockquotes
//  * - Code blocks
//  * - Dark theme styling
//  */

// import dynamic from "next/dynamic"
// import { useMemo } from "react"

// // Dynamically import ReactQuill to avoid SSR issues
// const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })
// import "react-quill/dist/quill.snow.css"

// interface RichTextEditorProps {
//   value: string
//   onChange: (value: string) => void
//   placeholder?: string
// }

// export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
//   // Memoize modules and formats to prevent unnecessary re-renders
//   const modules = useMemo(
//     () => ({
//       toolbar: [
//         [{ header: [1, 2, 3, false] }],
//         ["bold", "italic", "underline", "strike"],
//         [{ list: "ordered" }, { list: "bullet" }],
//         ["blockquote", "code-block"],
//         ["link"],
//         ["clean"],
//       ],
//       clipboard: {
//         // Toggle to add extra line breaks when pasting HTML:
//         matchVisual: false,
//       },
//     }),
//     [],
//   )

//   const formats = useMemo(
//     () => ["header", "bold", "italic", "underline", "strike", "list", "bullet", "blockquote", "code-block", "link"],
//     [],
//   )

//   return (
//     <div className="glass-card rounded-lg overflow-hidden border-white/10">
//       <ReactQuill
//         theme="snow"
//         value={value}
//         onChange={onChange}
//         modules={modules}
//         formats={formats}
//         placeholder={placeholder}
//         style={{
//           backgroundColor: "transparent",
//         }}
//       />
//     </div>
//   )
// }
