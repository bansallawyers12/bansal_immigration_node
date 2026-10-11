import "server-only";
import { headers } from "next/headers";
import { query } from "@/lib/db";

export function requestHost(headerHost: string | null, forwardedHost: string | null): string {
  return (forwardedHost || headerHost || "").split(",")[0].trim();
}

function isLocalHost(host: string): boolean {
  const name = host.split(":")[0].replace(/^\[|\]$/g, "").toLowerCase();
  return (
    name === "localhost" ||
    name === "127.0.0.1" ||
    name === "::1" ||
    name.endsWith(".localhost") ||
    name.endsWith(".local")
  );
}

async function adminAllowsTurnstile(): Promise<boolean> {
  try {
    const rows = await query<{ meta_key: string; meta_value: string | null }>(
      `SELECT meta_key, meta_value FROM home_content WHERE meta_key IN ('turnstile_enabled', 'recaptcha_enabled')`,
    );
    const map = new Map(rows.map((row) => [row.meta_key, row.meta_value]));
    const value = map.has("turnstile_enabled") ? map.get("turnstile_enabled") : map.get("recaptcha_enabled");
    return (value ?? "1") !== "0";
  } catch {
    return true;
  }
}

export async function isTurnstileEnabled(host: string): Promise<boolean> {
  if (!process.env.TURNSTILE_SITE_KEY || !process.env.TURNSTILE_SECRET_KEY) return false;
  if (!(await adminAllowsTurnstile())) return false;
  if (isLocalHost(host) && process.env.TURNSTILE_ENABLE_ON_LOCAL !== "true") return false;
  return true;
}

export async function turnstileSiteKey(): Promise<string | null> {
  const headerList = await headers();
  const host = requestHost(headerList.get("host"), headerList.get("x-forwarded-host"));
  if (!(await isTurnstileEnabled(host))) return null;
  return process.env.TURNSTILE_SITE_KEY ?? null;
}

/** Returns an error message when verification fails, or null when the request may continue. */
export async function verifyTurnstile(token: string | undefined, ip: string, host: string): Promise<string | null> {
  if (!(await isTurnstileEnabled(host))) return null;
  if (!token?.trim()) return "Please complete the security verification.";

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET_KEY || "",
        response: token,
        remoteip: ip,
      }),
    });
    const data = (await response.json()) as { success?: boolean };
    if (!response.ok || !data.success) return "Security verification failed. Please try again.";
    return null;
  } catch {
    return "Security verification is currently unavailable. Please try again.";
  }
}
