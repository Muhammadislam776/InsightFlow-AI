import { NextRequest, NextResponse } from "next/server";
import { savedDashboards } from "@/lib/store/mockStore";
import { executeSafeQuery } from "@/lib/db/database";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const dashboard = savedDashboards.find((d) => d.id === id);

  if (!dashboard) {
    return NextResponse.json({ error: "Dashboard not found" }, { status: 404 });
  }

  // Populate widgets with live data from database
  const widgetsWithData = await Promise.all(
    dashboard.widgets.map(async (widget) => {
      try {
        const res = await executeSafeQuery(widget.sqlQuery, 10000);
        return {
          ...widget,
          data: res.rows,
        };
      } catch (e: any) {
        return {
          ...widget,
          data: [],
          error: e.message,
        };
      }
    })
  );

  return NextResponse.json({
    dashboard: {
      ...dashboard,
      widgets: widgetsWithData,
    },
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const idx = savedDashboards.findIndex((d) => d.id === id);
  if (idx !== -1) {
    savedDashboards.splice(idx, 1);
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ error: "Dashboard not found" }, { status: 404 });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const body = await req.json();
  const idx = savedDashboards.findIndex((d) => d.id === id);

  if (idx === -1) {
    return NextResponse.json({ error: "Dashboard not found" }, { status: 404 });
  }

  savedDashboards[idx] = {
    ...savedDashboards[idx],
    ...body,
    lastUpdated: "Just now",
  };

  return NextResponse.json({ success: true, dashboard: savedDashboards[idx] });
}
