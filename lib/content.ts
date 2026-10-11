import { cacheLife } from "next/cache";
import { query } from "@/lib/db";
import { mediaUrl } from "@/lib/media";
import { asArray, asRecord, asStringList, flag, text } from "@/lib/parse";
import { hrefForStoredPage } from "@/lib/visa-catalog";
import type {
  BlogPost,
  BlogSummary,
  CmsPageRecord,
  HomeContent,
  RelatedPage,
  ServiceItem,
  SuccessStory,
  SuccessStorySummary,
  TeamMember,
  VisaCost,
  VisaFaq,
  VisaPathway,
} from "@/lib/types";

type PageRow = Record<string, unknown>;

const PAGE_COLUMNS = `
  id, title, slug, content, excerpt, template, category, subcategory, image, image_alt,
  meta_title, meta_description, meta_keywords, featured, updated_at,
  visa_highlights, visa_eligibility, visa_benefits, visa_steps, visa_faqs,
  visa_processing_times, visa_costs, visa_duration, visa_pathways
`;

function mapPage(row: PageRow): CmsPageRecord {
  return {
    id: Number(row.id),
    title: text(row.title),
    slug: text(row.slug),
    content: row.content == null ? null : text(row.content),
    excerpt: row.excerpt == null ? null : text(row.excerpt),
    template: row.template == null ? null : text(row.template),
    category: text(row.category),
    subcategory: row.subcategory == null ? null : text(row.subcategory),
    image: row.image == null ? null : text(row.image),
    image_alt: row.image_alt == null ? null : text(row.image_alt),
    meta_title: row.meta_title == null ? null : text(row.meta_title),
    meta_description: row.meta_description == null ? null : text(row.meta_description),
    meta_keywords: row.meta_keywords == null ? null : text(row.meta_keywords),
    featured: flag(row.featured),
    visaHighlights: asStringList(row.visa_highlights),
    visaEligibility: asStringList(row.visa_eligibility),
    visaBenefits: asStringList(row.visa_benefits),
    visaSteps: asStringList(row.visa_steps),
    visaFaqs: asArray<VisaFaq>(row.visa_faqs),
    visaProcessing: (asRecord(row.visa_processing_times) ?? {}) as CmsPageRecord["visaProcessing"],
    visaCosts: asArray<VisaCost>(row.visa_costs),
    visaDuration: (asRecord(row.visa_duration) ?? {}) as CmsPageRecord["visaDuration"],
    visaPathways: asArray<VisaPathway>(row.visa_pathways).map((item) => ({
      ...item,
      steps: Array.isArray(item.steps) ? item.steps.map((step) => text(step)) : [],
    })),
    updatedAt: row.updated_at == null ? null : text(row.updated_at),
  };
}

export async function getPublishedPage(category: string, slug: string): Promise<CmsPageRecord | null> {
  "use cache";
  cacheLife("hours");
  const rows = await query<PageRow>(
    `SELECT ${PAGE_COLUMNS} FROM pages WHERE category = ? AND slug = ? AND status = 1 LIMIT 1`,
    [category, slug],
  );
  return rows[0] ? mapPage(rows[0]) : null;
}

export async function getCategoryIndex(category: string): Promise<CmsPageRecord | null> {
  "use cache";
  cacheLife("hours");
  const exact = await query<PageRow>(
    `SELECT ${PAGE_COLUMNS} FROM pages
     WHERE category = ? AND parent_id IS NULL AND slug = ? AND status = 1
     LIMIT 1`,
    [category, category],
  );
  if (exact[0]) return mapPage(exact[0]);

  const fallback = await query<PageRow>(
    `SELECT ${PAGE_COLUMNS} FROM pages
     WHERE category = ? AND parent_id IS NULL AND status = 1
     ORDER BY id ASC LIMIT 1`,
    [category],
  );
  return fallback[0] ? mapPage(fallback[0]) : null;
}

export async function getRelatedPages(category: string, pageId: number): Promise<RelatedPage[]> {
  "use cache";
  cacheLife("hours");
  const rows = await query<PageRow>(
    `SELECT id, title, slug, category, excerpt FROM pages
     WHERE category = ? AND id != ? AND slug != ? AND status = 1
     LIMIT 6`,
    [category, pageId, category],
  );
  return rows.map((row) => ({
    id: Number(row.id),
    title: text(row.title),
    slug: text(row.slug),
    category: text(row.category),
    excerpt: row.excerpt == null ? null : text(row.excerpt),
    href: hrefForStoredPage(text(row.category), text(row.slug)),
  }));
}

