"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  Plus,
  ArrowRight,
  Layers,
  Clock,
  Star,
  Share2,
  Eye,
  Edit3,
  CheckCircle2,
  Sparkles,
  Search,
} from "lucide-react";

export default function AnalystDashboardsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const dashboards = [
    {
      id: "sales_overview",
      name: "Sales & Revenue Performance",
      description: "Quarterly sales figures, monthly ARR trajectory, and average deal size across sales tiers.",
      widgetsCount: 4,
      updated: "15 mins ago",
      author: "Elena Rostova",
      image: "/images/dashboard-sales.jpg",
      status: "Published",
      category: "Finance",
    },
    {
      id: "marketing_funnel",
      name: "Marketing & Acquisition Funnel",
      description: "Conversion rates, lead velocity, customer acquisition cost (CAC vs LTV), and marketing channel ROI.",
      widgetsCount: 4,
      updated: "1 hour ago",
      author: "Marketing Operations Team",
      image: "/images/dashboard-marketing.jpg",
      status: "Published",
      category: "Growth",
    },
    {
      id: "customer_analytics",
      name: "Customer Retention & LTV",
      description: "Segment breakdown (Enterprise vs Mid-Market), cohort retention matrix, and expansion MRR.",
      widgetsCount: 4,
      updated: "Yesterday",
      author: "Customer Success",
      image: "/images/dashboard-retention.jpg",
      status: "Published",
      category: "Retention",
    },
    {
      id: "executive_summary",
      name: "Quarterly Executive Summary",
      description: "Consolidated board deck metrics: ARR growth curves, EBITDA margins, and global expansion.",
      widgetsCount: 5,
      updated: "2 days ago",
      author: "Alex Vance (Admin)",
      image: "/images/dashboard-executive.jpg",
      status: "Executive Approved",
      category: "Strategy",
    },
  ];

  const filteredDashboards = dashboards.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-[#2563EB] mb-1">
            <BarChart3 className="w-4 h-4" />
            <span className="uppercase tracking-wider">Analyst Dashboard Repository</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111827]">
            Saved Business Dashboards
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Manage, clone, configure, and publish live interactive dashboards for organization stakeholders.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative w-48 sm:w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search dashboards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-white border border-[#E2E8F0] rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>
          <Link
            href="/analyst/builder"
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>New Dashboard</span>
          </Link>
        </div>
      </div>

      {/* Dashboards Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDashboards.map((dash) => (
          <div
            key={dash.id}
            className="group bg-white rounded-3xl border border-[#E2E8F0] shadow-xs hover:shadow-xl hover:border-blue-300 transition-all duration-300 overflow-hidden flex flex-col justify-between"
          >
            {/* Visual Thumbnail */}
            <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
              <img
                src={dash.image}
                alt={dash.name}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

              <div className="absolute top-3 left-3 flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-blue-700 shadow-xs flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-blue-600" />
                  <span>{dash.status}</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900/70 text-white backdrop-blur-md">
                  {dash.category}
                </span>
              </div>

              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                <span className="text-xs font-bold flex items-center space-x-1">
                  <Layers className="w-3.5 h-3.5 text-blue-300" />
                  <span>{dash.widgetsCount} Chart Widgets</span>
                </span>
                <span className="text-[11px] text-white/80">Updated {dash.updated}</span>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-[#111827] group-hover:text-[#2563EB] transition-colors">
                  {dash.name}
                </h3>
                <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">
                  {dash.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-medium">Curated by {dash.author}</span>
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/analyst/builder?edit=${dash.id}`}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </Link>
                  <Link
                    href="/viewer/dashboards"
                    className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
