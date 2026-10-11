import { NextRequest, NextResponse } from "next/server";
import { occupationSearchPayload } from "@/lib/anzsco-presenter";
import { query } from "@/lib/db";

export async function GET(request: NextRequest) {
  const occupationCode = (request.nextUrl.searchParams.get("occupation_code") || "").trim();
  if (!occupationCode) {
    return NextResponse.json({
      success: false,
      message: "The occupation_code parameter is required.",
      data: [],
      count: 0,
    }, { status: 400 });
  }
  const rows = await query<Record<string, unknown>>(
    `SELECT * FROM anzsco_occupations WHERE is_active = 1 AND anzsco_code = ? LIMIT 1`,
    [occupationCode],
  );
  const data = rows[0] ? [occupationSearchPayload(rows[0])] : [];
  return NextResponse.json({
    success: true,
    data,
    count: data.length,
    search_query: occupationCode,
  });
}
