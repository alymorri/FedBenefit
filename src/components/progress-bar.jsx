"use client"

import { useEffect, useState } from "react"

export function ProgressBar({ progress }) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    // Animate progress change
    const timer = setTimeout(() => {
      setWidth(progress)
    }, 100)

    return () => clearTimeout(timer)
  }, [progress])

  return (
    <div className="w-full h-2 bg-gray-200">
      <div className="h-full bg-red-600 transition-all duration-500 ease-out" style={{ width: `${width}%` }} />
    </div>
  )
}
