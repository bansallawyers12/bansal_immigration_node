import type { Metadata, Viewport } from "next";
import { Footer, Header } from "@/components/layout";
import { canonicalUrl, site } from "@/lib/site";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1e3a8a",
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Bansal Immigration - Expert Australian Migration Services",
    template: "%s | Bansal Immigration",
  },
  description: site.description,
  openGraph: {
    title: "Bansal Immigration - Expert Australian Migration Services",
    description: site.description,
    images: ["/img/homepage.jpg"],
    url: canonicalUrl("/"),
    type: "website",
    siteName: site.name,
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bansal Immigration - Expert Australian Migration Services",
    description: site.description,
    images: ["/img/homepage.jpg"],
  },
  icons: {
    icon: "/img/logo/favicon.webp",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.legalName,
  image: canonicalUrl("/img/logo/favicon.webp"),
  logo: canonicalUrl("/img/logo/favicon.webp"),
  "@id": canonicalUrl("/"),
  url: canonicalUrl("/"),
  telephone: "+61396021330",
  email: site.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.streetAddress,
    addressLocality: site.locality,
    addressRegion: site.region,
    postalCode: site.postalCode,
    addressCountry: "AU",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -37.8162,
    longitude: 144.9631,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:30",
      closes: "18:00",
    },
  ],
  priceRange: "$$",
  areaServed: { "@type": "Country", name: "Australia" },
  description: site.description,
};

const websiteData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.name,
  url: canonicalUrl("/"),
  description: site.description,
  publisher: {
    "@type": "Organization",
    name: site.legalName,
    logo: {
      "@type": "ImageObject",
      url: canonicalUrl("/img/logo/favicon.webp"),
    },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-AU">
      <body className="min-h-screen bg-white font-sans text-slate-900 antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }} />
        <a
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-white focus:px-3 focus:py-2"
          href="#main-content"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
