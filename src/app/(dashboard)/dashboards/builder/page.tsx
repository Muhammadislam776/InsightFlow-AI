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
  Sparkles,
  BarChart3,
  LineChart as LineIcon,
  PieChart as PieIcon,
  CheckCircle2,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function DashboardBuilderPage() {
  const router = useRouter();
  const { currentUser } = useApp();

  const [name, setName] = useState("Custom Operations Review");
  const [description, setDescription] = useState("Consolidated business metrics and territorial breakdown.");
  const [visibility, setVisibility] = useState<"public" | "team" | "private">("public");
  const [saving, setSaving] = useState(false);

  const [widgets, setWidgets] = useState([
    {
      id: "w_new_1",
      title: "Monthly Revenue Aggregation",
      chartType: "area" as const,
      sqlQuery: "SELECT strftime('%Y-%m', order_date) AS month, ROUND(SUM(total_amount), 2) AS total_revenue FROM orders WHERE status != 'Refunded' GROUP BY month ORDER BY month ASC LIMIT 12",
      xAxisKey: "month",
      yAxisKey: "total_revenue",
      width: "half" as const,
      summaryMetric: "Revenue Stream",
    },
    {
      id: "w_new_2",
      title: "Regional Sales Performance",
      chartType: "bar" as const,
      sqlQuery: "SELECT r.name AS region_name, ROUND(SUM(o.total_amount), 2) AS total_sales FROM orders o JOIN customers c ON o.customer_id = c.id JOIN regions r ON c.region_id = r.id WHERE o.status = 'Completed' GROUP BY r.id, r.name",
      xAxisKey: "region_name",
      yAxisKey: "total_sales",
      width: "half" as const,
      summaryMetric: "5 Regions",
    },
  ]);

  const handleAddWidget = () => {
    setWidgets([
      ...widgets,
      {
        id: `w_new_${Date.now()}`,
        title: "Top Products by Sales",
        chartType: "bar",
        sqlQuery: "SELECT p.name AS product_name, ROUND(SUM(oi.subtotal), 2) AS total_revenue FROM order_items oi JOIN products p ON oi.product_id = p.id JOIN orders o ON oi.order_id = o.id WHERE o.status = 'Completed' GROUP BY p.name ORDER BY total_revenue DESC LIMIT 5",
        xAxisKey: "product_name",
        yAxisKey: "total_revenue",
        width: "half",
        summaryMetric: "Top 5 Products",
      },
    ]);
  };

  const handleRemoveWidget = (idx: number) => {
    setWidgets(widgets.filter((_, i) => i !== idx));
  };

  const handleSaveDashboard = async () => {
    if (!name.trim()) return;
    setSaving(true);

    try {
      const res = await fetch("/api/dashboards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          visibility,
          widgets,
        }),
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/dashboards/${data.dashboard.id}`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/80">
        <div className="flex items-center space-x-3">
          <Link
            href="/dashboards"
            className="p-2 rounded-xl border border-border bg-surface hover:bg-slate-100 text-text-secondary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">
              Dashboard Builder
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary">
              Compose custom analytics dashboards from natural language queries.
            </p>
          </div>
        </div>

        <button
          onClick={handleSaveDashboard}
          disabled={saving}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover shadow-subtle transition-all"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving..." : "Save Dashboard"}</span>
        </button>
      </div>

      {/* Dashboard Metadata Settings */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-card space-y-4">
        <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">
          Dashboard Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="font-semibold text-text-secondary block mb-1">
              Dashboard Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-xl text-text-primary outline-hidden focus:border-primary"
            />
          </div>
          <div>
            <label className="font-semibold text-text-secondary block mb-1">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-xl text-text-primary outline-hidden focus:border-primary"
            />
          </div>
          <div>
            <label className="font-semibold text-text-secondary block mb-1">
              Visibility Scope
            </label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as any)}
              className="w-full px-3 py-2 bg-background border border-border rounded-xl text-text-primary outline-hidden focus:border-primary"
            >
              <option value="public">Public (Entire Organization)</option>
              <option value="team">Team Only</option>
              <option value="private">Private (Only You)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Widgets Grid Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-text-primary flex items-center">
            <Layers className="w-4 h-4 mr-2 text-primary" />
            Configured Widgets ({widgets.length})
          </h2>
          <button
            onClick={handleAddWidget}
            className="px-3 py-1.5 rounded-xl bg-primary-light text-primary hover:bg-blue-100 text-xs font-semibold border border-blue-200 transition-colors flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Widget</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {widgets.map((w, idx) => (
            <div
              key={w.id}
              className="rounded-2xl border border-border bg-surface p-5 shadow-card space-y-3 relative group"
            >
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={w.title}
                  onChange={(e) => {
                    const copy = [...widgets];
                    copy[idx].title = e.target.value;
                    setWidgets(copy);
                  }}
                  className="font-bold text-sm text-text-primary bg-transparent border-b border-dashed border-border focus:border-primary outline-hidden pb-0.5"
                />
                <button
                  onClick={() => handleRemoveWidget(idx)}
                  className="text-text-muted hover:text-status-danger p-1 rounded transition-colors"
                  title="Remove widget"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center space-x-3 text-xs text-text-secondary">
                <span>Chart:</span>
                <select
                  value={w.chartType}
                  onChange={(e) => {
                    const copy = [...widgets];
                    copy[idx].chartType = e.target.value as any;
                    setWidgets(copy);
                  }}
                  className="px-2 py-1 bg-background border border-border rounded-lg"
                >
                  <option value="area">Area Chart</option>
                  <option value="bar">Bar Chart</option>
                  <option value="line">Line Chart</option>
                  <option value="pie">Pie Chart</option>
                </select>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl text-blue-200 font-mono text-[11px] overflow-x-auto">
                <code>{w.sqlQuery}</code>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
