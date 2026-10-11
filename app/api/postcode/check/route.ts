import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { text } from "@/lib/parse";
import { hitRateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const input = (request.nextUrl.searchParams.get("search") ?? "").trim();
  if (!input || input.length > 100) {
    return NextResponse.json([]);
  }
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!hitRateLimit(`postcode:${ip}`, 30, 60 * 60 * 1000)) {
    return NextResponse.json({ message: "Too many checks." }, { status: 429 });
  }

  const suburbs = /^\d+$/.test(input)
    ? await query<Record<string, unknown>>(`SELECT suburb, postcode, state FROM suburbs WHERE postcode = ?`, [Number(input)])
    : await query<Record<string, unknown>>(
        `SELECT suburb, postcode, state FROM suburbs WHERE suburb LIKE ? LIMIT 50`,
        [`%${input.replace(/[%_]/g, "")}%`],
      );

  const payload = [];
  for (const suburb of suburbs) {
    const postcode = Number(suburb.postcode);
    const ranges = await query<Record<string, unknown>>(
      `SELECT category FROM postcode_ranges WHERE start_postcode <= ? AND end_postcode >= ? ORDER BY start_postcode LIMIT 1`,
      [postcode, postcode],
    );
    const category = ranges[0] ? text(ranges[0].category) : "Category 1, Not Regional – Major Cities";
    payload.push({
      suburb: text(suburb.suburb),
      postcode: String(postcode),
      state: text(suburb.state),
      category,
      regional: category.includes("Category 2") || category.includes("Category 3"),
    });
  }
  return NextResponse.json(payload);
}
