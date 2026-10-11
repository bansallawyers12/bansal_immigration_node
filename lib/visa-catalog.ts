export type PageLookup = {
  dbCategory: string;
  dbSlug: string | null;
  templateOverride?: string;
  publicPrefix: string;
};

const DB_CATEGORY: Record<string, string> = {
  "business-visas": "business-visa",
};

/** URL path -> database slug when they differ. */
export const slugAliases: Record<string, string> = {
  "/study-australia/student-guardian-visa-590": "student-guardian-visa-subclass-590",
  "/migrate-to-australia/points-for-english-score": "english-points",
  "/migrate-to-australia/national-innovation-visa-858": "national-innovation-visa",
  "/migrate-to-australia/distinguished-talent-visa-124": "distinguished-talent-124",
  "/migrate-to-australia/distinguished-talent-visa-858": "distinguished-talent-858",
  "/family-visa/new-zealand-citizen-family-relationship-461":
    "new-zealand-citizen-family-relationship-visa-subclass-461",
  "/family-visa/contributory-aged-parent-864": "contributory-aged-parent-visa-subclass-864",
  "/family-visa/contributory-parent-temporary-173": "contributory-parent-temporary-visa-subclass-173",
  "/family-visa/contributory-parent-143": "contributory-parent-subclass-143",
  "/family-visa/parent-visa-103": "parent-visa-subclass-103",
  "/family-visa/aged-parent-visa-804": "aged-parent-visa-subclass-804",
  "/family-visa/sponsored-parent-temporary-870": "sponsored-parent-temporary-visa-subclass-870",
  "/family-visa/child-visa-101": "child-visa-subclass-101",
  "/family-visa/child-visa-802": "child-visa-subclass-802",
  "/family-visa/remaining-relative-visa-115": "remaining-relative-visa-subclass-115",
  "/family-visa/remaining-relative-visa-835": "remaining-relative-visa-subclass-835",
  "/family-visa/aged-dependent-relative-visa-114": "aged-dependent-114",
  "/family-visa/aged-dependent-relative-visa-offshore-114": "aged-dependent-offshore-114",
  "/family-visa/aged-dependent-relative-visa-onshore-838": "aged-dependent-onshore-838",
  "/family-visa/carer-visa-offshore-116": "carer-visa-offshore-subclass-116",
  "/family-visa/carer-visa-onshore-836": "carer-visa-onshore-subclass-836",
  "/employer-sponsored/global-talent-employer-sponsored-gtes": "gtes",
  "/business-visas/business-innovation-investment-permanent-888":
    "business-innovation-and-investment-permanent-visa-subclass-888",
  "/business-visas/business-innovation-investment-provisional-188":
    "business-innovation-and-investment-provisional-visa-subclass-188",
  "/business-visas/business-talent-permanent-132": "business-talent-permanent-visa-subclass-132",
  "/appeals/noicc": "notice-of-intention-to-consider-cancellation",
  "/skill-assessment/guide": "skills-assessment-guide",
  "/skill-assessment/requirements": "assessment-requirements",
  "/skill-assessment/timeline": "assessment-timeline",
  "/skilled-migration/skilled-work-regional-provisional-491":
    "skilled-work-regional-provisional-visa-subclass-491",
};

