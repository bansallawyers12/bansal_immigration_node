import { Suspense } from "react";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { canAccessAppointmentAction } from "@/lib/appointment-access";
import { query } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

export default function ConfirmAppointmentPage({
  params,
  searchParams,
}: Params & { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return (
    <Suspense fallback={<p className="mx-auto max-w-lg px-4 py-24 text-center">Loading…</p>}>
      <ConfirmContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function ConfirmContent({
  params,
  searchParams,
}: Params & { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const id = Number((await params).id);
  const sp = await searchParams;
  const qs = new URLSearchParams(
    Object.entries(sp).flatMap(([key, value]) =>
      value === undefined ? [] : [[key, Array.isArray(value) ? value[0] : value]],
    ),
  );
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") || headerStore.get("host") || "localhost";
  const proto = headerStore.get("x-forwarded-proto") || "http";
  const requestLike = {
    nextUrl: { searchParams: qs },
    url: `${proto}://${host}/appointment/${id}/confirm?${qs.toString()}`,
  };

  const rows = await query<Record<string, unknown>>(`SELECT * FROM enhanced_appointments WHERE id = ? LIMIT 1`, [id]);
  const row = rows[0];
  if (!row) notFound();
  if (!canAccessAppointmentAction(requestLike, row)) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-sg-navy">Link expired</h1>
        <p className="mt-4 text-sg-dark-gray">This link is invalid or has expired. Please contact our office.</p>
      </div>
    );
  }

  if (sp.confirm === "1") {
    await query(
      `UPDATE enhanced_appointments
       SET status = IF(status = 'paid', 'paid', 'confirmed'),
           confirmed_at = COALESCE(confirmed_at, NOW()),
           updated_at = NOW()
       WHERE id = ? AND status NOT IN ('cancelled', 'completed', 'no_show')`,
      [id],
    );
    const next = new URLSearchParams(qs);
    next.delete("confirm");
    next.set("done", "1");
    redirect(`/appointment/${id}/confirm?${next.toString()}`);
  }

  if (sp.done === "1") {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-sg-navy">Appointment confirmed</h1>
        <p className="mt-4 text-sg-dark-gray">Thank you. We look forward to meeting you.</p>
      </div>
    );
  }

  const confirmQs = new URLSearchParams(qs);
  confirmQs.set("confirm", "1");

  return (
    <div className="mx-auto max-w-lg px-4 py-24">
      <h1 className="text-2xl font-bold text-sg-navy">Confirm appointment</h1>
      <p className="mt-4 text-sg-dark-gray">Please confirm you will attend your scheduled consultation.</p>
      <a
        href={`?${confirmQs.toString()}`}
        className="mt-8 inline-block rounded-lg bg-sg-light-blue px-6 py-3 font-semibold text-white"
      >
        Confirm attendance
      </a>
    </div>
  );
}
