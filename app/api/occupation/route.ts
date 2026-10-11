import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { text } from "@/lib/parse";
import { hitRateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const q = (request.nextUrl.searchParams.get("q") ?? "").trim();
  if (q.length < 2) {
    return NextResponse.json({ results: [], message: "Enter at least 2 characters." });
  }
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!hitRateLimit(`occupation:${ip}`, 60, 60_000)) {
    return NextResponse.json({ message: "Too many searches." }, { status: 429 });
  }
  const like = `%${q.replace(/[%_]/g, "")}%`;
  const rows = await query<Record<string, unknown>>(
    `SELECT anzsco_code, occupation_title, assessing_authority, list_label
     FROM anzsco_occupations
     WHERE is_active = 1 AND (occupation_title LIKE ? OR anzsco_code LIKE ?)
     ORDER BY occupation_title ASC
     LIMIT 25`,
    [like, like],
  );
  return NextResponse.json({
    results: rows.map((row) => ({
      anzsco_code: text(row.anzsco_code),
      occupation_title: text(row.occupation_title),
      assessing_authority: row.assessing_authority == null ? null : text(row.assessing_authority),
      list_label: row.list_label == null ? null : text(row.list_label),
    })),
  });
}
