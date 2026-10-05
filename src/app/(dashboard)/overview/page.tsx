"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Percent,
  Layers,
  Clock,
  ChevronRight,
  BarChart3,
  ExternalLink,
  ShieldCheck,
  Star,
  CheckCircle2,
  Plus,
  BookOpen,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { savedDashboards, queryHistoryList } from "@/lib/store/mockStore";

export default function OverviewPage() {
  const router = useRouter();
  const { currentUser, setActiveQueryResult, favoriteDashboardIds, toggleFavoriteDashboard } = useApp();
  const [loadingInsight, setLoadingInsight] = useState(false);

  // KPIs matching commercial SaaS reference mockup
  const kpis = [
    {
      title: "Total Revenue",
      value: "$248,750",
      change: "+12.5% vs last month",
      icon: DollarSign,
      color: "text-[#2563EB]",
      bg: "bg-blue-50",
    },
    {
      title: "Total Orders",
      value: "1,842",
      change: "+6.2% vs last month",
      icon: ShoppingCart,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Customers",
      value: "1,245",
      change: "+4.7% vs last month",
      icon: Users,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      title: "Conversion Rate",
      value: "3.8%",
      change: "+0.4% vs last month",
      icon: Percent,
      color: "text-[#F97316]",
      bg: "bg-orange-50",
    },
  ];

  const handleAskQuick = (q: string) => {
    router.push(`/ask?q=${encodeURIComponent(q)}`);
  };

  const handleExploreInsight = async () => {
    setLoadingInsight(true);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: "Show monthly revenue for the last 12 months.",
          role: currentUser?.role || "ANALYST",
        }),
      });
      const data = await res.json();
      setActiveQueryResult(data);
      router.push("/explore");
    } catch (e) {
      router.push("/ask");
    } finally {
      setLoadingInsight(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner / Welcome Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-[#E2E8F0]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111827]">
            Good morning, {currentUser?.name ? currentUser.name.split(" ")[0] : "there"} 👋
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Explore your business data with natural language and safe SQL analytics.
          </p>
        </div>

        {/* Dedicated Portal Shortcuts based on Role */}
        <div className="flex flex-wrap items-center gap-2">
          {currentUser?.role === "ADMIN" && (
            <Link
              href="/admin"
              className="px-4 py-2 rounded-xl bg-[#1E3A8A] hover:bg-[#172554] text-xs font-bold text-white flex items-center space-x-1.5 shadow-md shadow-blue-900/20 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-200" />
              <span>Admin Portal →</span>
            </Link>
          )}

          {currentUser?.role === "ANALYST" && (
            <Link
              href="/analyst"
              className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-xs font-bold text-white flex items-center space-x-1.5 shadow-md shadow-blue-600/20 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Analyst Studio →</span>
            </Link>
          )}

          {currentUser?.role === "VIEWER" && (
            <Link
              href="/viewer"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white flex items-center space-x-1.5 shadow-md shadow-emerald-600/20 transition-colors"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Executive Cockpit →</span>
            </Link>
          )}

          <Link
            href="/ask"
            className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-[0_4px_12px_rgba(37,99,235,0.25)] flex items-center space-x-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F97316]" />
            <span>Ask Data</span>
          </Link>
        </div>
      </div>

      {/* Visual Hero Feature Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-950 via-indigo-900 to-slate-900 text-white shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-4 z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-orange-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-Powered Natural Language Analytics</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black leading-tight text-white">
              Turn Business Questions into Safe Interactive Visualizations
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-xl">
              Ask about revenue, customer churn, regional comparisons, and order velocity. InsightFlow translates English questions into deterministic read-only SQL in real time.
            </p>
            <div className="pt-1 flex flex-wrap items-center gap-3">
              <button
                onClick={() => handleAskQuick("Show monthly revenue for the last 12 months.")}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-md shadow-orange-500/30"
              >
                <span>Ask: "Monthly revenue last 12 months"</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 h-48 lg:h-full relative overflow-hidden">
            <img
              src="/images/ai-analytics-hero.jpg"
              alt="AI Analytics & Natural Language BI"
              className="w-full h-full object-cover object-center opacity-85 hover:opacity-100 transition-opacity duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-blue-950/90 via-transparent to-transparent" />
          </div>
        </div>
      </div>

      {/* 4 Clean Elevated KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="rounded-3xl border border-[#E2E8F0] bg-white p-5 shadow-xs hover:shadow-md hover:border-blue-300 transition-all duration-200 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#64748B]">{kpi.title}</span>
                <div className={`p-2.5 rounded-2xl ${kpi.bg} ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-1">
                <span className="text-2xl font-black text-[#111827] tracking-tight">
                  {kpi.value}
                </span>
                <p className="mt-1 text-xs font-bold text-emerald-600 flex items-center">
                  <TrendingUp className="w-3.5 h-3.5 mr-1" />
                  {kpi.change}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity + Saved Dashboards Side-by-Side Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Recent Activity */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E2E8F0] shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-sm font-bold text-[#111827] flex items-center">
              <Clock className="w-4 h-4 mr-2 text-[#2563EB]" />
              Recent Question Activity
            </h2>
            <Link
              href="/history"
              className="text-xs font-semibold text-[#2563EB] hover:underline"
            >
              View Full History →
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {queryHistoryList.slice(0, 5).map((item) => (
              <div
                key={item.id}
                onClick={() => handleAskQuick(item.question)}
                className="py-3 hover:bg-slate-50/80 px-2 rounded-xl transition-colors cursor-pointer group flex items-center justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#111827] group-hover:text-[#2563EB] transition-colors truncate">
                    "{item.question}"
                  </p>
                  <div className="flex items-center space-x-2.5 mt-0.5 text-[11px] text-[#94A3B8]">
                    <span>{item.timestamp}</span>
                    <span>•</span>
                    <span>{item.rowsReturned} rows</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.status === "Success"
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                        : item.status === "Blocked"
                        ? "bg-rose-50 text-rose-600 border border-rose-200"
                        : "bg-blue-50 text-[#2563EB] border border-blue-200"
                    }`}
                  >
                    {item.status}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                    {item.visualization}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (5 cols): Saved Dashboards */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E2E8F0] shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-sm font-bold text-[#111827] flex items-center">
              <Layers className="w-4 h-4 mr-2 text-[#2563EB]" />
              Curated Business Dashboards
            </h2>
            <Link
              href="/viewer/dashboards"
              className="text-xs font-semibold text-[#2563EB] hover:underline"
            >
              Browse Gallery →
            </Link>
          </div>

          <div className="space-y-3">
            {[
              {
                id: "dash_sales",
                title: "Sales & Revenue Overview",
                img: "/images/dashboard-sales.jpg",
                metric: "$2.8M Gross",
              },
              {
                id: "dash_mktg",
                title: "Marketing Acquisition Funnel",
                img: "/images/dashboard-marketing.jpg",
                metric: "15.4K Visits",
              },
              {
                id: "dash_exec",
                title: "Quarterly Executive Summary",
                img: "/images/dashboard-executive.jpg",
                metric: "$8.5M ARR",
              },
            ].map((dash) => (
              <Link
                key={dash.id}
                href="/viewer/dashboards"
                className="rounded-2xl border border-slate-200 p-2.5 hover:border-blue-300 hover:shadow-xs transition-all flex items-center justify-between group bg-[#F8FAFC]/50"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-10 rounded-lg overflow-hidden bg-slate-200 shrink-0">
                    <img src={dash.img} alt={dash.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#111827] group-hover:text-[#2563EB] transition-colors">
                      {dash.title}
                    </h4>
                    <p className="text-[10px] text-[#64748B] font-medium">{dash.metric}</p>
                  </div>
                </div>

                <span className="text-[11px] font-bold text-[#2563EB] group-hover:translate-x-0.5 transition-transform">
                  View →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
