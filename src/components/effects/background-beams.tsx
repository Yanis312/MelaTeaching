"use client"
import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

export function BackgroundBeams({ className }: { className?: string }) {
  const beamsRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = beamsRef.current
    if (!svg) return
    let frame: number
    let t = 0
    const animate = () => {
      t += 0.003
      const paths = svg.querySelectorAll("path")
      paths.forEach((p, i) => {
        const offset = i * 0.4
        const opacity = 0.3 + 0.25 * Math.sin(t + offset)
        p.style.opacity = String(Math.max(0.05, opacity))
      })
      frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      <svg
        ref={beamsRef}
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="beam1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
            <stop offset="50%" stopColor="#818cf8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="beam2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0" />
            <stop offset="50%" stopColor="#c4b5fd" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="beam3" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
            <stop offset="50%" stopColor="#7dd3fc" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="beam4" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#f472b6" stopOpacity="0" />
            <stop offset="50%" stopColor="#f9a8d4" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#f472b6" stopOpacity="0" />
          </linearGradient>
          <filter id="blur">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>
        {/* Beams */}
        <path d="M-100 300 Q200 0 500 300 Q700 500 900 200" stroke="url(#beam1)" strokeWidth="2" fill="none" filter="url(#blur)" />
        <path d="M900 100 Q600 400 300 200 Q100 0 -100 400" stroke="url(#beam2)" strokeWidth="1.5" fill="none" filter="url(#blur)" />
        <path d="M0 600 Q300 200 600 500 Q750 650 900 300" stroke="url(#beam3)" strokeWidth="2" fill="none" filter="url(#blur)" />
        <path d="M400 -100 Q500 300 300 500 Q200 700 500 700" stroke="url(#beam4)" strokeWidth="1.5" fill="none" filter="url(#blur)" />
        <path d="M-50 100 Q400 50 800 400 Q900 500 750 600" stroke="url(#beam1)" strokeWidth="1" fill="none" filter="url(#blur)" />
        <path d="M200 -50 Q100 300 400 400 Q600 500 800 250" stroke="url(#beam2)" strokeWidth="1" fill="none" filter="url(#blur)" />
        {/* Glow spots */}
        <circle cx="200" cy="150" r="80" fill="#6366f1" fillOpacity="0.06" filter="url(#blur)" />
        <circle cx="600" cy="400" r="120" fill="#a78bfa" fillOpacity="0.05" filter="url(#blur)" />
        <circle cx="400" cy="300" r="150" fill="#38bdf8" fillOpacity="0.04" filter="url(#blur)" />
      </svg>
    </div>
  )
}
