import { NextRequest, NextResponse } from "next/server";
import { calculateStudentVisaFunds, type StudentCalcInput } from "@/lib/student-calculator";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as StudentCalcInput | null;
  if (!body) return NextResponse.json({ success: false, message: "Invalid body." }, { status: 422 });
  const data = calculateStudentVisaFunds({
    course_duration: Number(body.course_duration),
    annual_tuition_fee: Number(body.annual_tuition_fee),
    partner_spouse: Number(body.partner_spouse),
    dependent_children: Number(body.dependent_children),
    school_age_children: Number(body.school_age_children),
    travel_expenses: Number(body.travel_expenses),
  });
  return NextResponse.json({ success: true, data });
}
