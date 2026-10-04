import { NextRequest, NextResponse } from "next/server";
import { translateNaturalLanguageToSql, generateDataGroundedExplanation } from "@/lib/ai/nlToSql";
import { validateAndSanitizeSql } from "@/lib/security/sqlValidator";
import { executeSafeQuery } from "@/lib/db/database";
import { queryCache } from "@/lib/cache";
import { queryHistoryList, AUDIT_LOGS } from "@/lib/store/mockStore";
import { UserRole } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question, role = "ANALYST", previousContext } = body;

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { error: "A valid natural language question string is required." },
        { status: 400 }
      );
    }

    const userRole: UserRole = role;

    // Step 1: Translate NL to SQL
    const translation = translateNaturalLanguageToSql(question, userRole, previousContext);

    // If prompt injection or adversarial intent detected
    if (translation.isBlockedPrompt) {
      const blockedItem = {
        id: `qh_${Date.now()}`,
        question,
        timestamp: "Just now",
        user: "Active User",
        role: userRole,
        executionTime: 2,
        rowsReturned: 0,
        status: "Blocked" as const,
        visualization: "None",
        generatedSql: "-- BLOCKED: Prompt safety violation",
        errorMessage: translation.interpretation,
      };
      queryHistoryList.unshift(blockedItem);

      AUDIT_LOGS.unshift({
        id: `aud_${Date.now()}`,
        user: "Security Guardrail",
        role: "SYSTEM",
        action: "PROMPT_INJECTION_BLOCKED",
        details: `Intercepted adversarial question: "${question.slice(0, 60)}"`,
        timestamp: "Just now",
        ip: "127.0.0.1",
      });

      return NextResponse.json(
        {
          question,
          interpretation: translation.interpretation,
          generatedSql: "-- BLOCKED",
          columns: [],
          rows: [],
          totalRows: 0,
          executionTimeMs: 2,
          status: "BLOCKED",
          visualization: {
            recommendedType: "table",
            title: "Query Blocked",
          },
          explanation: {
            summary: "This question was blocked by the security safety engine.",
            keyTakeaway: "Unsafe instruction detected.",
            dataBasis: "Security policy allowlist enforcement.",
            limitation: "Only read-only analytics questions are permitted.",
          },
          securityAudit: {
            isReadOnly: true,
            isSchemaApproved: false,
            rowLimitApplied: 0,
            tablesQueried: [],
            columnsQueried: [],
            riskScore: 95,
          },
          errorMessage: translation.interpretation,
        },
        { status: 200 }
      );
    }

    // Step 2: Validate and Sanitize Generated SQL
    const validation = validateAndSanitizeSql(translation.sql, userRole, 1000);

    if (!validation.isValid) {
      const blockedItem = {
        id: `qh_${Date.now()}`,
        question,
        timestamp: "Just now",
        user: "Active User",
        role: userRole,
        executionTime: 3,
        rowsReturned: 0,
        status: "Blocked" as const,
        visualization: "None",
        generatedSql: translation.sql,
        errorMessage: validation.errorMessage,
      };
      queryHistoryList.unshift(blockedItem);

      AUDIT_LOGS.unshift({
        id: `aud_${Date.now()}`,
        user: "SQL Guardrail",
        role: "SYSTEM",
        action: "UNSAFE_SQL_BLOCKED",
        details: `Blocked reason: ${validation.blockReason} for SQL: ${translation.sql.slice(0, 50)}`,
        timestamp: "Just now",
        ip: "127.0.0.1",
      });

      return NextResponse.json(
        {
          question,
          interpretation: translation.interpretation,
          generatedSql: translation.sql,
          columns: [],
          rows: [],
          totalRows: 0,
          executionTimeMs: 3,
          status: "BLOCKED",
          visualization: {
            recommendedType: "table",
            title: "Query Blocked",
          },
          explanation: {
            summary: validation.errorMessage || "SQL Validation failed.",
            keyTakeaway: "Query violates safe analytics policy.",
            dataBasis: "Approved Schema & Read-Only Governance",
            limitation: "Write or unapproved schema operations are blocked.",
          },
          securityAudit: {
            isReadOnly: true,
            isSchemaApproved: false,
            rowLimitApplied: 0,
            tablesQueried: validation.tablesIdentified,
            columnsQueried: validation.columnsIdentified,
            riskScore: 80,
          },
          errorMessage: validation.errorMessage,
        },
        { status: 200 }
      );
    }

    // Step 3: Check cache
    const cachedData = queryCache.get(validation.sanitizedSql, userRole);
    if (cachedData) {
      return NextResponse.json({
        ...cachedData,
        cacheHit: true,
        status: "CACHED",
      });
    }

    // Step 4: Execute Safe Read-Only Query on DB
    const startTime = Date.now();
    let execResult;
    try {
      execResult = await executeSafeQuery(validation.sanitizedSql, 30000);
    } catch (dbErr: any) {
      const isTimeout = dbErr.message && dbErr.message.includes("TIMEOUT");
      return NextResponse.json(
        {
          question,
          interpretation: translation.interpretation,
          generatedSql: validation.sanitizedSql,
          columns: [],
          rows: [],
          totalRows: 0,
          executionTimeMs: Date.now() - startTime,
          status: isTimeout ? "TIMEOUT" : "FAILED",
          visualization: {
            recommendedType: "table",
            title: "Query Error",
          },
          explanation: {
            summary: isTimeout
              ? "Your query exceeded the 30-second execution time limit."
              : "An error occurred while executing the query against the database.",
            keyTakeaway: isTimeout ? "Try narrowing date ranges or dimensions." : "Execution halted safely.",
            dataBasis: "Approved Schema",
            limitation: "Execution limit reached.",
          },
          securityAudit: {
            isReadOnly: true,
            isSchemaApproved: true,
            rowLimitApplied: validation.limitApplied,
            tablesQueried: validation.tablesIdentified,
            columnsQueried: validation.columnsIdentified,
            riskScore: 0,
          },
          errorMessage: dbErr.message,
        },
        { status: 200 }
      );
    }

    // Step 5: Generate Data-Grounded Explanation
    const explanation = generateDataGroundedExplanation(
      question,
      execResult.rows,
      execResult.columns
    );

    // Structure response
    const finalResult = {
      question,
      interpretation: translation.interpretation,
      generatedSql: validation.sanitizedSql,
      columns: execResult.columns,
      rows: execResult.rows,
      totalRows: execResult.rows.length,
      executionTimeMs: execResult.executionTimeMs,
      status: "SUCCESS" as const,
      visualization: {
        recommendedType: translation.recommendedChart,
        xAxisKey: translation.xAxisKey || execResult.columns[0],
        yAxisKeys: translation.yAxisKeys || (execResult.columns[1] ? [execResult.columns[1]] : []),
        title: question,
      },
      explanation,
      securityAudit: {
        isReadOnly: true,
        isSchemaApproved: true,
        rowLimitApplied: validation.limitApplied,
        tablesQueried: validation.tablesIdentified,
        columnsQueried: validation.columnsIdentified,
        riskScore: 0,
      },
      cacheHit: false,
    };

    // Store in cache
    queryCache.set(validation.sanitizedSql, userRole, finalResult, execResult.executionTimeMs);

    // Log to query history
    queryHistoryList.unshift({
      id: `qh_${Date.now()}`,
      question,
      timestamp: "Just now",
      user: "Active User",
      role: userRole,
      executionTime: execResult.executionTimeMs,
      rowsReturned: execResult.rows.length,
      status: "Success",
      visualization: `${translation.recommendedChart.toUpperCase()} Chart`,
      generatedSql: validation.sanitizedSql,
    });

    return NextResponse.json(finalResult);
  } catch (error: any) {
    console.error("API /api/ask Error:", error);
    return NextResponse.json(
      { error: "Internal server error processing natural language question.", details: error.message },
      { status: 500 }
    );
  }
}
