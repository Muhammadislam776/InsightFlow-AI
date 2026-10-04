import { NextRequest, NextResponse } from "next/server";
import { queryCache } from "@/lib/cache";
import { queryHistoryList, AUDIT_LOGS } from "@/lib/store/mockStore";

export async function GET(req: NextRequest) {
  const cacheStats = queryCache.getStats();

  const totalQueriesToday = 184 + queryHistoryList.length;
  const successfulQueries = queryHistoryList.filter((q) => q.status === "Success" || q.status === "Cached").length + 168;
  const blockedQueries = queryHistoryList.filter((q) => q.status === "Blocked").length + 16;
  const exportCount = AUDIT_LOGS.filter((a) => a.action === "CSV_EXPORT").length + 18;

  const usageOverTime = [
    { time: "00:00", queries: 4, blocked: 0 },
    { time: "04:00", queries: 2, blocked: 0 },
    { time: "08:00", queries: 28, blocked: 1 },
    { time: "10:00", queries: 54, blocked: 4 },
    { time: "12:00", queries: 42, blocked: 2 },
    { time: "14:00", queries: 68, blocked: 6 },
    { time: "16:00", queries: 48, blocked: 3 },
  ];

  const queriesByRole = [
    { role: "ADMIN", count: 72, color: "#2563EB" },
    { role: "ANALYST", count: 98, color: "#0284C7" },
    { role: "VIEWER", count: 30, color: "#64748B" },
  ];

  const securityThreatCategories = [
    { type: "Write Operations (DROP/DELETE/UPDATE)", count: 9, risk: "High" },
    { type: "Prompt Injection Attempts", count: 4, risk: "Critical" },
    { type: "Unauthorized Column / Table Access", count: 3, risk: "Medium" },
    { type: "Multiple Statements (Semicolon Injection)", count: 2, risk: "High" },
  ];

  return NextResponse.json({
    kpis: {
      queriesToday: totalQueriesToday,
      successfulQueries,
      blockedQueries,
      avgQueryTimeMs: 24.8,
      cacheHitRate: cacheStats.hitRate,
      dataExports: exportCount,
      cacheStats,
    },
    charts: {
      usageOverTime,
      queriesByRole,
      securityThreatCategories,
    },
    recentSecurityEvents: AUDIT_LOGS.slice(0, 10),
  });
}
