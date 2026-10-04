"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, SearchCode, ArrowRight } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { QueryResultView } from "@/components/query/QueryResultView";
import { EmptyStateIllustration } from "@/components/illustrations/Illustrations";

export default function ExplorePage() {
  const { currentUser, activeQueryResult, setActiveQueryResult } = useApp();
  const [loadingSample, setLoadingSample] = useState(false);

  // If no query has been run yet, provide quick sample loader
  const handleLoadSample = async (question: string) => {
    setLoadingSample(true);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          role: currentUser.role,
        }),
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-border/80">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-primary mb-1">
            <SearchCode className="w-4 h-4" />
            <span>Interactive Analytics Explorer</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Explore & Verify Results
          </h1>
          <p className="text-xs md:text-sm text-text-secondary mt-0.5">
            Detailed inspection, SQL transparency, raw data tables, and grounded AI explanations.
          </p>
        </div>

        <Link
          href="/ask"
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover shadow-subtle transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-accent-orange" />
          <span>New Question</span>
        </Link>
      </div>

      {activeQueryResult ? (
        <QueryResultView
          result={activeQueryResult}
          onAskFollowUp={(q) => handleLoadSample(q)}
        />
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-surface p-12 text-center max-w-xl mx-auto space-y-4">
          <EmptyStateIllustration
            title="No Active Query in Session"
            description="Ask a question in Ask Data, or click a verified sample below to inspect results and generated SQL."
          />
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {[
              "Which products generated the highest revenue?",
              "Compare sales between regions.",
              "Show monthly revenue for the last 12 months.",
            ].map((sample, idx) => (
              <button
                key={idx}
                disabled={loadingSample}
                onClick={() => handleLoadSample(sample)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-primary-light hover:text-primary text-xs font-medium text-text-secondary border border-border transition-colors"
              >
                {sample}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
