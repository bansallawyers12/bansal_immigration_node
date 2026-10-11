import { NextRequest, NextResponse } from "next/server";
import { requireCrmAuth } from "@/lib/crm-auth";
import { listAppointmentsForCrm } from "@/lib/crm-appointment";

export async function GET(request: NextRequest) {
  const denied = await requireCrmAuth(request);
  if (denied) return denied;
  const sp = request.nextUrl.searchParams;
  const page = Math.max(1, Number(sp.get("page") || 1));
  const perPage = Math.min(100, Math.max(1, Number(sp.get("per_page") || 50)));
  const result = await listAppointmentsForCrm({
    start_date: sp.get("start_date") || undefined,
    end_date: sp.get("end_date") || undefined,
    status: sp.get("status") || undefined,
    location: sp.get("location") || undefined,
    enquiry_type: sp.get("enquiry_type") || undefined,
    created_after: sp.get("created_after") || undefined,
    updated_after: sp.get("updated_after") || undefined,
    page,
    perPage,
  });
  return NextResponse.json({ success: true, ...result });
}
