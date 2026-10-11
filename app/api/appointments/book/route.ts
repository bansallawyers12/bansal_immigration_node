import { randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { sendZoho } from "@/lib/mail";
import { availableSlots } from "@/lib/slots";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as Record<string, string> | null;
  if (!body?.full_name || !body.email || !body.appointment_date || !body.appointment_time || !body.location) {
    return NextResponse.json({ success: false, message: "Please complete the booking form." }, { status: 422 });
  }

  const slots = await availableSlots({
    location: body.location,
    enquiryType: body.enquiry_type || "migration",
    date: body.appointment_date,
  });
  if (!slots.includes(body.appointment_time)) {
    return NextResponse.json({ success: false, message: "That time is no longer available." }, { status: 409 });
  }

  const token = randomBytes(16).toString("hex");
  await query(
    `INSERT INTO enhanced_appointments
      (full_name, email, phone, location, enquiry_type, enquiry_details, appointment_date, appointment_time,
       appointment_datetime, status, confirmation_token, is_paid, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, 0, NOW(), NOW())`,
    [
      body.full_name,
      body.email,
      body.phone || null,
      body.location,
      body.enquiry_type || "migration",
      body.enquiry_details || null,
      body.appointment_date,
      body.appointment_time,
      `${body.appointment_date} ${body.appointment_time}:00`,
      token,
    ],
  );

  try {
    await sendZoho({
      to: body.email,
      subject: "Your Bansal Immigration consultation",
      text: `Your consultation is booked for ${body.appointment_date} at ${body.appointment_time} (${body.location}).`,
    });
  } catch {
    // A mail failure must not undo the booking.
  }

  if (process.env.MIGRATION_CRM_WEBHOOK_URL && process.env.MIGRATION_CRM_WEBHOOK_TOKEN) {
    try {
      await fetch(process.env.MIGRATION_CRM_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${process.env.MIGRATION_CRM_WEBHOOK_TOKEN}`,
        },
        body: JSON.stringify({ event: "booked", token, ...body }),
      });
    } catch {
      // CRM polling remains the backup.
    }
  }

  return NextResponse.json({ success: true });
}
