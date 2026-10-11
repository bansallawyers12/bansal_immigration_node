import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Why Choose Us – Bansal Immigration | Trusted Migration Experts" },
  description:
    "Discover why thousands trust Bansal Immigration for Australian visa and education services. Expert guidance, transparent processes, and a strong success record.",
};

export default function WhyChoosePage() {
  return (
    <div>
      <div className="bg-gray-100 py-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900">Why Choose Us?</h1>
        <p className="mx-auto mt-4 max-w-3xl text-xl text-gray-600">
          We are committed to providing exceptional immigration services with a personal touch that sets us apart from the competition.
        </p>
      </div>
      <div className="mx-auto max-w-5xl space-y-10 px-4 py-12">
        <section>
          <h2 className="text-2xl font-bold text-gray-900">Registered with the Office of the Migration Agents Registration Authority (OMARA).</h2>
          <p className="mt-3 text-gray-600">
            All our migration agents are registered with the Office of the Migration Agents Registration Authority (OMARA), ensuring you receive professional, ethical, and legally compliant immigration advice. We are bound by strict professional standards and ongoing education requirements.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-gray-900">Proven Track Record</h2>
          <p className="mt-3 text-gray-600">With over 10+ years of experience and 10,000+ successful cases, we have the expertise you need.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-gray-900">Personalized Service</h2>
          <p className="mt-3 text-gray-600">Every case is unique. We provide personalized attention and customized solutions.</p>
        </section>
      </div>
    </div>
  );
}
