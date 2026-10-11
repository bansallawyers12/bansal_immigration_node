import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { text } from "@/lib/parse";

export async function GET(request: NextRequest) {
  const postcode = Number(request.nextUrl.searchParams.get("postcode"));
  const suburbName = (request.nextUrl.searchParams.get("suburb") || "").trim();
  if (!postcode || postcode < 1000 || postcode > 9999) {
    return NextResponse.json({ success: false, message: "Invalid postcode." }, { status: 422 });
  }
  const suburbs = suburbName
    ? await query<Record<string, unknown>>(
        `SELECT suburb, postcode, state FROM suburbs WHERE postcode = ? AND suburb LIKE ?`,
        [postcode, `%${suburbName}%`],
      )
    : await query<Record<string, unknown>>(
        `SELECT suburb, postcode, state FROM suburbs WHERE postcode = ?`,
        [postcode],
      );
  if (!suburbs[0]) {
    return NextResponse.json({ success: false, message: "Postcode not found in our database.", data: null }, { status: 404 });
  }
  const ranges = await query<Record<string, unknown>>(
    `SELECT category FROM postcode_ranges WHERE start_postcode <= ? AND end_postcode >= ? ORDER BY start_postcode LIMIT 1`,
    [postcode, postcode],
  );
  const category = text(ranges[0]?.category) || "Category 1, Not Regional – Major Cities";
  const isRegional = category.includes("Category 2") || category.includes("Category 3");
  const suburb = suburbs[0];
  const result: Record<string, unknown> = {
    postcode: text(suburb.postcode),
    area: text(suburb.suburb),
    state: text(suburb.state),
    regional_status: isRegional ? "Yes - Regional area" : "No - Metropolitan area",
    category,
    is_regional: isRegional,
  };
  if (suburbs.length > 1) {
    result.other_suburbs = suburbs.slice(1).map((row) => ({
      suburb: text(row.suburb),
      postcode: text(row.postcode),
      state: text(row.state),
    }));
  }
  return NextResponse.json({ success: true, data: result });
}
