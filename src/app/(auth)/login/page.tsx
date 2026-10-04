"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useApp } from "@/context/AppContext";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "alex.vance@insightflow.ai";
  const wasRegistered = searchParams.get("registered") === "true";

  const { switchRole } = useApp();

  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("Password123!");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [noticeMsg, setNoticeMsg] = useState<string | null>(
    wasRegistered ? "Account created! You can now log in below." : null
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Email not confirmed")) {
          setErrorMsg(
            "Email verification is pending for this account. Please check your inbox for the confirmation link, or use the demo login options below to proceed immediately."
          );
        } else {
          setErrorMsg(error.message);
        }
        return;
      }

      if (data?.session) {
        router.push("/overview");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setErrorMsg(err.message || "Failed to authenticate.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = (role: "ADMIN" | "ANALYST" | "VIEWER", demoEmail: string) => {
    switchRole(role);
    router.push("/overview");
  };

  return (
    <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-6 animate-in fade-in">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-black text-[#111827]">Welcome Back</h2>
        <p className="text-xs text-[#64748B]">Sign in to your InsightFlow AI account</p>
      </div>

      {noticeMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{noticeMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4 text-xs">
        <div>
          <label className="font-semibold text-[#64748B] block mb-1">Corporate Email</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@company.com"
              className="w-full pl-9 pr-3 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-[#111827] outline-none focus:border-[#2563EB] focus:bg-white transition-all font-medium"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="font-semibold text-[#64748B]">Password</label>
            <Link href="/forgot-password" className="text-[#2563EB] hover:underline text-[11px] font-medium">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="w-full pl-9 pr-3 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-[#111827] outline-none focus:border-[#2563EB] focus:bg-white transition-all font-medium"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-full font-bold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center space-x-1.5 transform hover:-translate-y-0.5 disabled:opacity-50"
        >
          <span>{loading ? "Authenticating with Supabase..." : "Sign In"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Instant Demo Role Switcher */}
      <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
        <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider text-center">
          Instant Role Previews (1-Click)
        </p>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleQuickDemoLogin("ADMIN", "alex.vance@insightflow.ai")}
            className="p-2 rounded-xl bg-[#F8FAFC] hover:bg-blue-50 hover:text-[#2563EB] border border-slate-200 text-center font-bold transition-all text-[11px]"
          >
            Admin
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemoLogin("ANALYST", "elena.r@insightflow.ai")}
            className="p-2 rounded-xl bg-[#F8FAFC] hover:bg-blue-50 hover:text-[#2563EB] border border-slate-200 text-center font-bold transition-all text-[11px]"
          >
            Analyst
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemoLogin("VIEWER", "d.chen@insightflow.ai")}
            className="p-2 rounded-xl bg-[#F8FAFC] hover:bg-blue-50 hover:text-[#2563EB] border border-slate-200 text-center font-bold transition-all text-[11px]"
          >
            Viewer
          </button>
        </div>
      </div>

      <div className="text-center text-xs text-[#64748B]">
        Don't have an account yet?{" "}
        <Link href="/signup" className="text-[#2563EB] font-bold hover:underline">
          Sign Up First
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-text-muted">Loading sign in...</div>}>
      <LoginContent />
    </Suspense>
  );
}
