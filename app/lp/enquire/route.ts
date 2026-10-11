import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { appendLpEnquiry } from "@/lib/google-sheets";

const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const name = String(form.get("name") || "").trim();
  const phone = String(form.get("phone") || "").trim();
  if (!name || !phone) {
    return NextResponse.json({ success: false }, { status: 422 });
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
