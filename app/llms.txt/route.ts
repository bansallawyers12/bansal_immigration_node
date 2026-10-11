import { canonicalUrl } from "@/lib/site";

export function GET() {
  const env = process.env.APP_ENV || process.env.NODE_ENV;
  if (env === "staging" || env === "local" || env === "development") {
    return new Response("User-agent: *\nDisallow: /\n", { headers: { "content-type": "text/plain" } });
  }
  const host = process.env.NEXT_PUBLIC_SITE_URL || "";
  const local = host.includes("localhost") || host.includes("127.0.0.1");
  const body = `User-agent: *
Disallow: /admin/
Disallow: /admin-login
Disallow: /dashboard
Disallow: /api/
Disallow: /landing
Disallow: /design/
${local ? "" : `Sitemap: ${canonicalUrl("/sitemap.xml")}\n`}`;
  return new Response(body, { headers: { "content-type": "text/plain" } });
}
