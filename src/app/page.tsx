"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  Sparkles,
  ShieldCheck,
  Zap,
  Layers,
  FileSpreadsheet,
  Cpu,
  ArrowRight,
  CheckCircle,
  Lock,
  Database,
  Search,
  ChevronRight,
  Code2,
  PieChart,
  Play,
  TrendingUp,
  Shield,
  KeyRound,
  FileText,
  Share2,
  Clock,
  Activity,
  Award,
  Check,
} from "lucide-react";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<"chart" | "table">("chart");

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] selection:bg-blue-100 selection:text-blue-700 font-sans">
      {/* 1. Global Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <BarChart3 className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-[#111827]">
                InsightFlow <span className="text-[#2563EB]">AI</span>
              </span>
            </Link>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#EFF6FF] text-[#2563EB] border border-blue-200">
              AI Analytics
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8 text-[13px] font-medium text-[#64748B]">
            <a href="#home" className="text-[#2563EB] font-semibold hover:text-[#2563EB] transition-colors">Home</a>
            <a href="#features" className="hover:text-[#111827] transition-colors">Features</a>
            <a href="#security" className="hover:text-[#111827] transition-colors">Security</a>
            <a href="#how-it-works" className="hover:text-[#111827] transition-colors">How It Works</a>
            <a href="#preview" className="hover:text-[#111827] transition-colors">Dashboard Preview</a>
            <a href="#pricing" className="hover:text-[#111827] transition-colors">About</a>
          </nav>

          {/* Search + Auth Actions */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center bg-[#F1F5F9] px-3 py-1.5 rounded-full text-xs text-[#64748B] w-48 border border-transparent focus-within:border-blue-300 focus-within:bg-white transition-all">
              <Search className="w-3.5 h-3.5 mr-2 text-[#94A3B8]" />
              <input
                type="text"
                placeholder="Search anything..."
                className="bg-transparent text-xs text-[#111827] placeholder-[#94A3B8] outline-none w-full"
              />
            </div>

            <Link
              href="/login"
              className="px-4 py-2 text-xs font-semibold text-[#111827] hover:text-[#2563EB] transition-colors border border-[#E2E8F0] rounded-full hover:bg-slate-50"
            >
              Login
            </Link>

            <Link
              href="/overview"
              className="px-5 py-2 text-xs font-bold text-white bg-[#F97316] hover:bg-[#EA580C] rounded-full shadow-[0_4px_14px_rgba(249,115,22,0.35)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.45)] transition-all transform hover:-translate-y-0.5"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section id="home" className="relative pt-12 pb-20 md:pt-16 md:pb-24 overflow-hidden">
        {/* Soft background ambient gradient lights */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-100/60 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-orange-100/50 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-5 space-y-6">
              {/* Pill Badge */}
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#EFF6FF] border border-blue-200 text-xs font-semibold text-[#2563EB]">
                <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>AI-Powered Business Intelligence</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black tracking-tight text-[#111827] leading-[1.08]">
                Ask Your Data <br />
                <span className="text-[#2563EB]">Anything</span>
                <span className="text-[#2563EB]">.</span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-[#64748B] leading-relaxed max-w-lg">
                Turn plain-language questions into safe, explainable business insights. Get instant answers with AI, powered by your data — no SQL required.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/ask"
                  className="px-6 py-3.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-[0_4px_14px_rgba(37,99,235,0.35)] transition-all flex items-center space-x-2 transform hover:-translate-y-0.5"
                >
                  <span>Start Analyzing</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#how-it-works"
                  className="px-6 py-3.5 rounded-full bg-white hover:bg-slate-50 text-[#111827] text-xs font-bold border border-[#E2E8F0] shadow-sm transition-all flex items-center space-x-2"
                >
                  <Play className="w-3.5 h-3.5 fill-[#2563EB] text-[#2563EB]" />
                  <span>View Demo</span>
                </a>
              </div>

              {/* 4 Trust Features List */}
              <div className="grid grid-cols-2 gap-3 pt-6 border-t border-slate-200/80">
                <div className="flex items-center space-x-2 text-xs">
                  <div className="w-5 h-5 rounded-md bg-blue-50 flex items-center justify-center text-[#2563EB]">
                    <Shield className="w-3 h-3" />
                  </div>
                  <div>
                    <span className="font-bold text-[#111827]">Secure</span>
                    <span className="text-[#64748B] block text-[11px]">Read-only access</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-xs">
                  <div className="w-5 h-5 rounded-md bg-orange-50 flex items-center justify-center text-[#F97316]">
                    <KeyRound className="w-3 h-3" />
                  </div>
                  <div>
                    <span className="font-bold text-[#111827]">Role-Based</span>
                    <span className="text-[#64748B] block text-[11px]">Access control</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-xs">
                  <div className="w-5 h-5 rounded-md bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Database className="w-3 h-3" />
                  </div>
                  <div>
                    <span className="font-bold text-[#111827]">Approved Schema</span>
                    <span className="text-[#64748B] block text-[11px]">No unauthorized data</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-xs">
                  <div className="w-5 h-5 rounded-md bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Sparkles className="w-3 h-3" />
                  </div>
                  <div>
                    <span className="font-bold text-[#111827]">AI-Powered</span>
                    <span className="text-[#64748B] block text-[11px]">Natural language to SQL</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Interactive Architecture Hero Illustration */}
            <div className="lg:col-span-7 relative">
              <div className="relative mx-auto max-w-2xl bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-[0_20px_50px_rgba(37,99,235,0.08)]">
                {/* Floating Question Speech Bubble */}
                <div className="flex items-center space-x-2 bg-white px-4 py-2.5 rounded-full border border-blue-200 shadow-sm w-fit mb-6 text-xs font-semibold text-[#111827] animate-pulse-subtle">
                  <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>What were our total sales last month?</span>
                </div>

                {/* Central Workflow Card matching reference mockup */}
                <div className="bg-[#F8FAFC] rounded-2xl p-5 border border-slate-200/90 shadow-inner space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                    {/* Step 1: Natural Language */}
                    <div className="md:col-span-3 bg-white p-3 rounded-xl border border-slate-200 text-center shadow-xs">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] mx-auto flex items-center justify-center mb-1.5">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-bold text-[#111827] block">Natural Language</span>
                      <span className="text-[10px] text-[#64748B]">"Total sales last month"</span>
                    </div>

                    {/* Arrow / Central AI Node */}
                    <div className="md:col-span-2 flex flex-col items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#2563EB] to-blue-400 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-blue-500/30">
                        AI
                      </div>
                    </div>

                    {/* Step 2: Safe SQL Card */}
                    <div className="md:col-span-5 bg-white p-3 rounded-xl border border-slate-200 text-left shadow-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#111827]">Safe SQL</span>
                        <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                          ✓ Validated & Safe
                        </span>
                      </div>
                      <pre className="text-[9.5px] font-mono text-slate-700 bg-slate-50 p-2 rounded-lg leading-tight overflow-x-auto">
                        <code>{`SELECT SUM(total_amount) AS total_sales\nFROM orders\nWHERE strftime('%Y-%m', order_date) = '2026-02';`}</code>
                      </pre>
                    </div>

                    {/* Step 3: Interactive Chart icon */}
                    <div className="md:col-span-2 bg-white p-3 rounded-xl border border-slate-200 text-center shadow-xs">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-1">
                        <BarChart3 className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold text-[#111827] block">Interactive Chart</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Row: 3D-styled Database + Floating KPI Card + Security Badge */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-6 items-center">
                  {/* Left: 3D Cylindrical Database */}
                  <div className="md:col-span-4 flex items-center space-x-3 p-3 bg-white rounded-2xl border border-slate-200 shadow-xs">
                    <div className="relative w-12 h-14 flex flex-col items-center justify-center">
                      <div className="w-10 h-3 rounded-full bg-blue-500 shadow-sm" />
                      <div className="w-10 h-7 bg-blue-600 border-x border-blue-400" />
                      <div className="w-10 h-3 rounded-full bg-blue-700 -mt-1.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#111827] block">Read-Only DB</span>
                      <span className="text-[10px] text-[#64748B]">Approved schema isolated</span>
                    </div>
                  </div>

                  {/* Right: Floating KPI Card with Multi-color Bars */}
                  <div className="md:col-span-8 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-semibold text-[#64748B] block">Total Sales</span>
                      <span className="text-xl font-extrabold text-[#111827]">$248,750</span>
                      <span className="text-[10px] font-bold text-emerald-600 flex items-center mt-0.5">
                        <TrendingUp className="w-3 h-3 mr-0.5" />
                        ↑ 12.5% vs last month
                      </span>
                    </div>

                    {/* Mini Multi-Color Bar Chart */}
                    <div className="flex items-end space-x-1.5 h-12">
                      <div className="w-2.5 bg-blue-400 h-6 rounded-t-sm" />
                      <div className="w-2.5 bg-[#F97316] h-9 rounded-t-sm" />
                      <div className="w-2.5 bg-blue-500 h-7 rounded-t-sm" />
                      <div className="w-2.5 bg-amber-400 h-10 rounded-t-sm" />
                      <div className="w-2.5 bg-[#2563EB] h-12 rounded-t-sm" />
                    </div>
                  </div>
                </div>

                {/* Bottom Floating Security Pill */}
                <div className="mt-4 flex items-center justify-between px-3 py-2 bg-blue-50/70 border border-blue-200 rounded-xl text-[11px] text-[#2563EB]">
                  <div className="flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
                    <span className="font-bold">Your data is safe</span>
                    <span className="text-[#64748B]">• Read-only · Approved schema · Encrypted</span>
                  </div>
                  <span className="font-bold text-[10px] bg-white px-2 py-0.5 rounded text-emerald-600 border border-emerald-200">
                    Active Guard
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Eight Feature Cards Grid (matching reference mockup) */}
      <section id="features" className="py-16 bg-white border-y border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Natural Language Analytics",
                desc: "Ask questions in plain English",
                icon: Sparkles,
                color: "text-blue-600",
                bg: "bg-blue-50",
              },
              {
                title: "Secure & Controlled",
                desc: "Only approved data & read-only",
                icon: ShieldCheck,
                color: "text-emerald-600",
                bg: "bg-emerald-50",
              },
              {
                title: "Beautiful Visualizations",
                desc: "Charts, tables & insights",
                icon: BarChart3,
                color: "text-[#F97316]",
                bg: "bg-orange-50",
              },
              {
                title: "Role-Based Access",
                desc: "Right data for the right people",
                icon: KeyRound,
                color: "text-indigo-600",
                bg: "bg-indigo-50",
              },
              {
                title: "Fast & Reliable",
                desc: "Optimized performance",
                icon: Zap,
                color: "text-amber-600",
                bg: "bg-amber-50",
              },
              {
                title: "Export & Share",
                desc: "CSV, PNG, PDF",
                icon: Share2,
                color: "text-cyan-600",
                bg: "bg-cyan-50",
              },
              {
                title: "Smart Caching",
                desc: "Faster results, lower load",
                icon: Database,
                color: "text-purple-600",
                bg: "bg-purple-50",
              },
              {
                title: "Full Monitoring",
                desc: "Usage, benchmarks & more",
                icon: Activity,
                color: "text-rose-600",
                bg: "bg-rose-50",
              },
            ].map((f, idx) => {
              const Icon = f.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group"
                >
                  <div className={`w-10 h-10 rounded-xl ${f.bg} ${f.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-[#111827]">{f.title}</h3>
                  <p className="text-xs text-[#64748B] mt-1">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. "How It Works" Stepper Section */}
      <section id="how-it-works" className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto space-y-2 mb-16">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#EFF6FF] border border-blue-200 text-xs font-semibold text-[#2563EB]">
              <span>✦ Simple · Secure · Powerful</span>
            </div>
            <h2 className="text-3xl font-extrabold text-[#111827]">How It Works</h2>
            <p className="text-xs sm:text-sm text-[#64748B]">
              From a simple question to powerful insights in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {[
              {
                step: "1",
                title: "Ask",
                desc: "Type your question in plain English.",
                icon: Sparkles,
                badgeBg: "bg-[#2563EB]",
              },
              {
                step: "2",
                title: "Validate",
                desc: "We check your request, permissions and schema.",
                icon: ShieldCheck,
                badgeBg: "bg-[#F97316]",
              },
              {
                step: "3",
                title: "Analyze",
                desc: "Safe SQL is executed on your approved data.",
                icon: Database,
                badgeBg: "bg-blue-600",
              },
              {
                step: "4",
                title: "Visualize",
                desc: "Get interactive charts, explanations and insights.",
                icon: BarChart3,
                badgeBg: "bg-amber-500",
              },
            ].map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`w-6 h-6 rounded-full ${s.badgeBg} text-white font-bold text-xs flex items-center justify-center`}>
                      {s.step}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#111827]">{s.title}</h3>
                  <p className="text-xs text-[#64748B] leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Bottom Section: CTA Banner on Left + Live Dashboard Preview on Right */}
      <section id="preview" className="py-20 bg-white border-t border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left CTA Banner with 3D database graphics */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#EFF6FF] via-white to-blue-50/50 p-8 rounded-3xl border border-blue-200 shadow-sm space-y-6">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#111827] leading-tight">
                Ready to turn your data into meaningful insights?
              </h3>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                Join thousands of teams using InsightFlow AI to make faster, smarter decisions with complete governance.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/overview"
                  className="px-6 py-3 rounded-full bg-[#2563EB] text-white text-xs font-bold hover:bg-[#1D4ED8] shadow-[0_4px_14px_rgba(37,99,235,0.35)] transition-all"
                >
                  Get Started Free
                </Link>
                <Link
                  href="/ask"
                  className="px-5 py-3 rounded-full bg-white text-[#111827] text-xs font-bold border border-slate-200 hover:bg-slate-50 transition-all flex items-center space-x-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-[#2563EB] text-[#2563EB]" />
                  <span>Watch Demo</span>
                </Link>
              </div>

              {/* Graphical cylindrical database illustration matching mockup */}
              <div className="pt-6 border-t border-blue-100 flex items-center space-x-4">
                <div className="w-12 h-14 bg-gradient-to-b from-blue-400 to-blue-600 rounded-lg shadow-md flex items-center justify-center text-white">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#111827] block">Multi-tenant Ready</span>
                  <span className="text-[11px] text-[#64748B]">Continuous data encryption and strict allowlisting</span>
                </div>
              </div>
            </div>

            {/* Right Dashboard Mockup (Matching the reference preview image in detail) */}
            <div className="lg:col-span-7 bg-[#F8FAFC] rounded-3xl p-6 border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.06)] space-y-4">
              {/* Inner Mini Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-md bg-[#2563EB] flex items-center justify-center text-white">
                    <BarChart3 className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-bold text-xs text-[#111827]">InsightFlow AI</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    href="/ask"
                    className="px-3 py-1 bg-[#2563EB] text-white rounded-lg text-[10px] font-bold flex items-center space-x-1"
                  >
                    <Sparkles className="w-3 h-3 text-[#F97316]" />
                    <span>Ask Data</span>
                  </Link>
                </div>
              </div>

              {/* Welcome text inside preview */}
              <div>
                <h4 className="text-sm font-bold text-[#111827]">Good morning, Sarah 👋</h4>
                <p className="text-[10px] text-[#64748B]">Explore your business data with natural language.</p>
              </div>

              {/* 4 Mini KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-[#64748B] block">Total Revenue</span>
                  <span className="text-sm font-extrabold text-[#111827] block mt-0.5">$248,750</span>
                  <span className="text-[9px] font-bold text-emerald-600">↑ 12.5% vs last month</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-[#64748B] block">Total Orders</span>
                  <span className="text-sm font-extrabold text-[#111827] block mt-0.5">1,842</span>
                  <span className="text-[9px] font-bold text-emerald-600">↑ 6.2% vs last month</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-[#64748B] block">Customers</span>
                  <span className="text-sm font-extrabold text-[#111827] block mt-0.5">1,245</span>
                  <span className="text-[9px] font-bold text-emerald-600">↑ 4.7% vs last month</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-[#64748B] block">Conversion Rate</span>
                  <span className="text-sm font-extrabold text-[#111827] block mt-0.5">3.8%</span>
                  <span className="text-[9px] font-bold text-emerald-600">↑ 0.4% vs last month</span>
                </div>
              </div>

              {/* Bottom split: Recent Activity & Saved Dashboards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Recent Activity */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-[10px] font-bold text-[#111827] block">Recent Activity</span>
                  <div className="space-y-1.5 text-[10px]">
                    <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50">
                      <span className="truncate text-slate-800">Revenue by region this month</span>
                      <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-600">Chart</span>
                    </div>
                    <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50">
                      <span className="truncate text-slate-800">Top 10 products by sales</span>
                      <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">Table</span>
                    </div>
                  </div>
                </div>

                {/* Saved Dashboards */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-[10px] font-bold text-[#111827] block">Saved Dashboards</span>
                  <div className="space-y-1.5 text-[10px]">
                    <div className="p-1.5 rounded-lg bg-slate-50 flex items-center justify-between">
                      <span className="text-slate-800 font-medium">Sales Overview</span>
                      <span className="text-[9px] text-[#64748B]">12 widgets</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-slate-50 flex items-center justify-between">
                      <span className="text-slate-800 font-medium">Marketing Performance</span>
                      <span className="text-[9px] text-[#64748B]">8 widgets</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="py-10 bg-[#F8FAFC] border-t border-[#E2E8F0] text-xs text-[#64748B]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-md bg-[#2563EB] flex items-center justify-center text-white">
              <BarChart3 className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-[#111827]">InsightFlow AI</span>
            <span className="text-[#94A3B8]">Natural Language Analytics Platform</span>
          </div>

          <p className="text-[11px] text-[#94A3B8]">
            Better Questions. Deeper Insights. © {new Date().getFullYear()} InsightFlow AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
