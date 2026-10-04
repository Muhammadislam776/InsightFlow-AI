"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Search,
  Database,
  Lock,
  ShieldCheck,
  Tag,
  Key,
  ChevronDown,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { ApprovedTable } from "@/lib/types";

export default function DataCatalogPage() {
  const { currentUser } = useApp();
  const [catalog, setCatalog] = useState<ApprovedTable[]>([]);
  const [search, setSearch] = useState("");
  const [expandedTable, setExpandedTable] = useState<string | null>("orders");

  useEffect(() => {
    fetchCatalog();
  }, [search, currentUser?.role]);

  const fetchCatalog = async () => {
    try {
      const res = await fetch(`/api/catalog?search=${encodeURIComponent(search)}&role=${currentUser?.role || "ANALYST"}`);
      const data = await res.json();
      setCatalog(data.catalog || []);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleTable = (tableName: string) => {
    setExpandedTable(expandedTable === tableName ? null : tableName);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/80">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Data Catalog & Semantic Layer
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Controlled business dictionary of approved tables, verified columns, metrics, and permissions.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <span className="px-2.5 py-1 rounded-xl bg-blue-50 text-primary border border-blue-200 font-bold">
            Role: {currentUser?.role || "GUEST"} View
          </span>
        </div>
      </div>

      {/* Search Input (Section 41) */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-text-muted" />
        <input
          type="text"
          placeholder="Search tables, columns, definitions (e.g. 'revenue', 'orders')..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border rounded-xl text-xs text-text-primary outline-hidden focus:border-primary shadow-subtle font-medium"
        />
      </div>

      {/* Catalog Tables Accordion */}
      <div className="space-y-4">
        {catalog.map((table) => {
          const isExpanded = expandedTable === table.tableName;

          return (
            <div
              key={table.tableName}
              className="rounded-2xl border border-border bg-surface shadow-card overflow-hidden transition-all"
            >
              {/* Table Header Bar */}
              <button
                onClick={() => toggleTable(table.tableName)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-primary-light text-primary">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-text-primary">
                        {table.displayName}
                      </span>
                      <code className="text-xs font-mono text-primary bg-blue-50 px-2 py-0.5 rounded">
                        {table.tableName}
                      </code>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 font-semibold text-text-muted">
                        {table.category}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary mt-1">
                      {table.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-xs text-text-muted">
                    {table.columns.length} approved fields
                  </span>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-text-muted" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-text-muted" />
                  )}
                </div>
              </button>

              {/* Columns Table */}
              {isExpanded && (
                <div className="border-t border-border bg-slate-50/50 p-5">
                  <div className="overflow-x-auto rounded-xl border border-border bg-surface">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-text-secondary border-b border-border">
                        <tr>
                          <th className="px-4 py-2.5 font-semibold">Column Name</th>
                          <th className="px-4 py-2.5 font-semibold">Business Name</th>
                          <th className="px-4 py-2.5 font-semibold">Type</th>
                          <th className="px-4 py-2.5 font-semibold">Description</th>
                          <th className="px-4 py-2.5 font-semibold">Allowed Roles</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {table.columns.map((col) => (
                          <tr key={col.name} className="hover:bg-slate-50/70">
                            <td className="px-4 py-2.5 font-mono text-text-primary font-medium">
                              {col.name}
                              {col.isSensitive && (
                                <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-red-100 text-status-danger font-bold">
                                  Sensitive
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-2.5 text-text-primary font-medium">
                              {col.displayName}
                            </td>
                            <td className="px-4 py-2.5">
                              <span className="px-2 py-0.5 rounded bg-slate-100 text-[11px] font-mono text-slate-700">
                                {col.dataType}
                              </span>
                            </td>
                            <td className="px-4 py-2.5 text-text-secondary">
                              {col.description}
                            </td>
                            <td className="px-4 py-2.5">
                              <div className="flex flex-wrap gap-1">
                                {col.allowedRoles.map((r) => (
                                  <span
                                    key={r}
                                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                      r === "ADMIN"
                                        ? "bg-purple-50 text-purple-700"
                                        : r === "ANALYST"
                                        ? "bg-blue-50 text-primary"
                                        : "bg-slate-100 text-slate-600"
                                    }`}
                                  >
                                    {r}
                                  </span>
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
