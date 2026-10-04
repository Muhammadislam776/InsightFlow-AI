export type UserRole = "ADMIN" | "ANALYST" | "VIEWER";

export interface User {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  status: "active" | "invited" | "disabled";
  createdAt: string;
}

export interface Organization {
  id: string;
  name: string;
  tier: "Enterprise" | "Growth" | "Starter";
  maxQueriesPerDay: number;
}

export interface ApprovedTable {
  tableName: string;
  displayName: string;
  description: string;
  category: string;
  allowedRoles: UserRole[];
  columns: ApprovedColumn[];
}

export interface ApprovedColumn {
  name: string;
  displayName: string;
  dataType: "TEXT" | "INTEGER" | "REAL" | "DATE" | "BOOLEAN";
  description: string;
  isSensitive?: boolean; // e.g. unit_cost is restricted from VIEWERS
  allowedRoles: UserRole[];
  exampleValues?: string[];
}

export interface QueryExecutionResult {
  question: string;
  interpretation: string;
  generatedSql: string;
  columns: string[];
  rows: Record<string, any>[];
  totalRows: number;
  executionTimeMs: number;
  status: "SUCCESS" | "FAILED" | "BLOCKED" | "TIMEOUT" | "CACHED";
  visualization: {
    recommendedType: "bar" | "line" | "pie" | "kpi" | "table" | "area";
    xAxisKey?: string;
    yAxisKeys?: string[];
    title: string;
    colorScheme?: string;
  };
  explanation: {
    summary: string;
    keyTakeaway: string;
    dataBasis: string;
    limitation: string;
  };
  securityAudit: {
    isReadOnly: boolean;
    isSchemaApproved: boolean;
    rowLimitApplied: number;
    tablesQueried: string[];
    columnsQueried: string[];
    riskScore: number;
  };
  cacheHit?: boolean;
  errorMessage?: string;
}

export interface DashboardWidget {
  id: string;
  title: string;
  question?: string;
  chartType: "bar" | "line" | "pie" | "kpi" | "table" | "area";
  sqlQuery: string;
  xAxisKey?: string;
  yAxisKey?: string;
  data?: any[];
  width?: "full" | "half" | "third";
  summaryMetric?: string;
}

export interface Dashboard {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  owner: string;
  lastUpdated: string;
  isFavorite: boolean;
  visibility: "public" | "team" | "private";
  widgets: DashboardWidget[];
}

export interface QueryHistoryItem {
  id: string;
  question: string;
  timestamp: string;
  user: string;
  role: UserRole;
  executionTime: number;
  rowsReturned: number;
  status: "Success" | "Failed" | "Blocked" | "Timeout" | "Cached";
  visualization: string;
  generatedSql: string;
  errorMessage?: string;
}

export interface BenchmarkCase {
  id: string;
  question: string;
  category: "Aggregation" | "Time Series" | "Joins & Filtering" | "Security Injection" | "Schema Boundary" | "Edge Cases";
  isSafetyTest: boolean;
  expectedBlocked: boolean;
  expectedPattern?: string;
  lastRunStatus?: "PASS" | "FAIL" | "BLOCKED";
  latencyMs?: number;
  generatedSql?: string;
}
