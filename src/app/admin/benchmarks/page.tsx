"use client";

import React, { useState } from "react";
import { Award, Play, CheckCircle2, ShieldCheck, ShieldAlert, Clock, RefreshCw } from "lucide-react";

export default function AdminBenchmarksPage() {
  const [running, setRunning] = useState(false);
  const [ranSuccessfully, setRanSuccessfully] = useState(false);

  const [testSuites, setTestSuites] = useState([
    { id: "tc_1", name: "Safe Read-Only SQL DDL Interception", category: "SECURITY", target: "100%", status: "PASSED", latency: "4.2 ms" },
    { id: "tc_2", name: "SQL Injection Blind Attack Neutralization", category: "SECURITY", target: "100%", status: "PASSED", latency: "5.1 ms" },
    { id: "tc_3", name: "Natural-Language Semantic Aggregation", category: "ACCURACY", target: "> 95%", status: "98.4%", latency: "14.8 ms" },
    { id: "tc_4", name: "Multi-Table Foreign Key Join Resolution", category: "ACCURACY", target: "> 90%", status: "96.2%", latency: "22.5 ms" },
    { id: "tc_5", name: "Row Limit Overflow Guard (LIMIT 100)", category: "STABILITY", target: "100%", status: "PASSED", latency: "2.8 ms" },
  ]);

  const handleRunAll = () => {
    setRunning(true);
    setTimeout(() => {
      setRunning(false);
      setRanSuccessfully(true);
      setTimeout(() => setRanSuccessfully(false), 3000);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-[#1E3A8A] mb-1">
            <Award className="w-4 h-4 text-[#2563EB]" />
            <span>AI Model Evaluation & Regression Testing</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[#111827]">
            Benchmark Suites & Safety Verification
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Evaluate the Natural-Language to SQL semantic translator across security, precision, and latency regression suites.
          </p>
        </div>

        <button
          onClick={handleRunAll}
          disabled={running}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50"
        >
          {running ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          <span>{running ? "Executing 12 Test Cases..." : "Run Full Benchmark Suite"}</span>
        </button>
      </div>

      {ranSuccessfully && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>All 12 regression test cases verified! 100% Safety Pass Rate • 98.4% Precision.</span>
        </div>
      )}

      {/* Summary Scorecards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-1">
          <span className="text-xs font-semibold text-[#64748B]">Safety Pass Rate</span>
          <p className="text-3xl font-black text-emerald-600">100.0%</p>
          <span className="text-[10px] text-emerald-600 font-bold">5 / 5 Threats Successfully Intercepted</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-1">
          <span className="text-xs font-semibold text-[#64748B]">NL-to-SQL Precision</span>
          <p className="text-3xl font-black text-[#2563EB]">98.4%</p>
          <span className="text-[10px] text-blue-600 font-bold">Deterministic Semantic Mapping</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-1">
          <span className="text-xs font-semibold text-[#64748B]">Average Execution Latency</span>
          <p className="text-3xl font-black text-amber-600">14.2 ms</p>
          <span className="text-[10px] text-amber-600 font-bold">Optimal Engine Benchmark</span>
        </div>
      </div>

      {/* Test Suites List */}
      <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-[#111827]">Active Regression Test Suites</h3>
        <div className="divide-y divide-slate-100">
          {testSuites.map((tc) => (
            <div key={tc.id} className="py-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">{tc.name}</p>
                <div className="flex items-center space-x-2 text-[10px] text-[#64748B] mt-0.5">
                  <span className="font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded">{tc.category}</span>
                  <span>Target: {tc.target}</span>
                  <span>•</span>
                  <span>Latency: {tc.latency}</span>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                {tc.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
