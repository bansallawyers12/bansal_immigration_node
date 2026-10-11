import { NextResponse } from "next/server";
import { studentCalculatorLists } from "@/lib/student-calculator";

export async function GET() {
  return NextResponse.json({ success: true, data: studentCalculatorLists() });
}
