import { APPROVED_SCHEMA, isTableApproved, isColumnApproved } from "./schemaCatalog";
import { UserRole } from "../types";

export interface ValidationResult {
  isValid: boolean;
  sanitizedSql: string;
  errorMessage?: string;
  blockReason?: string;
  tablesIdentified: string[];
  columnsIdentified: string[];
  limitApplied: number;
}

// Disallowed SQL keywords that indicate write, DDL, or admin operations
const DISALLOWED_KEYWORDS = [
  "INSERT", "UPDATE", "DELETE", "DROP", "ALTER", "TRUNCATE",
  "CREATE", "GRANT", "REVOKE", "MERGE", "EXEC", "EXECUTE",
  "CALL", "REPLACE", "PRAGMA", "ATTACH", "DETACH", "VACUUM",
  "REINDEX", "TRANSACTION", "COMMIT", "ROLLBACK", "SAVEPOINT",
  "RELEASE", "EXPLAIN", "INTO", "OUTFILE", "DUMPFILE",
  "LOAD_EXTENSION", "XP_CMDSHELL"
];

const ALLOWED_SQL_FUNCTIONS = [
  "COUNT", "SUM", "AVG", "MIN", "MAX",
  "ROUND", "ABS", "UPPER", "LOWER", "TRIM",
  "COALESCE", "NULLIF", "strftime", "DATE", "DATETIME",
  "JULIANDAY", "LENGTH", "SUBSTR", "SUBSTRING",
  "CAST", "CASE", "WHEN", "THEN", "ELSE", "END",
  "DISTINCT", "AS", "OVER", "ROW_NUMBER", "RANK", "DENSE_RANK"
];

export function validateAndSanitizeSql(
  rawSql: string,
  userRole: UserRole = "ANALYST",
  maxRows: number = 1000
): ValidationResult {
  let sql = (rawSql || "").trim();

  // Strip trailing semicolon
  if (sql.endsWith(";")) {
    sql = sql.slice(0, -1).trim();
  }

  // 1. Check for multiple statements (semicolon injection)
  if (sql.includes(";")) {
    return {
      isValid: false,
      sanitizedSql: "",
      errorMessage: "Multiple SQL statements are strictly forbidden for security reasons.",
      blockReason: "MULTIPLE_STATEMENTS_DETECTED",
      tablesIdentified: [],
      columnsIdentified: [],
      limitApplied: 0,
    };
  }

  // 2. Check for SQL comments used to evade inspection (-- or /* */)
  if (/(--|\/\*|\*\/)/.test(sql)) {
    return {
      isValid: false,
      sanitizedSql: "",
      errorMessage: "SQL comments are blocked to prevent inspection evasion.",
      blockReason: "SQL_COMMENTS_DISALLOWED",
      tablesIdentified: [],
      columnsIdentified: [],
      limitApplied: 0,
    };
  }

  // 3. Must start with SELECT or WITH (CTE followed by SELECT)
  const normalizedSql = sql.replace(/\s+/g, " ").trim();
  const startsWithSelect = /^SELECT\b/i.test(normalizedSql);
  const startsWithWith = /^WITH\b[\s\S]+\bSELECT\b/i.test(normalizedSql);

  if (!startsWithSelect && !startsWithWith) {
    return {
      isValid: false,
      sanitizedSql: "",
      errorMessage: "Only read-only SELECT queries are permitted on this workspace.",
      blockReason: "NON_SELECT_STATEMENT",
      tablesIdentified: [],
      columnsIdentified: [],
      limitApplied: 0,
    };
  }

  // 4. Tokenize to check for disallowed DDL/DML keywords
  const tokens = normalizedSql.toUpperCase().split(/[^A-Z0-9_]+/);
  for (const disallowed of DISALLOWED_KEYWORDS) {
    if (tokens.includes(disallowed)) {
      return {
        isValid: false,
        sanitizedSql: "",
        errorMessage: `Unsafe SQL keyword detected: '${disallowed}'. Only read-only queries are supported.`,
        blockReason: `DANGEROUS_KEYWORD_${disallowed}`,
        tablesIdentified: [],
        columnsIdentified: [],
        limitApplied: 0,
      };
    }
  }

  // 5. Extract tables and validate against APPROVED_SCHEMA
  const approvedTableNames = APPROVED_SCHEMA.map((t) => t.tableName.toLowerCase());
  const fromJoinMatches = sql.match(/(?:FROM|JOIN)\s+([a-zA-Z0-9_]+)/gi) || [];
  const foundTables: string[] = [];

  for (const match of fromJoinMatches) {
    const parts = match.trim().split(/\s+/);
    const tableName = parts[1] ? parts[1].toLowerCase().replace(/[`"'[\]]/g, "") : "";
    if (tableName && !foundTables.includes(tableName)) {
      foundTables.push(tableName);
    }
  }

  if (foundTables.length === 0) {
    return {
      isValid: false,
      sanitizedSql: "",
      errorMessage: "Could not safely determine target data tables from query.",
      blockReason: "NO_APPROVED_TABLES_FOUND",
      tablesIdentified: [],
      columnsIdentified: [],
      limitApplied: 0,
    };
  }

  // Verify all found tables are in approved schema and permitted for user role
  for (const table of foundTables) {
    if (!approvedTableNames.includes(table)) {
      return {
        isValid: false,
        sanitizedSql: "",
        errorMessage: `Access denied to table '${table}'. It is not in the approved analytics catalog.`,
        blockReason: "UNAPPROVED_TABLE_ACCESS",
        tablesIdentified: foundTables,
        columnsIdentified: [],
        limitApplied: 0,
      };
    }

    if (!isTableApproved(table, userRole)) {
      return {
        isValid: false,
        sanitizedSql: "",
        errorMessage: `Your role (${userRole}) is not permitted to query table '${table}'.`,
        blockReason: "ROLE_PERMISSION_TABLE_DENIED",
        tablesIdentified: foundTables,
        columnsIdentified: [],
        limitApplied: 0,
      };
    }
  }

  // 6. Check for sensitive columns that current role cannot access
  // e.g. 'unit_cost' is restricted to ADMIN only
  if (userRole !== "ADMIN") {
    if (/\bunit_cost\b/i.test(sql)) {
      return {
        isValid: false,
        sanitizedSql: "",
        errorMessage: `Column 'unit_cost' is restricted to Administrator roles.`,
        blockReason: "ROLE_PERMISSION_COLUMN_DENIED",
        tablesIdentified: foundTables,
        columnsIdentified: ["unit_cost"],
        limitApplied: 0,
      };
    }
  }

  // 7. Enforce Row Limits (Requirement 20)
  // Check if LIMIT clause already exists
  const limitMatch = sql.match(/\bLIMIT\s+(\d+)/i);
  let finalSql = sql;
  let finalLimit = maxRows;

  if (limitMatch) {
    const requestedLimit = parseInt(limitMatch[1], 10);
    if (requestedLimit > maxRows) {
      // Constrain to maximum allowable rows
      finalSql = sql.replace(/\bLIMIT\s+\d+/i, `LIMIT ${maxRows}`);
      finalLimit = maxRows;
    } else {
      finalLimit = requestedLimit;
    }
  } else {
    // Append standard row limit
    finalSql = `${sql} LIMIT ${maxRows}`;
  }

  return {
    isValid: true,
    sanitizedSql: finalSql,
    tablesIdentified: foundTables,
    columnsIdentified: [],
    limitApplied: finalLimit,
  };
}
