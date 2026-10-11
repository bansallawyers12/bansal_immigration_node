import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="text-3xl font-bold text-gray-900">Page Not Found</h1>
      <p className="mt-3 text-gray-600">The requested page could not be found.</p>
      <Link href="/" className="mt-6 inline-block rounded-xl bg-sg-light-blue px-6 py-3 font-semibold text-white">
        Return Home
      </Link>
    </div>
  );
}
