import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { text } from "@/lib/parse";
import { hitRateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const q = (request.nextUrl.searchParams.get("q") ?? "").trim();
  if (q.length < 2) return NextResponse.json([]);
  if (q.length > 100) {
    return NextResponse.json({ message: "Search query is too long." }, { status: 422 });
  }
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!hitRateLimit(`postcode-suggest:${ip}`, 120, 60 * 60 * 1000)) {
    return NextResponse.json({ message: "Too many requests." }, { status: 429 });
  }
  const safe = q.replace(/[%_]/g, "");
  const rows = /^\d+$/.test(q)
    ? await query<Record<string, unknown>>(
        `SELECT suburb, postcode, state FROM suburbs WHERE postcode LIKE ? ORDER BY postcode, suburb LIMIT 10`,
        [`${safe}%`],
      )
    : await query<Record<string, unknown>>(
        `SELECT suburb, postcode, state FROM suburbs WHERE suburb LIKE ? ORDER BY suburb, postcode LIMIT 10`,
        [`${safe}%`],
      );
  return NextResponse.json(
    rows.map((row) => ({
      suburb: text(row.suburb),
      postcode: String(row.postcode),
      state: text(row.state),
    })),
  );
}
