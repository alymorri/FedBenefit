"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

export function LoadingScreen() {
  const [dots, setDots] = useState("")
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return ""
        return prev + "."
      })
    }, 400)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100
        return prev + 5
      })
    }, 90) // Will reach 100% in ~1.8 seconds

    return () => {
      clearInterval(interval)
      clearInterval(progressInterval)
    }
  }, [])

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-gray-50 to-gray-100 z-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border-2 border-gray-200 rounded-lg shadow-lg p-6 relative overflow-hidden">
        {/* Red top border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-red-600"></div>

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight uppercase">Official Notice</h1>
          <div className="h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent w-full mt-1"></div>
        </div>

        {/* Main content */}
        <div className="text-center space-y-4 mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-red-600 uppercase tracking-wider">FEDERAL RECOVERY AUDIT</h2>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 uppercase tracking-wide">
            Recovery Credit Questionnaire
          </h3>

          <div className="flex flex-col items-center justify-center mt-6 space-y-3">
            <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-red-600 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-center">
              <Loader2 className="h-6 w-6 text-red-600 animate-spin mr-2" />
              <p className="text-sm font-medium text-gray-700">Initializing secure session{dots}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center border-t border-gray-200 pt-4">
          <p className="text-xs text-gray-500 font-medium">
            SECURE VERIFICATION SYSTEM • CONFIDENTIAL • {new Date().getFullYear()}
          </p>
        </div>

        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-red-600"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-red-600"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-red-600"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-red-600"></div>
      </div>
    </div>
  )
}
