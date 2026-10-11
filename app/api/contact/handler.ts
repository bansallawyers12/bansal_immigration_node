import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { sendGmail } from "@/lib/mail";
import { hitRateLimit } from "@/lib/rate-limit";
import { site } from "@/lib/site";
import { requestHost, verifyTurnstile } from "@/lib/turnstile";

const countryCodes = new Set([
  "+61", "+1", "+44", "+91", "+86", "+81", "+82", "+65", "+60", "+66", "+63", "+64",
  "+49", "+33", "+39", "+34", "+7", "+55", "+52", "+27",
]);

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!hitRateLimit(`contact:${ip}`, 30, 60_000)) {
    return NextResponse.json({ success: false, message: "Too many submissions. Please wait a minute." }, { status: 429 });
  }

  const body = (await request.json().catch(() => null)) as Record<string, string> | null;
  if (!body) return NextResponse.json({ success: false, message: "Invalid submission." }, { status: 422 });

  const name = oneLine(body.name);
  const email = (body.email || "").trim().toLowerCase();
  const phone = oneLine(body.phone);
  const subject = oneLine(body.subject);
  const message = (body.message || "").replace(/<[^>]*>/g, "").trim();
  const country = body.country_code || "";
  const errors: Record<string, string> = {};
  if (!name) errors.name = "Name is required.";
  if (!email || !email.includes("@")) errors.email = "The email must be a valid email address.";
  if (!phone) errors.phone = "Phone number is required.";
  if (country === "+61" && !/^[0-9]{9}$/.test(phone)) errors.phone = "Please enter a valid 9-digit Australian phone number.";
  if (country && !countryCodes.has(country)) errors.country_code = "Invalid country code.";
  if (!subject) errors.subject = "Subject is required.";
  if (!message) errors.message = "Message is required.";
  if (Object.keys(errors).length) {
    return NextResponse.json({ success: false, errors }, { status: 422 });
  }

  const host = requestHost(request.headers.get("host"), request.headers.get("x-forwarded-host"));
  const turnstileError = await verifyTurnstile(body["cf-turnstile-response"], ip, host);
  if (turnstileError) {
    return NextResponse.json({ success: false, message: turnstileError }, { status: 422 });
  }

  const storedPhone = country ? `${country}${phone}` : phone;
  await query(
    `INSERT INTO contacts (name, contact_email, contact_phone, subject, message, status, form_source, ip_address, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, 'unread', ?, ?, NOW(), NOW())`,
    [name, email, storedPhone, subject, message, body.form_source || "contact", ip],
  );

  let mailed = false;
  try {
    mailed = await sendGmail({
      to: site.email,
      subject: `Website enquiry: ${subject}`,
      text: `${name}\n${email}\n${storedPhone}\n\n${message}`,
    });
  } catch {
    mailed = false;
  }

  if (!mailed) {
    return NextResponse.json(
      { success: false, message: "Your enquiry was saved, but the notification email could not be sent." },
      { status: 502 },
    );
  }

  return NextResponse.json({ success: true, message: "Thank you! Your message has been sent successfully." });
}

function oneLine(value: string | undefined): string {
  return (value || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim().slice(0, 255);
}
