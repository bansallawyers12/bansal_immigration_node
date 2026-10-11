import { NextResponse } from "next/server";
import { prPointCalculatorLists } from "@/lib/pr-calculator";

export async function GET() {
  return NextResponse.json({ success: true, data: prPointCalculatorLists });
}
