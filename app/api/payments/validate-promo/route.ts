import { NextRequest, NextResponse } from "next/server";
import { validatePromoCode } from "@/lib/promo-codes";
import { hitRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!hitRateLimit(`promo:${ip}`, 10, 60_000)) {
    return NextResponse.json({ success: false, message: "Too many attempts." }, { status: 429 });
  }
  const body = (await request.json().catch(() => null)) as { code?: string } | null;
  const result = await validatePromoCode(body?.code || "");
  if (!result.valid) return NextResponse.json({ success: false, message: result.message }, { status: 422 });
  return NextResponse.json({ success: true, ...result });
}
