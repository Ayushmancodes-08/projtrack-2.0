"use client"

import React, { useState } from "react"
import { useClerk } from "@clerk/nextjs"
import { Shield, Mail, Lock, User, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function SignupPage() {
  const clerk = useClerk()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [pendingVerification, setPendingVerification] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName || !email || !password) {
      toast.error("Please fill in all fields")
      return
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long")
      return
    }

    if (!clerk.loaded) return
    setIsLoading(true)

    try {
      const parts = fullName.trim().split(" ")
      const firstName = parts[0]
      const lastName = parts.slice(1).join(" ") || undefined

      const result = await clerk.client.signUp.create({
        emailAddress: email.trim(),
        password: password,
        firstName: firstName,
        lastName: lastName,
      })

      if (result.status === "complete") {
        await clerk.setActive({ session: result.createdSessionId })
        toast.success("Account created successfully!")
        window.location.href = "/dashboard"
      } else {
        await clerk.client.signUp.prepareEmailAddressVerification({ strategy: "email_code" })
        setPendingVerification(true)
        toast.info("A verification code was sent to your email.")
      }
    } catch (err: any) {
      console.error("Clerk signup error:", err)
      const errorMsg = err.errors?.[0]?.longMessage || err.errors?.[0]?.message || err.message || "Failed to create account. Please try again."
      toast.error(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!verificationCode) {
      toast.error("Please enter the verification code")
      return
    }

    if (!clerk.loaded) return
    setIsLoading(true)

    try {
      const result = await clerk.client.signUp.attemptEmailAddressVerification({
        code: verificationCode.trim(),
      })

      if (result.status === "complete") {
        await clerk.setActive({ session: result.createdSessionId })
        toast.success("Email verified and account activated!")
        window.location.href = "/dashboard"
      } else {
        toast.error("Verification could not be completed.")
      }
    } catch (err: any) {
      console.error("Verification error:", err)
      const errorMsg = err.errors?.[0]?.longMessage || err.errors?.[0]?.message || err.message || "Invalid verification code."
      toast.error(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#07111E] via-[#0B1728] to-[#0A1424] px-4 py-8">
      {/* Background Decorative Lighting */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/4 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/[0.04] blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[450px] w-[450px] rounded-full bg-blue-600/[0.03] blur-3xl" />
      </div>

      {/* Glowing Red Shield Badge & Header */}
      <div className="relative z-10 mb-6 text-center flex flex-col items-center">
        <div className="relative mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-b from-[#EF4444] to-[#B91C1C] shadow-[0_0_35px_rgba(239,68,68,0.45)] transition-transform duration-300 hover:scale-105">
          <Shield className="h-8 w-8 text-white stroke-[2.2]" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Create Account</h1>
        <p className="mt-1 text-[11px] text-white/55 font-semibold tracking-widest uppercase">
          START MANAGING YOUR PROJECTS TODAY
        </p>
      </div>

      {/* Main Glass Card */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#0E1A2C]/80 p-7 backdrop-blur-2xl shadow-2xl transition-all duration-300">
        {!pendingVerification ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-white/80">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <Input
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="h-11 border-white/10 bg-[#122138]/70 pl-10 text-sm text-white placeholder:text-white/30 focus:border-red-500/50 focus:bg-[#122138] focus-visible:ring-red-500/20"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-white/80">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <Input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 border-white/10 bg-[#122138]/70 pl-10 text-sm text-white placeholder:text-white/30 focus:border-red-500/50 focus:bg-[#122138] focus-visible:ring-red-500/20"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-white/80">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 border-white/10 bg-[#122138]/70 pl-10 text-sm text-white placeholder:text-white/30 focus:border-red-500/50 focus:bg-[#122138] focus-visible:ring-red-500/20"
                />
              </div>
              <p className="text-[11px] text-white/40 mt-1">
                Must be at least 6 characters long.
              </p>
            </div>

            {/* Clerk Bot Protection CAPTCHA container */}
            <div id="clerk-captcha" className="my-1 flex justify-center" />

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 mt-2 bg-[#B91C1C] hover:bg-[#DC2626] text-white font-bold text-sm tracking-wide shadow-lg shadow-red-900/30 transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                "Creating Account..."
              ) : (
                <span className="flex items-center justify-center gap-1.5">
                  Register
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>

            <div className="mt-5 text-center text-xs text-white/50">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-red-400 hover:text-red-300 transition-colors"
              >
                Log In
              </Link>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-white/80">Verification Code</Label>
              <Input
                type="text"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
                className="h-11 border-white/10 bg-[#122138]/70 text-center font-mono text-lg text-white placeholder:text-white/30 tracking-widest focus:border-red-500/50 focus:bg-[#122138] focus-visible:ring-red-500/20"
              />
              <p className="text-[11px] text-white/40 text-center mt-1">
                Check your inbox at <span className="text-white/80 font-medium">{email}</span>
              </p>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 mt-2 bg-[#B91C1C] hover:bg-[#DC2626] text-white font-bold text-sm tracking-wide shadow-lg shadow-red-900/30 transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? "Verifying..." : "Complete Registration →"}
            </Button>
          </form>
        )}
      </div>

      <p className="relative z-10 mt-8 text-[11px] text-white/30 font-medium tracking-wider uppercase">
        &copy; 2026 PROJECTBEACON. ALL RIGHTS RESERVED.
      </p>
    </div>
  )
}


