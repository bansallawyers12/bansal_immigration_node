import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { appendLpEnquiry } from "@/lib/google-sheets";
import { requestHost, verifyTurnstile } from "@/lib/turnstile";

const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const name = String(form.get("name") || "").trim();
  const phone = String(form.get("phone") || "").trim();
  if (!name || !phone) {
    return NextResponse.json({ success: false, message: "Name and phone are required." }, { status: 422 });
  }
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const host = requestHost(request.headers.get("host"), request.headers.get("x-forwarded-host"));
  const turnstileError = await verifyTurnstile(String(form.get("cf-turnstile-response") || ""), ip, host);
  if (turnstileError) {
    return NextResponse.json({ success: false, message: turnstileError }, { status: 422 });
  }
  const data: Record<string, string> = {
    name,
    email: String(form.get("email") || "").trim(),
    phone,
    interest: String(form.get("interest") || "").trim(),
    message: String(form.get("message") || "").trim(),
  };
  const jar = await cookies();
  for (const key of utmKeys) {
    const value = jar.get(key)?.value;
    if (value) data[key] = value;
  }
  try {
    await appendLpEnquiry(data);
  } catch {
    // Sheet append is optional when credentials are missing.
  }
  const response = NextResponse.redirect(new URL("/lp-thankyou", request.url));
  response.cookies.set("lp_thankyou_name", name, { httpOnly: true, maxAge: 300, path: "/" });
  return response;
}
