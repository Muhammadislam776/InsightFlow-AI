"use client";

import React, { useState, useEffect } from "react";
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
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-[#1E3A8A] mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Root Governance Active</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[#111827]">
            Admin Command Center
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Full enterprise oversight of data governance, security guardrails, RBAC policies, and telemetry.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            href="/admin/governance"
            className="px-3.5 py-2 rounded-xl bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-bold transition-all shadow-xs"
          >
            Manage Schema Catalog
          </Link>
          <Link
            href="/admin/security-guard"
            className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs"
          >
            Threat Guard
          </Link>
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
                  <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-rose-600 text-white">
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
