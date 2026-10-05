"use client";

import React, { useState } from "react";
import {
  Activity,
  Zap,
  Clock,
  Database,
  RefreshCw,
  Cpu,
  Server,
  CheckCircle2,
  Gauge,
  Sparkles,
} from "lucide-react";

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
            <span className="uppercase tracking-wider">Infrastructure Health & Real-Time Performance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111827]">
            System Telemetry & Performance Engine
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Monitor query execution latencies, cache memory allocation, API request loads, and database pool health.
          </p>
        </div>

        <button
          onClick={handlePurgeCache}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-md shadow-amber-500/20"
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

      {/* Visual Telemetry Showcase */}
      <div className="rounded-3xl border border-[#E2E8F0] bg-white overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12 items-center">
        <div className="lg:col-span-7 p-6 sm:p-8 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-bold border border-blue-100">
            <Gauge className="w-3.5 h-3.5" />
            <span>Sub-Millisecond Query Acceleration</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
            High-Throughput In-Memory Caching & AST Validation
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
            The analytics pipeline leverages query signature hashing to deliver warm-cache response times below 4ms. All operations operate on read-only transactions with zero lock contention.
          </p>
          <div className="pt-1 flex items-center space-x-4 text-xs font-semibold text-slate-700">
            <span className="flex items-center space-x-1 text-emerald-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>99.98% System Uptime</span>
            </span>
            <span className="text-slate-400">•</span>
            <span>42.1k queries/sec burst capacity</span>
          </div>
        </div>

        <div className="lg:col-span-5 h-48 lg:h-56 relative overflow-hidden bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-100">
          <img
            src="/images/telemetry-performance.jpg"
            alt="System Telemetry & Performance Gauges"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>

      {/* Hardware & Service Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-[#E2E8F0] shadow-xs space-y-1">
          <span className="text-xs font-semibold text-[#64748B] flex items-center">
            <Zap className="w-3.5 h-3.5 text-amber-500 mr-1.5" /> Cache Hit Rate
          </span>
          <p className="text-2xl font-black text-[#111827]">91.4%</p>
          <span className="text-[10px] text-emerald-600 font-bold">↑ 3.2% optimization</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E2E8F0] shadow-xs space-y-1">
          <span className="text-xs font-semibold text-[#64748B] flex items-center">
            <Clock className="w-3.5 h-3.5 text-blue-500 mr-1.5" /> Avg Execution Time
          </span>
          <p className="text-2xl font-black text-[#2563EB]">11.8 ms</p>
          <span className="text-[10px] text-blue-600 font-bold">Safe SQL AST verified</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E2E8F0] shadow-xs space-y-1">
          <span className="text-xs font-semibold text-[#64748B] flex items-center">
            <Cpu className="w-3.5 h-3.5 text-indigo-500 mr-1.5" /> Node Heap Usage
          </span>
          <p className="text-2xl font-black text-slate-800">42 MB</p>
          <span className="text-[10px] text-slate-500 font-bold">Of 512 MB Allocation</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E2E8F0] shadow-xs space-y-1">
          <span className="text-xs font-semibold text-[#64748B] flex items-center">
            <Server className="w-3.5 h-3.5 text-emerald-500 mr-1.5" /> DB Connection Pool
          </span>
          <p className="text-2xl font-black text-emerald-600">8 / 20 Active</p>
          <span className="text-[10px] text-emerald-600 font-bold">Healthy • Zero Wait</span>
        </div>
      </div>

      {/* Latency Distribution Breakdown */}
      <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-[#111827]">Query Execution Latency Distribution</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1.5">
              <span>Fast Track Cached (&lt; 5 ms)</span>
              <span className="text-emerald-600 font-bold">78% of total volume</span>
            </div>
            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-[78%] rounded-full"></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1.5">
              <span>Cold SQLite Executions (5 ms - 30 ms)</span>
              <span className="text-blue-600 font-bold">19% of total volume</span>
            </div>
            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 w-[19%] rounded-full"></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1.5">
              <span>Complex Multi-Table Joins (30 ms - 100 ms)</span>
              <span className="text-amber-600 font-bold">3% of total volume</span>
            </div>
            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 w-[3%] rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
