import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { requireCrmAuth } from "@/lib/crm-auth";
import { query } from "@/lib/db";
import { text } from "@/lib/parse";

type Params = { params: Promise<{ reference: string; document: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  const denied = await requireCrmAuth(request);
  if (denied) return denied;
  const { reference, document } = await params;
  if (!/^[a-f0-9]{12}$/i.test(reference)) {
    return NextResponse.json({ message: "Not found." }, { status: 404 });
  }
  const rows = await query<Record<string, unknown>>(
    `SELECT primary_id_path, secondary_id_path FROM afp_applications WHERE reference = ? LIMIT 1`,
    [reference],
  );
  const row = rows[0];
  if (!row) return NextResponse.json({ message: "Not found." }, { status: 404 });
  const column = document === "primary" ? "primary_id_path" : document === "secondary" ? "secondary_id_path" : null;
  if (!column) return NextResponse.json({ message: "Not found." }, { status: 404 });
  const relative = text(row[column]);
  if (!relative.startsWith("storage/afp/")) {
    return NextResponse.json({ message: "Not found." }, { status: 404 });
  }
  const absolute = path.join(/* turbopackIgnore: true */ process.cwd(), "storage", "afp", reference, path.basename(relative));
  const file = await readFile(absolute);
  return new NextResponse(file, {
    headers: {
      "content-type": "application/octet-stream",
      "content-disposition": `attachment; filename="${path.basename(absolute)}"`,
    },
  });
}
