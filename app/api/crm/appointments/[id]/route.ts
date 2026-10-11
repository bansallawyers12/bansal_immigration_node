import { NextRequest, NextResponse } from "next/server";
import { requireCrmAuth } from "@/lib/crm-auth";
import { formatAppointmentForCrm, loadAppointmentForCrm } from "@/lib/crm-appointment";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  const denied = await requireCrmAuth(request);
  if (denied) return denied;
  const id = Number((await params).id);
  const row = await loadAppointmentForCrm(id);
  if (!row) return NextResponse.json({ success: false, message: "Appointment not found" }, { status: 404 });
  return NextResponse.json({ success: true, data: formatAppointmentForCrm(row) });
}