export async function listActivePages(): Promise<
  { category: string; slug: string; updatedAt: string | null; routeName: string | null }[]
> {
  "use cache";
  cacheLife("hours");
  const rows = await query<PageRow>(
    `SELECT category, slug, updated_at, route_name FROM pages WHERE status = 1`,
  );
  return rows.map((row) => ({
    category: text(row.category),
    slug: text(row.slug),
    updatedAt: row.updated_at == null ? null : text(row.updated_at),
    routeName: row.route_name == null ? null : text(row.route_name),
  }));
}

function mapBlog(row: PageRow): BlogSummary {
  return {
    id: Number(row.id),
    title: text(row.title),
    slug: text(row.slug),
    shortDescription: row.short_description == null ? null : text(row.short_description),
    image: mediaUrl(row.image == null ? null : text(row.image)),
    imageAlt: row.image_alt == null ? null : text(row.image_alt),
    author: row.author == null ? null : text(row.author),
    featured: flag(row.featured),
    publishedAt: row.published_at == null ? null : text(row.published_at),
    createdAt: row.created_at == null ? null : text(row.created_at),
  };
}

export async function getLatestBlogs(limit = 3): Promise<BlogSummary[]> {
  "use cache";
  cacheLife("hours");
  const rows = await query<PageRow>(
    `SELECT id, title, slug, short_description, image, image_alt, author, featured, published_at, created_at
     FROM blogs WHERE status = 1
     ORDER BY created_at DESC LIMIT ?`,
    [limit],
  );
  return rows.map(mapBlog);
}

export async function listBlogs(offset = 0, limit = 12): Promise<{ posts: BlogSummary[]; total: number }> {
  "use cache";
  cacheLife("minutes");
  const rows = await query<PageRow>(
    `SELECT id, title, slug, short_description, image, image_alt, author, featured, published_at, created_at
     FROM blogs WHERE status = 1
     ORDER BY COALESCE(published_at, created_at) DESC
     LIMIT ? OFFSET ?`,
    [limit, offset],
  );
  const count = await query<{ total: number }>(`SELECT COUNT(*) AS total FROM blogs WHERE status = 1`);
  return { posts: rows.map(mapBlog), total: Number(count[0]?.total ?? 0) };
}

export async function getBlog(slug: string): Promise<BlogPost | null> {
  "use cache";
  cacheLife("hours");
  const rows = await query<PageRow>(
    `SELECT id, title, slug, short_description, description, image, image_alt, author, featured,
            published_at, created_at, meta_title, meta_description
     FROM blogs WHERE status = 1 AND slug = ? LIMIT 1`,
    [slug],
  );
  const row = rows[0];
  if (!row) return null;
  return {
    ...mapBlog(row),
    description: row.description == null ? null : text(row.description),
    metaTitle: row.meta_title == null ? null : text(row.meta_title),
    metaDescription: row.meta_description == null ? null : text(row.meta_description),
  };
}

function mapStory(row: PageRow): SuccessStorySummary {
  return {
    id: Number(row.id),
    title: text(row.title),
    slug: text(row.slug),
    excerpt: row.excerpt == null ? null : text(row.excerpt),
    image: mediaUrl(row.image == null ? null : text(row.image)),
    visaType: row.visa_type == null ? null : text(row.visa_type),
    clientName: row.client_name == null ? null : text(row.client_name),
    featured: flag(row.featured),
    order: row.order == null ? null : Number(row.order),
  };
}

export async function getFeaturedStories(limit = 3): Promise<SuccessStorySummary[]> {
  "use cache";
  cacheLife("hours");
  const rows = await query<PageRow>(
    `SELECT id, title, slug, excerpt, image, visa_type, client_name, featured, \`order\`
     FROM success_stories WHERE status = 1
     ORDER BY \`order\` ASC, created_at DESC LIMIT ?`,
    [limit],
  );
  return rows.map(mapStory);
}

