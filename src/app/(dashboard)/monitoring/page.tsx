"use client";

import React, { useState, useEffect } from "react";
import {
  Activity,
  ShieldCheck,
  ShieldAlert,
  Zap,
  Clock,
  FileSpreadsheet,
  Users,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { useApp } from "@/context/AppContext";

export default function UsageMonitoringPage() {
  const { currentUser } = useApp();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/usage")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  if (currentUser?.role === "VIEWER") {
    return (
      <div className="p-12 rounded-2xl border border-border bg-white text-center max-w-lg mx-auto space-y-3">
        <h2 className="text-base font-bold text-text-primary">Telemetry Access Restricted</h2>
        <p className="text-xs text-text-secondary">
          System telemetry and query monitoring are restricted to ADMIN and ANALYST accounts.
        </p>
      </div>
    );
  }

  if (loading || !data) {
    return <div className="p-12 text-center text-xs text-text-muted">Loading telemetry & security metrics...</div>;
  }

  const kpis = [
    { title: "Queries Today", value: data.kpis.queriesToday, icon: Activity, color: "text-primary", bg: "bg-blue-50" },
    { title: "Successful Queries", value: data.kpis.successfulQueries, icon: CheckCircle2, color: "text-status-success", bg: "bg-green-50" },
    { title: "Blocked Threats", value: data.kpis.blockedQueries, icon: ShieldAlert, color: "text-status-danger", bg: "bg-red-50" },
    { title: "Avg Latency", value: `${data.kpis.avgQueryTimeMs} ms`, icon: Clock, color: "text-indigo-600", bg: "bg-indigo-50" },
    { title: "Cache Hit Rate", value: `${data.kpis.cacheHitRate}%`, icon: Zap, color: "text-accent-orange", bg: "bg-orange-50" },
    { title: "CSV Exports", value: data.kpis.dataExports, icon: FileSpreadsheet, color: "text-slate-700", bg: "bg-slate-100" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/80">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Usage & Security Monitoring
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Real-time analytics traffic telemetry, cache performance, and security guardrail intercept monitoring.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <span className="h-2 w-2 rounded-full bg-status-success animate-ping"></span>
          <span className="font-semibold text-status-success">Telemetry Stream Active</span>
        </div>
      </div>

      {/* KPI Cards (Section 47) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="rounded-2xl border border-border bg-surface p-4 shadow-card">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-text-secondary">{kpi.title}</span>
                <div className={`p-1.5 rounded-lg ${kpi.bg} ${kpi.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="mt-2 text-xl font-extrabold text-text-primary">{kpi.value}</div>
            </div>
          );
        })}
      </div>

      {/* Usage Charts Grid (Section 48) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Queries Over Time (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl border border-border bg-surface p-5 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-text-primary">Query Volume Over 24 Hours</h3>
              <p className="text-xs text-text-secondary">Total query submissions vs blocked attempts</p>
            </div>
            <span className="text-xs text-text-muted">Today (UTC)</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.charts.usageOverTime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="queryGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "12px",
                    border: "1px solid #E2E8F0",
                    fontSize: "12px",
                  }}
                />
                <Area type="monotone" dataKey="queries" stroke="#2563EB" strokeWidth={2.5} fill="url(#queryGrad)" name="Total Queries" />
                <Area type="monotone" dataKey="blocked" stroke="#DC2626" strokeWidth={2} fill="#FEE2E2" name="Blocked Attempts" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Queries by Role (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl border border-border bg-surface p-5 shadow-card space-y-4">
          <div>
            <h3 className="text-sm font-bold text-text-primary">Activity by Role</h3>
            <p className="text-xs text-text-secondary">Distribution of query executions</p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip contentStyle={{ borderRadius: "10px", fontSize: "11px" }} />
                <Pie
                  data={data.charts.queriesByRole}
                  dataKey="count"
                  nameKey="role"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                >
                  {data.charts.queriesByRole.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Security Threat Interceptions Table (Section 49) */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-status-danger" />
            <h3 className="text-sm font-bold text-text-primary">
              Security Interceptions & Guardrail Events
            </h3>
          </div>
          <span className="text-xs text-status-success font-semibold flex items-center">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            0 Breaches Allowed
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-text-secondary border-b border-border">
              <tr>
                <th className="px-4 py-2.5 font-semibold">Action</th>
                <th className="px-4 py-2.5 font-semibold">User</th>
                <th className="px-4 py-2.5 font-semibold">Incident Details</th>
                <th className="px-4 py-2.5 font-semibold">Origin IP</th>
                <th className="px-4 py-2.5 font-semibold">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {data.recentSecurityEvents.map((evt: any) => (
                <tr key={evt.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-2.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-status-danger border border-red-200">
                      {evt.action}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 font-medium text-text-primary">{evt.user}</td>
                  <td className="px-4 py-2.5 text-text-secondary max-w-sm truncate">{evt.details}</td>
                  <td className="px-4 py-2.5 font-mono text-text-muted">{evt.ip}</td>
                  <td className="px-4 py-2.5 text-text-muted">{evt.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
