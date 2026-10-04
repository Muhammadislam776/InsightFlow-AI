"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  BarChart3,
  LineChart as LineIcon,
  PieChart as PieIcon,
  Table as TableIcon,
  Download,
  Maximize2,
  Minimize2,
  BookmarkPlus,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowUpDown,
  Search,
} from "lucide-react";

interface VisualizerProps {
  data: Record<string, any>[];
  columns: string[];
  initialType?: "bar" | "line" | "area" | "pie" | "table" | "kpi";
  xAxisKey?: string;
  yAxisKeys?: string[];
  title?: string;
  isCached?: boolean;
  rowLimit?: number;
  onSaveToDashboard?: () => void;
}

const PALETTE = ["#2563EB", "#F97316", "#0284C7", "#10B981", "#8B5CF6", "#F59E0B"];

export function DataVisualizer({
  data = [],
  columns = [],
  initialType = "bar",
  xAxisKey,
  yAxisKeys = [],
  title = "Analytics Visualization",
  isCached = false,
  rowLimit = 1000,
  onSaveToDashboard,
}: VisualizerProps) {
  const [chartType, setChartType] = useState<string>(initialType);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-slate-50/50 p-12 text-center">
        <p className="text-sm font-medium text-text-secondary">No records to visualize.</p>
      </div>
    );
  }

  // Detect keys if not specified
  const xKey = xAxisKey || columns[0] || "name";
  const numCols = columns.filter(
    (col) => typeof data[0]?.[col] === "number" || (!isNaN(Number(data[0]?.[col])) && !col.includes("id"))
  );
  const yKeys = yAxisKeys.length > 0 ? yAxisKeys : numCols.length > 0 ? [numCols[0]] : [columns[1] || columns[0]];

  // Table filtering and sorting
  const filteredData = data.filter((row) =>
    columns.some((col) =>
      String(row[col] ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortCol) return 0;
    const aVal = a[sortCol];
    const bVal = b[sortCol];
    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortAsc ? aVal - bVal : bVal - aVal;
    }
    return sortAsc
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });

  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = sortedData.slice((page - 1) * pageSize, page * pageSize);

  // CSV export handler
  const handleExportCSV = () => {
    const headerRow = columns.join(",");
    const bodyRows = data.map((r) =>
      columns.map((c) => `"${String(r[c] ?? "").replace(/"/g, '""')}"`).join(",")
    );
    const csvContent = [headerRow, ...bodyRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `insightflow_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className={`bg-surface rounded-2xl border border-border shadow-card transition-all ${
        isFullscreen ? "fixed inset-4 z-50 overflow-y-auto p-6 bg-white" : "p-5"
      }`}
    >
      {/* Visualizer Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border">
        {/* Security Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-primary border border-blue-200">
            <ShieldCheck className="w-3 h-3 mr-1 text-primary" />
            READ ONLY
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-status-success border border-green-200">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            VALIDATED
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-text-secondary border border-border">
            APPROVED SCHEMA
          </span>
          {isCached && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-accent-orange border border-orange-200">
              <Sparkles className="w-3 h-3 mr-1" />
              CACHED
            </span>
          )}
          <span className="text-[11px] text-text-muted font-medium ml-1">
            {data.length} {data.length === 1 ? "row" : "rows"}
          </span>
        </div>

        {/* Chart View Switchers and Action Buttons */}
        <div className="flex items-center space-x-1.5">
          <div className="flex bg-slate-100 p-0.5 rounded-xl border border-border">
            {[
              { type: "bar", icon: BarChart3, label: "Bar" },
              { type: "line", icon: LineIcon, label: "Line" },
              { type: "area", icon: AreaChart, label: "Area" },
              { type: "pie", icon: PieIcon, label: "Pie" },
              { type: "table", icon: TableIcon, label: "Table" },
            ].map((btn) => {
              const Icon = btn.icon as any;
              return (
                <button
                  key={btn.type}
                  onClick={() => setChartType(btn.type)}
                  className={`p-1.5 rounded-lg transition-all text-xs flex items-center ${
                    chartType === btn.type
                      ? "bg-surface text-primary shadow-subtle font-bold"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                  title={`${btn.label} View`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </button>
              );
            })}
          </div>

          {onSaveToDashboard && (
            <button
              onClick={onSaveToDashboard}
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-primary-light text-primary hover:bg-blue-100 border border-blue-200 transition-colors flex items-center"
              title="Save to Dashboard"
            >
              <BookmarkPlus className="w-3.5 h-3.5 mr-1" />
              Save
            </button>
          )}

          <button
            onClick={handleExportCSV}
            className="p-1.5 rounded-xl text-text-secondary hover:text-primary hover:bg-slate-100 border border-border transition-colors"
            title="Export CSV"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-xl text-text-secondary hover:text-primary hover:bg-slate-100 border border-border transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Render Selected View */}
      <div className="mt-4 min-h-[320px]">
        {/* KPI VIEW */}
        {chartType === "kpi" && (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <span className="text-xs font-bold tracking-wider text-text-muted uppercase">
              {columns[0]?.replace(/_/g, " ")}
            </span>
            <div className="mt-2 text-4xl font-extrabold text-text-primary">
              {typeof data[0]?.[columns[0]] === "number"
                ? data[0]?.[columns[0]].toLocaleString()
                : String(data[0]?.[columns[0]])}
            </div>
            {columns[1] && (
              <p className="mt-2 text-sm text-text-secondary">
                {columns[1].replace(/_/g, " ")}:{" "}
                <strong className="text-primary font-bold">
                  {typeof data[0]?.[columns[1]] === "number"
                    ? data[0]?.[columns[1]].toLocaleString()
                    : String(data[0]?.[columns[1]])}
                </strong>
              </p>
            )}
          </div>
        )}

        {/* BAR CHART VIEW */}
        {chartType === "bar" && (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis
                  dataKey={xKey}
                  stroke="#94A3B8"
                  fontSize={11}
                  tickLine={false}
                  angle={-20}
                  textAnchor="end"
                />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "12px",
                    border: "1px solid #E2E8F0",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.08)",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                {yKeys.map((key, idx) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    fill={PALETTE[idx % PALETTE.length]}
                    radius={[6, 6, 0, 0]}
                    animationDuration={600}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* LINE CHART VIEW */}
        {chartType === "line" && (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis
                  dataKey={xKey}
                  stroke="#94A3B8"
                  fontSize={11}
                  tickLine={false}
                  angle={-20}
                  textAnchor="end"
                />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "12px",
                    border: "1px solid #E2E8F0",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.08)",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                {yKeys.map((key, idx) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={PALETTE[idx % PALETTE.length]}
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2, fill: "#FFFFFF" }}
                    activeDot={{ r: 6 }}
                    animationDuration={600}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* AREA CHART VIEW */}
        {chartType === "area" && (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis
                  dataKey={xKey}
                  stroke="#94A3B8"
                  fontSize={11}
                  tickLine={false}
                  angle={-20}
                  textAnchor="end"
                />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "12px",
                    border: "1px solid #E2E8F0",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.08)",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey={yKeys[0]}
                  stroke="#2563EB"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#areaGrad)"
                  animationDuration={600}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* PIE / DONUT VIEW */}
        {chartType === "pie" && (
          <div className="h-80 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "12px",
                    border: "1px solid #E2E8F0",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.08)",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Pie
                  data={data}
                  dataKey={yKeys[0]}
                  nameKey={xKey}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={3}
                  animationDuration={600}
                >
                  {data.map((_, idx) => (
                    <Cell key={`cell-${idx}`} fill={PALETTE[idx % PALETTE.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* DATA TABLE VIEW (Requirement 29) */}
        {chartType === "table" && (
          <div>
            {/* Search filter within returned rows */}
            <div className="flex items-center justify-between mb-3">
              <div className="relative w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-text-muted" />
                <input
                  type="text"
                  placeholder="Filter rows..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-background border border-border rounded-xl outline-hidden focus:border-primary"
                />
              </div>
              <span className="text-[11px] text-text-muted">
                Showing {paginatedData.length} of {sortedData.length} records
              </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-text-secondary border-b border-border">
                  <tr>
                    {columns.map((col) => (
                      <th
                        key={col}
                        onClick={() => {
                          if (sortCol === col) {
                            setSortAsc(!sortAsc);
                          } else {
                            setSortCol(col);
                            setSortAsc(true);
                          }
                        }}
                        className="px-4 py-2.5 font-semibold cursor-pointer hover:bg-slate-100 transition-colors select-none"
                      >
                        <div className="flex items-center space-x-1">
                          <span>{col}</span>
                          <ArrowUpDown className="w-3 h-3 text-text-muted" />
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {paginatedData.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className="hover:bg-slate-50/70 transition-colors duration-150"
                    >
                      {columns.map((col) => (
                        <td key={col} className="px-4 py-2.5 text-text-primary">
                          {typeof row[col] === "number"
                            ? row[col].toLocaleString()
                            : String(row[col] ?? "—")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-3 text-xs">
                <span className="text-text-muted">
                  Page {page} of {totalPages}
                </span>
                <div className="flex space-x-1">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="px-2.5 py-1 rounded-lg border border-border bg-surface disabled:opacity-40 hover:bg-slate-100"
                  >
                    Prev
                  </button>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="px-2.5 py-1 rounded-lg border border-border bg-surface disabled:opacity-40 hover:bg-slate-100"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
