import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" })

export const metadata: Metadata = {
  title: "Mela Teaching",
  description: "Cours particuliers de mathématiques et physique",
  manifest: "/manifest.json",
  themeColor: "#0a0a0f",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#0a0a0f] text-white">{children}</body>
    </html>
  )
}
