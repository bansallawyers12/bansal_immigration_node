import { canonicalUrl } from "@/lib/site";

export function GET() {
  const env = process.env.APP_ENV || process.env.NODE_ENV;
  if (env === "staging" || env === "development") {
    return new Response("User-agent: *\nDisallow: /\n", { headers: { "content-type": "text/plain" } });
  }
  const lines = [
    "User-agent: *",
    "Disallow: /admin/",
    "Disallow: /admin-login",
    "Disallow: /dashboard",
    "Disallow: /api/",
    "Disallow: /landing",
    "Disallow: /design/",
    "Allow: /",
  ];
  const host = process.env.NEXT_PUBLIC_SITE_URL || "";
  const local = host.includes("localhost") || host.includes("127.0.0.1");
  if (!local && env === "production") {
    lines.push(`Sitemap: ${canonicalUrl("/sitemap.xml")}`);
  }
  return new Response(`${lines.join("\n")}\n`, { headers: { "content-type": "text/plain" } });
}
