import Link from "next/link";
import { indianPccEnabled, site } from "@/lib/site";

const services = [
  ["/study-australia", "Study in Australia"],
  ["/migrate-to-australia", "Skilled Migration"],
  ["/partner-visas", "Partner Visas"],
  ["/visitor-visa", "Visitor Visas"],
  ["/business-visas", "Business Visas"],
  ["/employer-sponsored", "Employer Sponsored"],
  ["/citizenship", "Citizenship"],
  ["/appeals", "Appeals & Reviews"],
  ["/afp-national-police-check", "AFP Police Check Form"],
] as const;

const company = [
  ["/about", "About Us"],
  ["/team", "Our Team"],
  ["/mission-vision", "Mission & Vision"],
  ["/testimonials", "Testimonials"],
  ["/blogs", "Blog"],
  ["/success-stories", "Success Stories"],
  ["/contact", "Contact"],
  ["/why-choose-us", "Why Choose Us"],
  ["/office-visit-form", "Book Office Visit"],
] as const;

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-gray-200 bg-white py-6">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-5 lg:px-8">
        <div>
          <img src="/img/logo/logo.avif" alt="Bansal Immigration" width={340} height={131} className="mb-2 h-16 w-auto object-contain" />
          <div className="text-sm font-medium text-sg-light-blue">MARN Registered Migration Agents</div>
          <a
            href={site.phoneTel}
            className="mt-2 inline-flex rounded-lg border-2 border-sg-light-blue px-2.5 py-2 text-xs font-semibold text-sg-navy hover:bg-sg-light-blue hover:text-white"
          >
            Call {site.phoneDisplay}
          </a>
          <p className="mt-2 text-sm text-sg-navy">
            Please review our{" "}
            <Link href="/terms-conditions" className="text-sg-light-blue hover:underline">
              consultation Terms &amp; Conditions
            </Link>
            .
          </p>
          <ul className="mt-4 space-y-1 text-sm text-sg-navy">
            <li>
              <a
                href="https://www.legislation.gov.au/F2021L01856/2026-04-01/2026-04-01/text/original/pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-sg-light-blue"
              >
                Code of Conduct
              </a>
            </li>
            <li>
              <a href="/consumer_guide_english.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-sg-light-blue">
                Consumer Guide
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="mb-3 text-lg font-semibold text-sg-navy">Our Services</h2>
          <ul className="space-y-1 text-sm text-sg-navy">
            {services.map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="hover:text-sg-light-blue">
                  {label}
                </Link>
              </li>
            ))}
            {indianPccEnabled() ? (
              <li>
                <Link href="/indian-police-check" className="hover:text-sg-light-blue">
                  Indian PCC Form
                </Link>
              </li>
            ) : null}
          </ul>
        </div>
        <div>
          <h2 className="mb-3 text-lg font-semibold text-sg-navy">Company</h2>
          <ul className="space-y-1 text-sm text-sg-navy">
            {company.map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="hover:text-sg-light-blue">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-2">
          <h2 className="mb-3 text-lg font-semibold text-sg-navy">Contact &amp; Branches</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <Branch title="MELBOURNE" lines={["Level 8/278 Collins St", "Melbourne VIC 3000, Australia"]} phone={site.phoneDisplay} tel={site.phoneTel} email={site.email} />
            <Branch title="ADELAIDE" lines={["Unit 5, 55 Gawler Pl", "Adelaide SA 5000, Australia"]} phone={site.adelaide.phoneDisplay} tel={site.adelaide.phoneTel} email={site.adelaide.email} />
            <Branch title="PHILIPPINES" lines={[site.philippines.address]} phone={site.philippines.phoneDisplay} tel={site.philippines.phoneTel} email={site.philippines.email} />
          </div>
        </div>
      </div>
      <div className="mx-auto mt-6 flex max-w-7xl flex-col items-center justify-between gap-3 px-4 sm:flex-row">
        <p className="text-xs text-gray-600">ABN: 70 958 120 428 | The Trustee for EASYVISA TRUST</p>
        <div className="flex flex-wrap justify-center gap-2">
          {site.social.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.label}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-600 text-xs font-semibold text-white hover:bg-sg-navy"
            >
              {item.label.slice(0, 2)}
            </a>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-4 flex max-w-7xl flex-col items-center justify-between gap-3 border-t border-gray-300 px-4 pt-4 text-sm text-sg-navy md:flex-row">
        <p>© {year} Bansal Immigration. All rights reserved. | MARN Registered Migration Agents</p>
        <div className="flex flex-wrap justify-center gap-x-6">
          <Link href="/privacy-policy" className="hover:text-sg-light-blue">Privacy Policy</Link>
          <Link href="/terms-conditions" className="hover:text-sg-light-blue">Terms &amp; Conditions</Link>
          <Link href="/disclaimer" className="hover:text-sg-light-blue">Disclaimer</Link>
          <Link href="/cookie-policy" className="hover:text-sg-light-blue">Cookie Policy</Link>
        </div>
      </div>
    </footer>
  );
}

function Branch({
  title,
  lines,
  phone,
  tel,
  email,
}: {
  title: string;
  lines: string[];
  phone: string;
  tel: string;
  email: string;
}) {
  return (
    <div>
      <h3 className="mb-1 text-sm font-semibold text-sg-navy">{title}</h3>
      <p className="text-sm text-sg-navy">{lines.join(", ")}</p>
      <a href={tel} className="mt-1 block text-sm text-sg-navy hover:text-sg-light-blue">
        {phone}
      </a>
      <a href={`mailto:${email}`} className="block break-all text-sm text-sg-navy hover:text-sg-light-blue">
        {email}
      </a>
    </div>
  );
}
