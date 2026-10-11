import { listActiveBlogSlugs, listActivePages, listActiveStorySlugs } from "@/lib/content";
import { canonicalUrl, indianPccEnabled } from "@/lib/site";
import { publicPath } from "@/lib/visa-catalog";

const staticPaths = [
  "/",
  "/about",
  "/contact",
  "/book-an-appointment",
  "/blogs",
  "/success-stories",
  "/afp-national-police-check",
  "/office-visit-form",
  "/privacy-policy",
  "/terms-conditions",
  "/disclaimer",
  "/cookie-policy",
  "/testimonials",
  "/team",
  "/why-choose-us",
  "/mission-vision",
  "/migrate-to-australia/pr-point-calculator",
  "/postcode-checker",
  "/study-australia/student-visa-financial-calculator",
  "/occupation-finder",
];

export async function GET() {
  const urls = [...staticPaths];
  if (indianPccEnabled()) urls.push("/indian-police-check");

  try {
    const pages = await listActivePages();
    for (const page of pages) {
      if (page.slug === page.category) continue;
      const prefix = page.category === "business-visa" ? "business-visas" : page.category;
      urls.push(publicPath(prefix, page.slug, page.category));
    }
    for (const blog of await listActiveBlogSlugs()) urls.push(`/blogs/${blog.slug}`);
    for (const story of await listActiveStorySlugs()) urls.push(`/success-stories/${story.slug}`);
  } catch {
    urls.splice(0, urls.length, "/");
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...new Set(urls)]
  .map((path) => `  <url><loc>${escapeXml(canonicalUrl(path))}</loc></url>`)
  .join("\n")}
</urlset>`;

  return new Response(body, {
    headers: {
      "content-type": "application/xml; charset=UTF-8",
      "cache-control": "public, max-age=3600",
    },
  });
}

function escapeXml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
