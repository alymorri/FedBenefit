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
    <div className="fixed inset-0 bg-gradient-to-b from-slate-100 to-slate-200 z-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border-2 border-primary/20 rounded shadow-lg p-6 relative overflow-hidden">
        {/* Blue top border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-primary"></div>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">FB</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">FedBenefit</h1>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent w-full"></div>
        </div>

        {/* Main content */}
        <div className="text-center space-y-4 mb-6">
          <h2 className="text-base sm:text-lg font-semibold text-foreground">
            Federal Benefits Verification Portal
          </h2>
          <h3 className="text-sm text-muted-foreground">
            Eligibility Assessment Questionnaire
          </h3>

          <div className="flex flex-col items-center justify-center mt-6 space-y-3">
            <div className="relative w-full h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-center">
              <Loader2 className="h-6 w-6 text-primary animate-spin mr-2" />
              <p className="text-sm font-medium text-foreground">Initializing secure session{dots}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center border-t border-border pt-4">
          <p className="text-xs text-muted-foreground font-medium">
            SECURE VERIFICATION SYSTEM • CONFIDENTIAL • {new Date().getFullYear()}
          </p>
        </div>

        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/40"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/40"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary/40"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/40"></div>
      </div>
    </div>
  )
}
