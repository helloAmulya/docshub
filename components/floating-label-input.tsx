"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface FloatingLabelInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  disabled?: boolean
  required?: boolean
}

export function FloatingLabelInput({
  label,
  value,
  onChange,
  type = "text",
  disabled = false,
  required = false,
}: FloatingLabelInputProps) {
  const [focused, setFocused] = useState(false)

  const hasValue = value.length > 0
  const shouldFloat = focused || hasValue

  return (
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        disabled={disabled}
        required={required}
        className={cn(
          "glass-card w-full px-4 py-3 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-yellow-400/50 rounded-lg transition-all duration-200 border-white/10",
          disabled && "opacity-50 cursor-not-allowed",
        )}
        placeholder={label}
      />
      <label
        className={cn(
          "absolute left-4 transition-all duration-200 pointer-events-none text-gray-400",
          shouldFloat ? "top-1 text-xs text-yellow-400" : "top-3 text-base",
        )}
      >
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
    </div>
  )
}
