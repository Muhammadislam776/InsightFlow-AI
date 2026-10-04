"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, ArrowRight, Building, Shield, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [org, setOrg] = useState("Acme Enterprises");
  const [role, setRole] = useState<"ADMIN" | "ANALYST" | "VIEWER">("ANALYST");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
            organization: org,
          },
        },
      });

      if (error) {
        throw error;
      }

      setSuccessMsg(
        "Account created successfully in Supabase! You can now log in with your credentials."
      );
      // Auto navigate to login after 2 seconds
      setTimeout(() => {
        router.push(`/login?email=${encodeURIComponent(email)}&registered=true`);
      }, 2000);
    } catch (err: any) {
      console.error("Signup error:", err);
      setErrorMsg(err.message || "Failed to create account. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-6 animate-in fade-in">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-black text-[#111827]">Create Your Account</h2>
        <p className="text-xs text-[#64748B]">Sign up first to access InsightFlow AI analytics</p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs space-y-2">
          <div className="flex items-center space-x-2 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Registration Successful!</span>
          </div>
          <p>{successMsg}</p>
          <div className="pt-1">
            <Link
              href={`/login?email=${encodeURIComponent(email)}&registered=true`}
              className="text-xs font-bold text-[#2563EB] hover:underline"
            >
              Proceed to Login now →
            </Link>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {!successMsg && (
        <form onSubmit={handleSignUp} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-[#64748B] block mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
              <input
                type="text"
                required
                placeholder="Sarah Jenkins"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-[#111827] outline-none focus:border-[#2563EB] focus:bg-white transition-all font-medium"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-[#64748B] block mb-1">Work Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="sarah@insightflow.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-[#111827] outline-none focus:border-[#2563EB] focus:bg-white transition-all font-medium"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-[#64748B] block mb-1">Company / Organization</label>
            <div className="relative">
              <Building className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
              <input
                type="text"
                required
                placeholder="Acme Global Inc"
                value={org}
                onChange={(e) => setOrg(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-[#111827] outline-none focus:border-[#2563EB] focus:bg-white transition-all font-medium"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-[#64748B] block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-[#111827] outline-none focus:border-[#2563EB] focus:bg-white transition-all font-medium"
              />
            </div>
          </div>

          {/* Role Selection for RBAC Authorization */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-[#334155] text-xs">
                Select Your Account Role & Panel Access
              </label>
              <span className="text-[10px] text-[#64748B] font-mono">RBAC Enforced</span>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                {
                  r: "ADMIN",
                  title: "Admin",
                  desc: "All 9 Panels",
                  detail: "Full Admin, Settings & Governance",
                  badge: "Full Access",
                },
                {
                  r: "ANALYST",
                  title: "Analyst",
                  desc: "8 Panels",
                  detail: "SQL Queries, Charts & Benchmarks",
                  badge: "Analytics",
                },
                {
                  r: "VIEWER",
                  title: "Viewer",
                  desc: "6 Core Panels",
                  detail: "Read-Only Dashboards & Catalog",
                  badge: "Read Only",
                },
              ].map((item) => (
                <button
                  key={item.r}
                  type="button"
                  onClick={() => setRole(item.r as any)}
                  className={`p-3 rounded-2xl border text-left transition-all relative ${
                    role === item.r
                      ? "border-[#2563EB] bg-blue-50/80 ring-2 ring-[#2563EB]/20 shadow-sm"
                      : "border-slate-200 bg-[#F8FAFC] hover:bg-slate-100/80"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-[#0F172A]">{item.title}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                        role === item.r
                          ? "bg-[#2563EB] text-white"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {item.badge}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#2563EB] block">
                    {item.desc}
                  </span>
                  <span className="text-[10px] text-[#64748B] block mt-0.5 leading-tight">
                    {item.detail}
                  </span>
                </button>
              ))}
            </div>
            <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              {role === "ADMIN" && (
                <span>🛡️ <strong>Admin Access:</strong> Complete access to all 9 panels including Settings & Admin, Security Rules, Schema Governance, and Monitoring.</span>
              )}
              {role === "ANALYST" && (
                <span>📊 <strong>Analyst Access:</strong> Access to 8 panels: Ask Data, Dashboards, Explore, History, Catalog, Monitoring & Benchmarks. Settings panel is hidden.</span>
              )}
              {role === "VIEWER" && (
                <span>👁️ <strong>Viewer Access:</strong> Access to 6 core panels in read-only mode: Overview, Ask Data, Dashboards, Explore, History & Catalog.</span>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-full font-bold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center space-x-1.5 transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            <span>{loading ? "Creating Account in Supabase..." : "Sign Up & Create Account"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      )}

      <div className="text-center text-xs text-[#64748B] pt-2 border-t border-slate-100">
        Already registered?{" "}
        <Link href="/login" className="text-[#2563EB] font-bold hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
}
