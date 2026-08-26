import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AuthProvider } from "@/lib/auth-context"
import { ClerkProvider } from "@clerk/nextjs"

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "ProjTrack — Enterprise Project Intelligence",
  description: "Enterprise-grade project intelligence platform with automated health monitoring",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#D4AF37",
          colorBackground: "#0d213d",
        },
        elements: {
          card: "border border-white/10 shadow-2xl backdrop-blur-xl bg-[#0d213d]/90",
          headerTitle: "text-white font-bold",
          headerSubtitle: "text-white/60",
          formFieldInput: "bg-[#08162b] border-white/10 text-white placeholder:text-white/30",
          formFieldLabel: "text-white/80",
          socialButtonsBlockButton: "border-white/10 bg-white/5 text-white hover:bg-white/10",
          formButtonPrimary: "bg-gradient-to-r from-[#D4AF37] to-[#B8972E] text-[#0A192F] font-bold hover:opacity-90",
          footerActionLink: "text-[#D4AF37] hover:text-[#E5C158]",
        },
      }}
    >
      <AuthProvider>
        <html lang="en" className={`${inter.variable} h-full antialiased`}>
          <body className="min-h-full flex flex-col bg-navy text-foreground">
            <TooltipProvider>
              {children}
              <Toaster richColors position="top-right" />
            </TooltipProvider>
          </body>
        </html>
      </AuthProvider>
    </ClerkProvider>
  )
}

