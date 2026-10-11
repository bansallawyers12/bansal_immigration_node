import Image from "next/image";
import Link from "next/link";
import { indianPccEnabled } from "@/lib/site";
import { MobileNav } from "@/components/layout/MobileNav";

const primary = [
  ["/study-australia", "Study in Australia"],
  ["/migrate-to-australia", "Migrate to Australia"],
  ["/celebrity-visas", "Celebrity Visas"],
  ["/skill-assessment", "Skill Assessment"],
  ["/citizenship", "Citizenship"],
  ["/appeals", "Appeals"],
] as const;

const subnav = [
  ["/about", "About"],
  ["/blogs", "Blog"],
  ["/success-stories", "Success Stories"],
  ["/study-australia/our-affiliations", "Affiliations"],
  ["/contact", "Contact"],
  ["/occupation-finder", "Occupation Finder"],
  ["/migrate-to-australia/pr-point-calculator", "PR Calculator"],
  ["/postcode-checker", "Postcode Checker"],
  ["/study-australia/student-visa-financial-calculator", "Student Calculator"],
  ["/afp-national-police-check", "AFP Police Check"],
] as const;

export function Header() {
  const tools = indianPccEnabled()
    ? [...subnav, ["/indian-police-check", "Indian PCC Form"] as const]
    : subnav;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0">
          <Image
            src="/img/logo/logo_transparent.avif"
            alt="Bansal Immigration"
            width={360}
            height={139}
            priority
            className="h-10 w-auto rounded-lg border-2 border-sg-light-blue bg-white object-contain p-2 shadow-sm sm:h-12 lg:h-16"
          />
        </Link>
        <nav aria-label="Primary navigation" className="hidden items-center gap-6 px-4 lg:flex">
          {primary.map(([href, label]) => (
            <Link key={href} href={href} className="font-medium text-sg-dark-gray hover:text-sg-light-blue">
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/book-an-appointment"
            className="whitespace-nowrap rounded-lg bg-sg-light-blue px-6 py-2 text-sm font-semibold text-white"
          >
            Book Consultation
          </Link>
          <MobileNav showIndianPcc={indianPccEnabled()} />
        </div>
      </div>
      <div className="hidden border-t border-gray-200 bg-sg-light-gray lg:block">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-2 px-4 py-1 text-sm">
          {tools.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="rounded-lg px-3 py-2 font-medium text-sg-dark-gray hover:bg-white hover:text-sg-light-blue"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
