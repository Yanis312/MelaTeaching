"use client"
import { useState, useTransition } from "react"
import { motion, AnimatePresence } from "motion/react"
import { LogoIcon } from "@/components/ui/logo-icon"
import { BackgroundBeams } from "@/components/effects/background-beams"
import { FloatingParticles } from "@/components/effects/floating-particles"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faEnvelope, faLock, faEye, faEyeSlash,
  faSpinner, faGlobe, faRightToBracket, faTriangleExclamation
} from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"
import { loginAction } from "../actions"

type Lang = "fr" | "ar" | "en"

const t = {
  fr: {
    title: "Mela Teaching",
    subtitle: "Cours particuliers · Mathématiques & Physique",
    email: "Adresse e-mail",
    password: "Mot de passe",
    login: "Se connecter",
    forgotPassword: "Mot de passe oublié ?",
    noAccount: "Pas encore de compte ?",
    register: "S'inscrire",
    loading: "Connexion...",
    awaitingApproval: "Compte en attente de validation.",
    dir: "ltr" as const,
  },
  ar: {
    title: "ميلا للتعليم",
    subtitle: "دروس خصوصية · الرياضيات والفيزياء",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    login: "دخول",
    forgotPassword: "نسيت كلمة المرور؟",
    noAccount: "ليس لديك حساب؟",
    register: "التسجيل",
    loading: "جاري الدخول...",
    awaitingApproval: "حسابك في انتظار الموافقة.",
    dir: "rtl" as const,
  },
  en: {
    title: "Mela Teaching",
    subtitle: "Private tutoring · Mathematics & Physics",
    email: "Email address",
    password: "Password",
    login: "Sign in",
    forgotPassword: "Forgot password?",
    noAccount: "Don't have an account?",
    register: "Sign up",
    loading: "Signing in...",
    awaitingApproval: "Account awaiting approval.",
    dir: "ltr" as const,
  },
}

const LANG_LABELS: Record<Lang, string> = { fr: "Français", ar: "العربية", en: "English" }
const LANG_FLAGS: Record<Lang, string> = { fr: "FR", ar: "AR", en: "EN" }

