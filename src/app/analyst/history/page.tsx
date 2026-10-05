"use client";

import React, { useState } from "react";
import Link from "next/link";
import { History, Play, Search, Clock, CheckCircle2, ArrowRight } from "lucide-react";

export default function AnalystQueryHistoryPage() {
  const [search, setSearch] = useState("");

  const history = [
    {
      id: "qh_1",
      question: "Show monthly revenue for the last 12 months.",
      sql: "SELECT strftime('%Y-%m', order_date) AS month, ROUND(SUM(total_amount), 2) AS total_revenue FROM orders GROUP BY month ORDER BY month ASC LIMIT 12",
      time: "10 mins ago",
      latency: "12.4 ms",
      rows: 12,
      chart: "area",
    },
    {
      id: "qh_2",
      question: "Which products generated the highest revenue?",
      sql: "SELECT name, price FROM products ORDER BY price DESC LIMIT 5",
      time: "42 mins ago",
      latency: "8.1 ms",
      rows: 5,
      chart: "bar",
    },
    {
      id: "qh_3",
      question: "Compare sales between regions.",
      sql: "SELECT r.name, SUM(o.total_amount) AS revenue FROM orders o JOIN customers c ON o.customer_id = c.id JOIN regions r ON c.region_id = r.id GROUP BY r.name",
      time: "2 hours ago",
      latency: "18.6 ms",
      rows: 4,
      chart: "bar",
    },
    {
      id: "qh_4",
      question: "Show me the top 10 customers by revenue.",
      sql: "SELECT name, company, lifetime_value FROM customers ORDER BY lifetime_value DESC LIMIT 10",
      time: "Yesterday",
      latency: "11.2 ms",
      rows: 10,
      chart: "table",
    },
  ];

  const filtered = history.filter(
    (h) =>
      h.question.toLowerCase().includes(search.toLowerCase()) ||
      h.sql.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-[#2563EB] mb-1">
            <History className="w-4 h-4" />
            <span>Execution Audit & Performance Logs</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[#111827]">
            Analyst Query Execution Log
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Review previous natural language queries, inspect exact SQL statements executed, and re-run queries instantly.
          </p>
        </div>

        <div className="relative w-64">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search query logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-[#2563EB]"
          />
        </div>
      </div>

      {/* Query List */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-3 hover:border-blue-300 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-[#111827]">"{item.question}"</h3>
              <div className="flex items-center space-x-2 text-[11px] text-[#64748B]">
                <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  {item.rows} Rows Returned
                </span>
                <span>•</span>
                <span className="font-mono text-slate-600">{item.latency}</span>
                <span>•</span>
                <span>{item.time}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto">
              <code>{item.sql}</code>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-[#64748B]">
                Visualization Mode: <strong className="text-slate-800 uppercase">{item.chart}</strong>
              </span>
              <Link
                href={`/analyst/ask-studio?q=${encodeURIComponent(item.question)}`}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#2563EB] text-xs font-bold transition-colors"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Re-run in Studio</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
