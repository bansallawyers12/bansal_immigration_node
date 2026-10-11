import { NextRequest, NextResponse } from "next/server";
import { requireCrmAuth } from "@/lib/crm-auth";
import { formatAppointmentForCrm } from "@/lib/crm-appointment";
import { query } from "@/lib/db";

export async function GET(request: NextRequest) {
  const denied = await requireCrmAuth(request);
  if (denied) return denied;

  const minutes = Math.min(Math.max(Number(request.nextUrl.searchParams.get("minutes") || 30), 1), 1440);

  const rows = await query<Record<string, unknown>>(
    `SELECT a.*,
            u.id AS admin_id, u.name AS admin_name, u.email AS admin_email,
            p.id AS payment_id, p.status AS payment_status, p.amount AS payment_amount,
            p.payment_method, p.paid_at AS payment_paid_at
     FROM enhanced_appointments a
     LEFT JOIN users u ON u.id = a.assigned_to
     LEFT JOIN payments p ON p.appointment_id = a.id
     WHERE a.created_at >= DATE_SUB(NOW(), INTERVAL ? MINUTE)
        OR a.updated_at >= DATE_SUB(NOW(), INTERVAL ? MINUTE)
     ORDER BY a.created_at DESC`,
    [minutes, minutes],
  );

  const data = rows.map(formatAppointmentForCrm);
  return NextResponse.json({ success: true, count: data.length, data });
}
