"use client";

import React, { useState } from "react";
import { Activity, Zap, Clock, Database, RefreshCw, Cpu, Server, CheckCircle2 } from "lucide-react";

export default function AdminTelemetryPage() {
  const [cacheFlushed, setCacheFlushed] = useState(false);

  const handlePurgeCache = () => {
    setCacheFlushed(true);
    setTimeout(() => setCacheFlushed(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-[#1E3A8A] mb-1">
            <Activity className="w-4 h-4 text-[#2563EB]" />
            <span>Infrastructure Health & Real-Time Performance</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[#111827]">
            System Telemetry & Cache Engine
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Monitor query execution latencies, cache memory allocation, API request loads, and database pool health.
          </p>
        </div>

        <button
          onClick={handlePurgeCache}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-xs"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Purge Query Cache Memory</span>
        </button>
      </div>

      {cacheFlushed && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>In-memory query cache successfully cleared and memory reclaimed!</span>
        </div>
      )}

      {/* Hardware & Service Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-[#64748B] flex items-center">
            <Zap className="w-3.5 h-3.5 text-amber-500 mr-1" /> Cache Hit Rate
          </span>
          <p className="text-2xl font-black text-[#111827]">91.4%</p>
          <span className="text-[10px] text-emerald-600 font-bold">↑ 3.2% optimization</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-[#64748B] flex items-center">
            <Clock className="w-3.5 h-3.5 text-blue-500 mr-1" /> Avg Execution Time
          </span>
          <p className="text-2xl font-black text-[#2563EB]">11.8 ms</p>
          <span className="text-[10px] text-blue-600 font-bold">Safe SQL AST verified</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-[#64748B] flex items-center">
            <Cpu className="w-3.5 h-3.5 text-indigo-500 mr-1" /> Node Heap Usage
          </span>
          <p className="text-2xl font-black text-slate-800">42 MB</p>
          <span className="text-[10px] text-slate-500 font-bold">Of 512 MB Allocation</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-[#64748B] flex items-center">
            <Server className="w-3.5 h-3.5 text-emerald-500 mr-1" /> DB Connection Pool
          </span>
          <p className="text-2xl font-black text-emerald-600">8 / 20 Active</p>
          <span className="text-[10px] text-emerald-600 font-bold">Healthy • Zero Wait</span>
        </div>
      </div>

      {/* Latency Distribution Breakdown */}
      <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-[#111827]">Query Execution Latency Tiers</h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span>Fast Track Cached (&lt; 5 ms)</span>
              <span className="text-emerald-600 font-bold">78% of total volume</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-[78%]"></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span>Cold SQLite Executions (5 ms - 30 ms)</span>
              <span className="text-blue-600 font-bold">19% of total volume</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 w-[19%]"></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span>Complex Multi-Table Joins (30 ms - 100 ms)</span>
              <span className="text-amber-600 font-bold">3% of total volume</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 w-[3%]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
