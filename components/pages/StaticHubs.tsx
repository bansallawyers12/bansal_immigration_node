import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CelebrityHub } from "@/components/pages/CelebrityHub";

const hubs: Record<
  string,
  { title: string; description: string; intro: string; groups: { heading: string; links: [string, string][] }[] }
> = {
  "/citizenship": {
    title: "Australian Citizenship Services",
    description:
      "Expert assistance with all types of Australian citizenship applications including conferral, descent, dual citizenship, and citizenship test preparation.",
    intro:
      "Becoming an Australian citizen is a significant milestone. We provide comprehensive support for all citizenship pathways, from application preparation to test coaching and ceremony attendance.",
    groups: [
      {
        heading: "Citizenship Pathways",
        links: [
          ["/citizenship/citizenship-by-conferral", "Citizenship by Conferral"],
          ["/citizenship/citizenship-by-descent", "Citizenship by Descent"],
          ["/citizenship/evidence-of-australian-citizenship", "Evidence of Australian Citizenship"],
          ["/citizenship/citizenship-by-birth", "Citizenship by Birth"],
          ["/citizenship/dual-citizenship", "Dual Citizenship"],
          ["/citizenship/citizenship-test", "Citizenship Test"],
        ],
      },
    ],
  },
  "/other-countries": {
    title: "Other Countries",
    description: "Immigration guidance for Canada, New Zealand, and the United States.",
    intro: "Bansal Immigration also advises clients who are comparing pathways beyond Australia.",
    groups: [
      {
        heading: "Destinations",
        links: [
          ["/other-countries/canada", "Canada"],
          ["/other-countries/new-zealand", "New Zealand"],
          ["/other-countries/usa", "United States"],
        ],
      },
    ],
  },
  "/celebrity-visas": {
    title: "Celebrity Visas",
    description:
      "Discover success stories of Punjabi, Haryanvi, Bollywood singers, actors, and religious figures who obtained entertainment visas to perform in Australia through Bansal Immigration.",
    intro:
      "Bansal Immigration has assisted singers, actors, and performers with entertainment visas to perform in Australia.",
    groups: [{ heading: "Related services", links: [["/contact", "Talk to our entertainment visa team"]] }],
  },
  "/partner-visas": {
    title: "Partner Visas",
    description:
      "Apply for Partner Visas in Australia with expert guidance from Bansal Immigration. We help couples reunite through partner, spouse, and de facto visa pathways.",
    intro:
      "Complete guide to Australian partner visa pathways for spouses, de facto partners, and prospective marriage partners.",
    groups: [
      {
        heading: "Offshore Partner Visas",
        links: [
          ["/family-visa/partner-provisional-visa-subclass-309", "Partner Provisional (309)"],
          ["/family-visa/partner-permanent-visa-subclass-100", "Partner Permanent (100)"],
        ],
      },
      {
        heading: "Onshore Partner Visas",
        links: [
          ["/family-visa/partner-provisional-visa-subclass-820", "Partner Provisional (820)"],
          ["/family-visa/partner-permanent-visa-subclass-801", "Partner Permanent (801)"],
        ],
      },
      {
        heading: "Other Partner Visas",
        links: [
          ["/family-visa/prospective-marriage-visa-subclass-300", "Prospective Marriage (300)"],
          ["/family-visa/new-zealand-citizen-family-relationship-461", "NZ Citizen Family (461)"],
        ],
      },
    ],
  },
  "/parent-visas": {
    title: "Parent Visas",
    description: "Overview of Australian parent visa options to reunite families.",
    intro: "Overview of Australian parent visa options to reunite families.",
    groups: [
      {
        heading: "Parent visa options",
        links: [
          ["/family-visa/contributory-aged-parent-temporary-visa-subclass-884", "Contributory Aged Parent (884)"],
          ["/family-visa/contributory-aged-parent-864", "Contributory Aged Parent (864)"],
          ["/family-visa/contributory-parent-temporary-173", "Contributory Parent Temporary (173)"],
          ["/family-visa/contributory-parent-143", "Contributory Parent (143)"],
          ["/family-visa/parent-visa-103", "Parent Visa (103)"],
          ["/family-visa/aged-parent-visa-804", "Aged Parent (804)"],
          ["/family-visa/sponsored-parent-temporary-870", "Sponsored Parent Temporary (870)"],
          ["/family-visa/cost-for-contributory-visas", "Cost for contributory visas"],
        ],
      },
    ],
  },
  "/bridging-return-visas": {
    title: "Bridging & Return Visas",
    description:
      "Comprehensive guide to Australian bridging visas and resident return visas for maintaining your lawful status in Australia.",
    intro:
      "Comprehensive guide to Australian bridging visas and resident return visas for maintaining your lawful status in Australia.",
    groups: [{ heading: "Need advice", links: [["/contact", "Contact our team"], ["/book-an-appointment", "Book a consultation"]] }],
  },
};

export function hubMetadata(path: string): Metadata {
  const hub = hubs[path];
  if (!hub) return {};
  return { title: { absolute: `${hub.title} | Bansal Immigration` }, description: hub.description };
}

export function StaticHub({ path }: { path: string }) {
  if (path === "/celebrity-visas") return <CelebrityHub />;
  const hub = hubs[path];
  if (!hub) notFound();
  return (
    <div>
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl font-bold md:text-5xl">{hub.title}</h1>
          <p className="mt-4 text-xl text-blue-100">{hub.intro}</p>
        </div>
      </div>
      <div className="mx-auto max-w-6xl space-y-10 px-4 py-12">
        {hub.groups.map((group) => (
          <section key={group.heading}>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">{group.heading}</h2>
            <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {group.links.map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="block rounded-2xl border bg-white p-6 font-semibold text-sg-navy shadow hover:border-sg-light-blue">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
