const BRAND = "Bansal Immigration";

/** Same title rule as Laravel `Page::getSeoTitleAttribute`. */
export function seoTitle(metaTitle: string | null | undefined, title: string): string {
  let value = (metaTitle || title || "").trim();
  value = value.replace(/\s*[-|]\s*Bansal Immigration\s*/gi, "").trim();
  value = value.replace(/^Bansal Immigration\s*[-|]\s*/i, "").trim();
  if (!value.toLowerCase().includes("bansal immigration")) {
    value = `${value} | ${BRAND}`;
  }
  return value.trim();
}

export function stripBrandSuffix(value: string): string {
  return value.replace(/\s*\|\s*Bansal Immigration\s*$/i, "").trim();
}
