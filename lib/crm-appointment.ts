import { query } from "@/lib/db";
import { text } from "@/lib/parse";

const ENQUIRY_LABELS: Record<string, string> = {
  tr: "TR (TR and JRP)",
  tourist: "Tourist Visa",
  education: "Education",
  kunal: "Kunal (PR / GSM / EOI)",
  ajay: "Ajay (complex / cancellations / refusals)",
  arun: "Arun",
  pr_complex: "Employer Sponsored",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  paid: "Paid",
  completed: "Completed",
  cancelled: "Cancelled",
  no_show: "No Show",
};

export type AppointmentRow = Record<string, unknown>;

export async function loadAppointmentForCrm(id: number): Promise<AppointmentRow | null> {
  const rows = await query<AppointmentRow>(
    `SELECT a.*,
            u.id AS admin_id, u.name AS admin_name, u.email AS admin_email,
            p.id AS payment_id, p.status AS payment_status, p.amount AS payment_amount,
            p.payment_method, p.paid_at AS payment_paid_at
     FROM enhanced_appointments a
     LEFT JOIN users u ON u.id = a.assigned_to
     LEFT JOIN payments p ON p.appointment_id = a.id
     WHERE a.id = ?
     LIMIT 1`,
    [id],
  );
  return rows[0] ?? null;
}

export function formatAppointmentForCrm(row: AppointmentRow) {
  const enquiry = text(row.enquiry_type);
  const status = text(row.status);
  const date = text(row.appointment_date).slice(0, 10);
  const time = text(row.appointment_time).slice(0, 5);
  const datetime = row.appointment_datetime ? new Date(String(row.appointment_datetime)).toISOString() : null;

  return {
    id: Number(row.id),
    full_name: text(row.full_name),
    email: text(row.email),
    phone: text(row.phone),
    location: text(row.location),
    meeting_type: text(row.meeting_type),
    preferred_language: row.preferred_language == null ? null : text(row.preferred_language),
    enquiry_type: enquiry,
    enquiry_type_display: ENQUIRY_LABELS[enquiry] ?? enquiry,
    service_type: row.service_type == null ? null : text(row.service_type),
    specific_service: row.specific_service == null ? null : text(row.specific_service),
    enquiry_details: row.enquiry_details == null ? null : text(row.enquiry_details),
    appointment_date: date,
    appointment_time: time,
    appointment_datetime: datetime,
    duration_minutes: row.duration_minutes == null ? null : Number(row.duration_minutes),
    status,
    status_display: STATUS_LABELS[status] ?? status,
    is_paid: Boolean(row.is_paid),
    amount: row.amount == null ? null : Number(row.amount),
    discount_amount: row.discount_amount == null ? null : Number(row.discount_amount),
    final_amount: row.final_amount == null ? null : Number(row.final_amount),
    promo_code: row.promo_code == null ? null : text(row.promo_code),
    assigned_admin: row.admin_id
      ? { id: Number(row.admin_id), name: text(row.admin_name), email: text(row.admin_email) }
      : null,
    payment: row.payment_id
      ? {
          id: Number(row.payment_id),
          status: text(row.payment_status),
          amount: row.payment_amount == null ? null : Number(row.payment_amount),
          payment_method: row.payment_method == null ? null : text(row.payment_method),
          paid_at: row.payment_paid_at ? new Date(String(row.payment_paid_at)).toISOString() : null,
        }
      : null,
    admin_notes: row.admin_notes == null ? null : text(row.admin_notes),
    client_notes: row.client_notes == null ? null : text(row.client_notes),
    confirmed_at: row.confirmed_at ? new Date(String(row.confirmed_at)).toISOString() : null,
    cancelled_at: row.cancelled_at ? new Date(String(row.cancelled_at)).toISOString() : null,
    cancellation_reason: row.cancellation_reason == null ? null : text(row.cancellation_reason),
    created_at: row.created_at ? new Date(String(row.created_at)).toISOString() : null,
    updated_at: row.updated_at ? new Date(String(row.updated_at)).toISOString() : null,
  };
}

export async function listAppointmentsForCrm(filters: {
  start_date?: string;
  end_date?: string;
  status?: string;
  location?: string;
  enquiry_type?: string;
  created_after?: string;
  updated_after?: string;
  page: number;
  perPage: number;
}) {
  const where: string[] = [];
  const params: unknown[] = [];
  if (filters.start_date && filters.end_date) {
    where.push("a.appointment_date BETWEEN ? AND ?");
    params.push(filters.start_date, filters.end_date);
  }
  if (filters.status) {
    where.push("a.status = ?");
    params.push(filters.status);
  }
  if (filters.location) {
    where.push("a.location = ?");
    params.push(filters.location);
  }
  if (filters.enquiry_type) {
    where.push("a.enquiry_type = ?");
    params.push(filters.enquiry_type);
  }
  if (filters.created_after) {
    where.push("a.created_at >= ?");
    params.push(filters.created_after);
  }
  if (filters.updated_after) {
    where.push("a.updated_at >= ?");
    params.push(filters.updated_after);
  }
  const clause = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const countRows = await query<{ total: number }>(
    `SELECT COUNT(*) AS total FROM enhanced_appointments a ${clause}`,
    params,
  );
  const total = Number(countRows[0]?.total ?? 0);
  const offset = (filters.page - 1) * filters.perPage;
  const rows = await query<AppointmentRow>(
    `SELECT a.*,
            u.id AS admin_id, u.name AS admin_name, u.email AS admin_email,
            p.id AS payment_id, p.status AS payment_status, p.amount AS payment_amount,
            p.payment_method, p.paid_at AS payment_paid_at
     FROM enhanced_appointments a
     LEFT JOIN users u ON u.id = a.assigned_to
     LEFT JOIN payments p ON p.appointment_id = a.id
     ${clause}
     ORDER BY a.created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, filters.perPage, offset],
  );
  const lastPage = Math.max(1, Math.ceil(total / filters.perPage));
  return {
    data: rows.map(formatAppointmentForCrm),
    pagination: {
      total,
      per_page: filters.perPage,
      current_page: filters.page,
      last_page: lastPage,
      from: total ? offset + 1 : 0,
      to: Math.min(offset + filters.perPage, total),
    },
  };
}
