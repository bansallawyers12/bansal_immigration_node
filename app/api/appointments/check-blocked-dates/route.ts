import { NextRequest, NextResponse } from "next/server";
import { checkBlockedDates } from "@/lib/blocked-dates";
import { hitRateLimit } from "@/lib/rate-limit";
import { isEnquiryType } from "@/lib/slots";

export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!hitRateLimit(`appt-dates:${ip}`, 60, 60_000)) {
    return NextResponse.json({ success: false, message: "Too many requests." }, { status: 429 });
  }
  const sp = request.nextUrl.searchParams;
  const startDate = sp.get("start_date") || "";
  const endDate = sp.get("end_date") || "";
  const enquiryType = sp.get("enquiry_type") || "";
  const location = sp.get("location") || "melbourne";
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(startDate) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(endDate) ||
    startDate >= endDate ||
    (location !== "melbourne" && location !== "adelaide") ||
    !isEnquiryType(enquiryType)
  ) {
    return NextResponse.json({ success: false, errors: { dates: "Invalid parameters." } }, { status: 422 });
  }
  const blocked = await checkBlockedDates({ startDate, endDate, location, enquiryType });
  return NextResponse.json({ success: true, blocked_dates: blocked });
}
