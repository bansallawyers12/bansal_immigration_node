import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as Record<string, string> | null;
  if (!body?.first_name || !body.last_name || !body.email || !body.phone) {
    return NextResponse.json({ success: false, message: "Name, email, and phone are required." }, { status: 422 });
  }
  await query(
    `INSERT INTO office_visit_forms (first_name, last_name, email, phone, created_at, updated_at)
     VALUES (?, ?, ?, ?, NOW(), NOW())`,
    [body.first_name, body.last_name, body.email, body.phone],
  );
  return NextResponse.json({ success: true });
}