export default function LoginPage() {
  const [lang, setLang] = useState<Lang>("fr")
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [langOpen, setLangOpen] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const txt = t[lang]
  const isRtl = txt.dir === "rtl"

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setAuthError(null)
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await loginAction(fd)
      if (result?.error) {
        setAuthError(
          result.error === "awaiting_approval"
            ? txt.awaitingApproval
            : result.error
        )
      }
    })
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden transition-colors duration-300 bg-stone-100 dark:bg-[#0a0a0f]">
      {/* Light mode background */}
      <div className="dark:hidden absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-stone-100 to-orange-50" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-amber-200/50 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-orange-200/40 blur-[100px]" />
      </div>

      {/* Dark mode background effects */}
      <div className="hidden dark:block">
        <BackgroundBeams className="opacity-60" />
        <FloatingParticles count={20} />
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-amber-500/8 blur-[120px]" />
      </div>

      {/* Top bar: lang switcher + theme toggle */}
      <div className="absolute top-5 right-5 z-50 flex items-center gap-2">
        {/* Lang switcher */}
        <div className="relative">
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl
              bg-white/80 dark:bg-white/5
              border border-black/10 dark:border-white/10
              text-stone-600 dark:text-white/70
              hover:text-stone-900 dark:hover:text-white
              hover:bg-white dark:hover:bg-white/10
              backdrop-blur-sm transition-all text-sm font-medium shadow-sm dark:shadow-none"
          >
            <FontAwesomeIcon icon={faGlobe} className="w-3.5 h-3.5 text-amber-500" />
            {LANG_FLAGS[lang]}
          </button>
          <AnimatePresence>
            {langOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.95 }}
                transition={{ duration: 0.12 }}
                className="absolute top-full mt-2 right-0
                  bg-white dark:bg-[#13131a]
                  border border-black/10 dark:border-white/10
                  rounded-xl overflow-hidden shadow-xl dark:shadow-black/50 min-w-[130px]"
              >
                {(["fr", "ar", "en"] as Lang[]).map(l => (
                  <button
                    key={l}
                    onClick={() => { setLang(l); setLangOpen(false) }}
                    className={`w-full px-4 py-2.5 text-left text-sm transition-colors
                      hover:bg-amber-50 dark:hover:bg-white/5
                      ${lang === l
                        ? "text-amber-600 dark:text-amber-400 font-semibold"
                        : "text-stone-600 dark:text-white/60"
                      }`}
                  >
                    {LANG_FLAGS[l]} {LANG_LABELS[l]}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <ThemeToggle />
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 1, y: 0, scale: 1 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        dir={txt.dir}
        className="relative z-10 w-full max-w-[420px] mx-4"
      >
        <div className="relative rounded-2xl overflow-hidden p-8
          bg-white/90 dark:bg-white/[0.04]
          border border-black/[0.06] dark:border-white/[0.08]
          backdrop-blur-xl
          shadow-2xl shadow-black/10 dark:shadow-black/60"
        >
          {/* Top shimmer line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

          {/* Logo + title */}
          <div className="flex flex-col items-center mb-7 gap-3">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/25 ring-1 ring-amber-400/20 bg-gradient-to-br from-stone-900 to-stone-800 dark:from-white/5 dark:to-white/[0.02]">
              <LogoIcon size={60} />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-stone-900 dark:text-white tracking-tight">
                {txt.title}
              </h1>
              <p className="text-xs text-stone-400 dark:text-white/35 mt-1 tracking-wide">
                {txt.subtitle}
              </p>
            </div>
          </div>

          {/* Gold divider */}
          <div className="w-12 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full mx-auto mb-7" />

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error */}
            {authError && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm">
                <FontAwesomeIcon icon={faTriangleExclamation} className="w-4 h-4 shrink-0" />
                {authError}
              </div>
            )}
            {/* Email */}
            <div className="relative group">
              <div className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? "right-4" : "left-4"} text-stone-300 dark:text-white/25 group-focus-within:text-amber-500 transition-colors`}>
                <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4" />
              </div>
              <input
                type="email"
                name="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={txt.email}
                required
                className={`w-full rounded-xl py-3.5 text-sm transition-all outline-none
                  bg-stone-100 dark:bg-white/[0.06]
                  border border-stone-200 dark:border-white/[0.08]
                  text-stone-900 dark:text-white
                  placeholder:text-stone-400 dark:placeholder:text-white/25
                  focus:border-amber-400/60 dark:focus:border-amber-400/50
                  focus:bg-white dark:focus:bg-white/[0.08]
                  focus:shadow-[0_0_0_3px_rgba(251,191,36,0.1)]
                  ${isRtl ? "pr-12 pl-4 text-right" : "pl-12 pr-4"}`}
              />
            </div>

            {/* Password */}
            <div className="relative group">
              <div className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? "right-4" : "left-4"} text-stone-300 dark:text-white/25 group-focus-within:text-amber-500 transition-colors`}>
                <FontAwesomeIcon icon={faLock} className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={txt.password}
                required
                className={`w-full rounded-xl py-3.5 text-sm transition-all outline-none
                  bg-stone-100 dark:bg-white/[0.06]
                  border border-stone-200 dark:border-white/[0.08]
                  text-stone-900 dark:text-white
                  placeholder:text-stone-400 dark:placeholder:text-white/25
                  focus:border-amber-400/60 dark:focus:border-amber-400/50
                  focus:bg-white dark:focus:bg-white/[0.08]
                  focus:shadow-[0_0_0_3px_rgba(251,191,36,0.1)]
                  ${isRtl ? "pr-12 pl-12 text-right" : "pl-12 pr-12"}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? "left-4" : "right-4"} text-stone-300 dark:text-white/25 hover:text-amber-500 transition-colors`}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="w-4 h-4" />
              </button>
            </div>

            {/* Forgot */}
            <div className={`flex ${isRtl ? "justify-start" : "justify-end"}`}>
              <Link href="/forgot-password" className="text-xs text-amber-600 dark:text-amber-400/70 hover:text-amber-500 dark:hover:text-amber-400 transition-colors">
                {txt.forgotPassword}
              </Link>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isPending}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 rounded-xl font-semibold text-sm
                bg-gradient-to-r from-amber-500 to-orange-500
                hover:from-amber-400 hover:to-orange-400
                text-white shadow-lg shadow-amber-500/25
                disabled:opacity-60 disabled:cursor-not-allowed
                transition-all flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 animate-spin" />
                  {txt.loading}
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faRightToBracket} className="w-4 h-4" />
                  {txt.login}
                </>
              )}
            </motion.button>
          </form>

          {/* Register link */}
          <p className="text-center text-sm text-stone-400 dark:text-white/35 mt-6">
            {txt.noAccount}{" "}
            <Link href="/register" className="text-amber-600 dark:text-amber-400 hover:text-amber-500 font-medium transition-colors">
              {txt.register}
            </Link>
          </p>

          {/* Bottom shimmer */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-orange-400/30 to-transparent" />
        </div>
      </motion.div>
    </div>
  )
}
