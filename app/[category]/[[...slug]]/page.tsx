import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { CmsArticle } from "@/components/pages/CmsArticle";
import { StaticHub } from "@/components/pages/StaticHubs";
import { PrPointCalculator } from "@/components/tools/PrPointCalculator";
import { StudentVisaCalculator } from "@/components/tools/StudentVisaCalculator";
import { getCategoryIndex, getPublishedPage, getRelatedPages } from "@/lib/content";
import { seoTitle } from "@/lib/seo";
import {
  chooseTemplate,
  cmsCategories,
  resolveLookup,
  staticHubs,
  toolPaths,
  visaRedirects,
} from "@/lib/visa-catalog";

type Params = { category: string; slug?: string[] };

function requestPath(category: string, slug?: string[]) {
  return slug?.length ? `/${category}/${slug.join("/")}` : `/${category}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { category, slug } = await params;
  const path = requestPath(category, slug);
  if (staticHubs.has(path) || toolPaths.has(path) || visaRedirects[path]) {
    return {};
  }
  const lookup = resolveLookup(category, slug?.[0] ?? null);
  if (!lookup || (slug && slug.length > 1)) return {};
  const page = lookup.dbSlug
    ? await getPublishedPage(lookup.dbCategory, lookup.dbSlug)
    : await getCategoryIndex(lookup.dbCategory);
  if (!page) return {};
  const title = seoTitle(page.meta_title, page.title);
  const description = page.meta_description || page.excerpt || "";
  return {
    title: { absolute: title },
    description,
    keywords: page.meta_keywords || undefined,
  };
}

export default async function CategoryPage({ params }: { params: Promise<Params> }) {
  const { category, slug } = await params;
  if (!cmsCategories.has(category)) notFound();
  if (slug && slug.length > 1) notFound();

  const urlSlug = slug?.[0] ?? null;
  const path = requestPath(category, slug);
  const redirectTo = visaRedirects[path];
  if (redirectTo) permanentRedirect(redirectTo);
  if (urlSlug && urlSlug === category) notFound();

  if (path === "/migrate-to-australia/pr-point-calculator") return <PrPointCalculator />;
  if (path === "/study-australia/student-visa-financial-calculator") return <StudentVisaCalculator />;
  if (staticHubs.has(path)) return <StaticHub path={path} />;

  const lookup = resolveLookup(category, urlSlug);
  if (!lookup) notFound();
  const page = lookup.dbSlug
    ? await getPublishedPage(lookup.dbCategory, lookup.dbSlug)
    : await getCategoryIndex(lookup.dbCategory);
  if (!page) notFound();

  const related = await getRelatedPages(lookup.dbCategory, page.id, lookup.publicPrefix);
  const template = chooseTemplate(page.template, lookup.dbCategory, lookup.templateOverride);
  return <CmsArticle page={page} related={related} publicPrefix={lookup.publicPrefix} template={template} />;
}
