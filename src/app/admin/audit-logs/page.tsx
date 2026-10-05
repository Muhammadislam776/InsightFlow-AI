"use client";

import React, { useState } from "react";
import { FileText, ShieldAlert, ShieldCheck, Download, Search, Filter } from "lucide-react";

export default function AdminAuditLogsPage() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("ALL");

  const logs = [
    { id: "aud_1", timestamp: "2026-10-05 15:40:12", user: "Alex Vance (ADMIN)", action: "CONFIG_CHANGE", details: "Updated default query row limit to 100", severity: "INFO" },
    { id: "aud_2", timestamp: "2026-10-05 15:32:05", user: "Ext-IP 182.16.4.11", action: "SECURITY_INTERCEPT", details: "Blocked query: DROP TABLE customers;--", severity: "CRITICAL" },
    { id: "aud_3", timestamp: "2026-10-05 15:18:44", user: "Elena Rostova (ANALYST)", action: "QUERY_EXECUTION", details: "Executed 'Show monthly revenue for last 12 months' (12.4ms)", severity: "SUCCESS" },
    { id: "aud_4", timestamp: "2026-10-05 14:55:01", user: "David Chen (VIEWER)", action: "DASHBOARD_ACCESS", details: "Viewed 'Sales Overview' executive dashboard", severity: "INFO" },
    { id: "aud_5", timestamp: "2026-10-05 14:12:30", user: "Alex Vance (ADMIN)", action: "USER_INVITE", details: "Invited Rachel Zane as ANALYST", severity: "INFO" },
    { id: "aud_6", timestamp: "2026-10-05 13:45:19", user: "Unknown Client", action: "AUTH_FAILURE", details: "Failed password attempt on account alex.vance@insightflow.ai", severity: "WARNING" },
  ];

  const filteredLogs = logs.filter((log) => {
    const matchSearch =
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filterType === "ALL" || log.severity === filterType;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-[#1E3A8A] mb-1">
            <FileText className="w-4 h-4 text-[#2563EB]" />
            <span>Immutable Compliance Trail</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[#111827]">
            Security Audit Logs & Activity Trail
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Cryptographically timestamped audit records of all user logins, query executions, and blocked security attempts.
          </p>
        </div>

        <button
          onClick={() => alert("Audit log export downloaded in JSON format.")}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-xs"
        >
          <Download className="w-4 h-4" />
          <span>Export Compliance Audit</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by user, IP, or action details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#2563EB]"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none"
        >
          <option value="ALL">All Severities</option>
          <option value="CRITICAL">Critical Threats Only</option>
          <option value="WARNING">Warnings</option>
          <option value="INFO">Info & Config</option>
          <option value="SUCCESS">Query Executions</option>
        </select>
      </div>

      {/* Logs Table */}
      <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[#94A3B8] font-bold uppercase text-[10px]">
                <th className="py-2.5">Timestamp</th>
                <th className="py-2.5">User / Origin</th>
                <th className="py-2.5">Action Event</th>
                <th className="py-2.5">Details</th>
                <th className="py-2.5 text-right">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70">
                  <td className="py-3 text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                  <td className="py-3 font-bold text-slate-800 font-sans">{log.user}</td>
                  <td className="py-3 text-[#2563EB] font-bold">{log.action}</td>
                  <td className="py-3 text-slate-600 font-sans max-w-md truncate">{log.details}</td>
                  <td className="py-3 text-right">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        log.severity === "CRITICAL"
                          ? "bg-rose-100 text-rose-700"
                          : log.severity === "WARNING"
                          ? "bg-amber-100 text-amber-700"
                          : log.severity === "SUCCESS"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-blue-50 text-blue-700"
                      }`}
                    >
                      {log.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
