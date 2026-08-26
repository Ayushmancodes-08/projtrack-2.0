"use client"

import React, { useState } from "react"
import { useClerk } from "@clerk/nextjs"
import { useAuth } from "@/lib/auth-context"
import { Shield, Mail, Lock, Key, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function LoginPage() {
  const clerk = useClerk()
  const { loginAsTeamMember } = useAuth()
  const [loginType, setLoginType] = useState<"independent" | "team">("independent")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [inviteCode, setInviteCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleIndependentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast.error("Please enter your email address")
      return
    }
    if (!password) {
      toast.error("Please enter your password")
      return
    }

    if (!clerk.loaded) return
    setIsLoading(true)

    try {
      const result = await clerk.client.signIn.create({
        identifier: email.trim(),
        password: password,
      })

      if (result.status === "complete") {
        await clerk.setActive({ session: result.createdSessionId })
        toast.success("Successfully logged in!")
        window.location.href = "/dashboard"
      } else {
        console.warn("Clerk sign-in pending status:", result.status)
        toast.info("Please check your email to complete verification.")
      }
    } catch (err: any) {
      console.error("Clerk sign in error:", err)
      const errorMsg = err.errors?.[0]?.longMessage || err.errors?.[0]?.message || err.message || "Authentication failed. Please check your credentials."
      toast.error(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast.error("Please enter your email address")
      return
    }
    if (!inviteCode) {
      toast.error("Please enter your invite code")
      return
    }

    setIsLoading(true)
    try {
      await loginAsTeamMember(email, inviteCode)
    } catch (err: any) {
      toast.error(err.message || "Authentication failed. Please check your invitation code.")
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
        <h1 className="text-2xl font-bold tracking-tight text-white">projectBeacon</h1>
        <p className="mt-1 text-[11px] text-white/55 font-semibold tracking-widest uppercase">
          AUTONOMOUS PROJECT INTELLIGENCE
        </p>
      </div>

      {/* Main Glass Card */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#0E1A2C]/80 p-7 backdrop-blur-2xl shadow-2xl transition-all duration-300">
        
        {/* Toggle Switch */}
        <div className="mb-6 flex rounded-xl bg-[#091322] p-1.5 border border-white/5">
          <button
            type="button"
            onClick={() => {
              setLoginType("independent")
              setEmail("")
              setPassword("")
              setInviteCode("")
            }}
            className={`flex-1 rounded-lg py-2.5 text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
              loginType === "independent"
                ? "bg-[#B91C1C] text-white shadow-md"
                : "text-white/60 hover:text-white"
            }`}
          >
            Independent User
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginType("team")
              setEmail("")
              setPassword("")
              setInviteCode("")
            }}
            className={`flex-1 rounded-lg py-2.5 text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
              loginType === "team"
                ? "bg-[#B91C1C] text-white shadow-md"
                : "text-white/60 hover:text-white"
            }`}
          >
            Team Member
          </button>
        </div>

        {loginType === "independent" ? (
          <form onSubmit={handleIndependentSubmit} className="space-y-4">
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
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium text-white/80">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] font-medium text-red-400 hover:text-red-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
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
            </div>

            {/* Clerk Bot Protection CAPTCHA container */}
            <div id="clerk-captcha" className="my-1 flex justify-center" />

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 mt-2 bg-[#B91C1C] hover:bg-[#DC2626] text-white font-bold text-sm tracking-wide shadow-lg shadow-red-900/30 transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                "Authenticating..."
              ) : (
                <span className="flex items-center justify-center gap-1.5">
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>

            <div className="mt-5 text-center text-xs text-white/50">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-semibold text-red-400 hover:text-red-300 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </form>
        ) : (
          <form onSubmit={handleTeamSubmit} className="space-y-4">
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
              <Label className="text-xs font-medium text-white/80">Invite Code</Label>
              <div className="relative">
                <Key className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <Input
                  type="text"
                  placeholder="PT-XXXXXX"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  required
                  className="h-11 border-white/10 bg-[#122138]/70 pl-10 text-sm text-white placeholder:text-white/30 font-mono focus:border-red-500/50 focus:bg-[#122138] focus-visible:ring-red-500/20"
                />
              </div>
              <p className="text-[11px] text-white/45 leading-relaxed mt-1">
                Enter the code sent to you by your team administrator.
              </p>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 mt-2 bg-[#B91C1C] hover:bg-[#DC2626] text-white font-bold text-sm tracking-wide shadow-lg shadow-red-900/30 transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                "Authenticating..."
              ) : (
                <span className="flex items-center justify-center gap-1.5">
                  Join Team
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>
        )}
      </div>

      <p className="relative z-10 mt-8 text-[11px] text-white/30 font-medium tracking-wider uppercase">
        &copy; 2026 PROJTRACK. ALL RIGHTS RESERVED.
      </p>
    </div>
  )
}


