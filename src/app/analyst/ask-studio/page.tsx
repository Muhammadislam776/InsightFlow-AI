"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Sparkles,
  Search,
  ShieldCheck,
  Send,
  Lock,
  Database,
  ArrowRight,
  Code2,
  Table as TableIcon,
  Download,
  CheckCircle2,
  AlertCircle,
  Copy,
  Cpu,
  BarChart3,
  Layers,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { QueryExecutionResult } from "@/lib/types";
import { QueryResultView } from "@/components/query/QueryResultView";
import { QueryLoadingIndicator } from "@/components/query/QueryLoadingIndicator";

function AskStudioContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const { currentUser, activeQueryResult, setActiveQueryResult } = useApp();

  const [question, setQuestion] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (initialQuery && !activeQueryResult) {
      handleExecuteQuery(initialQuery);
    }
  }, [initialQuery]);

  const handleExecuteQuery = async (queryText: string) => {
    const trimmed = queryText.trim();
    if (!trimmed) return;

    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: trimmed,
          role: "ANALYST",
        }),
      });

      const data: QueryExecutionResult = await res.json();
      setActiveQueryResult(data);
    } catch (err) {
      setErrorMsg("Failed to communicate with analytics backend engine.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="pb-2 border-b border-[#E2E8F0]">
        <div className="flex items-center space-x-2 text-xs font-bold text-[#F97316] mb-1">
          <Sparkles className="w-4 h-4" />
          <span className="uppercase tracking-wider">Analyst AI Natural Language Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111827]">
          Ask Data Studio
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
          Type queries in natural business English. The studio maps your question to safe SQL, computes live metrics, and renders interactive charts.
        </p>
      </div>

      {/* Large Input Box */}
      <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleExecuteQuery(question);
          }}
          className="relative"
        >
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-slate-400 absolute left-4" />
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. Show monthly revenue for the last 12 months..."
              className="w-full pl-12 pr-32 py-4 bg-[#F8FAFC] border border-slate-200 rounded-2xl text-sm text-[#111827] outline-none focus:border-[#2563EB] focus:bg-white font-medium shadow-inner transition-all"
            />
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="absolute right-2 px-5 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center space-x-1.5"
            >
              <span>Ask Studio</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {/* Suggested Quick Prompts */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-[11px] font-bold text-[#64748B]">Try asking:</span>
          {[
            "Top 10 products by sales",
            "Show monthly revenue for the last 12 months",
            "Compare sales between regions",
            "Which products generated the highest revenue?",
            "Show me top 10 customers by revenue",
          ].map((prompt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setQuestion(prompt);
                handleExecuteQuery(prompt);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-[#2563EB] border border-slate-200 hover:border-blue-300 transition-all text-xs font-medium"
            >
              "{prompt}"
            </button>
          ))}
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && <QueryLoadingIndicator />}

      {/* Error Message */}
      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Result Display */}
      {activeQueryResult && !loading && (
        <QueryResultView result={activeQueryResult} />
      )}

      {/* Empty State / AI Architecture Showcase */}
      {!activeQueryResult && !loading && (
        <div className="bg-white rounded-3xl border border-[#E2E8F0] overflow-hidden shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-6 p-8 space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#2563EB] text-xs font-bold">
                <Cpu className="w-3.5 h-3.5" />
                <span>Deterministic AST Translation Pipeline</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                How Natural-Language Queries Become Certified SQL & Charts
              </h2>
              <div className="space-y-3 text-xs text-[#64748B]">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center font-bold shrink-0">1</div>
                  <p><strong className="text-slate-800">Natural-Language Intent:</strong> Your business question is parsed into structured semantic dimensions and metric aggregations.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold shrink-0">2</div>
                  <p><strong className="text-slate-800">AST Security Validation:</strong> Queries are restricted to SELECT statements with enforced LIMIT clauses and catalog masking.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">3</div>
                  <p><strong className="text-slate-800">Visual Synthesis:</strong> Results render automatically as Bar, Line, Area, or KPI tiles with narrative summaries.</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 h-72 lg:h-96 relative bg-slate-50 overflow-hidden border-t lg:border-t-0 lg:border-l border-slate-100">
              <img
                src="/images/nlp-query-studio.jpg"
                alt="NLP to SQL AI Engine Workflow"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AnalystAskStudioPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[#64748B]">Loading Ask Studio...</div>}>
      <AskStudioContent />
    </Suspense>
  );
}
