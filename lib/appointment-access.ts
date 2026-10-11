import { createHmac, timingSafeEqual } from "node:crypto";
import { text } from "@/lib/parse";

type ActionRequest = { nextUrl: { searchParams: URLSearchParams }; url?: string };

export function appointmentActionVersion(row: Record<string, unknown>): number {
  return Math.max(1, Number(row.email_action_version) || 1);
}

export function versionMatches(request: ActionRequest, row: Record<string, unknown>): boolean {
  const v = Number(request.nextUrl.searchParams.get("v") || 1);
  return v === appointmentActionVersion(row);
}

/** Laravel temporary signed URL (APP_KEY from Laravel .env). */
export function hasValidLaravelSignature(request: ActionRequest): boolean {
  const appKey = process.env.APP_KEY;
  if (!appKey) return false;
  const signature = request.nextUrl.searchParams.get("signature");
  const expires = request.nextUrl.searchParams.get("expires");
  if (!signature || !expires) return false;
  if (Number(expires) < Math.floor(Date.now() / 1000)) return false;
  if (!request.url) return false;

  const url = new URL(request.url);
  url.searchParams.delete("signature");
  const original = url.toString();
  const key = appKey.startsWith("base64:") ? Buffer.from(appKey.slice(7), "base64") : Buffer.from(appKey);
  const expected = createHmac("sha256", key).update(original).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

export function canAccessAppointmentAction(request: ActionRequest, row: Record<string, unknown>): boolean {
  if (hasValidLaravelSignature(request) && versionMatches(request, row)) return true;
  const token = request.nextUrl.searchParams.get("token");
  return Boolean(token && token === text(row.confirmation_token) && versionMatches(request, row));
}
