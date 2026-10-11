import type { NextConfig } from "next";
import { visaRedirects } from "./lib/visa-catalog";

const legacyRedirects: Record<string, string> = {
  "/about-us": "/about",
  "/contact-us": "/contact",
  "/pr-calculator": "/migrate-to-australia/pr-point-calculator",
  "/pr-point-calculator": "/migrate-to-australia/pr-point-calculator",
  "/points-for-pr-australia": "/migrate-to-australia/pr-point-calculator",
  "/canada": "/other-countries/canada",
  "/new-zealand": "/other-countries/new-zealand",
  "/usa": "/other-countries/usa",
  "/people": "/team",
  "/staff": "/team",
  "/australia-immigration-changes-july-2025": "/blogs/latest-australian-immigration-updates-july-2025",
  "/australian-immigration-changes-july-2025": "/blogs/latest-australian-immigration-updates-july-2025",
};

const nextConfig: NextConfig = {
  poweredByHeader: false,
  cacheComponents: true,
  partialPrefetching: true,
  async redirects() {
    const exact = Object.entries({ ...legacyRedirects, ...visaRedirects }).map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }));
    return [
      ...exact,
      { source: "/public/:path*", destination: "/:path*", permanent: true },
      { source: "/booking/calendar/:path*", destination: "/book-an-appointment", permanent: true },
      { source: "/page/:path*", destination: "/", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
