import { NextResponse } from "next/server";
import { occupationFinderMinimalItem } from "@/lib/anzsco-presenter";
import { query } from "@/lib/db";

export async function GET() {
  const rows = await query<Record<string, unknown>>(
    `SELECT * FROM anzsco_occupations WHERE is_active = 1 ORDER BY occupation_title, anzsco_code`,
  );
  const data = rows.map((row, index) => ({
    occupation_id: index + 1,
    ...occupationFinderMinimalItem(row),
  }));
  return NextResponse.json({ success: true, data, count: data.length });
}
