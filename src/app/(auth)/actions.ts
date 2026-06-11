"use server"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function loginAction(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Authentification échouée" }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_approved")
    .eq("id", user.id)
    .single()

  if (!profile) return { error: "Profil introuvable" }
  if (!profile.is_approved) return { error: "awaiting_approval" }

  switch (profile.role) {
    case "super_admin": redirect("/superadmin/dashboard")
    case "prof":        redirect("/prof/dashboard")
    case "student":     redirect("/student/dashboard")
    case "parent":      redirect("/student/dashboard")
    default:            redirect("/login")
  }
}

export async function registerAction(formData: FormData) {
  const supabase = await createClient()

  const email      = formData.get("email") as string
  const password   = formData.get("password") as string
  const fullName   = formData.get("full_name") as string
  const phone      = formData.get("phone") as string
  const role       = formData.get("role") as "student" | "parent"
  const childName  = formData.get("child_name") as string | null
  const childLevel = formData.get("child_level") as string | null

  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) return { error: error.message }
  if (!data.user) return { error: "Erreur lors de la création du compte" }

  const { error: profileError } = await supabase.from("profiles").insert({
    id: data.user.id,
    role,
    full_name: fullName,
    phone: phone || null,
    is_approved: false,
  })
  if (profileError) return { error: profileError.message }

  if (role === "parent" && childName && childLevel) {
    await supabase.from("students").insert({
      parent_id: data.user.id,
      full_name: childName,
      level: childLevel,
    })
  }

  return { success: true }
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}
