import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  if (request.method === "POST" && request.nextUrl.pathname === "/contact") {
    return NextResponse.rewrite(new URL("/api/contact", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/contact"],
};
