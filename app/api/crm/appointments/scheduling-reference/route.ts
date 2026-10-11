import { NextRequest, NextResponse } from "next/server";
import { requireCrmAuth } from "@/lib/crm-auth";
import { crmSchedulingReference } from "@/lib/scheduling-reference";

export async function GET(request: NextRequest) {
  const denied = await requireCrmAuth(request);
  if (denied) return denied;
  return NextResponse.json({ success: true, ...crmSchedulingReference() });
}
