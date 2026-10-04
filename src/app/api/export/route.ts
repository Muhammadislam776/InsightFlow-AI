import { NextRequest, NextResponse } from "next/server";
import { AUDIT_LOGS } from "@/lib/store/mockStore";
import { UserRole } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rows = [], columns = [], title = "analytics_export", role = "ANALYST", user = "Active User" } = body;

    // Viewers cannot export data
    if (role === "VIEWER") {
      return NextResponse.json(
        { error: "Export permission denied. Viewer role cannot export raw data." },
        { status: 403 }
      );
    }

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: "No data rows provided to export." }, { status: 400 });
    }

    // Apply row limit constraint (max 5000 rows export)
    const exportLimit = 5000;
    const exportRows = rows.slice(0, exportLimit);

    // Build CSV content
    const headers = columns.length > 0 ? columns : Object.keys(exportRows[0]);
    const csvLines = [headers.join(",")];

    for (const row of exportRows) {
      const line = headers.map((h: string) => {
        const val = row[h];
        if (val === null || val === undefined) return '""';
        const str = String(val).replace(/"/g, '""');
        return `"${str}"`;
      });
      csvLines.push(line.join(","));
    }

    const csvContent = csvLines.join("\n");

    // Record in audit log
    AUDIT_LOGS.unshift({
      id: `aud_${Date.now()}`,
      user,
      role: role as UserRole,
      action: "CSV_EXPORT",
      details: `Exported ${exportRows.length} rows from "${title}" (CSV format, ${Math.round(csvContent.length / 1024)} KB)`,
      timestamp: "Just now",
      ip: "127.0.0.1",
    });

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${title.replace(/[^a-zA-Z0-9_-]/g, "_")}_${Date.now()}.csv"`,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
