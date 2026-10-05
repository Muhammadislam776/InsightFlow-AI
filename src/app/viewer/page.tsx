"use client";

import React from "react";
import Link from "next/link";
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Percent,
  Sparkles,
  ArrowRight,
  Layers,
  FileText,
  CheckCircle2,
  ShieldCheck,
  BarChart3,
  ExternalLink,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function ViewerCockpitPage() {
  const { currentUser } = useApp();

  const kpis = [
    { title: "Total Revenue", value: "$248,750", change: "+12.5% vs last month", icon: DollarSign, color: "text-[#2563EB]", bg: "bg-blue-50" },
    { title: "Total Orders", value: "1,842", change: "+6.2% vs last month", icon: ShoppingCart, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Active Customers", value: "3,120", change: "+4.1% vs last month", icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Conversion Rate", value: "3.8%", change: "+0.4% vs last month", icon: Percent, color: "text-[#F97316]", bg: "bg-orange-50" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Welcome & Mode */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span className="uppercase tracking-wider">Executive Briefing Mode</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111827]">
            Executive Business Cockpit, {currentUser?.name?.split(" ")[0]}
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Curated high-level business intelligence, verified departmental dashboards, and key performance indicators.
          </p>
        </div>

        <Link
          href="/viewer/dashboards"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20"
        >
          <Layers className="w-4 h-4" />
          <span>Browse Published Dashboards</span>
        </Link>
      </div>

      {/* Hero Showcase Card with AI Graphic */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-4 z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-orange-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Executive Synthesis • Q3 Live</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black leading-tight text-white">
              Revenue Surges by +18.2% with Zero Enterprise Churn
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-xl">
              Natural-language analytics synthesized across 50,000+ customer records indicate record growth across Enterprise software tiers, with European expansion pacing 14% ahead of conservative estimates.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/viewer/insights"
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-md shadow-orange-500/30"
              >
                <span>Read Full AI Narrative</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/viewer/dashboards"
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold backdrop-blur-md transition-all border border-white/20"
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>View Certified Dashboards</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 h-48 lg:h-full relative overflow-hidden">
            <img
              src="/images/ai-analytics-hero.jpg"
              alt="AI Analytics Synthesis"
              className="w-full h-full object-cover object-center opacity-85 hover:opacity-100 transition-opacity duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-blue-900/90 via-transparent to-transparent" />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-white p-5 rounded-3xl border border-[#E2E8F0] shadow-xs hover:shadow-md hover:border-emerald-300 transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#64748B]">{kpi.title}</span>
                <div className={`p-2.5 rounded-2xl ${kpi.bg} ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-[#111827]">{kpi.value}</p>
              <span className="text-[11px] font-bold text-emerald-600 block">{kpi.change}</span>
            </div>
          );
        })}
      </div>

      {/* Curated Dashboards Visual Teaser */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-[#111827]">Featured Certified Dashboards</h3>
            <p className="text-xs text-[#64748B]">Click any dashboard to open full interactive inspection</p>
          </div>
          <Link
            href="/viewer/dashboards"
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center space-x-1"
          >
            <span>View all 4</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Link
            href="/viewer/dashboards"
            className="group bg-white rounded-3xl border border-[#E2E8F0] overflow-hidden shadow-xs hover:shadow-lg hover:border-emerald-400 transition-all block"
          >
            <div className="aspect-video w-full overflow-hidden bg-slate-100 relative">
              <img
                src="/images/dashboard-sales.jpg"
                alt="Sales & Revenue Overview"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-emerald-700 shadow-xs">
                Verified by Finance
              </span>
            </div>
            <div className="p-5 space-y-1.5">
              <h4 className="text-base font-bold text-[#111827] group-hover:text-emerald-600 transition-colors">
                Sales & Revenue Overview
              </h4>
              <p className="text-xs text-[#64748B] line-clamp-2">
                Company-wide gross revenue, regional targets vs attainment, and order volume velocity.
              </p>
            </div>
          </Link>

          <Link
            href="/viewer/dashboards"
            className="group bg-white rounded-3xl border border-[#E2E8F0] overflow-hidden shadow-xs hover:shadow-lg hover:border-emerald-400 transition-all block"
          >
            <div className="aspect-video w-full overflow-hidden bg-slate-100 relative">
              <img
                src="/images/dashboard-executive.jpg"
                alt="Quarterly Executive Summary"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-emerald-700 shadow-xs">
                Executive Approved
              </span>
            </div>
            <div className="p-5 space-y-1.5">
              <h4 className="text-base font-bold text-[#111827] group-hover:text-emerald-600 transition-colors">
                Quarterly Executive Summary
              </h4>
              <p className="text-xs text-[#64748B] line-clamp-2">
                Consolidated board deck metrics: ARR growth curves, EBITDA margins, and enterprise expansion.
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <Link
          href="/viewer/insights"
          className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs hover:border-emerald-300 transition-all space-y-2 block group"
        >
          <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600 w-fit">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[#111827] group-hover:text-emerald-700">
            AI Narrative Insights Feed
          </h3>
          <p className="text-xs text-[#64748B]">
            Transparent explanation cards grounded in actual SQL queries with confidence intervals and audit references.
          </p>
        </Link>

        <Link
          href="/viewer/reports"
          className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs hover:border-emerald-300 transition-all space-y-2 block group"
        >
          <div className="p-2.5 rounded-xl bg-blue-50 text-[#2563EB] w-fit">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[#111827] group-hover:text-[#2563EB]">
            Executive Briefings & Downloads
          </h3>
          <p className="text-xs text-[#64748B]">
            Review monthly executive board presentations, summaries, and high-level KPI snapshots.
          </p>
        </Link>
      </div>
    </div>
  );
}
