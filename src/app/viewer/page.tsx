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
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>Executive Briefing Mode</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[#111827]">
            Executive Business Cockpit, {currentUser?.name?.split(" ")[0]}
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Curated high-level business intelligence, published departmental dashboards, and key performance indicators.
          </p>
        </div>

        <Link
          href="/viewer/dashboards"
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20"
        >
          <Layers className="w-4 h-4" />
          <span>Browse Published Dashboards</span>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-white p-5 rounded-3xl border border-[#E2E8F0] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#64748B]">{kpi.title}</span>
                <div className={`p-2 rounded-xl ${kpi.bg} ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-[#111827]">{kpi.value}</p>
              <span className="text-[11px] font-bold text-emerald-600 block">{kpi.change}</span>
            </div>
          );
        })}
      </div>

      {/* Narrative AI Insight Card */}
      <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/50 p-6 rounded-3xl border border-blue-200 shadow-xs space-y-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-[#F97316]" />
          <span className="text-xs font-bold text-[#1E3A8A] uppercase tracking-wider">
            AI Automated Executive Briefing
          </span>
        </div>
        <p className="text-sm font-semibold text-[#111827] leading-relaxed">
          "Quarterly revenue grew by 12.4% driven predominantly by the North America enterprise segment and Software add-ons. Customer retention increased across Platinum accounts with zero detected revenue leakages."
        </p>
        <div className="pt-1">
          <Link
            href="/viewer/insights"
            className="text-xs font-bold text-[#2563EB] hover:underline inline-flex items-center space-x-1"
          >
            <span>Read full executive narrative insights</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/viewer/dashboards"
          className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs hover:border-emerald-300 transition-all space-y-2 block group"
        >
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 w-fit">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[#111827] group-hover:text-emerald-700">
            Interactive Published Dashboards
          </h3>
          <p className="text-xs text-[#64748B]">
            Explore pre-approved sales, marketing, and customer retention charts verified by the analytics team.
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
