import { NextRequest, NextResponse } from "next/server";
import { availableSlots } from "@/lib/slots";

export async function GET(request: NextRequest) {
  const location = request.nextUrl.searchParams.get("location") || "";
  const enquiryType = request.nextUrl.searchParams.get("enquiryType") || "";
  const date = request.nextUrl.searchParams.get("date") || "";
  if (!location || !enquiryType || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ slots: [] });
  }
  const slots = await availableSlots({ location, enquiryType, date });
  return NextResponse.json({ slots });
}
