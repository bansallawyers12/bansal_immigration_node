import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Mission & Vision - Bansal Immigration Consultants" },
  description: "Learn about Bansal Immigration Consultants' mission and vision to help people achieve their Australian immigration dreams.",
};

export default function MissionVisionPage() {
  return (
    <div>
      <div className="bg-gray-100 py-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900">Mission &amp; Vision</h1>
        <p className="mx-auto mt-4 max-w-3xl text-xl text-gray-600">
          Our commitment to excellence and our vision for the future of immigration services.
        </p>
      </div>
      <div className="mx-auto max-w-4xl space-y-8 px-4 py-12">
        <section className="rounded-lg bg-white p-8 text-center shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
          <p className="mt-6 text-xl leading-relaxed text-gray-700">
            To provide exceptional immigration services that help individuals and families achieve their dreams of living, working, and studying in Australia. We are committed to delivering personalized, professional, and ethical immigration solutions that make a positive difference in our clients&apos; lives.
          </p>
          <p className="mt-4 text-lg text-gray-600">
            We believe that everyone deserves the opportunity to pursue their aspirations, and we are dedicated to making the immigration process as smooth and successful as possible for each and every client.
          </p>
        </section>
        <section className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-center text-white shadow-lg">
          <h2 className="text-3xl font-bold">Our Vision</h2>
          <p className="mt-6 text-xl leading-relaxed">
            To be the most trusted immigration consultancy, known for ethical advice, clear communication, and outcomes that help families build their future in Australia.
          </p>
        </section>
      </div>
    </div>
  );
}
