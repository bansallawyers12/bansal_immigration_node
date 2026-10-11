import sanitizeHtml from "sanitize-html";

const CATEGORIES = [
  "citizenship",
  "family-visa",
  "employer-sponsored",
  "study-australia",
  "visitor-visa",
  "maritime-crew",
  "medical-humanitarian",
  "transit-special-purpose",
];

const BROKEN_LINKS: Record<string, string> = {
  "https://www.bansalimmigration.com.au/australian-immigration-changes-july-2025":
    "/blogs/latest-australian-immigration-updates-july-2025",
  "https://www.bansalimmigration.com.au/australia-immigration-changes-july-2025":
    "/blogs/latest-australian-immigration-updates-july-2025",
  "https://bansalimmigration.com.au/australian-immigration-changes-july-2025":
    "/blogs/latest-australian-immigration-updates-july-2025",
  "https://bansalimmigration.com.au/australia-immigration-changes-july-2025":
    "/blogs/latest-australian-immigration-updates-july-2025",
  "/australian-immigration-changes-july-2025": "/blogs/latest-australian-immigration-updates-july-2025",
  "/australia-immigration-changes-july-2025": "/blogs/latest-australian-immigration-updates-july-2025",
};

/**
 * Ports Laravel ContentSanitizer, then strips tags and attributes that can execute script.
 */
export function sanitizeContent(input: string | null | undefined): string {
  if (!input) return "";
  let content = fixDuplicateCategoryLinks(input);
  content = fixBrokenLinks(content);
  content = downgradeHeadings(content);
  content = addTableCaptions(content);
  content = standardizeTypography(content);
  return sanitizeHtml(content, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      "img",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "figure",
      "figcaption",
      "caption",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
      "span",
      "div",
      "section",
      "article",
      "details",
      "summary",
      "sup",
      "sub",
    ]),
    allowedAttributes: {
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "title", "width", "height"],
      "*": ["class", "id"],
      td: ["colspan", "rowspan"],
      th: ["colspan", "rowspan"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          rel: attribs.target === "_blank" ? "noopener noreferrer" : attribs.rel,
        },
      }),
    },
  });
}

function fixDuplicateCategoryLinks(content: string): string {
  let next = content;
  for (const category of CATEGORIES) {
    const pattern = new RegExp(
      `(href\\s*=\\s*["'])/${category}/${category}(/)?(["'])`,
      "gi",
    );
    next = next.replace(pattern, `$1/${category}/$3`);
  }
  return next;
}

function fixBrokenLinks(content: string): string {
  let next = content;
  for (const [broken, correct] of Object.entries(BROKEN_LINKS)) {
    const pattern = new RegExp(`(href=["'])${escapeRegExp(broken)}(["'])`, "gi");
    next = next.replace(pattern, `$1${correct}$2`);
  }
  return next;
}

function downgradeHeadings(content: string): string {
  let next = content;
  for (let level = 6; level >= 1; level -= 1) {
    const nextLevel = Math.min(level + 1, 6);
    next = next.replace(new RegExp(`<h${level}(\\s[^>]*)?>`, "gi"), `<h${nextLevel}$1>`);
    next = next.replace(new RegExp(`</h${level}>`, "gi"), `</h${nextLevel}>`);
  }
  return next;
}

function addTableCaptions(content: string): string {
  return content.replace(/<table\b([^>]*)>/gi, (match, attrs: string, offset: number, source: string) => {
    const after = source.slice(offset + match.length, offset + match.length + 200);
    if (/^\s*<caption\b/i.test(after)) return match;
    const caption =
      '<caption class="sr-only" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0;">Data table</caption>';
    return `<table${attrs}>${caption}`;
  });
}

function standardizeTypography(content: string): string {
  let next = content.replace(/style="([^"]*)"/gi, (_match, styles: string) => {
    const allowed = styles
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const [name, ...rest] = part.split(":");
        return { name: name?.trim().toLowerCase() ?? "", value: rest.join(":").trim() };
      })
      .filter((part) => part.name === "text-align" || part.name === "list-style-type")
      .map((part) => `${part.name}: ${part.value}`);
    return allowed.length ? `style="${allowed.join("; ")}"` : "";
  });
  next = next.replace(/<\/?font[^>]*>/gi, "");
  next = next.replace(/\s*(color|size|face|bgcolor)="[^"]*"/gi, "");
  next = next.replace(/<span([^>]*)>([\s\S]*?)<\/span>/gi, (_match, attributes: string, inner: string) => {
    const attrs = attributes.trim();
    if (!attrs || /^\s*style="[^"]*"\s*$/i.test(attrs)) return inner;
    if (attrs.includes("class=")) return `<span${attributes}>${inner}</span>`;
    return inner;
  });
  return next;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
