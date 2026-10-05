"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Layers,
  ArrowRight,
  Eye,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  User,
  X,
  Maximize2,
  Download,
  Share2,
  Sparkles,
  BarChart3,
  TrendingUp,
} from "lucide-react";

interface DashboardItem {
  id: string;
  title: string;
  description: string;
  widgetsCount: number;
  author: string;
  status: string;
  updated: string;
  image: string;
  category: string;
  kpis: { label: string; value: string; change: string }[];
  insights: string;
}

export default function ViewerDashboardsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDashboard, setSelectedDashboard] = useState<DashboardItem | null>(null);

  const publishedDashboards: DashboardItem[] = [
    {
      id: "dash_sales",
      title: "Sales & Revenue Overview",
      description: "Company-wide gross revenue, regional targets vs attainment, and order volume velocity across all sales channels.",
      widgetsCount: 4,
      author: "Elena Rostova (Lead Analyst)",
      status: "Verified by Finance",
      updated: "10 mins ago",
      image: "/images/dashboard-sales.jpg",
      category: "finance",
      kpis: [
        { label: "Total Revenue", value: "$2.8M", change: "+18.2% YoY" },
        { label: "New MRR", value: "$450K", change: "+12.5% MoM" },
        { label: "Active Users", value: "54.2K", change: "+8.7%" },
        { label: "Renewal Rate", value: "96.5%", change: "+1.1%" },
      ],
      insights: "Q3 revenue has outpaced target by $400K with North America and Enterprise plans leading customer expansions.",
    },
    {
      id: "dash_mktg",
      title: "Marketing & Acquisition Funnel",
      description: "Conversion rates, lead velocity, customer acquisition cost (CAC vs LTV), and marketing channel ROI.",
      widgetsCount: 4,
      author: "Marketing Operations Team",
      status: "Published",
      updated: "1 hour ago",
      image: "/images/dashboard-marketing.jpg",
      category: "marketing",
      kpis: [
        { label: "Website Visits", value: "15,420", change: "+12.8% conv" },
        { label: "MQL Velocity", value: "162 MQLs", change: "+15.2% MoM" },
        { label: "CAC vs LTV", value: "$820 / $4.5K", change: "5.4x Ratio" },
        { label: "Paid Trials", value: "50 Accounts", change: "32% Win Rate" },
      ],
      insights: "Paid trial to customer velocity improved by 4.2% following the onboarding workflow revamp.",
    },
    {
      id: "dash_cust",
      title: "Customer Retention & Cohort Health",
      description: "Net revenue retention (NRR), customer churn risk analysis, and account growth patterns by cohort.",
      widgetsCount: 4,
      author: "Customer Success Analytics",
      status: "Verified by Ops",
      updated: "Yesterday",
      image: "/images/dashboard-retention.jpg",
      category: "retention",
      kpis: [
        { label: "Net Revenue Retention", value: "115%", change: "Healthy Expansion" },
        { label: "Gross Renewal Rate", value: "92%", change: "+2.4% QoQ" },
        { label: "Logo Churn (Mo)", value: "1.8%", change: "-0.4% Improvement" },
        { label: "Expansion MRR", value: "$180K", change: "+24% YoY" },
      ],
      insights: "Cohort analysis shows 95% retention at month 1 with zero revenue contraction in tier-1 enterprise clients.",
    },
    {
      id: "dash_exec",
      title: "Quarterly Executive Summary",
      description: "Consolidated board deck metrics: ARR growth curves, EBITDA margins, cash runway, and global market expansion.",
      widgetsCount: 5,
      author: "Alex Vance (Admin & Strategy)",
      status: "Executive Approved",
      updated: "2 days ago",
      image: "/images/dashboard-executive.jpg",
      category: "executive",
      kpis: [
        { label: "Annual Recurring Revenue", value: "$8.5M", change: "+22% YoY" },
        { label: "EBITDA Margin", value: "21%", change: "Above 17% Target" },
        { label: "Cash Runway", value: "19 Months", change: "$17.8M Balance" },
        { label: "EMEA Expansion", value: "$2.6M", change: "+24% YoY" },
      ],
      insights: "Board deck is locked and approved. ARR trajectory positions the organization for Series B milestone targets.",
    },
  ];

  const filteredDashboards = publishedDashboards.filter((dash) => {
    const matchesCategory = activeCategory === "all" || dash.category === activeCategory;
    const matchesSearch =
      dash.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dash.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dash.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="pb-4 border-b border-[#E2E8F0] flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-[#2563EB] mb-1">
            <Eye className="w-4 h-4" />
            <span className="uppercase tracking-wider">Curated Read-Only Dashboards</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111827]">
            Published Business Dashboards
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1 max-w-2xl">
            Access certified analytics dashboards prepared, audited, and published by your organization's analytics and finance team.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search dashboards or authors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] transition-all placeholder:text-slate-400 shadow-2xs"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: "all", label: "All Dashboards" },
          { id: "finance", label: "Finance & Sales" },
          { id: "marketing", label: "Marketing & Growth" },
          { id: "retention", label: "Customer Success" },
          { id: "executive", label: "Executive & Board" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeCategory === tab.id
                ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20"
                : "bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-[#2563EB]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Visual Dashboard Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDashboards.map((dash) => (
          <div
            key={dash.id}
            className="group bg-white rounded-3xl border border-[#E2E8F0] shadow-xs hover:shadow-xl hover:border-blue-300 transition-all duration-300 overflow-hidden flex flex-col justify-between"
          >
            {/* Visual Preview Banner */}
            <div
              onClick={() => setSelectedDashboard(dash)}
              className="relative aspect-video w-full bg-slate-100 overflow-hidden cursor-pointer"
            >
              <img
                src={dash.image}
                alt={dash.title}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
              
              {/* Badge overlay */}
              <div className="absolute top-3 left-3 flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#2563EB] shadow-xs flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-[#2563EB]" />
                  <span>{dash.status}</span>
                </span>
              </div>

              <div className="absolute top-3 right-3">
                <span className="text-[11px] font-semibold text-white/90 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full">
                  {dash.updated}
                </span>
              </div>

              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                <span className="text-xs font-bold drop-shadow-sm flex items-center space-x-1">
                  <BarChart3 className="w-3.5 h-3.5 text-blue-300" />
                  <span>{dash.widgetsCount} Interactive Charts</span>
                </span>
                <span className="text-[11px] text-white/80 drop-shadow-sm flex items-center space-x-1">
                  <User className="w-3 h-3" />
                  <span>{dash.author}</span>
                </span>
              </div>
            </div>

            {/* Card Content Details */}
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <h3
                  onClick={() => setSelectedDashboard(dash)}
                  className="text-lg font-black text-[#111827] group-hover:text-[#2563EB] transition-colors cursor-pointer"
                >
                  {dash.title}
                </h3>
                <p className="text-xs text-[#64748B] leading-relaxed line-clamp-2">
                  {dash.description}
                </p>
              </div>

              {/* Mini KPI Preview Pill Row */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                {dash.kpis.slice(0, 2).map((kpi, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-100 rounded-xl p-2.5">
                    <p className="text-[10px] font-semibold text-slate-500 uppercase">{kpi.label}</p>
                    <div className="flex items-baseline space-x-1.5 mt-0.5">
                      <span className="text-sm font-black text-slate-900">{kpi.value}</span>
                      <span className="text-[10px] font-bold text-emerald-600">{kpi.change}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Bar */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[11px] text-slate-500 flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#F97316]" />
                  <span className="font-semibold text-slate-700">AI Grounded Basis</span>
                </div>

                <button
                  onClick={() => setSelectedDashboard(dash)}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 group-hover:translate-x-0.5"
                >
                  <span>Open Interactive View</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Modal Dashboard Viewer */}
      {selectedDashboard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="p-2 rounded-xl bg-blue-100 text-[#2563EB]">
                  <Layers className="w-5 h-5" />
                </span>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-base sm:text-lg font-black text-slate-900">
                      {selectedDashboard.title}
                    </h2>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200">
                      {selectedDashboard.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Curated by {selectedDashboard.author} • Updated {selectedDashboard.updated}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    const el = document.createElement("a");
                    const blob = new Blob([`InsightFlow AI - ${selectedDashboard.title}\nStatus: Verified\nSummary: ${selectedDashboard.insights}`], { type: "text/plain" });
                    el.href = URL.createObjectURL(blob);
                    el.download = `${selectedDashboard.id}.txt`;
                    document.body.appendChild(el);
                    el.click();
                    document.body.removeChild(el);
                  }}
                  className="hidden sm:inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-white text-slate-700 text-xs font-semibold transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export</span>
                </button>
                <button
                  onClick={() => setSelectedDashboard(null)}
                  className="p-2 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Full Visual Preview Image */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md">
                <img
                  src={selectedDashboard.image}
                  alt={selectedDashboard.title}
                  className="w-full object-contain"
                />
              </div>

              {/* KPI Metrics Strip */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Key Performance Indicators
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {selectedDashboard.kpis.map((kpi, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1">
                      <span className="text-xs font-semibold text-slate-500">{kpi.label}</span>
                      <p className="text-xl font-black text-slate-900">{kpi.value}</p>
                      <span className="text-xs font-bold text-emerald-600 block">{kpi.change}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Narrative Commentary */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-200 rounded-2xl p-5 space-y-2">
                <div className="flex items-center space-x-2 text-[#1E3A8A]">
                  <Sparkles className="w-4 h-4 text-[#F97316]" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Executive Narrative Summary
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                  "{selectedDashboard.insights}"
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Mode: Verified Read-Only View • Strict RBAC Enforced
              </span>
              <button
                onClick={() => setSelectedDashboard(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
