import { NextRequest, NextResponse } from "next/server";
import { occupationFinderMinimalItem } from "@/lib/anzsco-presenter";
import { query } from "@/lib/db";

export async function GET(request: NextRequest) {
  const q = (request.nextUrl.searchParams.get("q") || "").trim();
  const limit = Math.min(50, Math.max(1, Number(request.nextUrl.searchParams.get("limit") || 20)));
  const page = Math.max(1, Number(request.nextUrl.searchParams.get("page") || 1));
  if (q.length < 2) {
    return NextResponse.json({
      success: false,
      message: "Search query must be at least 2 characters. You can search by occupation name or ANZSCO code.",
      data: [],
      count: 0,
    }, { status: 400 });
  }
  const like = `%${q.replace(/[%_]/g, "")}%`;
  const countRows = await query<{ total: number }>(
    `SELECT COUNT(*) AS total FROM anzsco_occupations WHERE is_active = 1 AND (occupation_title LIKE ? OR anzsco_code LIKE ?)`,
    [like, like],
  );
  const total = Number(countRows[0]?.total ?? 0);
  const lastPage = total ? Math.ceil(total / limit) : 1;
  const offset = (page - 1) * limit;
  const rows = await query<Record<string, unknown>>(
    `SELECT * FROM anzsco_occupations WHERE is_active = 1 AND (occupation_title LIKE ? OR anzsco_code LIKE ?)
     ORDER BY occupation_title LIMIT ? OFFSET ?`,
    [like, like, limit, offset],
  );
  const data = rows.map(occupationFinderMinimalItem);
  return NextResponse.json({
    success: true,
    data,
    count: data.length,
    total,
    page,
    per_page: limit,
    last_page: lastPage,
    search_query: q,
  });
}
