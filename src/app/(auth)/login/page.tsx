"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Lock,
  Mail,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  UserPlus,
  ShieldAlert,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { authService, validateLoginInput } from "@/lib/auth/authService";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";
  const wasRegistered = searchParams.get("registered") === "true";
  const redirectPath = searchParams.get("redirect") || "/overview";

  const { login } = useApp();

  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isNotRegisteredError, setIsNotRegisteredError] = useState(false);
  const [noticeMsg, setNoticeMsg] = useState<string | null>(
    wasRegistered
      ? "Account registered successfully! Please log in with your email and password."
      : null
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsNotRegisteredError(false);

    // 1. Run Validity Checks
    const validation = validateLoginInput({ email, password });
    if (!validation.valid) {
      const firstError = Object.values(validation.errors)[0];
      setErrorMsg(firstError);
      return;
    }

    setLoading(true);

    try {
      // 2. Authenticate User ("Without register not login")
      const result = await login(email, password);

      if (result.success) {
        // Automatically route user to their dedicated role portal
        let targetPortal = "/overview";
        if (result.user.role === "ADMIN") targetPortal = "/admin";
        else if (result.user.role === "ANALYST") targetPortal = "/analyst";
        else if (result.user.role === "VIEWER") targetPortal = "/viewer";

        const destination = redirectPath && redirectPath !== "/overview" ? redirectPath : targetPortal;

        setNoticeMsg(`Welcome back, ${result.user.name}! Redirecting to ${result.user.role} portal...`);
        setTimeout(() => {
          router.push(destination);
        }, 500);
      }
    } catch (err: any) {
      console.error("Login verification failed:", err);
      const msg = err.message || "Authentication failed.";
      setErrorMsg(msg);

      // Check if error is because user is not registered
      if (
        msg.toLowerCase().includes("no registered account") ||
        msg.toLowerCase().includes("sign up first") ||
        msg.toLowerCase().includes("not found")
      ) {
        setIsNotRegisteredError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-6 animate-in fade-in">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-black text-[#111827]">Welcome Back</h2>
        <p className="text-xs text-[#64748B]">
          Sign in to your InsightFlow AI analytics workspace
        </p>
      </div>

      {noticeMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{noticeMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs space-y-2">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="font-semibold">{errorMsg}</span>
          </div>

          {/* Actionable Prompt if User is Not Registered */}
          {isNotRegisteredError && (
            <div className="pt-1.5 border-t border-rose-200/80 flex items-center justify-between">
              <span className="text-[11px] text-rose-600">Need to create an account?</span>
              <Link
                href={`/signup?email=${encodeURIComponent(email)}`}
                className="inline-flex items-center space-x-1 px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors"
              >
                <UserPlus className="w-3 h-3" />
                <span>Sign Up First</span>
              </Link>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4 text-xs">
        <div>
          <label className="font-semibold text-[#64748B] block mb-1">
            Corporate Email <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              required
              placeholder="sarah@company.com"
              className="w-full pl-9 pr-3 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-[#111827] outline-none focus:border-[#2563EB] focus:bg-white transition-all font-medium"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="font-semibold text-[#64748B]">
              Password <span className="text-rose-500">*</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-[#2563EB] hover:underline text-[11px] font-medium"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              required
              placeholder="Enter your password"
              className="w-full pl-9 pr-10 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-[#111827] outline-none focus:border-[#2563EB] focus:bg-white transition-all font-medium"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-[#94A3B8] hover:text-[#64748B]"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-full font-bold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center space-x-1.5 transform hover:-translate-y-0.5 disabled:opacity-50"
        >
          <span>{loading ? "Verifying Credentials..." : "Sign In"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>

      <div className="pt-2 border-t border-slate-100 text-center text-xs text-[#64748B] space-y-2">
        <p>
          Don't have an account yet?{" "}
          <Link href="/signup" className="text-[#2563EB] font-bold hover:underline">
            Sign Up First
          </Link>
        </p>
        <p className="text-[11px] text-slate-400">
          Only registered users can access workspace panels.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-[#64748B]">
          Loading sign in...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
