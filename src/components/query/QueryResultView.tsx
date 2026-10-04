"use client";

import React, { useState } from "react";
import {
  Code,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  BookmarkPlus,
  ArrowRight,
  ShieldAlert,
  Info,
  Clock,
  Database,
  Layers,
  Download,
  Share2,
  Table as TableIcon,
  BarChart3,
  LineChart as LineIcon,
  PieChart as PieIcon,
  Search,
  ArrowUpDown,
} from "lucide-react";
import { QueryExecutionResult } from "@/lib/types";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface QueryResultViewProps {
  result: QueryExecutionResult;
  onAskFollowUp?: (followUpQuestion: string) => void;
  onSaveDashboardWidget?: (widgetData: any) => void;
}

const PALETTE = ["#2563EB", "#06B6D4", "#F97316", "#FBBF24", "#8B5CF6", "#10B981"];

export function QueryResultView({
  result,
  onAskFollowUp,
  onSaveDashboardWidget,
}: QueryResultViewProps) {
  const [viewMode, setViewMode] = useState<"chart" | "table">("chart");
  const [chartType, setChartType] = useState<string>(
    result.visualization.recommendedType === "table" ? "bar" : result.visualization.recommendedType
  );
  const [copiedSql, setCopiedSql] = useState(false);
  const [followUpText, setFollowUpText] = useState("");
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saveWidgetTitle, setSaveWidgetTitle] = useState(result.question);

  // Table sorting & pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const handleCopySql = () => {
    navigator.clipboard.writeText(result.generatedSql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleExportCSV = async () => {
    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rows: result.rows,
          columns: result.columns,
          title: result.question.replace(/[^a-zA-Z0-9]/g, "_"),
          role: "ANALYST",
        }),
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `insightflow_${Date.now()}.csv`;
      link.click();
    } catch (e) {
      console.error(e);
    }
  };

  const isBlocked = result.status === "BLOCKED";

  // If query was blocked by safety policy
  if (isBlocked) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50/50 p-6 sm:p-8 shadow-sm space-y-4 animate-in fade-in">
        <div className="flex items-start space-x-3.5">
          <div className="p-2.5 rounded-2xl bg-rose-600 text-white shadow-sm">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-rose-700 uppercase tracking-wide">
              Security Guardrail Intercept
            </span>
            <h3 className="text-lg font-bold text-[#111827] mt-1">
              Query Execution Blocked
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              {result.explanation.summary}
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-red-100 p-4 text-xs space-y-2 shadow-2xs">
          <p className="font-bold text-[#111827] flex items-center">
            <Info className="w-4 h-4 text-[#2563EB] mr-1.5" />
            Security Governance Rule:
          </p>
          <p className="text-[#64748B] leading-relaxed">
            {result.errorMessage ||
              "InsightFlow AI enforces strict read-only execution on approved business schemas. Write statements, DDL commands, multi-statements, and unapproved table access are strictly rejected."}
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={() => onAskFollowUp && onAskFollowUp("What were our total sales last month?")}
            className="px-4 py-2 bg-[#2563EB] text-white text-xs font-bold rounded-xl hover:bg-[#1D4ED8] transition-colors"
          >
            Try Safe Question: "What were our total sales last month?"
          </button>
        </div>
      </div>
    );
  }

  // Filter & sort rows for Table View
  const filteredData = result.rows.filter((row) =>
    result.columns.some((col) =>
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

  const xKey = result.visualization.xAxisKey || result.columns[0] || "name";
  const numCols = result.columns.filter(
    (col) => typeof result.rows[0]?.[col] === "number" || (!isNaN(Number(result.rows[0]?.[col])) && !col.includes("id"))
  );
  const yKeys =
    result.visualization.yAxisKeys && result.visualization.yAxisKeys.length > 0
      ? result.visualization.yAxisKeys
      : numCols.length > 0
      ? [numCols[0]]
      : [result.columns[1] || result.columns[0]];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header Card matching Mockup #5 */}
      <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-0.5">
            <span>Query Results</span>
            <span>•</span>
            <span className="text-[#2563EB]">{result.totalRows} rows</span>
            <span>•</span>
            <span>{result.executionTimeMs} ms</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#111827]">
            {result.question}
          </h2>
        </div>

        {/* Action Controls matching Mockup #5 */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSaveModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-white border border-[#E2E8F0] hover:bg-slate-50 text-xs font-semibold text-[#111827] flex items-center space-x-1.5 shadow-2xs transition-colors"
          >
            <BookmarkPlus className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Save</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-1.5 rounded-xl bg-white border border-[#E2E8F0] hover:bg-slate-50 text-xs font-semibold text-[#111827] flex items-center space-x-1.5 shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export</span>
          </button>

          {/* Chart selector pill */}
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold text-[#111827] outline-none cursor-pointer"
          >
            <option value="bar">Bar Chart</option>
            <option value="line">Line Chart</option>
            <option value="area">Area Chart</option>
            <option value="pie">Pie Chart</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Visualizer on Left (7 cols) + AI Explanation & SQL on Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Visual Chart + Table View Toggle (Mockup #5) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            {/* View Switchers */}
            <div className="flex bg-[#F1F5F9] p-1 rounded-xl">
              <button
                onClick={() => setViewMode("chart")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  viewMode === "chart"
                    ? "bg-white text-[#2563EB] shadow-2xs"
                    : "text-[#64748B] hover:text-[#111827]"
                }`}
              >
                Chart View
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  viewMode === "table"
                    ? "bg-white text-[#2563EB] shadow-2xs"
                    : "text-[#64748B] hover:text-[#111827]"
                }`}
              >
                Table View
              </button>
            </div>

            {/* Badges */}
            <div className="flex items-center space-x-1.5 text-[10px] font-bold">
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                ✓ Safe Read-Only
              </span>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200">
                Approved Schema
              </span>
            </div>
          </div>

          {/* Render Visual or Table */}
          {viewMode === "chart" ? (
            <div className="h-80 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === "bar" ? (
                  <BarChart data={result.rows} margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis
                      dataKey={xKey}
                      stroke="#94A3B8"
                      fontSize={11}
                      tickLine={false}
                      angle={-15}
                      textAnchor="end"
                    />
                    <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "12px",
                        border: "1px solid #E2E8F0",
                        fontSize: "12px",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                    {yKeys.map((key, idx) => (
                      <Bar
                        key={key}
                        dataKey={key}
                        fill={PALETTE[idx % PALETTE.length]}
                        radius={[6, 6, 0, 0]}
                        animationDuration={500}
                      />
                    ))}
                  </BarChart>
                ) : chartType === "line" ? (
                  <LineChart data={result.rows} margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey={xKey} stroke="#94A3B8" fontSize={11} tickLine={false} angle={-15} textAnchor="end" />
                    <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: "12px", fontSize: "12px" }} />
                    <Legend wrapperStyle={{ fontSize: "11px" }} />
                    {yKeys.map((key, idx) => (
                      <Line key={key} type="monotone" dataKey={key} stroke={PALETTE[idx % PALETTE.length]} strokeWidth={3} dot={{ r: 4 }} />
                    ))}
                  </LineChart>
                ) : chartType === "area" ? (
                  <AreaChart data={result.rows} margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey={xKey} stroke="#94A3B8" fontSize={11} tickLine={false} angle={-15} textAnchor="end" />
                    <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: "12px", fontSize: "12px" }} />
                    <Area type="monotone" dataKey={yKeys[0]} stroke="#2563EB" strokeWidth={3} fill="url(#chartGrad)" />
                  </AreaChart>
                ) : (
                  <RechartsPieChart>
                    <Tooltip contentStyle={{ borderRadius: "12px", fontSize: "12px" }} />
                    <Legend wrapperStyle={{ fontSize: "11px" }} />
                    <Pie data={result.rows} dataKey={yKeys[0]} nameKey={xKey} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3}>
                      {result.rows.map((_, idx) => (
                        <Cell key={`cell-${idx}`} fill={PALETTE[idx % PALETTE.length]} />
                      ))}
                    </Pie>
                  </RechartsPieChart>
                )}
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Search filter */}
              <div className="relative w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#94A3B8]" />
                <input
                  type="text"
                  placeholder="Search returned rows..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F8FAFC] border border-slate-200 rounded-xl outline-none focus:border-[#2563EB]"
                />
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] text-[#64748B] border-b border-slate-200">
                    <tr>
                      {result.columns.map((col) => (
                        <th
                          key={col}
                          onClick={() => {
                            if (sortCol === col) setSortAsc(!sortAsc);
                            else {
                              setSortCol(col);
                              setSortAsc(true);
                            }
                          }}
                          className="px-3.5 py-2.5 font-semibold cursor-pointer hover:bg-slate-100"
                        >
                          <div className="flex items-center space-x-1">
                            <span>{col}</span>
                            <ArrowUpDown className="w-3 h-3 text-[#94A3B8]" />
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70">
                        {result.columns.map((col) => (
                          <td key={col} className="px-3.5 py-2 text-[#111827]">
                            {typeof row[col] === "number" ? row[col].toLocaleString() : String(row[col] ?? "—")}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between text-xs text-[#64748B] pt-1">
                  <span>Page {page} of {totalPages}</span>
                  <div className="flex space-x-1">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="px-2.5 py-1 rounded bg-slate-100 disabled:opacity-40"
                    >
                      Prev
                    </button>
                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className="px-2.5 py-1 rounded bg-slate-100 disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side: AI Explanation & Safe SQL Cards matching Mockup #5 */}
        <div className="lg:col-span-5 space-y-5">
          {/* AI Explanation Card (Mockup #5) */}
          <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-sm space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#F97316]" />
              </div>
              <h3 className="text-sm font-bold text-[#111827]">AI Explanation</h3>
            </div>

            <p className="text-xs sm:text-[13px] text-[#111827] font-medium leading-relaxed bg-[#F8FAFC] p-3.5 rounded-2xl border border-slate-200">
              {result.explanation.summary}
            </p>

            <div className="space-y-1.5 text-xs text-[#64748B] pt-1">
              <div className="flex items-start space-x-2">
                <span className="font-semibold text-[#111827]">Key takeaway:</span>
                <span>{result.explanation.keyTakeaway}</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-semibold text-[#111827]">Data basis:</span>
                <span>{result.explanation.dataBasis}</span>
              </div>
            </div>
          </div>

          {/* SQL Query Card (Mockup #5) */}
          <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                  <Code className="w-4 h-4 text-[#2563EB]" />
                </div>
                <h3 className="text-sm font-bold text-[#111827]">SQL Query</h3>
              </div>

              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                ✓ Read-Only · Validated
              </span>
            </div>

            <div className="relative">
              <pre className="p-3.5 rounded-2xl bg-slate-900 text-blue-200 font-mono text-[11px] leading-relaxed overflow-x-auto border border-slate-800">
                <code>{result.generatedSql}</code>
              </pre>
              <button
                onClick={handleCopySql}
                className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                title="Copy SQL"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <p className="text-[11px] text-[#64748B]">
              <strong className="text-[#111827]">Interpretation:</strong> {result.interpretation}
            </p>
          </div>
        </div>
      </div>

      {/* Follow-up Questions Card */}
      <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
          Ask a Follow-Up Question
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Break that down by product.",
            "Compare with last year.",
            "Show only the North region.",
            "Show customer growth by month.",
          ].map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => onAskFollowUp && onAskFollowUp(prompt)}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#F1F5F9] hover:bg-[#EFF6FF] hover:text-[#2563EB] text-[#475569] border border-transparent hover:border-blue-200 transition-all flex items-center space-x-1"
            >
              <span>{prompt}</span>
              <ArrowRight className="w-3 h-3 text-[#94A3B8]" />
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2 pt-1">
          <input
            type="text"
            placeholder="Type custom follow-up (e.g. 'filter to completed orders')..."
            value={followUpText}
            onChange={(e) => setFollowUpText(e.target.value)}
            className="flex-1 px-4 py-2.5 text-xs bg-[#F8FAFC] border border-slate-200 rounded-full outline-none focus:border-[#2563EB] focus:bg-white"
            onKeyDown={(e) => {
              if (e.key === "Enter" && followUpText.trim()) {
                onAskFollowUp && onAskFollowUp(followUpText);
                setFollowUpText("");
              }
            }}
          />
          <button
            onClick={() => {
              if (followUpText.trim()) {
                onAskFollowUp && onAskFollowUp(followUpText);
                setFollowUpText("");
              }
            }}
            className="px-5 py-2.5 bg-[#2563EB] text-white text-xs font-bold rounded-full hover:bg-[#1D4ED8] transition-colors"
          >
            Ask Follow-up
          </button>
        </div>
      </div>

      {/* Save to Dashboard Modal */}
      {saveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <h3 className="text-base font-bold text-[#111827] flex items-center">
              <BookmarkPlus className="w-5 h-5 text-[#2563EB] mr-2" />
              Save to Dashboard
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-[#64748B] block mb-1">Widget Title</label>
                <input
                  type="text"
                  value={saveWidgetTitle}
                  onChange={(e) => setSaveWidgetTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs text-[#111827] outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-[#64748B] block mb-1">Target Dashboard</label>
                <select className="w-full px-3 py-2 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs text-[#111827] outline-none">
                  <option value="dash_sales_overview">Sales Overview</option>
                  <option value="dash_marketing_perf">Marketing Performance</option>
                  <option value="dash_customer_analytics">Customer Analytics</option>
                  <option value="dash_executive_summary">Executive Summary</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setSaveModalOpen(false)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-[#64748B] hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setSaveModalOpen(false);
                  if (onSaveDashboardWidget) {
                    onSaveDashboardWidget({
                      title: saveWidgetTitle,
                      sql: result.generatedSql,
                      chartType,
                    });
                  }
                  alert(`Widget "${saveWidgetTitle}" successfully pinned to dashboard!`);
                }}
                className="px-4 py-1.5 rounded-xl bg-[#2563EB] text-white text-xs font-bold hover:bg-[#1D4ED8]"
              >
                Save Widget
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
