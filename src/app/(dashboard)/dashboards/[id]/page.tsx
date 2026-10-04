"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  RefreshCw,
  Star,
  Clock,
  Layers,
  Sparkles,
  Calendar,
  Filter,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Dashboard } from "@/lib/types";
import { DataVisualizer } from "@/components/visualization/DataVisualizer";

export default function SingleDashboardPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { id } = params;
  const { favoriteDashboardIds, toggleFavoriteDashboard } = useApp();

  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dateFilter, setDateFilter] = useState("Last 12 Months");

  const loadDashboard = async () => {
    try {
      const res = await fetch(`/api/dashboards/${id}`);
      if (!res.ok) {
        throw new Error("Dashboard not found");
      }
      const data = await res.json();
      setDashboard(data.dashboard);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [id]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadDashboard();
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-text-muted">
        Loading analytics dashboard...
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="p-12 text-center space-y-3">
        <h2 className="text-base font-bold text-text-primary">Dashboard not found</h2>
        <Link href="/dashboards" className="text-xs text-primary underline">
          Return to dashboards
        </Link>
      </div>
    );
  }

  const isFav = favoriteDashboardIds.includes(dashboard.id);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-border/80">
        <div className="flex items-center space-x-3">
          <Link
            href="/dashboards"
            className="p-2 rounded-xl border border-border bg-surface hover:bg-slate-100 text-text-secondary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold tracking-tight text-text-primary">
                {dashboard.name}
              </h1>
              <button
                onClick={() => toggleFavoriteDashboard(dashboard.id)}
                className="p-1 text-text-muted hover:text-amber-500 transition-colors"
              >
                <Star className={`w-4 h-4 ${isFav ? "fill-amber-400 text-amber-400" : ""}`} />
              </button>
            </div>
            <p className="text-xs text-text-secondary mt-0.5">{dashboard.description}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Date Filter */}
          <div className="flex items-center bg-surface border border-border rounded-xl px-2.5 py-1.5 text-xs text-text-secondary shadow-subtle">
            <Calendar className="w-3.5 h-3.5 mr-1.5 text-primary" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-transparent outline-hidden font-medium text-text-primary cursor-pointer"
            >
              <option>Last 12 Months</option>
              <option>This Quarter</option>
              <option>Year to Date</option>
              <option>All Time</option>
            </select>
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 rounded-xl border border-border bg-surface hover:bg-slate-100 text-text-secondary transition-colors shadow-subtle"
            title="Refresh dashboard data"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-primary" : ""}`} />
          </button>
        </div>
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dashboard.widgets.map((w) => (
          <div key={w.id} className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold text-text-primary flex items-center">
                <span>{w.title}</span>
              </h3>
              {w.summaryMetric && (
                <span className="text-[11px] font-semibold text-primary">
                  {w.summaryMetric}
                </span>
              )}
            </div>

            <DataVisualizer
              data={w.data || []}
              columns={w.data && w.data.length > 0 ? Object.keys(w.data[0]) : []}
              initialType={w.chartType}
              xAxisKey={w.xAxisKey}
              yAxisKeys={w.yAxisKey ? [w.yAxisKey] : []}
              title={w.title}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
