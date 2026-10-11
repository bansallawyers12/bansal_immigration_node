import Link from "next/link";
import { primaryNavigation } from "@/lib/public-routes";
import { site } from "@/lib/site";

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="text-lg font-semibold text-slate-900">
          {site.name}
        </Link>
        <nav aria-label="Primary" className="flex flex-wrap gap-x-4 gap-y-2">
          {primaryNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-700 hover:text-slate-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/book-an-appointment"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          Book Consultation
        </Link>
      </div>
    </header>
  );
}
