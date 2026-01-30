"use client"

import { useEffect, useState } from "react"

export function CountdownTimer({ expiryDate, isActive = false }) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    if (!isActive) {
      // Set initial state but don't start countdown
      const difference = +expiryDate - +new Date()
      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
      return
    }

    const calculateTimeLeft = () => {
      const difference = +expiryDate - +new Date()

      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [expiryDate, isActive])

  return (
    <div className="flex justify-center items-center space-x-2 py-2">
      <div className="flex flex-col items-center">
        <div className="bg-red-600 text-white font-bold rounded px-3 py-2 text-xl">
          {String(timeLeft.hours).padStart(2, "0")}
        </div>
        <span className="text-xs mt-1">Hours</span>
      </div>
      <span className="text-xl font-bold text-red-600">:</span>
      <div className="flex flex-col items-center">
        <div className="bg-red-600 text-white font-bold rounded px-3 py-2 text-xl">
          {String(timeLeft.minutes).padStart(2, "0")}
        </div>
        <span className="text-xs mt-1">Minutes</span>
      </div>
      <span className="text-xl font-bold text-red-600">:</span>
      <div className="flex flex-col items-center">
        <div className="bg-red-600 text-white font-bold rounded px-3 py-2 text-xl">
          {String(timeLeft.seconds).padStart(2, "0")}
        </div>
        <span className="text-xs mt-1">Seconds</span>
      </div>
    </div>
  )
}
