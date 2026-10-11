import Link from "next/link";
import { publicRouteGroups, publicRoutes } from "@/lib/public-routes";
import { site } from "@/lib/site";

const footerGroups = publicRouteGroups.filter((group) => group !== "Primary");

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-base font-semibold text-slate-900">{site.name}</p>
          <p className="mt-2 text-sm text-slate-600">{site.address}</p>
          <a className="mt-2 inline-block text-sm text-slate-700 hover:text-slate-900" href={site.phoneTel}>
            {site.phoneDisplay}
          </a>
          <a className="mt-1 block text-sm text-slate-700 hover:text-slate-900" href={`mailto:${site.email}`}>
            {site.email}
          </a>
        </div>
        {footerGroups.map((group) => (
          <div key={group}>
            <h2 className="text-sm font-semibold text-slate-900">{group}</h2>
            <ul className="mt-3 space-y-2">
              {publicRoutes
                .filter((route) => route.group === group)
                .map((route) => (
                  <li key={route.href}>
                    <Link href={route.href} className="text-sm text-slate-600 hover:text-slate-900">
                      {route.label}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
}
