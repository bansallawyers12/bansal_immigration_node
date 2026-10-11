import { canonicalUrl } from "@/lib/site";

export function GET() {
  const env = process.env.APP_ENV || process.env.NODE_ENV;
  if (env === "staging" || env === "local" || env === "development") {
    return new Response("User-agent: *\nDisallow: /\n", { headers: { "content-type": "text/plain" } });
  }
  const body = `User-agent: *
Disallow: /admin/
Disallow: /admin-login
Disallow: /dashboard
Disallow: /api/
Disallow: /landing
Disallow: /design/
Sitemap: ${canonicalUrl("/sitemap.xml")}
`;
  return new Response(body, { headers: { "content-type": "text/plain" } });
}
