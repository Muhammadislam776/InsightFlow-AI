"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  Mail,
  User,
  ArrowRight,
  Building,
  Shield,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Check,
  X,
} from "lucide-react";
import { authService, calculatePasswordStrength, validateSignupInput } from "@/lib/auth/authService";
import { UserRole } from "@/lib/types";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [org, setOrg] = useState("Acme Global");
  const [role, setRole] = useState<UserRole>("ANALYST");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Real-time password strength calculation
  const strength = useMemo(() => calculatePasswordStrength(password), [password]);

  // Real-time password match check
  const passwordsMatch = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setFieldErrors({});

    // 1. Run Comprehensive Validity Checks
    const validation = validateSignupInput({
      name,
      email,
      organization: org,
      role,
      password,
      confirmPassword,
    });

    if (!validation.valid) {
      setFieldErrors(validation.errors);
      const firstError = Object.values(validation.errors)[0];
      setErrorMsg(firstError);
      return;
    }

    setLoading(true);

    try {
      // 2. Register User (Supabase Auth + Database Table + Store)
      const res = await authService.signup({
        name,
        email,
        organization: org,
        role,
        password,
        confirmPassword,
      });

      setSuccessMsg(
        `Account successfully registered as ${role}! You can now log in using your email and password.`
      );

      // Auto redirect to login after 1.8 seconds
      setTimeout(() => {
        router.push(`/login?email=${encodeURIComponent(email)}&registered=true`);
      }, 1800);
    } catch (err: any) {
      console.error("Signup validation error:", err);
      setErrorMsg(err.message || "Failed to create account. Please check your information.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-6 animate-in fade-in">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-black text-[#111827]">Create Your Account</h2>
        <p className="text-xs text-[#64748B]">
          Sign up first to access InsightFlow AI analytics dashboards
        </p>
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
          {/* Full Name */}
          <div>
            <label className="font-semibold text-[#64748B] block mb-1">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
              <input
                type="text"
                required
                placeholder="Sarah Jenkins"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: "" }));
                }}
                className={`w-full pl-9 pr-3 py-2.5 bg-[#F8FAFC] border rounded-xl text-[#111827] outline-none transition-all font-medium ${
                  fieldErrors.name
                    ? "border-rose-400 focus:border-rose-500"
                    : "border-slate-200 focus:border-[#2563EB] focus:bg-white"
                }`}
              />
            </div>
            {fieldErrors.name && (
              <p className="text-[11px] text-rose-600 mt-1 font-medium">{fieldErrors.name}</p>
            )}
          </div>

          {/* Work Email */}
          <div>
            <label className="font-semibold text-[#64748B] block mb-1">
              Work Email <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="sarah@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: "" }));
                }}
                className={`w-full pl-9 pr-3 py-2.5 bg-[#F8FAFC] border rounded-xl text-[#111827] outline-none transition-all font-medium ${
                  fieldErrors.email
                    ? "border-rose-400 focus:border-rose-500"
                    : "border-slate-200 focus:border-[#2563EB] focus:bg-white"
                }`}
              />
            </div>
            {fieldErrors.email && (
              <p className="text-[11px] text-rose-600 mt-1 font-medium">{fieldErrors.email}</p>
            )}
          </div>

          {/* Company / Organization */}
          <div>
            <label className="font-semibold text-[#64748B] block mb-1">
              Company / Organization <span className="text-rose-500">*</span>
            </label>
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

          {/* Role Selection for RBAC Authorization */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-[#334155] text-xs">
                Select Your Account Role & Panel Access <span className="text-rose-500">*</span>
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
                  onClick={() => setRole(item.r as UserRole)}
                  className={`p-3 rounded-2xl border text-left transition-all relative ${
                    role === item.r
                      ? "border-[#2563EB] bg-blue-50/80 ring-2 ring-[#2563EB]/20 shadow-xs"
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

          {/* Password with Validity & Strength Indicator */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-[#64748B]">
                Password <span className="text-rose-500">*</span>
              </label>
              {password && (
                <span
                  className={`text-[10px] font-bold ${
                    strength.score <= 1
                      ? "text-rose-500"
                      : strength.score === 2
                      ? "text-amber-500"
                      : strength.score === 3
                      ? "text-blue-500"
                      : "text-emerald-600"
                  }`}
                >
                  Strength: {strength.label}
                </span>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="At least 8 characters with numbers & symbols"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: "" }));
                }}
                className={`w-full pl-9 pr-10 py-2.5 bg-[#F8FAFC] border rounded-xl text-[#111827] outline-none transition-all font-medium ${
                  fieldErrors.password
                    ? "border-rose-400 focus:border-rose-500"
                    : "border-slate-200 focus:border-[#2563EB] focus:bg-white"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-[#94A3B8] hover:text-[#64748B]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Strength Bar */}
            {password.length > 0 && (
              <div className="mt-2 space-y-1.5">
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
                  <div
                    className={`h-full transition-all duration-300 ${
                      strength.score <= 1
                        ? "w-1/4 bg-rose-500"
                        : strength.score === 2
                        ? "w-2/4 bg-amber-500"
                        : strength.score === 3
                        ? "w-3/4 bg-blue-500"
                        : "w-full bg-emerald-500"
                    }`}
                  />
                </div>
                {/* Requirements Checklist */}
                <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-500 pt-1">
                  <span className={`flex items-center space-x-1 ${strength.checks.length ? "text-emerald-600 font-semibold" : ""}`}>
                    {strength.checks.length ? <Check className="w-3 h-3 text-emerald-600" /> : <X className="w-3 h-3 text-slate-300" />}
                    <span>At least 8 characters</span>
                  </span>
                  <span className={`flex items-center space-x-1 ${strength.checks.uppercase ? "text-emerald-600 font-semibold" : ""}`}>
                    {strength.checks.uppercase ? <Check className="w-3 h-3 text-emerald-600" /> : <X className="w-3 h-3 text-slate-300" />}
                    <span>1 uppercase letter</span>
                  </span>
                  <span className={`flex items-center space-x-1 ${strength.checks.lowercase ? "text-emerald-600 font-semibold" : ""}`}>
                    {strength.checks.lowercase ? <Check className="w-3 h-3 text-emerald-600" /> : <X className="w-3 h-3 text-slate-300" />}
                    <span>1 lowercase letter</span>
                  </span>
                  <span className={`flex items-center space-x-1 ${strength.checks.number && strength.checks.special ? "text-emerald-600 font-semibold" : ""}`}>
                    {strength.checks.number && strength.checks.special ? <Check className="w-3 h-3 text-emerald-600" /> : <X className="w-3 h-3 text-slate-300" />}
                    <span>Number & special symbol</span>
                  </span>
                </div>
              </div>
            )}
            {fieldErrors.password && (
              <p className="text-[11px] text-rose-600 mt-1 font-medium">{fieldErrors.password}</p>
            )}
          </div>

          {/* Confirm Password Check */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-[#64748B]">
                Confirm Password <span className="text-rose-500">*</span>
              </label>
              {passwordsMatch && (
                <span className="text-[10px] font-bold text-emerald-600 flex items-center">
                  <Check className="w-3 h-3 mr-0.5" /> Passwords match
                </span>
              )}
              {passwordsMismatch && (
                <span className="text-[10px] font-bold text-rose-500 flex items-center">
                  <X className="w-3 h-3 mr-0.5" /> Passwords do not match
                </span>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (fieldErrors.confirmPassword) setFieldErrors((prev) => ({ ...prev, confirmPassword: "" }));
                }}
                className={`w-full pl-9 pr-10 py-2.5 bg-[#F8FAFC] border rounded-xl text-[#111827] outline-none transition-all font-medium ${
                  passwordsMismatch || fieldErrors.confirmPassword
                    ? "border-rose-400 focus:border-rose-500"
                    : "border-slate-200 focus:border-[#2563EB] focus:bg-white"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-[#94A3B8] hover:text-[#64748B]"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {fieldErrors.confirmPassword && (
              <p className="text-[11px] text-rose-600 mt-1 font-medium">{fieldErrors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-full font-bold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center space-x-1.5 transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            <span>{loading ? "Validating & Registering Account..." : "Sign Up & Register Account"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      )}

      <div className="text-center text-xs text-[#64748B] pt-2 border-t border-slate-100">
        Already registered?{" "}
        <Link href="/login" className="text-[#2563EB] font-bold hover:underline">
          Sign In to Your Account
        </Link>
      </div>
    </div>
  );
}
