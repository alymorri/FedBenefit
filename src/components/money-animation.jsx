"use client"

import { useEffect, useState, useRef } from "react"
import { DollarSign } from "lucide-react"

export function MoneyAnimation() {
  const [isAnimating, setIsAnimating] = useState(false)
  const [displayAmount, setDisplayAmount] = useState("0.00")
  const targetAmount = 2007.32
  const countRef = useRef(null)
  const frameRef = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(true)
      startCountAnimation()
    }, 300)

    return () => {
      clearTimeout(timer)
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [])

  const startCountAnimation = () => {
    let startTime = null
    const duration = 2000 // 2 seconds for the animation
    countRef.current = 0

    const animateCount = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)

      // Easing function for a more natural counting effect
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)

      const currentCount = easeOutQuart * targetAmount
      countRef.current = currentCount

      // Format with 2 decimal places and thousands separator
      setDisplayAmount(
        currentCount.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
      )

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animateCount)
      }
    }

    frameRef.current = requestAnimationFrame(animateCount)
  }

  return (
    <div className="relative w-64 h-40 flex items-center justify-center">
      {/* Background glow */}
      <div
        className={`absolute inset-0 bg-gradient-to-r from-green-100 to-green-50 rounded-xl shadow-lg transition-all duration-1000 ${isAnimating ? "scale-100 opacity-100" : "scale-0 opacity-0"
          }`}
      />

      {/* Border effect */}
      <div
        className={`absolute inset-0 border-2 border-green-400 rounded-xl transition-all duration-1000 ${isAnimating ? "scale-98 opacity-70" : "scale-0 opacity-0"
          }`}
      />

      {/* Dollar sign and amount */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 ${isAnimating ? "scale-100 opacity-100" : "scale-0 opacity-0"
          }`}
      >
        <div className="text-green-700 font-semibold text-lg mb-2 text-center">You were found eligible for</div>

        <div className="flex items-center text-green-600 animate-pulse">
          <DollarSign className="h-14 w-14 drop-shadow-md" strokeWidth={2.5} />
          <div className="flex flex-col ml-1">
            <span className="text-4xl font-bold tracking-tight drop-shadow-md">{displayAmount}</span>
            <span className="text-sm text-green-700 font-medium">Tariff Rebate Credits</span>
          </div>
        </div>
      </div>
    </div>
  )
}
