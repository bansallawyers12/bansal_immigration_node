import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { sendZoho } from "@/lib/mail";
import { hitRateLimit } from "@/lib/rate-limit";
import { site } from "@/lib/site";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!hitRateLimit(`afp:${ip}`, 5, 60_000)) {
    return NextResponse.json({ success: false, message: "Too many applications." }, { status: 429 });
  }
  const form = await request.formData();
  const primary = form.get("primary_id");
  const secondary = form.get("secondary_id");
  const birthPlace = text(form.get("birth_place"));
  const citizenship = text(form.get("citizenship"));
  const address = text(form.get("address_history"));
  if (!(primary instanceof File) || !(secondary instanceof File) || !birthPlace || !citizenship || !address) {
    return NextResponse.json(
      { success: false, message: "Complete the identity, address, and both document fields." },
      { status: 422 },
    );
  }
  const reference = randomBytes(6).toString("hex");
  const primaryPath = await storeFile(reference, "primary", primary);
  const secondaryPath = await storeFile(reference, "secondary", secondary);
  await query(
    `INSERT INTO afp_applications
      (reference, purpose, email, phone, first_names, family_name, date_of_birth, birth_place, citizenship,
       address_history, primary_id_path, secondary_id_path, status, ip_address, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'submitted', ?, NOW(), NOW())`,
    [
      reference,
      text(form.get("purpose")) || "visa-citizenship",
      text(form.get("email")),
      text(form.get("phone")),
      text(form.get("first_names")),
      text(form.get("family_name")),
      text(form.get("date_of_birth")),
      birthPlace,
      citizenship,
      JSON.stringify([{ address }]),
      primaryPath,
      secondaryPath,
      ip,
    ],
  );
  try {
    await sendZoho({
      to: site.email,
      subject: `New AFP application ${reference}`,
      text: `Reference: ${reference}\nApplicant: ${text(form.get("first_names"))} ${text(form.get("family_name"))}\nEmail: ${text(form.get("email"))}`,
    });
  } catch {
    // Notification failure must not undo the saved application.
  }

  return NextResponse.json({ success: true, message: "Application saved. Staff will review it." });
}

async function storeFile(reference: string, role: string, file: File): Promise<string> {
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80) || "document";
  const relative = path.posix.join("storage", "afp", reference, `${role}-${safe}`);
  const absolute = path.join(process.cwd(), "storage", "afp", reference, `${role}-${safe}`);
  await mkdir(path.dirname(absolute), { recursive: true });
  await writeFile(absolute, Buffer.from(await file.arrayBuffer()));
  return relative;
}

function text(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}
