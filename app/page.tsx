import Link from "next/link";
import { publicRouteGroups, publicRoutes } from "@/lib/public-routes";
import { site } from "@/lib/site";

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <p className="text-sm font-medium text-slate-500">Melbourne</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">{site.name}</h1>
      <p className="mt-4 max-w-2xl text-slate-600">{site.description}</p>
      <p className="mt-3 max-w-2xl text-slate-600">
        This is the Next.js shell. The pages below keep the current public addresses. Only the home page is built so far.
      </p>

      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {publicRouteGroups.map((group) => (
          <section key={group}>
            <h2 className="text-sm font-semibold text-slate-900">{group}</h2>
            <ul className="mt-3 space-y-2">
              {publicRoutes
                .filter((route) => route.group === group)
                .map((route) => (
                  <li key={route.href}>
                    <Link href={route.href} className="text-sm text-slate-700 hover:text-slate-900">
                      {route.label}
                    </Link>
                    <span className="ml-2 text-xs text-slate-400">{route.href}</span>
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
