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
  HelpCircle,
  AlertCircle,
  TrendingUp,
  BarChart3,
  Bot,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { QueryExecutionResult } from "@/lib/types";
import { QueryLoadingIndicator } from "@/components/query/QueryLoadingIndicator";
import { QueryResultView } from "@/components/query/QueryResultView";

function AskDataContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const { currentUser, activeQueryResult, setActiveQueryResult } = useApp();

  const [question, setQuestion] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Suggested questions matching image 4
  const suggestedQuestions = [
    { text: "What are our top 10 products?", icon: "✦" },
    { text: "How did revenue change this year?", icon: "✓" },
    { text: "Which region has the highest sales?", icon: "✓" },
    { text: "Show customer growth by month.", icon: "📈" },
    { text: "Compare this quarter with last quarter.", icon: "📊" },
    { text: "Show monthly revenue for the last 12 months.", icon: "⚡" },
  ];

  useEffect(() => {
    if (initialQuery && !activeQueryResult) {
      handleAskQuestion(initialQuery);
    }
  }, [initialQuery]);

  const handleAskQuestion = async (qText: string) => {
    const trimmed = qText.trim();
    if (!trimmed) return;

    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: trimmed,
          role: currentUser?.role || "ANALYST",
          previousContext: activeQueryResult
            ? { question: activeQueryResult.question, sql: activeQueryResult.generatedSql }
            : undefined,
        }),
      });

      const data: QueryExecutionResult = await res.json();
      setActiveQueryResult(data);
    } catch (err: any) {
      setErrorMsg("Failed to communicate with analytics backend service.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAskQuestion(question);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner with Cute AI Mascot matching Mockup #4 */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#EFF6FF] border border-blue-200 text-xs font-semibold text-[#2563EB]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Natural Language Analytics</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111827]">
              Ask Data
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
              Ask questions about your business data. Get instant answers with AI — translated directly into validated read-only SQL.
            </p>
          </div>

          {/* Cute AI Assistant Mascot Illustration (Mockup #4) */}
          <div className="hidden sm:flex items-center space-x-3 bg-[#F8FAFC] p-3.5 rounded-2xl border border-slate-200 shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#2563EB] to-blue-400 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Bot className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#111827] block">InsightFlow Bot</span>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" />
                Read-Only Guard Active
              </span>
            </div>
          </div>
        </div>

        {/* Search Input Box Pill */}
        <form onSubmit={handleFormSubmit} className="mt-6">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-[#94A3B8] absolute left-4.5" />
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. Show monthly revenue for the last 12 months..."
              className="w-full pl-12 pr-14 py-4 bg-[#F8FAFC] border border-slate-200 rounded-full text-xs sm:text-sm text-[#111827] placeholder:text-[#94A3B8] outline-none focus:border-[#2563EB] focus:bg-white shadow-inner transition-all font-medium"
            />
            <button
              type="submit"
              disabled={isLoading || !question.trim()}
              className="absolute right-2.5 w-10 h-10 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-40 text-white flex items-center justify-center shadow-md shadow-blue-500/20 transition-all hover:scale-105"
              title="Submit Question"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Try asking Pills Section */}
          <div className="mt-4">
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block mb-2">
              Try asking
            </span>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setQuestion(q.text);
                    handleAskQuestion(q.text);
                  }}
                  className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#F1F5F9] hover:bg-[#EFF6FF] hover:text-[#2563EB] hover:border-blue-300 border border-transparent text-[#475569] transition-all flex items-center space-x-1.5"
                >
                  <span className="text-[11px] text-[#2563EB]">{q.icon}</span>
                  <span>{q.text}</span>
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>

      {/* Error Notice */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-status-danger text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 5-Stage Loading Indicator */}
      {isLoading && <QueryLoadingIndicator />}

      {/* Query Result View */}
      {!isLoading && activeQueryResult && (
        <div className="pt-2">
          <QueryResultView
            result={activeQueryResult}
            onAskFollowUp={(followUp) => {
              setQuestion(followUp);
              handleAskQuestion(followUp);
            }}
          />
        </div>
      )}
    </div>
  );
}

export default function AskDataPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-text-muted">Loading Ask Data...</div>}>
      <AskDataContent />
    </Suspense>
  );
}
