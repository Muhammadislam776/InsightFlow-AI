"use client";

import React from "react";
import Link from "next/link";
import { Layers, ArrowRight, Star, Clock, Eye } from "lucide-react";

export default function ViewerDashboardsPage() {
  const publishedDashboards = [
    {
      id: "dash_sales",
      title: "Sales & Revenue Overview",
      description: "Company-wide gross revenue, regional targets vs attainment, and order volume.",
      widgetsCount: 4,
      author: "Elena Rostova (Analyst)",
      status: "Verified by Finance",
      updated: "10 mins ago",
    },
    {
      id: "dash_mktg",
      title: "Marketing & Acquisition Funnel",
      description: "Conversion rates, lead velocity, customer acquisition cost, and marketing ROI.",
      widgetsCount: 4,
      author: "Marketing Operations",
      status: "Published",
      updated: "1 hour ago",
    },
    {
      id: "dash_cust",
      title: "Customer Retention & Cohort Health",
      description: "Net revenue retention, customer churn risk, and top account growth trends.",
      widgetsCount: 4,
      author: "Customer Success",
      status: "Published",
      updated: "Yesterday",
    },
    {
      id: "dash_exec",
      title: "Quarterly Executive Summary",
      description: "Consolidated board deck metrics: ARR growth, EBITDA margin, and enterprise expansion.",
      widgetsCount: 5,
      author: "Alex Vance (Admin)",
      status: "Executive Approved",
      updated: "2 days ago",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="pb-2 border-b border-[#E2E8F0]">
        <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 mb-1">
          <Eye className="w-4 h-4" />
          <span>Curated Read-Only Dashboards</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-[#111827]">
          Published Business Dashboards
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
          Access certified analytics dashboards prepared and audited by your organization's analytics team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {publishedDashboards.map((dash) => (
          <div
            key={dash.id}
            className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-xs hover:border-emerald-300 transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {dash.status}
                </span>
                <span className="text-[11px] text-[#94A3B8]">{dash.updated}</span>
              </div>
              <h3 className="text-lg font-bold text-[#111827]">{dash.title}</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">{dash.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">{dash.widgetsCount} Chart Widgets • By {dash.author}</span>
              <button
                onClick={() => alert(`Opening ${dash.title} in read-only interactive view.`)}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
              >
                <span>Open View</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
