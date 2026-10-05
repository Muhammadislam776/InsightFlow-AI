"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Layers,
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  BarChart3,
  LineChart,
  CheckCircle2,
  Sparkles,
  PieChart,
  Grid,
} from "lucide-react";

export default function AnalystDashboardBuilder() {
  const router = useRouter();
  const [name, setName] = useState("Custom Performance Deck");
  const [description, setDescription] = useState("Analyst-curated KPIs, territorial trends, and volume breakdowns.");
  const [saving, setSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  const [widgets, setWidgets] = useState([
    {
      id: "w_1",
      title: "Monthly Revenue Aggregation",
      chartType: "area",
      sql: "SELECT strftime('%Y-%m', order_date) AS month, ROUND(SUM(total_amount), 2) AS total_revenue FROM orders GROUP BY month LIMIT 12",
      metric: "$248.7K Total",
    },
    {
      id: "w_2",
      title: "Top Products by Sales Volume",
      chartType: "bar",
      sql: "SELECT name, price FROM products ORDER BY price DESC LIMIT 5",
      metric: "Top 5 SKUs",
    },
  ]);

  const handleAddWidget = () => {
    setWidgets([
      ...widgets,
      {
        id: `w_${Date.now()}`,
        title: "Regional Customer Distribution",
        chartType: "pie",
        sql: "SELECT segment, COUNT(*) AS count FROM customers GROUP BY segment",
        metric: "Segment Share",
      },
    ]);
  };

  const handleRemoveWidget = (id: string) => {
    setWidgets(widgets.filter((w) => w.id !== id));
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSavedNotice(true);
      setTimeout(() => {
        router.push("/analyst/dashboards");
      }, 1200);
    }, 600);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E2E8F0]">
        <div className="flex items-center space-x-3">
          <Link
            href="/analyst/dashboards"
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111827]">
              Dashboard Composer & Builder
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B]">
              Assemble executive and departmental dashboards from verified read-only SQL queries.
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Publishing Dashboard..." : "Publish Dashboard"}</span>
        </button>
      </div>

      {savedNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Dashboard successfully published! Redirecting to dashboard library...</span>
        </div>
      )}

      {/* Builder Showcase Hero */}
      <div className="rounded-3xl border border-[#E2E8F0] bg-white overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12 items-center">
        <div className="lg:col-span-7 p-6 sm:p-8 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-bold border border-blue-100">
            <Grid className="w-3.5 h-3.5" />
            <span>Modular Canvas Layout</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
            Design Multi-Metric Views with Verified SQL Tiles
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
            Drag, configure, and connect charts to approved catalog views. Every tile inherits role-based row limitations (LIMIT 100) and real-time query acceleration.
          </p>
        </div>

        <div className="lg:col-span-5 h-44 lg:h-52 relative overflow-hidden bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-100">
          <img
            src="/images/dashboard-builder.jpg"
            alt="Dashboard Builder Canvas"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>

      {/* Metadata Configuration */}
      <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-xs space-y-4">
        <h3 className="text-xs font-black uppercase text-[#94A3B8] tracking-wider">
          Dashboard Properties
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Dashboard Title</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-[#2563EB] focus:bg-white font-medium transition-all"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Executive Summary / Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-[#2563EB] focus:bg-white font-medium transition-all"
            />
          </div>
        </div>
      </div>

      {/* Widgets Area */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#111827]">Configured Visualization Widgets ({widgets.length})</h3>
          <button
            onClick={handleAddWidget}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-[#2563EB] text-xs font-bold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Analytic Widget</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {widgets.map((widget) => (
            <div key={widget.id} className="bg-white p-5 rounded-3xl border border-[#E2E8F0] shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900">{widget.title}</span>
                <button
                  onClick={() => handleRemoveWidget(widget.id)}
                  className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1 text-xs">
                <span className="text-[10px] text-[#94A3B8] font-bold uppercase">SQL Source:</span>
                <p className="font-mono text-[11px] bg-slate-50 p-2.5 rounded-xl text-slate-700 truncate border border-slate-100">
                  {widget.sql}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px] text-[#64748B]">
                <span>Chart Type: <strong>{widget.chartType.toUpperCase()}</strong></span>
                <span className="text-emerald-600 font-bold">{widget.metric}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
