"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { BackgroundBeams } from "@/components/effects/background-beams"
import { FloatingParticles } from "@/components/effects/floating-particles"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faEnvelope, faLock, faEye, faEyeSlash,
  faGraduationCap, faChalkboardTeacher, faSpinner, faGlobe
} from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"

type Lang = "fr" | "ar" | "en"

const t = {
  fr: {
    title: "Mela Teaching",
    subtitle: "Cours particuliers de mathématiques & physique",
    email: "Adresse e-mail",
    password: "Mot de passe",
    login: "Se connecter",
    forgotPassword: "Mot de passe oublié ?",
    noAccount: "Pas encore de compte ?",
    register: "S'inscrire",
    loading: "Connexion...",
    dir: "ltr" as const,
  },
  ar: {
    title: "ميلا للتعليم",
    subtitle: "دروس خصوصية في الرياضيات والفيزياء",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    login: "دخول",
    forgotPassword: "نسيت كلمة المرور؟",
    noAccount: "ليس لديك حساب؟",
    register: "التسجيل",
    loading: "جاري الدخول...",
    dir: "rtl" as const,
  },
  en: {
    title: "Mela Teaching",
    subtitle: "Private tutoring in mathematics & physics",
    email: "Email address",
    password: "Password",
    login: "Sign in",
    forgotPassword: "Forgot password?",
    noAccount: "Don't have an account?",
    register: "Sign up",
    loading: "Signing in...",
    dir: "ltr" as const,
  },
}

const LANG_FLAGS: Record<Lang, string> = { fr: "FR", ar: "AR", en: "EN" }

export default function LoginPage() {
  const [lang, setLang] = useState<Lang>("fr")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [langOpen, setLangOpen] = useState(false)

  const txt = t[lang]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Supabase auth here
    await new Promise(r => setTimeout(r, 1500))
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative flex items-center justify-center overflow-hidden">
      {/* Background effects */}
      <BackgroundBeams />
      <FloatingParticles count={25} />

      {/* Radial glow center */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px]" />
      </div>

      {/* Language switcher */}
      <div className="absolute top-6 right-6 z-50">
        <div className="relative">
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all text-sm font-medium"
          >
            <FontAwesomeIcon icon={faGlobe} className="w-3.5 h-3.5" />
            {LANG_FLAGS[lang]}
          </button>
          <AnimatePresence>
            {langOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full mt-2 right-0 bg-[#13131a] border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-black/50 min-w-[100px]"
              >
                {(["fr", "ar", "en"] as Lang[]).map(l => (
                  <button
                    key={l}
                    onClick={() => { setLang(l); setLangOpen(false) }}
                    className={`w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-white/5 ${lang === l ? "text-indigo-400 font-semibold" : "text-white/60"}`}
                  >
                    {LANG_FLAGS[l]} {l === "fr" ? "Français" : l === "ar" ? "العربية" : "English"}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        dir={txt.dir}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Glassmorphism card */}
        <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl shadow-2xl shadow-black/60 overflow-hidden p-8">
          {/* Card top glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent" />

          {/* Logo + title */}
          <div className={`flex flex-col items-center mb-8 gap-3 ${txt.dir === "rtl" ? "text-center" : ""}`}>
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.4, ease: "backOut" }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30"
            >
              <FontAwesomeIcon icon={faGraduationCap} className="w-8 h-8 text-white" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.35 }}
              className="text-center"
            >
              <h1 className="text-2xl font-bold text-white tracking-tight">{txt.title}</h1>
              <p className="text-sm text-white/40 mt-1">{txt.subtitle}</p>
            </motion.div>
          </div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="space-y-4"
          >
            {/* Email */}
            <div className="relative group">
              <div className={`absolute top-1/2 -translate-y-1/2 ${txt.dir === "rtl" ? "right-4" : "left-4"} text-white/30 group-focus-within:text-indigo-400 transition-colors`}>
                <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={txt.email}
                required
                className={`w-full bg-white/[0.06] border border-white/[0.08] rounded-xl py-3.5 text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-indigo-500/60 focus:bg-white/[0.08] transition-all ${txt.dir === "rtl" ? "pr-12 pl-4 text-right" : "pl-12 pr-4"}`}
              />
            </div>

            {/* Password */}
            <div className="relative group">
              <div className={`absolute top-1/2 -translate-y-1/2 ${txt.dir === "rtl" ? "right-4" : "left-4"} text-white/30 group-focus-within:text-indigo-400 transition-colors`}>
                <FontAwesomeIcon icon={faLock} className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={txt.password}
                required
                className={`w-full bg-white/[0.06] border border-white/[0.08] rounded-xl py-3.5 text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-indigo-500/60 focus:bg-white/[0.08] transition-all ${txt.dir === "rtl" ? "pr-12 pl-12 text-right" : "pl-12 pr-12"}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute top-1/2 -translate-y-1/2 ${txt.dir === "rtl" ? "left-4" : "right-4"} text-white/30 hover:text-white/60 transition-colors`}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="w-4 h-4" />
              </button>
            </div>

            {/* Forgot password */}
            <div className={`flex ${txt.dir === "rtl" ? "justify-start" : "justify-end"}`}>
              <Link href="/forgot-password" className="text-xs text-indigo-400/70 hover:text-indigo-400 transition-colors">
                {txt.forgotPassword}
              </Link>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 animate-spin" />
                  {txt.loading}
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faChalkboardTeacher} className="w-4 h-4" />
                  {txt.login}
                </>
              )}
            </motion.button>
          </motion.form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.06]" />
            </div>
          </div>

          {/* Register link */}
          <p className="text-center text-sm text-white/40">
            {txt.noAccount}{" "}
            <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              {txt.register}
            </Link>
          </p>

          {/* Bottom glow */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
        </div>
      </motion.div>
    </div>
  )
}
