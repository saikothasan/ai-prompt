import { Toaster } from "@/components/ui/toaster"
import { cn } from "@/lib/utils"
import "./globals.css"
import { Inter } from "next/font/google"
import type React from "react"

import type { Metadata } from "next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI Prompt Generator",
  description: "Generate professional prompts for text, images, video, and code using AI.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={cn("min-h-screen bg-background font-sans antialiased flex flex-col", inter.className)}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}

