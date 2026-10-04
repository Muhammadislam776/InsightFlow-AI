"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Layers,
  Plus,
  Star,
  Clock,
  User,
  Eye,
  Trash2,
  ExternalLink,
  Search,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Dashboard } from "@/lib/types";

export default function DashboardsListPage() {
  const { currentUser, favoriteDashboardIds, toggleFavoriteDashboard } = useApp();
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboards();
  }, []);

  const fetchDashboards = async () => {
    try {
      const res = await fetch("/api/dashboards");
      const data = await res.json();
      setDashboards(data.dashboards || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredDashboards = dashboards.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/80">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Dashboards
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Pre-built and custom interactive dashboards powered by verified SQL metrics.
          </p>
        </div>

        {currentUser.role !== "VIEWER" && (
          <Link
            href="/dashboards/builder"
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover shadow-subtle transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Dashboard</span>
          </Link>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-text-muted" />
          <input
            type="text"
            placeholder="Search dashboards..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-surface border border-border rounded-xl text-xs text-text-primary outline-hidden focus:border-primary"
          />
        </div>
        <span className="text-xs text-text-muted">
          {filteredDashboards.length} dashboards available
        </span>
      </div>

      {/* Dashboards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDashboards.map((dash) => {
          const isFav = favoriteDashboardIds.includes(dash.id);

          return (
            <div
              key={dash.id}
              className="rounded-2xl border border-border bg-surface p-6 shadow-card hover:shadow-cardHover transition-all duration-200 flex flex-col justify-between group hover:-translate-y-0.5"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary-light text-primary border border-blue-200 uppercase">
                    {dash.visibility}
                  </span>
                  <button
                    onClick={() => toggleFavoriteDashboard(dash.id)}
                    className="p-1 text-text-muted hover:text-amber-500 transition-colors"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        isFav ? "fill-amber-400 text-amber-400" : ""
                      }`}
                    />
                  </button>
                </div>

                <h3 className="text-base font-bold text-text-primary mt-3 group-hover:text-primary transition-colors">
                  {dash.name}
                </h3>
                <p className="text-xs text-text-secondary mt-1.5 line-clamp-2 leading-relaxed">
                  {dash.description}
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-border flex items-center justify-between text-xs text-text-muted">
                <div className="space-y-0.5">
                  <p className="flex items-center text-[11px]">
                    <Clock className="w-3 h-3 mr-1" />
                    {dash.lastUpdated}
                  </p>
                  <p className="text-[11px] font-medium text-text-secondary">
                    {dash.widgets.length} analytics widgets
                  </p>
                </div>

                <Link
                  href={`/dashboards/${dash.id}`}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-primary hover:text-white font-semibold text-xs text-text-primary transition-all flex items-center space-x-1"
                >
                  <span>Open</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
