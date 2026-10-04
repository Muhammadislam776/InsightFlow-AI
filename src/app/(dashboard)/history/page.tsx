"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  History,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  Code,
  Clock,
  ExternalLink,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { QueryHistoryItem } from "@/lib/types";

export default function QueryHistoryPage() {
  const router = useRouter();
  const { currentUser, setActiveQueryResult } = useApp();
  const [history, setHistory] = useState<QueryHistoryItem[]>([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<QueryHistoryItem | null>(null);

  useEffect(() => {
    fetchHistory();
  }, [statusFilter, searchTerm]);

  const fetchHistory = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.append("status", statusFilter);
      if (searchTerm.trim()) params.append("search", searchTerm);
      const res = await fetch(`/api/query/history?${params.toString()}`);
      const data = await res.json();
      setHistory(data.history || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRerun = (question: string) => {
    router.push(`/ask?q=${encodeURIComponent(question)}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/80">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Query History & Audit
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Complete audit trail of natural language questions, generated SQL, execution times, and safety intercepts.
          </p>
        </div>
        <span className="text-xs text-text-muted font-medium">
          {history.length} recorded queries
        </span>
      </div>

      {/* Filters Bar (Section 38) */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-text-muted" />
          <input
            type="text"
            placeholder="Search questions or SQL..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-surface border border-border rounded-xl text-xs text-text-primary outline-hidden focus:border-primary shadow-subtle"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-text-muted font-semibold flex items-center">
            <Filter className="w-3.5 h-3.5 mr-1" />
            Status:
          </span>
          {["ALL", "Success", "Blocked", "Cached"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                statusFilter === status
                  ? "bg-primary text-white shadow-subtle"
                  : "bg-surface border border-border text-text-secondary hover:text-text-primary"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* History Table */}
      <div className="rounded-2xl border border-border bg-surface shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-text-secondary border-b border-border">
              <tr>
                <th className="px-5 py-3 font-semibold">Question</th>
                <th className="px-4 py-3 font-semibold">User / Role</th>
                <th className="px-4 py-3 font-semibold">Latency</th>
                <th className="px-4 py-3 font-semibold">Rows</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Time</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {history.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/70 transition-colors duration-150 cursor-pointer"
                  onClick={() => setSelectedItem(item)}
                >
                  <td className="px-5 py-3.5 font-medium text-text-primary max-w-xs">
                    <span className="truncate block" title={item.question}>
                      "{item.question}"
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-text-secondary">
                    <div className="flex items-center space-x-1.5">
                      <span>{item.user}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 font-bold">
                        {item.role}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-text-muted">{item.executionTime} ms</td>
                  <td className="px-4 py-3.5 text-text-muted">{item.rowsReturned}</td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.status === "Success"
                          ? "bg-green-50 text-status-success border border-green-200"
                          : item.status === "Blocked"
                          ? "bg-red-50 text-status-danger border border-red-200"
                          : "bg-blue-50 text-primary border border-blue-200"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-text-muted">{item.timestamp}</td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRerun(item.question);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-primary hover:text-white text-text-secondary transition-colors font-medium text-[11px]"
                    >
                      Rerun
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Query Detail Modal (Section 39) */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-surface rounded-2xl max-w-lg w-full p-6 shadow-elevated border border-border space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-base font-bold text-text-primary flex items-center">
                <Code className="w-4 h-4 text-primary mr-2" />
                Query Audit Details
              </h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-text-muted hover:text-text-primary text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-semibold text-text-muted block">Question:</span>
                <p className="font-bold text-text-primary text-sm mt-0.5">
                  "{selectedItem.question}"
                </p>
              </div>

              <div>
                <span className="font-semibold text-text-muted block">Generated SQL:</span>
                <pre className="p-3 bg-slate-900 text-blue-200 rounded-xl font-mono text-[11px] mt-1 overflow-x-auto">
                  <code>{selectedItem.generatedSql}</code>
                </pre>
              </div>

              {selectedItem.errorMessage && (
                <div className="p-3 bg-red-50 text-status-danger rounded-xl border border-red-200">
                  <span className="font-bold block">Guardrail Block Reason:</span>
                  <p className="mt-0.5">{selectedItem.errorMessage}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                <div className="p-2 rounded-lg bg-slate-50 border border-border">
                  <span className="text-text-muted block">Executed By:</span>
                  <span className="font-semibold text-text-primary">
                    {selectedItem.user} ({selectedItem.role})
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-border">
                  <span className="text-text-muted block">Performance:</span>
                  <span className="font-semibold text-text-primary">
                    {selectedItem.executionTime} ms · {selectedItem.rowsReturned} rows
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-border">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-3 py-1.5 rounded-xl border border-border text-xs font-semibold text-text-secondary hover:bg-slate-100"
              >
                Close
              </button>
              <button
                onClick={() => handleRerun(selectedItem.question)}
                className="px-4 py-1.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover"
              >
                Open in Ask Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