export async function listStories(offset = 0, limit = 12): Promise<SuccessStorySummary[]> {
  "use cache";
  cacheLife("hours");
  const rows = await query<PageRow>(
    `SELECT id, title, slug, excerpt, image, visa_type, client_name, featured, \`order\`
     FROM success_stories WHERE status = 1
     ORDER BY \`order\` ASC, created_at DESC LIMIT ? OFFSET ?`,
    [limit, offset],
  );
  return rows.map(mapStory);
}

export async function getStory(slug: string): Promise<SuccessStory | null> {
  "use cache";
  cacheLife("hours");
  const rows = await query<PageRow>(
    `SELECT id, title, slug, excerpt, content, image, visa_type, client_name, featured, \`order\`,
            meta_title, meta_description
     FROM success_stories WHERE status = 1 AND slug = ? LIMIT 1`,
    [slug],
  );
  const row = rows[0];
  if (!row) return null;
  return {
    ...mapStory(row),
    content: row.content == null ? null : text(row.content),
    metaTitle: row.meta_title == null ? null : text(row.meta_title),
    metaDescription: row.meta_description == null ? null : text(row.meta_description),
  };
}

export async function getActiveServices(): Promise<ServiceItem[]> {
  "use cache";
  cacheLife("hours");
  const rows = await query<PageRow>(
    `SELECT id, title, slug, short_description, icon, \`order\`
     FROM services WHERE status = 1 ORDER BY \`order\` ASC`,
  );
  return rows.map((row) => ({
    id: Number(row.id),
    title: text(row.title),
    slug: row.slug == null ? null : text(row.slug),
    shortDescription: row.short_description == null ? null : text(row.short_description),
    icon: row.icon == null ? null : text(row.icon),
    order: row.order == null ? null : Number(row.order),
  }));
}

export async function getTeam(): Promise<TeamMember[]> {
  "use cache";
  cacheLife("hours");
  try {
    return await loadTeam();
  } catch {
    return [];
  }
}

async function loadTeam(): Promise<TeamMember[]> {
  const rows = await query<PageRow>(
    `SELECT id, name, designation, marn, description, image, \`order\`
     FROM team_members WHERE is_active = 1 ORDER BY \`order\` ASC`,
  );
  return rows.map((row) => ({
    id: Number(row.id),
    name: text(row.name),
    designation: row.designation == null ? null : text(row.designation),
    marn: row.marn == null ? null : text(row.marn),
    description: row.description == null ? null : text(row.description),
    image: mediaUrl(row.image == null ? null : text(row.image)),
    order: row.order == null ? null : Number(row.order),
  }));
}

export async function getHomeContent(): Promise<HomeContent> {
  "use cache";
  cacheLife("hours");
  const settings = await query<PageRow>(
    `SELECT meta_key, meta_value FROM home_content WHERE meta_key IN ('meta_title', 'meta_description', 'meet_link')`,
  );
  const map = new Map(settings.map((row) => [text(row.meta_key), text(row.meta_value)]));
  const [blogs, services, stories, team] = await Promise.all([
    getLatestBlogs(3),
    getActiveServices(),
    getFeaturedStories(3),
    getTeam(),
  ]);
  return {
    seoTitle:
      map.get("meta_title") || "Bansal Immigration - Expert Australian Migration Services",
    seoDescription:
      map.get("meta_description") ||
      "Professional Australian immigration consultants helping you achieve permanent residency, study abroad, and family reunification in Australia. Registered with the Office of the Migration Agents Registration Authority (OMARA).",
    meetLink: map.get("meet_link") || "/contact",
    blogs,
    services,
    stories,
    team,
  };
}

export async function listActiveBlogSlugs(): Promise<{ slug: string; updatedAt: string | null }[]> {
  "use cache";
  cacheLife("hours");
  const rows = await query<PageRow>(
    `SELECT slug, updated_at FROM blogs WHERE status = 1`,
  );
  return rows.map((row) => ({
    slug: text(row.slug),
    updatedAt: row.updated_at == null ? null : text(row.updated_at),
  }));
}

export async function listActiveStorySlugs(): Promise<{ slug: string; updatedAt: string | null }[]> {
  "use cache";
  cacheLife("hours");
  const rows = await query<PageRow>(
    `SELECT slug, updated_at FROM success_stories WHERE status = 1`,
  );
  return rows.map((row) => ({
    slug: text(row.slug),
    updatedAt: row.updated_at == null ? null : text(row.updated_at),
  }));
}
