import { NextRequest, NextResponse } from "next/server";
import { savedDashboards } from "@/lib/store/mockStore";
import { Dashboard } from "@/lib/types";

export async function GET(req: NextRequest) {
  return NextResponse.json({ dashboards: savedDashboards });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, visibility = "public", widgets = [] } = body;

    if (!name) {
      return NextResponse.json({ error: "Dashboard name is required." }, { status: 400 });
    }

    const newDashboard: Dashboard = {
      id: `dash_${Date.now()}`,
      organizationId: "org_acme_bi",
      name,
      description: description || "Custom user created dashboard",
      owner: "Active User",
      lastUpdated: "Just now",
      isFavorite: false,
      visibility,
      widgets,
    };

    savedDashboards.unshift(newDashboard);

    return NextResponse.json({ success: true, dashboard: newDashboard });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
