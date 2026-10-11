import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { text } from "@/lib/parse";

export async function GET(request: NextRequest) {
  const q = (request.nextUrl.searchParams.get("q") || "").trim();
  const limit = Math.min(50, Math.max(1, Number(request.nextUrl.searchParams.get("limit") || 20)));
  if (q.length < 2) {
    return NextResponse.json({
      success: false,
      message: "Search query must be at least 2 characters. You can search by postcode or suburb name.",
      data: [],
      count: 0,
    }, { status: 400 });
  }
  const rows = /^\d+$/.test(q)
    ? await query<Record<string, unknown>>(
        `SELECT suburb, postcode, state FROM suburbs WHERE postcode LIKE ? ORDER BY postcode, suburb LIMIT ?`,
        [`${q}%`, limit],
      )
    : await query<Record<string, unknown>>(
        `SELECT suburb, postcode, state FROM suburbs WHERE suburb LIKE ? ORDER BY suburb, postcode LIMIT ?`,
        [`%${q}%`, limit],
      );
  const data = rows.map((row) => ({
    suburb: text(row.suburb),
    postcode: text(row.postcode),
    state: text(row.state),
  }));
  return NextResponse.json({ success: true, data, count: data.length, search_query: q });
}
