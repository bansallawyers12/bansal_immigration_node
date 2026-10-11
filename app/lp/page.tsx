import type { Metadata } from "next";
import Link from "next/link";
import { LpEnquiryForm } from "@/components/forms/LpEnquiryForm";

export const metadata: Metadata = {
  title: { absolute: "Study in Australia | Bansal Education" },
  description: "Free education counselling, university shortlisting, and student visa support from MARA registered agents.",
  robots: { index: false, follow: false },
};

export default function LpPage() {
  return (
    <div className="lp-page mx-auto max-w-6xl px-4 py-12">
        <header className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">Bansal Education</p>
          <h1 className="mt-2 text-4xl font-bold text-sg-navy">Study in Australia with expert guidance</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-sg-dark-gray">
            Free counselling, affordable universities, and MARA-registered student visa support.
          </p>
        </header>
        <div className="grid gap-12 lg:grid-cols-2">
          <section>
            <h2 className="text-2xl font-bold text-sg-navy">Book your free consultation</h2>
            <p className="mt-2 text-sg-medium-gray">Tell us about your goals and we will shortlist courses that fit your budget.</p>
            <div className="mt-6">
              <LpEnquiryForm />
            </div>
          </section>
          <section className="space-y-6">
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-sg-navy">What you get</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-sg-dark-gray">
                <li>University and course shortlisting</li>
                <li>Scholarship and tuition comparisons</li>
                <li>Student visa preparation with registered migration agents</li>
              </ul>
            </div>
            <p className="text-sm text-sg-medium-gray">
              Prefer the main site? <Link href="/" className="text-sg-light-blue hover:underline">Return to Bansal Immigration</Link>
            </p>
          </section>
        </div>
    </div>
  );
}
