"use client"
import { useEffect, useRef } from "react"

interface Particle {
  x: number; y: number; vx: number; vy: number; r: number; opacity: number; color: string
}

const COLORS = ["#6366f1", "#a78bfa", "#38bdf8", "#f472b6", "#34d399"]

export function FloatingParticles({ count = 30 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let frame: number
    let particles: Particle[] = []

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    const init = () => {
      resize()
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }))
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.opacity
        ctx.fill()
        ctx.globalAlpha = 1
      })
      frame = requestAnimationFrame(draw)
    }

    init()
    draw()
    window.addEventListener("resize", resize)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("resize", resize)
    }
  }, [count])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  )
}
