"use client"
import { useState, useTransition } from "react"
import { motion, AnimatePresence } from "motion/react"
import { LogoIcon } from "@/components/ui/logo-icon"
import { BackgroundBeams } from "@/components/effects/background-beams"
import { FloatingParticles } from "@/components/effects/floating-particles"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faEnvelope, faLock, faUser, faPhone, faGraduationCap,
  faChild, faSpinner, faGlobe, faUserPlus, faTriangleExclamation,
  faCircleCheck, faChalkboardTeacher, faUserGroup
} from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"
import { registerAction } from "../actions"

type Lang = "fr" | "ar" | "en"
type Role = "student" | "parent"

const LEVELS = [
  { value: "primaire_1", fr: "Primaire 1ère", ar: "ابتدائي 1", en: "Primary 1" },
  { value: "primaire_2", fr: "Primaire 2ème", ar: "ابتدائي 2", en: "Primary 2" },
  { value: "primaire_3", fr: "Primaire 3ème", ar: "ابتدائي 3", en: "Primary 3" },
  { value: "primaire_4", fr: "Primaire 4ème", ar: "ابتدائي 4", en: "Primary 4" },
  { value: "primaire_5", fr: "Primaire 5ème", ar: "ابتدائي 5", en: "Primary 5" },
  { value: "cem_1", fr: "CEM 1ère", ar: "متوسط 1", en: "Middle 1" },
  { value: "cem_2", fr: "CEM 2ème", ar: "متوسط 2", en: "Middle 2" },
  { value: "cem_3", fr: "CEM 3ème", ar: "متوسط 3", en: "Middle 3" },
  { value: "cem_4", fr: "CEM 4ème (Brevet)", ar: "متوسط 4 (شهادة)", en: "Middle 4 (Brevet)" },
  { value: "lycee_1as", fr: "Lycée 1ère AS", ar: "ثانوي 1", en: "High School 1" },
  { value: "lycee_2as", fr: "Lycée 2ème AS", ar: "ثانوي 2", en: "High School 2" },
  { value: "lycee_3as", fr: "Lycée 3ème AS (Bac)", ar: "ثانوي 3 (بكالوريا)", en: "High School 3 (Bac)" },
]

const t = {
  fr: {
    title: "Créer un compte", subtitle: "Rejoindre Mela Teaching",
    fullName: "Nom complet", email: "Adresse e-mail", phone: "Téléphone (optionnel)",
    password: "Mot de passe", iAmStudent: "Je suis un élève", iAmParent: "Je suis un parent",
    childName: "Prénom de l'enfant", childLevel: "Niveau scolaire",
    register: "S'inscrire", loading: "Création...",
    hasAccount: "Déjà un compte ?", login: "Se connecter",
    successTitle: "Inscription envoyée !",
    successMsg: "Votre compte est en attente de validation. Vous recevrez un email dès l'approbation.",
    dir: "ltr" as const,
  },
  ar: {
    title: "إنشاء حساب", subtitle: "انضم إلى ميلا للتعليم",
    fullName: "الاسم الكامل", email: "البريد الإلكتروني", phone: "الهاتف (اختياري)",
    password: "كلمة المرور", iAmStudent: "أنا طالب", iAmParent: "أنا ولي أمر",
    childName: "اسم الطفل", childLevel: "المستوى الدراسي",
    register: "تسجيل", loading: "جاري التسجيل...",
    hasAccount: "لديك حساب؟", login: "دخول",
    successTitle: "تم إرسال الطلب!",
    successMsg: "حسابك في انتظار الموافقة. ستتلقى بريدًا إلكترونيًا عند الموافقة.",
    dir: "rtl" as const,
  },
  en: {
    title: "Create account", subtitle: "Join Mela Teaching",
    fullName: "Full name", email: "Email address", phone: "Phone (optional)",
    password: "Password", iAmStudent: "I am a student", iAmParent: "I am a parent",
    childName: "Child's name", childLevel: "School level",
    register: "Sign up", loading: "Creating...",
    hasAccount: "Already have an account?", login: "Sign in",
    successTitle: "Registration sent!",
    successMsg: "Your account is awaiting approval. You'll receive an email once approved.",
    dir: "ltr" as const,
  },
}

