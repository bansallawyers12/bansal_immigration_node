import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { hitRateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!hitRateLimit(`crm:${ip}`, 60, 60_000)) {
    return NextResponse.json({ message: "Too many requests." }, { status: 429 });
  }
  const header = request.headers.get("authorization") || "";
  const raw = header.replace(/^Bearer\s+/i, "");
  const plain = raw.includes("|") ? raw.slice(raw.indexOf("|") + 1) : raw;
  if (!plain) return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
  const hash = createHash("sha256").update(plain).digest("hex");
  const tokens = await query<Record<string, unknown>>(
    `SELECT id FROM personal_access_tokens WHERE token = ? LIMIT 1`,
    [hash],
  );
  if (!tokens[0]) return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });

  const rows = await query(
    `SELECT id, full_name, email, phone, location, enquiry_type, appointment_date, appointment_time, status, created_at
     FROM enhanced_appointments ORDER BY id DESC LIMIT 20`,
  );
  return NextResponse.json({ data: rows });
}
