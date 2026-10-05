"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  ShieldCheck,
  Database,
  Users,
  Activity,
  Zap,
  ArrowRight,
  Lock,
  Cpu,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sliders,
  ExternalLink,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function AdminCommandCenter() {
  const { currentUser } = useApp();
  const [stats, setStats] = useState({
    activeUsers: 24,
    registeredTables: 6,
    blockedThreatsToday: 14,
    cacheHitRate: 88.5,
    systemUptime: "99.98%",
    avgLatencyMs: 12.4,
  });

  const [recentThreats, setRecentThreats] = useState([
    {
      id: "th_1",
      query: "DROP TABLE customers;--",
      user: "Ext-IP 192.168.1.45",
      type: "DESTRUCTIVE_DDL",
      time: "8 mins ago",
      status: "BLOCKED",
    },
    {
      id: "th_2",
      query: "UPDATE orders SET total_amount = 0 WHERE 1=1",
      user: "Analyst (Session 89)",
      type: "UNAUTHORIZED_WRITE",
      time: "24 mins ago",
      status: "INTERCEPTED",
    },
    {
      id: "th_3",
      query: "SELECT password_hash FROM auth.users",
      user: "Unknown Client",
      type: "UNAPPROVED_SCHEMA_ACCESS",
      time: "1 hour ago",
      status: "BLOCKED",
    },
  ]);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-[#1E3A8A] mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="uppercase tracking-wider">Root Governance & Security Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111827]">
            Admin Command Center
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Full enterprise oversight of data governance, SQL safety guardrails, RBAC policies, and live telemetry.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            href="/admin/governance"
            className="px-4 py-2.5 rounded-xl bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-bold transition-all shadow-xs"
          >
            Manage Schema Catalog
          </Link>
          <Link
            href="/admin/security-guard"
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs"
          >
            Threat Guard
          </Link>
        </div>
      </div>

      {/* Visual Enterprise Security Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-4 z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>SQL AST Safety Shield Active • 100% Read-Only</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black leading-tight text-white">
              Enterprise Data Governance & Threat Interception
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-xl">
              All incoming natural-language prompts and raw SQL queries pass through an AST validator before execution. Destructive DDL commands, schema tampering, and cross-tenant leaks are quarantined in real time.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/admin/security-guard"
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/30"
              >
                <span>Open Threat Playground</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/admin/audit-logs"
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold backdrop-blur-md transition-all border border-white/20"
              >
                <span>View Compliance Logs</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 h-52 lg:h-full relative overflow-hidden">
            <img
              src="/images/security-governance.jpg"
              alt="Data Security & Governance Shield"
              className="w-full h-full object-cover object-center opacity-90 hover:opacity-100 transition-opacity duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-900/90 via-transparent to-transparent" />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-[#64748B]">Active Users</span>
          <p className="text-xl font-black text-[#111827]">{stats.activeUsers}</p>
          <span className="text-[10px] text-emerald-600 font-bold">● RBAC Sync OK</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-[#64748B]">Approved Tables</span>
          <p className="text-xl font-black text-[#111827]">{stats.registeredTables}</p>
          <span className="text-[10px] text-blue-600 font-bold">100% Read-Only</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-[#64748B]">Blocked Threats</span>
          <p className="text-xl font-black text-rose-600">{stats.blockedThreatsToday}</p>
          <span className="text-[10px] text-rose-600 font-bold">Zero Breaches</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-[#64748B]">Cache Hit Rate</span>
          <p className="text-xl font-black text-amber-600">{stats.cacheHitRate}%</p>
          <span className="text-[10px] text-amber-600 font-bold">Sub-20ms Response</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-[#64748B]">System Uptime</span>
          <p className="text-xl font-black text-emerald-600">{stats.systemUptime}</p>
          <span className="text-[10px] text-emerald-600 font-bold">SLA Compliant</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-[#64748B]">Avg Query Latency</span>
          <p className="text-xl font-black text-[#2563EB]">{stats.avgLatencyMs} ms</p>
          <span className="text-[10px] text-blue-600 font-bold">In-Memory Engine</span>
        </div>
      </div>

      {/* Grid: Live Interception Feed & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Live Interception Feed */}
        <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <h2 className="text-sm font-bold text-[#111827]">Live Threat & SQL Safety Interceptions</h2>
            </div>
            <Link href="/admin/security-guard" className="text-xs text-[#2563EB] font-bold hover:underline">
              View All Rules →
            </Link>
          </div>

          <div className="space-y-3">
            {recentThreats.map((threat) => (
              <div
                key={threat.id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-700">
                      {threat.type}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-800 truncate max-w-md">
                      {threat.query}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#64748B]">
                    Origin: <strong>{threat.user}</strong> • {threat.time}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-rose-600 text-white shadow-xs">
                    {threat.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Admin Action Cards */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-3">
            <h3 className="text-xs font-black uppercase text-[#94A3B8] tracking-wider">
              Governance Shortcuts
            </h3>
            <div className="space-y-2 text-xs">
              <Link
                href="/admin/users"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-[#2563EB] transition-colors border border-slate-200/80 font-bold"
              >
                <span>RBAC User Role Manager</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/admin/telemetry"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-[#2563EB] transition-colors border border-slate-200/80 font-bold"
              >
                <span>Query Performance & Cache</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/admin/audit-logs"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-[#2563EB] transition-colors border border-slate-200/80 font-bold"
              >
                <span>Audit Trail & Activity Log</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/admin/settings"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-[#2563EB] transition-colors border border-slate-200/80 font-bold"
              >
                <span>AI Limits & System Config</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
