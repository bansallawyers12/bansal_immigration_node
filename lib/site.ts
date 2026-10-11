export const site = {
  name: "Bansal Immigration",
  legalName: "Bansal Immigration Consultants",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.bansalimmigration.com.au",
  description:
    "Expert Australian immigration consultants. Registered with the Office of the Migration Agents Registration Authority (OMARA).",
  email: "info@bansalimmigration.com.au",
  phoneDisplay: "+61 3 9602 1330",
  phoneTel: "tel:+61396021330",
  address: "Level 8, 278 Collins Street, Melbourne VIC 3000",
  streetAddress: "Level 8, 278 Collins Street",
  locality: "Melbourne",
  region: "VIC",
  postalCode: "3000",
  adelaide: {
    address: "Unit 5, 55 Gawler Pl, Adelaide SA 5000, Australia",
    phoneDisplay: "08 8317 1340",
    phoneTel: "tel:+61883171340",
    email: "adelaide@bansalimmigration.com.au",
  },
  philippines: {
    address:
      "Unit 12, 2nd Floor, Brgy Quebiawan, HPT Building, Cer-Hil Service Road, San Fernando, 2000 Pampanga, Philippines",
    phoneDisplay: "+63 917 124 1207",
    phoneTel: "tel:+639171241207",
    email: "philippines@bansalimmigration.com.au",
  },
  social: [
    { label: "Facebook", href: "https://www.facebook.com/share/1HLkRjHfdu/" },
    { label: "Instagram", href: "https://www.instagram.com/bansalimmigrationconsultants?igsh=ZmZxNzA1ZW03OTRw" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/bansal-immigration-consultants/?viewAsMember=true" },
    { label: "X", href: "https://x.com/Bansalimmi" },
    { label: "YouTube", href: "https://youtube.com/@bansalimmigrationconsultants?si=HDryW37a5lffs4Qj" },
    { label: "Pinterest", href: "https://pin.it/3G66spsLH" },
    { label: "Threads", href: "https://www.threads.com/@bansalimmigrationconsultants?hl=en" },
  ],
};

export function canonicalUrl(path = "/"): string {
  const base = site.url.replace(/\/$/, "");
  if (!path || path === "/") return `${base}/`;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function indianPccEnabled(): boolean {
  return process.env.INDIAN_PCC_ENABLED === "true";
}
