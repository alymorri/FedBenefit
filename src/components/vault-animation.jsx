"use client"

import { useEffect, useState } from "react"
import { Lock } from "lucide-react"

export function VaultAnimation() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <div
        className={`absolute inset-0 bg-green-100 rounded-full transition-all duration-1000 ${isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
      />

      <div
        className={`absolute inset-0 border-4 border-green-600 rounded-full transition-all duration-1000 ${isOpen ? "scale-90 opacity-30" : "scale-0 opacity-0"}`}
      />

      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
      >
        <Lock className="h-12 w-12 text-green-600" />
      </div>
    </div>
  )
}
