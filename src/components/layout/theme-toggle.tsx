"use client"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/5 dark:bg-white/5 border border-white/10 dark:border-white/10 border-black/10 text-amber-500 hover:bg-amber-500/10 transition-all"
      aria-label="Toggle theme"
    >
      <FontAwesomeIcon
        icon={theme === "dark" ? faSun : faMoon}
        className="w-4 h-4"
      />
    </button>
  )
}