export const visaRedirects: Record<string, string> = {
  "/study-australia/student-subsequent-visa": "/study-australia/student-dependent-visa-500",
  "/study-australia/apply-afp-ipc-form": "/afp-national-police-check",
  "/migrate-to-australia/skilled-migration": "/skilled-migration",
  "/migrate-to-australia/temporary-graduate-visa-485":
    "/skilled-migration/temporary-graduate-visa-subclass-485-vocational",
  "/migrate-to-australia/temporary-graduate-visa-subclass-485":
    "/skilled-migration/temporary-graduate-visa-subclass-485-vocational",
  "/migrate-to-australia/post-study-work-visa-485":
    "/skilled-migration/temporary-graduate-visa-subclass-485-higher-education",
  "/migrate-to-australia/post-study-work-visa-subclass-485":
    "/skilled-migration/temporary-graduate-visa-subclass-485-higher-education",
  "/migrate-to-australia/skilled-recognised-graduate-visa-476":
    "/skilled-migration/temporary-graduate-visa-extension",
  "/migrate-to-australia/skilled-recognised-graduate-visa-subclass-476":
    "/skilled-migration/temporary-graduate-visa-extension",
  "/migrate-to-australia/skilled-independent-visa-189":
    "/skilled-migration/skilled-independent-visa-subclass-189",
  "/migrate-to-australia/skilled-nominated-visa-190":
    "/skilled-migration/skilled-nominated-visa-subclass-190",
  "/migrate-to-australia/skilled-regional-visa-887":
    "/skilled-migration/skilled-regional-visa-subclass-887",
  "/migrate-to-australia/skilled-work-regional-provisional-491":
    "/skilled-migration/skilled-work-regional-provisional-491",
  "/employer-sponsored-visas": "/employer-sponsored",
  "/employer-sponsored/temporary-skill-shortage-visa-subclass-482-old": "/employer-sponsored/sid-visa-482",
  "/employer-sponsored/temporary-skill-shortage-visa-subclass-482": "/employer-sponsored/sid-visa-482",
  "/bridging-return-visas/bridging-return-visas": "/bridging-return-visas",
};

export const toolPaths = new Set([
  "/migrate-to-australia/pr-point-calculator",
  "/study-australia/student-visa-financial-calculator",
]);

export const staticHubs = new Set([
  "/citizenship",
  "/other-countries",
  "/celebrity-visas",
  "/partner-visas",
  "/parent-visas",
  "/bridging-return-visas",
]);

export const cmsCategories = new Set([
  "study-australia",
  "visitor-visa",
  "migrate-to-australia",
  "skilled-migration",
  "family-visa",
  "employer-sponsored",
  "business-visas",
  "appeals",
  "citizenship",
  "skill-assessment",
  "transit-special-purpose",
  "medical-humanitarian",
  "maritime-crew",
  "other-countries",
  "celebrity-visas",
]);

const DEFAULT_TEMPLATES: Record<string, string> = {
  "study-australia": "study-australia",
  "visitor-visa": "visitor-visa",
  migration: "migration",
  "migrate-to-australia": "migrate-to-australia",
  "skilled-migration": "skilled-migration",
  "family-visa": "family-visa",
  "employer-sponsored": "employer-sponsored",
  "business-visa": "business-visa",
  appeals: "appeals",
  citizenship: "citizenship",
  "other-countries": "other-countries",
  "celebrity-visas": "celebrity-visas",
  "skill-assessment": "skill-assessment",
  "transit-special-purpose": "default",
  "medical-humanitarian": "default",
  "maritime-crew": "default",
  "bridging-return-visas": "default",
};

export function publicPath(prefix: string, slug: string, categorySlug: string): string {
  if (!slug || slug === categorySlug) return `/${prefix}`;
  return `/${prefix}/${slug}`;
}

export function resolveLookup(prefix: string, urlSlug: string | null): PageLookup | null {
  if (!cmsCategories.has(prefix)) return null;
  const path = urlSlug ? `/${prefix}/${urlSlug}` : `/${prefix}`;
  const dbCategory = DB_CATEGORY[prefix] ?? prefix;
  const dbSlug = urlSlug ? (slugAliases[path] ?? urlSlug) : null;
  const lookup: PageLookup = { dbCategory, dbSlug, publicPrefix: prefix };

  if (path === "/study-australia/our-affiliations") {
    lookup.templateOverride = "study-australia";
  }
  if (!urlSlug && prefix === "migrate-to-australia") {
    lookup.templateOverride = "migrate-to-australia";
  }
  if (!urlSlug && prefix === "skilled-migration") {
    lookup.templateOverride = "skilled-migration";
  }
  return lookup;
}

export function chooseTemplate(
  stored: string | null,
  dbCategory: string,
  override?: string,
): string {
  if (override) return override;
  const raw = (stored || DEFAULT_TEMPLATES[dbCategory] || "default").replace(/^pages\./, "");
  return raw || "default";
}