const LANG_FLAGS: Record<Lang, string> = { fr: "FR", ar: "AR", en: "EN" }
const LANG_LABELS: Record<Lang, string> = { fr: "Français", ar: "العربية", en: "English" }

export default function RegisterPage() {
  const [lang, setLang] = useState<Lang>("fr")
  const [role, setRole] = useState<Role>("student")
  const [langOpen, setLangOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  const txt = t[lang]
  const isRtl = txt.dir === "rtl"

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const fd = new FormData(e.currentTarget)
    fd.set("role", role)
    startTransition(async () => {
      const result = await registerAction(fd)
      if (result?.error) setError(result.error)
      else setSuccess(true)
    })
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden transition-colors duration-300 bg-stone-100 dark:bg-[#0a0a0f] py-8">
      {/* Light bg */}
      <div className="dark:hidden absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-stone-100 to-orange-50" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-amber-200/50 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-orange-200/40 blur-[100px]" />
      </div>
      {/* Dark bg */}
      <div className="hidden dark:block">
        <BackgroundBeams className="opacity-40" />
        <FloatingParticles count={15} />
      </div>

      {/* Top bar */}
      <div className="absolute top-5 right-5 z-50 flex items-center gap-2">
        <div className="relative">
          <button onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/80 dark:bg-white/5 border border-black/10 dark:border-white/10 text-stone-600 dark:text-white/70 hover:text-stone-900 dark:hover:text-white backdrop-blur-sm transition-all text-sm font-medium shadow-sm dark:shadow-none">
            <FontAwesomeIcon icon={faGlobe} className="w-3.5 h-3.5 text-amber-500" />
            {LANG_FLAGS[lang]}
          </button>
          <AnimatePresence>
            {langOpen && (
              <motion.div initial={{ opacity: 0, y: -6, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.95 }} transition={{ duration: 0.12 }}
                className="absolute top-full mt-2 right-0 bg-white dark:bg-[#13131a] border border-black/10 dark:border-white/10 rounded-xl overflow-hidden shadow-xl min-w-[130px]">
                {(["fr", "ar", "en"] as Lang[]).map(l => (
                  <button key={l} onClick={() => { setLang(l); setLangOpen(false) }}
                    className={`w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-amber-50 dark:hover:bg-white/5 ${lang === l ? "text-amber-600 dark:text-amber-400 font-semibold" : "text-stone-600 dark:text-white/60"}`}>
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
      <div className="relative z-10 w-full max-w-[440px] mx-4" dir={txt.dir}>
        <div className="relative rounded-2xl overflow-hidden p-8 bg-white/90 dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08] backdrop-blur-xl shadow-2xl shadow-black/10 dark:shadow-black/60">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

          {success ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faCircleCheck} className="w-8 h-8 text-emerald-500" />
              </div>
              <h2 className="text-xl font-bold text-stone-900 dark:text-white mb-2">{txt.successTitle}</h2>
              <p className="text-sm text-stone-500 dark:text-white/50 mb-6">{txt.successMsg}</p>
              <Link href="/login" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-sm shadow-lg shadow-amber-500/25 hover:from-amber-400 hover:to-orange-400 transition-all">
                <FontAwesomeIcon icon={faChalkboardTeacher} className="w-4 h-4" />
                {txt.login}
              </Link>
            </motion.div>
          ) : (
            <>
              {/* Header */}
              <div className="flex flex-col items-center mb-6 gap-2">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center shadow-md shadow-amber-500/20 ring-1 ring-amber-400/20 bg-gradient-to-br from-stone-900 to-stone-800 dark:from-white/5 dark:to-white/[0.02]">
                  <LogoIcon size={42} />
                </div>
                <div className="text-center">
                  <h1 className="text-xl font-bold text-stone-900 dark:text-white">{txt.title}</h1>
                  <p className="text-xs text-stone-400 dark:text-white/35 mt-0.5">{txt.subtitle}</p>
                </div>
              </div>

              {/* Role toggle */}
              <div className="flex rounded-xl overflow-hidden border border-stone-200 dark:border-white/10 mb-5">
                {(["student", "parent"] as Role[]).map(r => (
                  <button key={r} type="button" onClick={() => setRole(r)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-all
                      ${role === r
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-inner"
                        : "text-stone-500 dark:text-white/40 hover:bg-stone-50 dark:hover:bg-white/5"
                      }`}>
                    <FontAwesomeIcon icon={r === "student" ? faGraduationCap : faUserGroup} className="w-3.5 h-3.5" />
                    {r === "student" ? txt.iAmStudent : txt.iAmParent}
                  </button>
                ))}
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm mb-4">
                  <FontAwesomeIcon icon={faTriangleExclamation} className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Full name */}
                <div className="relative group">
                  <div className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? "right-4" : "left-4"} text-stone-300 dark:text-white/25 group-focus-within:text-amber-500 transition-colors`}>
                    <FontAwesomeIcon icon={faUser} className="w-4 h-4" />
                  </div>
                  <input name="full_name" type="text" placeholder={txt.fullName} required
                    className={`w-full rounded-xl py-3 text-sm outline-none transition-all bg-stone-100 dark:bg-white/[0.06] border border-stone-200 dark:border-white/[0.08] text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-white/25 focus:border-amber-400/60 focus:bg-white dark:focus:bg-white/[0.08] focus:shadow-[0_0_0_3px_rgba(251,191,36,0.1)] ${isRtl ? "pr-12 pl-4 text-right" : "pl-12 pr-4"}`} />
                </div>

                {/* Email */}
                <div className="relative group">
                  <div className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? "right-4" : "left-4"} text-stone-300 dark:text-white/25 group-focus-within:text-amber-500 transition-colors`}>
                    <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4" />
                  </div>
                  <input name="email" type="email" placeholder={txt.email} required
                    className={`w-full rounded-xl py-3 text-sm outline-none transition-all bg-stone-100 dark:bg-white/[0.06] border border-stone-200 dark:border-white/[0.08] text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-white/25 focus:border-amber-400/60 focus:bg-white dark:focus:bg-white/[0.08] focus:shadow-[0_0_0_3px_rgba(251,191,36,0.1)] ${isRtl ? "pr-12 pl-4 text-right" : "pl-12 pr-4"}`} />
                </div>

                {/* Phone */}
                <div className="relative group">
                  <div className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? "right-4" : "left-4"} text-stone-300 dark:text-white/25 group-focus-within:text-amber-500 transition-colors`}>
                    <FontAwesomeIcon icon={faPhone} className="w-4 h-4" />
                  </div>
                  <input name="phone" type="tel" placeholder={txt.phone}
                    className={`w-full rounded-xl py-3 text-sm outline-none transition-all bg-stone-100 dark:bg-white/[0.06] border border-stone-200 dark:border-white/[0.08] text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-white/25 focus:border-amber-400/60 focus:bg-white dark:focus:bg-white/[0.08] focus:shadow-[0_0_0_3px_rgba(251,191,36,0.1)] ${isRtl ? "pr-12 pl-4 text-right" : "pl-12 pr-4"}`} />
                </div>

                {/* Password */}
                <div className="relative group">
                  <div className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? "right-4" : "left-4"} text-stone-300 dark:text-white/25 group-focus-within:text-amber-500 transition-colors`}>
                    <FontAwesomeIcon icon={faLock} className="w-4 h-4" />
                  </div>
                  <input name="password" type="password" placeholder={txt.password} required minLength={6}
                    className={`w-full rounded-xl py-3 text-sm outline-none transition-all bg-stone-100 dark:bg-white/[0.06] border border-stone-200 dark:border-white/[0.08] text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-white/25 focus:border-amber-400/60 focus:bg-white dark:focus:bg-white/[0.08] focus:shadow-[0_0_0_3px_rgba(251,191,36,0.1)] ${isRtl ? "pr-12 pl-4 text-right" : "pl-12 pr-4"}`} />
                </div>

                {/* Parent fields */}
                <AnimatePresence>
                  {role === "parent" && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-3 overflow-hidden">
                      {/* Child name */}
                      <div className="relative group">
                        <div className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? "right-4" : "left-4"} text-stone-300 dark:text-white/25 group-focus-within:text-amber-500 transition-colors`}>
                          <FontAwesomeIcon icon={faChild} className="w-4 h-4" />
                        </div>
                        <input name="child_name" type="text" placeholder={txt.childName} required={role === "parent"}
                          className={`w-full rounded-xl py-3 text-sm outline-none transition-all bg-stone-100 dark:bg-white/[0.06] border border-stone-200 dark:border-white/[0.08] text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-white/25 focus:border-amber-400/60 focus:bg-white dark:focus:bg-white/[0.08] focus:shadow-[0_0_0_3px_rgba(251,191,36,0.1)] ${isRtl ? "pr-12 pl-4 text-right" : "pl-12 pr-4"}`} />
                      </div>
                      {/* Child level */}
                      <div className="relative group">
                        <div className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? "right-4" : "left-4"} text-stone-300 dark:text-white/25 group-focus-within:text-amber-500 transition-colors z-10`}>
                          <FontAwesomeIcon icon={faGraduationCap} className="w-4 h-4" />
                        </div>
                        <select name="child_level" required={role === "parent"}
                          className={`w-full rounded-xl py-3 text-sm outline-none transition-all bg-stone-100 dark:bg-white/[0.06] border border-stone-200 dark:border-white/[0.08] text-stone-900 dark:text-white focus:border-amber-400/60 focus:shadow-[0_0_0_3px_rgba(251,191,36,0.1)] appearance-none ${isRtl ? "pr-12 pl-4 text-right" : "pl-12 pr-4"}`}>
                          <option value="">{txt.childLevel}</option>
                          {LEVELS.map(l => (
                            <option key={l.value} value={l.value}>{l[lang]}</option>
                          ))}
                        </select>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Student level */}
                <AnimatePresence>
                  {role === "student" && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <div className="relative group">
                        <div className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? "right-4" : "left-4"} text-stone-300 dark:text-white/25 group-focus-within:text-amber-500 transition-colors z-10`}>
                          <FontAwesomeIcon icon={faGraduationCap} className="w-4 h-4" />
                        </div>
                        <select name="student_level" required
                          className={`w-full rounded-xl py-3 text-sm outline-none transition-all bg-stone-100 dark:bg-white/[0.06] border border-stone-200 dark:border-white/[0.08] text-stone-900 dark:text-white focus:border-amber-400/60 focus:shadow-[0_0_0_3px_rgba(251,191,36,0.1)] appearance-none ${isRtl ? "pr-12 pl-4 text-right" : "pl-12 pr-4"}`}>
                          <option value="">{txt.childLevel}</option>
                          {LEVELS.map(l => (
                            <option key={l.value} value={l.value}>{l[lang]}</option>
                          ))}
                        </select>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit */}
                <motion.button type="submit" disabled={isPending} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  className="w-full py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white shadow-lg shadow-amber-500/25 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 mt-1">
                  {isPending
                    ? <><FontAwesomeIcon icon={faSpinner} className="w-4 h-4 animate-spin" />{txt.loading}</>
                    : <><FontAwesomeIcon icon={faUserPlus} className="w-4 h-4" />{txt.register}</>
                  }
                </motion.button>
              </form>

              <p className="text-center text-sm text-stone-400 dark:text-white/35 mt-5">
                {txt.hasAccount}{" "}
                <Link href="/login" className="text-amber-600 dark:text-amber-400 hover:text-amber-500 font-medium transition-colors">{txt.login}</Link>
              </p>
            </>
          )}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-orange-400/30 to-transparent" />
        </div>
      </div>
    </div>
  )
}
