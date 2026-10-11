import type { ReactNode } from "react";

export function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="bg-gray-100 py-12">
        <div className="mx-auto max-w-4xl px-4">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600">Last updated: {updated}</p>
        </div>
      </div>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="space-y-4 text-gray-700 [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-gray-800 [&_h3]:mt-6 [&_h3]:font-semibold [&_li]:my-2 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-5">
          {children}
        </div>
      </div>
    </div>
  );
}

export function legalUpdated() {
  return new Intl.DateTimeFormat("en-AU", { month: "long", day: "2-digit", year: "numeric" }).format(new Date());
}
