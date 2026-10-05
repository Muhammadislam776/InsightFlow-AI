"use client";

import React from "react";
import Link from "next/link";
import { BarChart3, Plus, ArrowRight, Layers, Clock, Star, Share2 } from "lucide-react";

export default function AnalystDashboardsPage() {
  const dashboards = [
    {
      id: "sales_overview",
      name: "Sales & Revenue Performance",
      description: "Quarterly sales figures, monthly ARR trajectory, and average deal size.",
      widgetsCount: 4,
      updated: "15 mins ago",
      author: "Elena Rostova",
    },
    {
      id: "product_profitability",
      name: "Product Profitability & Unit Cost",
      description: "Top revenue generating SKUs, profit margins, and volume distributions.",
      widgetsCount: 6,
      updated: "2 hours ago",
      author: "Alex Vance",
    },
    {
      id: "customer_analytics",
      name: "Customer Retention & LTV",
      description: "Segment breakdown (Enterprise vs Mid-Market), churn rate, and lifetime value.",
      widgetsCount: 5,
      updated: "Yesterday",
      author: "Elena Rostova",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-[#2563EB] mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Analyst Dashboard Repository</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[#111827]">
            Saved Business Dashboards
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Manage, clone, configure, and publish live interactive dashboards for organization stakeholders.
          </p>
        </div>

        <Link
          href="/analyst/builder"
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>New Dashboard</span>
        </Link>
      </div>

      {/* Dashboards Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {dashboards.map((dash) => (
          <div
            key={dash.id}
            className="bg-white p-5 rounded-3xl border border-[#E2E8F0] shadow-xs hover:border-blue-300 transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#2563EB]">
                  {dash.widgetsCount} Widgets
                </span>
                <span className="text-[10px] text-[#94A3B8]">Updated {dash.updated}</span>
              </div>
              <h3 className="text-base font-bold text-[#111827]">{dash.name}</h3>
              <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">
                {dash.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">By {dash.author}</span>
              <Link
                href={`/viewer/dashboards`}
                className="text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] flex items-center space-x-1 group"
              >
                <span>View Live</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
