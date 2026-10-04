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

  // KPIs matching image 3 of the reference mockup
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
          role: currentUser.role,
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
      {/* Top Banner / Welcome Header with Quick Action Bar matching mockup */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-[#E2E8F0]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111827]">
            Good morning, {currentUser.name.split(" ")[0]} 👋
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Explore your business data with natural language.
          </p>
        </div>

        {/* Quick Action Pill Buttons matching mockup #3 */}
        <div className="flex flex-wrap items-center gap-2">
          {currentUser.role !== "VIEWER" && (
            <Link
              href="/dashboards/builder"
              className="px-3 py-2 rounded-xl bg-white border border-[#E2E8F0] hover:bg-slate-50 text-xs font-semibold text-[#111827] flex items-center space-x-1.5 shadow-2xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>New Dashboard</span>
            </Link>
          )}

          <Link
            href="/history"
            className="px-3 py-2 rounded-xl bg-white border border-[#E2E8F0] hover:bg-slate-50 text-xs font-semibold text-[#111827] flex items-center space-x-1.5 shadow-2xs transition-colors"
          >
            <Clock className="w-3.5 h-3.5 text-[#64748B]" />
            <span>Recent Queries</span>
          </Link>

          <Link
            href="/catalog"
            className="px-3 py-2 rounded-xl bg-white border border-[#E2E8F0] hover:bg-slate-50 text-xs font-semibold text-[#111827] flex items-center space-x-1.5 shadow-2xs transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            <span>Data Catalog</span>
          </Link>

          <Link
            href="/ask"
            className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-[0_4px_12px_rgba(37,99,235,0.25)] flex items-center space-x-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F97316]" />
            <span>Ask Data</span>
          </Link>
        </div>
      </div>

      {/* 4 Clean Elevated KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#64748B]">{kpi.title}</span>
                <div className={`p-2 rounded-xl ${kpi.bg} ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
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

      {/* AI Grounded Insight Banner */}
      <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50/80 via-white to-orange-50/50 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="p-2.5 rounded-xl bg-white border border-blue-200 shadow-sm text-[#F97316] shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider">
                Automated AI Business Insight
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white text-[#64748B] border border-[#E2E8F0]">
                Verified Data Basis
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-[#111827] mt-0.5">
              "Revenue increased 12.5% compared with the previous period."
            </h3>
            <p className="text-xs text-[#64748B]">
              Primary growth attributed to North America Enterprise Cloud renewals.
            </p>
          </div>
        </div>

        <button
          onClick={handleExploreInsight}
          disabled={loadingInsight}
          className="shrink-0 px-4 py-2 bg-white hover:bg-[#2563EB] hover:text-white text-[#111827] border border-[#E2E8F0] hover:border-[#2563EB] rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center space-x-1.5"
        >
          <span>{loadingInsight ? "Loading..." : "Explore Insight"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Recent Activity + Saved Dashboards Side-by-Side Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Recent Activity (Mockup #3) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#111827] flex items-center">
              <Clock className="w-4 h-4 mr-2 text-[#2563EB]" />
              Recent Activity
            </h2>
            <Link
              href="/history"
              className="text-xs font-semibold text-[#2563EB] hover:underline"
            >
              View All →
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

        {/* Right Column (5 cols): Saved Dashboards (Mockup #3) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#111827] flex items-center">
              <Layers className="w-4 h-4 mr-2 text-[#2563EB]" />
              Saved Dashboards
            </h2>
            <Link
              href="/dashboards"
              className="text-xs font-semibold text-[#2563EB] hover:underline"
            >
              View All →
            </Link>
          </div>

          <div className="space-y-3">
            {savedDashboards.map((dash) => {
              const isFav = favoriteDashboardIds.includes(dash.id);

              return (
                <div
                  key={dash.id}
                  className="rounded-xl border border-slate-200 p-3.5 hover:border-blue-300 hover:shadow-xs transition-all flex items-center justify-between group bg-[#F8FAFC]/50"
                >
                  <div className="space-y-0.5 pr-2">
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/dashboards/${dash.id}`}
                        className="text-xs font-bold text-[#111827] group-hover:text-[#2563EB] transition-colors"
                      >
                        {dash.name}
                      </Link>
                      {isFav && (
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      )}
                    </div>
                    <p className="text-[11px] text-[#64748B]">
                      {dash.widgets.length} widgets · Updated {dash.lastUpdated}
                    </p>
                  </div>

                  <Link
                    href={`/dashboards/${dash.id}`}
                    className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#2563EB] hover:text-white text-xs font-semibold text-[#111827] border border-[#E2E8F0] transition-all"
                  >
                    Open
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
