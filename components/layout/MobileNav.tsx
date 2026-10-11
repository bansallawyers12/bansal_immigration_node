"use client";

import Link from "next/link";
import { useState } from "react";
const services = [
  ["/study-australia", "Study in Australia"],
  ["/migrate-to-australia", "Migrate to Australia"],
  ["/celebrity-visas", "Celebrity Visas"],
  ["/skill-assessment", "Skill Assessment"],
  ["/citizenship", "Citizenship"],
  ["/appeals", "Appeals"],
] as const;

const company = [
  ["/about", "About"],
  ["/blogs", "Blog"],
  ["/success-stories", "Success Stories"],
  ["/study-australia/our-affiliations", "Affiliations"],
  ["/contact", "Contact"],
] as const;

const tools = [
  ["/occupation-finder", "Occupation Finder"],
  ["/migrate-to-australia/pr-point-calculator", "PR Calculator"],
  ["/postcode-checker", "Postcode Checker"],
  ["/study-australia/student-visa-financial-calculator", "Student Calculator"],
  ["/afp-national-police-check", "AFP Police Check"],
] as const;

export function MobileNav({ showIndianPcc = false }: { showIndianPcc?: boolean }) {
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<string | null>(null);
  const toolLinks = showIndianPcc
    ? [...tools, ["/indian-police-check", "Indian PCC Form"] as const]
    : tools;

  return (
    <>
      <button
        type="button"
        className="flex min-h-11 min-w-11 items-center justify-center rounded-lg hover:bg-gray-100 lg:hidden"
        aria-label="Open navigation menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="text-xl text-sg-dark-gray">{open ? "✕" : "☰"}</span>
      </button>
      {open ? (
        <div className="absolute inset-x-0 top-full border-t bg-white px-4 py-6 lg:hidden">
          <MenuSection title="Our Services" id="services" open={section} setOpen={setSection} links={services} />
          <MenuSection title="Company" id="company" open={section} setOpen={setSection} links={company} />
          <MenuSection title="Tools & Calculators" id="tools" open={section} setOpen={setSection} links={toolLinks} />
        </div>
      ) : null}
    </>
  );
}

function MenuSection({
  title,
  id,
  open,
  setOpen,
  links,
}: {
  title: string;
  id: string;
  open: string | null;
  setOpen: (value: string | null) => void;
  links: readonly (readonly [string, string])[];
}) {
  const expanded = open === id;
  return (
    <div className="mb-4">
      <button
        type="button"
        className="flex w-full items-center justify-between py-3 text-left font-semibold uppercase tracking-wide text-sg-navy"
        aria-expanded={expanded}
        onClick={() => setOpen(expanded ? null : id)}
      >
        {title}
        <span>{expanded ? "−" : "+"}</span>
      </button>
      {expanded ? (
        <div className="space-y-2 pl-4">
          {links.map(([href, label]) => (
            <Link key={href} href={href} className="block py-2 font-medium text-sg-dark-gray hover:text-sg-light-blue">
              {label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
