import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { text } from "@/lib/parse";

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const page = Math.max(1, Number(sp.get("page") || 1));
  const q = (sp.get("q") || "").trim();
  const featured = sp.get("featured");
  const where: string[] = ["status = 1"];
  const params: unknown[] = [];
  if (q) {
    where.push("(title LIKE ? OR short_description LIKE ? OR author LIKE ?)");
    const like = `%${q}%`;
    params.push(like, like, like);
  }
  if (featured === "1") where.push("featured = 1");
  if (featured === "0") where.push("featured = 0");
  const clause = where.join(" AND ");
  const countRows = await query<{ total: number }>(`SELECT COUNT(*) AS total FROM blogs WHERE ${clause}`, params);
  const total = Number(countRows[0]?.total ?? 0);
  const offset = (page - 1) * 10;
  const rows = await query<Record<string, unknown>>(
    `SELECT id, title, slug, short_description, image, image_alt, author, featured, created_at, published_at
     FROM blogs WHERE ${clause} ORDER BY published_at DESC, created_at DESC LIMIT 10 OFFSET ?`,
    [...params, offset],
  );
  const data = rows.map((blog) => ({
    id: blog.id,
    title: text(blog.title),
    slug: text(blog.slug),
    description: text(blog.short_description),
    image: blog.image ? text(blog.image) : null,
    image_alt: text(blog.image_alt) || text(blog.title),
    author: text(blog.author) || "Bansal Immigration Team",
    featured: blog.featured,
    date: blog.published_at ? String(blog.published_at).slice(0, 10) : String(blog.created_at).slice(0, 10),
    url: `/blogs/${text(blog.slug)}`,
  }));
  return NextResponse.json({
    success: true,
    data,
    pagination: {
      current_page: page,
      last_page: Math.max(1, Math.ceil(total / 10)),
      per_page: 10,
      total,
      from: total ? offset + 1 : 0,
      to: Math.min(offset + 10, total),
      has_more_pages: page * 10 < total,
    },
    ...(q ? { search_query: q } : {}),
  });
}
