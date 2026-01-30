"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

export function CheckingAnimation({ text }) {
  const [dots, setDots] = useState("")

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return ""
        return prev + "."
      })
    }, 400)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <Loader2 className="h-10 w-10 text-red-600 animate-spin" />
      <p className="text-base font-medium">
        {text}
        {dots}
      </p>
    </div>
  )
}
