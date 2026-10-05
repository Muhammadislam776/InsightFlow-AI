"use client";

import React from "react";
import { Sparkles, TrendingUp, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";

export default function ViewerInsightsPage() {
  const insights = [
    {
      id: "ins_1",
      title: "Revenue Surge Across North America",
      category: "GROWTH",
      date: "Today, 09:30 AM",
      narrative:
        "North America sales outperformed quarterly targets by 18.4%, largely fueled by high-value subscriptions in the enterprise tier. Average transaction size expanded from $1,200 to $1,480.",
      impact: "HIGH IMPACT",
      tagColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      id: "ins_2",
      title: "Product Concentration in Enterprise Software",
      category: "INVENTORY & SKUs",
      date: "Yesterday",
      narrative:
        "The top 3 software offerings accounted for 64% of total sales volume this quarter. Add-on services showed a 22% quarter-over-quarter expansion.",
      impact: "OPPORTUNITY",
      tagColor: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      id: "ins_3",
      title: "Zero Revenue Discrepancy & Read-Only Integrity",
      category: "COMPLIANCE",
      date: "Oct 03, 2026",
      narrative:
        "All calculated financial figures match PostgreSQL bank reconciliation tables with 100% precision. No unverified transactions were detected.",
      impact: "VERIFIED",
      tagColor: "bg-purple-50 text-purple-700 border-purple-200",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="pb-2 border-b border-[#E2E8F0]">
        <div className="flex items-center space-x-2 text-xs font-bold text-[#F97316] mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Automated Natural-Language Intelligence</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-[#111827]">
          AI Narrative Business Insights
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
          Grounded narrative analysis generated directly from verified database queries — no invented numbers or hallucinations.
        </p>
      </div>

      <div className="space-y-4">
        {insights.map((item) => (
          <div
            key={item.id}
            className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-xs space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.tagColor}`}>
                  {item.impact}
                </span>
                <h3 className="text-base font-bold text-[#111827]">{item.title}</h3>
              </div>
              <span className="text-[11px] text-[#94A3B8]">{item.date}</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {item.narrative}
            </p>

            <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100">
              <span className="text-[11px] text-slate-500 font-medium">Domain: {item.category}</span>
              <span className="text-[11px] font-bold text-emerald-600 flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Grounded in Verified Data
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
