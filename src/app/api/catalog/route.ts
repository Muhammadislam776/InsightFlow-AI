import { NextRequest, NextResponse } from "next/server";
import { APPROVED_SCHEMA, getApprovedTablesForRole } from "@/lib/security/schemaCatalog";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const role = searchParams.get("role") || "ANALYST";

  let tables = getApprovedTablesForRole(role);

  if (search.trim()) {
    const s = search.toLowerCase().trim();
    tables = tables
      .map((table) => {
        const matchesTable =
          table.tableName.toLowerCase().includes(s) ||
          table.displayName.toLowerCase().includes(s) ||
          table.description.toLowerCase().includes(s);

        const filteredColumns = table.columns.filter(
          (col) =>
            col.name.toLowerCase().includes(s) ||
            col.displayName.toLowerCase().includes(s) ||
            col.description.toLowerCase().includes(s)
        );

        if (matchesTable) {
          return table;
        }

        if (filteredColumns.length > 0) {
          return {
            ...table,
            columns: filteredColumns,
          };
        }

        return null;
      })
      .filter(Boolean) as any[];
  }

  return NextResponse.json({
    totalTables: tables.length,
    catalog: tables,
  });
}
