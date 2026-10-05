"use client";

import React from "react";
import { TrendingUp, DollarSign, Calendar, BarChart2 } from "lucide-react";

export default function ViewerMetricsPage() {
  const metricTrends = [
    { name: "Monthly Recurring Revenue (MRR)", current: "$84,200", change: "+14.2% QoQ", status: "Healthy" },
    { name: "Average Order Value (AOV)", current: "$1,350", change: "+5.8% MoM", status: "Expanding" },
    { name: "Customer Acquisition Velocity", current: "142 / mo", change: "+9.1% MoM", status: "Accelerating" },
    { name: "Gross Margin Percentage", current: "78.4%", change: "+1.2% QoQ", status: "Target Met" },
    { name: "Customer Churn Rate", current: "1.2%", change: "-0.4% MoM", status: "Low Risk" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="pb-2 border-b border-[#E2E8F0]">
        <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 mb-1">
          <TrendingUp className="w-4 h-4" />
          <span>Core Strategic KPIs</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-[#111827]">
          Key Business Metrics & Trajectory
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
          High-level executive indicators tracking company health, growth rate, and financial stability.
        </p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-xs">
        <h3 className="text-sm font-bold text-[#111827] mb-4">Strategic KPI Table</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[#94A3B8] font-bold uppercase text-[10px]">
                <th className="py-2.5">Metric Dimension</th>
                <th className="py-2.5">Current Value</th>
                <th className="py-2.5">Performance Trend</th>
                <th className="py-2.5 text-right">Health Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {metricTrends.map((m, i) => (
                <tr key={i} className="hover:bg-slate-50/70">
                  <td className="py-3 font-bold text-slate-800">{m.name}</td>
                  <td className="py-3 font-black text-slate-900 text-sm font-mono">{m.current}</td>
                  <td className="py-3 font-bold text-emerald-600">{m.change}</td>
                  <td className="py-3 text-right">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {m.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
