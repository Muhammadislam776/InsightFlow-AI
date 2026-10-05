"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  BarChart3,
  SearchCode,
  Layers,
  History,
  TrendingUp,
  ArrowRight,
  Database,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function AnalystHubPage() {
  const { currentUser } = useApp();

  const suggestedQuestions = [
    "What were our total sales last month?",
    "Show monthly revenue for the last 12 months.",
    "Which products generated the highest revenue?",
    "Compare sales between regions.",
    "Show me the top 10 customers by revenue.",
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-[#2563EB] mb-1">
            <Sparkles className="w-4 h-4 text-[#F97316]" />
            <span>Analyst Studio Active</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[#111827]">
            Welcome to the Analytics Studio, {currentUser?.name?.split(" ")[0]} 🚀
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Translate plain business questions into validated SQL, build multi-chart dashboards, and inspect data schemas.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            href="/analyst/ask-studio"
            className="px-4 py-2.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center space-x-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Launch Ask Studio</span>
          </Link>
          <Link
            href="/analyst/builder"
            className="px-4 py-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold transition-all shadow-xs"
          >
            + Build Dashboard
          </Link>
        </div>
      </div>

      {/* Analyst KPI Snapshot */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-1">
          <span className="text-xs font-semibold text-[#64748B]">Approved Tables</span>
          <p className="text-2xl font-black text-[#111827]">6 Tables</p>
          <span className="text-[10px] text-blue-600 font-bold">Orders, Products, Customers</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-1">
          <span className="text-xs font-semibold text-[#64748B]">Query Precision</span>
          <p className="text-2xl font-black text-emerald-600">98.4%</p>
          <span className="text-[10px] text-emerald-600 font-bold">Verified Read-Only SQL</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-1">
          <span className="text-xs font-semibold text-[#64748B]">Saved Dashboards</span>
          <p className="text-2xl font-black text-[#F97316]">4 Dashboards</p>
          <span className="text-[10px] text-[#F97316] font-bold">Executive & Departmental</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-1">
          <span className="text-xs font-semibold text-[#64748B]">Execution Speed</span>
          <p className="text-2xl font-black text-[#2563EB]">12 ms avg</p>
          <span className="text-[10px] text-blue-600 font-bold">Sub-second In-Memory</span>
        </div>
      </div>

      {/* Suggested Inquiries */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#F97316]" />
            <h2 className="text-sm font-bold text-[#111827]">Frequently Asked Business Questions</h2>
          </div>
          <span className="text-[11px] text-[#64748B]">Click any question to run in studio</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {suggestedQuestions.map((q, idx) => (
            <Link
              key={idx}
              href={`/analyst/ask-studio?q=${encodeURIComponent(q)}`}
              className="p-3.5 rounded-xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200/80 hover:border-blue-300 transition-all flex items-center justify-between group"
            >
              <span className="text-xs font-medium text-slate-800 group-hover:text-[#2563EB]">
                "{q}"
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#2563EB] group-hover:translate-x-0.5 transition-all" />
            </Link>
          ))}
        </div>
      </div>

      {/* Feature Grid for Analysts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/analyst/explore"
          className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs hover:border-blue-300 transition-all space-y-2 block"
        >
          <div className="p-2.5 rounded-xl bg-blue-50 text-[#2563EB] w-fit">
            <SearchCode className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[#111827]">SQL Transparency Explorer</h3>
          <p className="text-xs text-[#64748B]">
            Inspect the underlying safe SQL query generated by the AI model, review query execution plans, and verify joins.
          </p>
        </Link>

        <Link
          href="/analyst/builder"
          className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs hover:border-blue-300 transition-all space-y-2 block"
        >
          <div className="p-2.5 rounded-xl bg-orange-50 text-[#F97316] w-fit">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[#111827]">Custom Dashboard Builder</h3>
          <p className="text-xs text-[#64748B]">
            Assemble interactive multi-chart dashboards (Bar, Line, Area, KPI) directly from natural language questions.
          </p>
        </Link>

        <Link
          href="/analyst/catalog"
          className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs hover:border-blue-300 transition-all space-y-2 block"
        >
          <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 w-fit">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[#111827]">Semantic Data Catalog</h3>
          <p className="text-xs text-[#64748B]">
            Explore approved tables, column data types, business descriptions, and calculate KPI dimensions.
          </p>
        </Link>
      </div>
    </div>
  );
}
