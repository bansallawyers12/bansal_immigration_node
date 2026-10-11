import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { hitRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!hitRateLimit(`newsletter:${ip}`, 10, 60_000)) {
    return NextResponse.json({ success: false, message: "Too many requests." }, { status: 429 });
  }
  const body = (await request.json().catch(() => null)) as { email?: string } | null;
  const email = (body?.email || "").trim().toLowerCase();
  if (!email.includes("@") || email.length > 255) {
    return NextResponse.json({ success: false, message: "Enter a valid email." }, { status: 422 });
  }
  await query(
    `INSERT INTO newsletter_subscriptions (email, created_at, updated_at) VALUES (?, NOW(), NOW())`,
    [email],
  );
  return NextResponse.json({ success: true, message: "You are subscribed." });
}
