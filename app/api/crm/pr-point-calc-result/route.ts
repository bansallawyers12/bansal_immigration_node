import { NextRequest, NextResponse } from "next/server";
import { calculatePrPoints, type PrPointInput } from "@/lib/pr-calculator";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as PrPointInput | null;
  if (!body) return NextResponse.json({ success: false, message: "Invalid body." }, { status: 422 });
  const data = calculatePrPoints({
    age: Number(body.age),
    english_language_proficiency: Number(body.english_language_proficiency),
    educational_qualifications: Number(body.educational_qualifications),
    skilled_employment_overseas: Number(body.skilled_employment_overseas),
    skilled_employment_australia: Number(body.skilled_employment_australia),
    additional_points: Array.isArray(body.additional_points) ? body.additional_points.map(Number) : [],
    partner_spouse_status: Number(body.partner_spouse_status),
  });
  return NextResponse.json({ success: true, data });
}
