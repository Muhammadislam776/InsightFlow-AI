"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SearchCode, Sparkles, Code2, Database, Table, ArrowRight, CheckCircle2 } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { QueryResultView } from "@/components/query/QueryResultView";

export default function AnalystExplorePage() {
  const { activeQueryResult, setActiveQueryResult } = useApp();
  const [loadingSample, setLoadingSample] = useState(false);

  const sampleQueries = [
    { label: "Regional Sales & Targets", query: "Compare sales between regions." },
    { label: "Product Profitability & Volume", query: "Which products generated the highest revenue?" },
    { label: "Top Customer LTV Ranking", query: "Show me the top 10 customers by revenue." },
    { label: "12-Month Revenue Trends", query: "Show monthly revenue for the last 12 months." },
  ];

  const handleRunSample = async (question: string) => {
    setLoadingSample(true);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, role: "ANALYST" }),
      });
      const data = await res.json();
      setActiveQueryResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingSample(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-[#2563EB] mb-1">
            <SearchCode className="w-4 h-4" />
            <span>Interactive SQL Verification & Schema Inspector</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[#111827]">
            SQL Transparency & Data Explorer
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Full visibility into generated SQL syntax, relational table joins, column data basis, and execution timing.
          </p>
        </div>

        <Link
          href="/analyst/ask-studio"
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-bold hover:bg-[#1D4ED8] shadow-xs transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>New Studio Query</span>
        </Link>
      </div>

      {activeQueryResult ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-blue-50/70 p-3.5 rounded-2xl border border-blue-200 text-xs">
            <span className="font-semibold text-blue-900">
              Active Inspector Result for: <strong>"{activeQueryResult.question}"</strong>
            </span>
            <span className="font-mono text-[11px] text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200">
              Latency: {activeQueryResult.executionTimeMs} ms • {activeQueryResult.totalRows} rows
            </span>
          </div>

          <QueryResultView result={activeQueryResult} />
        </div>
      ) : (
        <div className="p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-xs text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto">
            <SearchCode className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-[#111827]">No Active Query in Inspector</h3>
            <p className="text-xs text-[#64748B]">
              Select a benchmark sample query below or visit Ask Data Studio to inspect safe SQL queries.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto pt-2 text-left">
            {sampleQueries.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleRunSample(item.query)}
                disabled={loadingSample}
                className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 text-xs text-slate-800 transition-colors flex items-center justify-between group"
              >
                <div>
                  <span className="font-bold block text-slate-900">{item.label}</span>
                  <span className="text-[11px] text-[#64748B] truncate block max-w-xs">{item.query}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#2563EB]" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
