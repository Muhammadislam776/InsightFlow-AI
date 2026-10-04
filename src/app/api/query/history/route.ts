import { NextRequest, NextResponse } from "next/server";
import { queryHistoryList } from "@/lib/store/mockStore";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "ALL";
  const search = searchParams.get("search") || "";

  let list = [...queryHistoryList];

  if (status !== "ALL") {
    list = list.filter((item) => item.status.toLowerCase() === status.toLowerCase());
  }

  if (search.trim()) {
    const s = search.toLowerCase();
    list = list.filter(
      (item) =>
        item.question.toLowerCase().includes(s) ||
        item.user.toLowerCase().includes(s) ||
        item.generatedSql.toLowerCase().includes(s)
    );
  }

  return NextResponse.json({ history: list });
}
