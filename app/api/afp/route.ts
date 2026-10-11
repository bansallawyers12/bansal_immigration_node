import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { hitRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!hitRateLimit(`afp:${ip}`, 5, 60_000)) {
    return NextResponse.json({ success: false, message: "Too many applications." }, { status: 429 });
  }
  const form = await request.formData();
  const file = form.get("primary_id");
  if (!(file instanceof File)) {
    return NextResponse.json({ success: false, message: "Upload an identity document." }, { status: 422 });
  }
  const reference = randomBytes(6).toString("hex");
  const folder = path.join(process.cwd(), "storage", "afp", reference);
  await mkdir(folder, { recursive: true });
  const stored = path.join(folder, file.name.replace(/[^a-zA-Z0-9._-]/g, "_"));
  await writeFile(stored, Buffer.from(await file.arrayBuffer()));
  await query(
    `INSERT INTO afp_applications
      (reference, purpose, email, phone, first_names, family_name, date_of_birth, primary_id_path, status, ip_address, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'submitted', ?, NOW(), NOW())`,
    [
      reference,
      String(form.get("purpose") || ""),
      String(form.get("email") || ""),
      String(form.get("phone") || ""),
      String(form.get("first_names") || ""),
      String(form.get("family_name") || ""),
      String(form.get("date_of_birth") || ""),
      stored,
      ip,
    ],
  );
  return NextResponse.json({ success: true, message: "Application saved. Staff will review it." });
}
