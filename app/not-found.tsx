import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-2xl font-semibold">Page not built yet</h1>
      <p className="mt-3 text-slate-600">
        This address is reserved for the Bansal Immigration site and will be added in a later step.
      </p>
      <Link href="/" className="mt-6 inline-block text-sm font-medium text-slate-900 underline">
        Back to home
      </Link>
    </div>
  );
}
