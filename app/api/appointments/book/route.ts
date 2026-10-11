import { randomBytes } from "node:crypto";
import type { PoolConnection } from "mysql2/promise";
import { NextRequest, NextResponse } from "next/server";
import { withTransaction } from "@/lib/db";
import { sendZoho } from "@/lib/mail";
import { availableSlots, isEnquiryType, lanesMatch, MEETING_TYPES } from "@/lib/slots";
import { text } from "@/lib/parse";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as Record<string, string> | null;
  const location = body?.location || "";
  const enquiryType = body?.enquiry_type || "";
  const meetingType = body?.meeting_type || "";
  const fullName = (body?.full_name || "").trim();
  const email = (body?.email || "").trim();
  const phone = (body?.phone || "").trim();
  const date = body?.appointment_date || "";
  const time = body?.appointment_time || "";
  if (
    !fullName ||
    !email.includes("@") ||
    !phone ||
    (location !== "melbourne" && location !== "adelaide") ||
    !isEnquiryType(enquiryType) ||
    !(MEETING_TYPES as readonly string[]).includes(meetingType) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    !/^\d{2}:\d{2}$/.test(time)
  ) {
    return NextResponse.json({ success: false, message: "Please complete the booking form." }, { status: 422 });
  }

  const slots = await availableSlots({ location, enquiryType, date });
  if (!slots.includes(time)) {
    return NextResponse.json({ success: false, message: "That time is no longer available." }, { status: 409 });
  }

  const token = randomBytes(16).toString("hex");

  try {
    await withTransaction(async (connection) => {
      const taken = await slotTaken(connection, location, enquiryType, date, time);
      if (taken) throw new BookingConflict();
      await connection.execute(
        `INSERT INTO enhanced_appointments
          (full_name, email, phone, location, meeting_type, enquiry_type, enquiry_details,
           appointment_date, appointment_time, appointment_datetime, status, confirmation_token, is_paid, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, 0, NOW(), NOW())`,
        [
          fullName,
          email,
          phone,
          location,
          meetingType,
          enquiryType,
          (body?.enquiry_details || "").trim(),
          date,
          `${time}:00`,
          `${date} ${time}:00`,
          token,
        ],
      );
    });
  } catch (error) {
    if (error instanceof BookingConflict) {
      return NextResponse.json({ success: false, message: "That time is no longer available." }, { status: 409 });
    }
    throw error;
  }

  try {
    await sendZoho({
      to: email,
      subject: "Your Bansal Immigration consultation",
      text: `Your consultation is booked for ${date} at ${time} (${location}).`,
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
        body: JSON.stringify({
          event: "booked",
          token,
          full_name: fullName,
          email,
          phone,
          location,
          meeting_type: meetingType,
          enquiry_type: enquiryType,
          appointment_date: date,
          appointment_time: time,
        }),
      });
    } catch {
      // CRM polling remains the backup.
    }
  }

  return NextResponse.json({ success: true });
}

class BookingConflict extends Error {}

async function slotTaken(
  connection: PoolConnection,
  location: string,
  enquiryType: string,
  date: string,
  time: string,
): Promise<boolean> {
  const [rows] = await connection.query(
    `SELECT enquiry_type, appointment_time FROM enhanced_appointments
     WHERE appointment_date = ? AND location = ? AND status <> 'cancelled' FOR UPDATE`,
    [date, location],
  );
  const existing = rows as Record<string, unknown>[];
  return existing.some((row) => {
    const bookedTime = text(row.appointment_time).slice(0, 5);
    return bookedTime === time && lanesMatch(location, text(row.enquiry_type), enquiryType);
  });
}
