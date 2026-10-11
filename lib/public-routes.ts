export type PublicRouteGroup = "Primary" | "Services" | "Company" | "Forms" | "Legal";

export type PublicRoute = {
  href: string;
  label: string;
  group: PublicRouteGroup;
};

export const publicRouteGroups: PublicRouteGroup[] = [
  "Primary",
  "Services",
  "Company",
  "Forms",
  "Legal",
];

/** Top-level public paths from the current Bansal Immigration site. */
export const publicRoutes: PublicRoute[] = [
  { href: "/", label: "Home", group: "Primary" },
  { href: "/study-australia", label: "Study in Australia", group: "Primary" },
  { href: "/migrate-to-australia", label: "Migrate to Australia", group: "Primary" },
  { href: "/celebrity-visas", label: "Celebrity Visas", group: "Primary" },
  { href: "/skill-assessment", label: "Skill Assessment", group: "Primary" },
  { href: "/citizenship", label: "Citizenship", group: "Primary" },
  { href: "/appeals", label: "Appeals", group: "Primary" },
  { href: "/visitor-visa", label: "Visitor Visas", group: "Services" },
  { href: "/skilled-migration", label: "Skilled Migration", group: "Services" },
  { href: "/family-visa", label: "Family Visas", group: "Services" },
  { href: "/partner-visas", label: "Partner Visas", group: "Services" },
  { href: "/parent-visas", label: "Parent Visas", group: "Services" },
  { href: "/employer-sponsored", label: "Employer Sponsored", group: "Services" },
  { href: "/business-visas", label: "Business Visas", group: "Services" },
  { href: "/other-countries", label: "Other Countries", group: "Services" },
  { href: "/about", label: "About", group: "Company" },
  { href: "/blogs", label: "Blog", group: "Company" },
  { href: "/success-stories", label: "Success Stories", group: "Company" },
  { href: "/contact", label: "Contact", group: "Company" },
  { href: "/book-an-appointment", label: "Book Consultation", group: "Company" },
  { href: "/office-visit-form", label: "Book Office Visit", group: "Company" },
  { href: "/afp-national-police-check", label: "AFP Police Check", group: "Forms" },
  { href: "/indian-police-check", label: "Indian Police Check", group: "Forms" },
  { href: "/lp", label: "Education Landing Page", group: "Forms" },
  { href: "/privacy-policy", label: "Privacy Policy", group: "Legal" },
  { href: "/terms-conditions", label: "Terms and Conditions", group: "Legal" },
  { href: "/disclaimer", label: "Disclaimer", group: "Legal" },
  { href: "/cookie-policy", label: "Cookie Policy", group: "Legal" },
];

export const primaryNavigation = publicRoutes.filter(
  (route) => route.group === "Primary" && route.href !== "/",
);
