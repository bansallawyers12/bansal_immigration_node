import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: "Australia Migration & Visa Experts You Can Trust | Bansal Immigration" },
  description:
    "MARA-registered migration agents with 10+ years expertise. Student visas, skilled migration, partner visas, and permanent residency. Free consultation.",
  robots: { index: false, follow: false },
};

export default function GoogleAdsLandingPage() {
  return (
    <div>
      <div className="bg-amber-500 py-3 text-center text-sm font-semibold text-white">
        Limited time: free initial consultation — book before slots fill up.
      </div>
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p className="text-sm uppercase tracking-widest text-blue-200">MARA registered</p>
          <h1 className="mt-4 text-4xl font-bold md:text-5xl">Your Australian visa journey starts here</h1>
          <p className="mt-4 text-lg text-blue-100">
            Skilled migration, partner visas, student pathways, and employer sponsorship — honest advice from registered agents.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/book-an-appointment" className="rounded-lg bg-white px-8 py-4 font-bold text-blue-900">
              Book free consultation
            </Link>
            <Link href="/contact" className="rounded-lg border-2 border-white px-8 py-4 font-bold">
              Make an enquiry
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
