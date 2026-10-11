import type { NextConfig } from "next";
import { legacyRedirects } from "./lib/legacy-redirects";
import { visaRedirects } from "./lib/visa-catalog";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  allowedDevOrigins: ["127.0.0.1"],
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
      { source: "/ourservices/:path*", destination: "/", permanent: true },
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
