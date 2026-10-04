import { NextRequest, NextResponse } from "next/server";
import { queryCache } from "@/lib/cache";
import { MOCK_USERS, AUDIT_LOGS } from "@/lib/store/mockStore";
import { APPROVED_SCHEMA } from "@/lib/security/schemaCatalog";

export async function GET(req: NextRequest) {
  const cacheStats = queryCache.getStats();

  return NextResponse.json({
    workspace: {
      id: "org_acme_bi",
      name: "Acme Enterprises BI Hub",
      plan: "Enterprise",
      region: "us-east-1",
      createdAt: "2024-01-15",
    },
    users: MOCK_USERS,
    cacheStats,
    approvedSchema: APPROVED_SCHEMA,
    queryLimits: {
      defaultLimit: 1000,
      maxLimit: 10000,
      queryTimeoutSec: 30,
    },
    aiConfig: {
      model: "InsightFlow Safe-SQL-v2 (Gemini Flash Optimized)",
      temperature: 0.1,
      maxTokens: 1024,
      guardrailEnforcement: "STRICT_ALLOWLIST",
    },
    auditLogs: AUDIT_LOGS,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, payload, user = "Alex Vance" } = body;

    if (action === "CLEAR_CACHE") {
      queryCache.clear();
      AUDIT_LOGS.unshift({
        id: `aud_${Date.now()}`,
        user,
        role: "ADMIN",
        action: "CACHE_PURGE",
        details: "Administrator purged all cached query slots.",
        timestamp: "Just now",
        ip: "127.0.0.1",
      });
      return NextResponse.json({ success: true, message: "Cache successfully cleared." });
    }

    if (action === "UPDATE_CACHE_TTL") {
      const minutes = Number(payload?.minutes) || 15;
      queryCache.setTtlMinutes(minutes);
      return NextResponse.json({ success: true, message: `Cache TTL updated to ${minutes} minutes.` });
    }

    if (action === "INVITE_USER") {
      const newUser = {
        id: `usr_${Date.now()}`,
        organizationId: "org_acme_bi",
        name: payload.name || "New Teammate",
        email: payload.email,
        role: payload.role || "ANALYST",
        status: "active" as const,
        createdAt: new Date().toISOString().split("T")[0],
      };
      MOCK_USERS.push(newUser);
      AUDIT_LOGS.unshift({
        id: `aud_${Date.now()}`,
        user,
        role: "ADMIN",
        action: "USER_INVITE",
        details: `Invited ${payload.email} with role ${payload.role}`,
        timestamp: "Just now",
        ip: "127.0.0.1",
      });
      return NextResponse.json({ success: true, user: newUser });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
