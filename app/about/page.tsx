import type { Metadata } from "next";
import Link from "next/link";
import { Photo } from "@/components/media/Photo";
import { getTeam } from "@/lib/content";

export const metadata: Metadata = {
  title: { absolute: "Bansal Immigration – Trusted Experts in Immigration Law" },
  description:
    "Bansal Immigration Consultants provide professional legal services for all your visa, citizenship, and migration needs. With years of experience and a commitment to excellence.",
};

export default async function AboutPage() {
  const team = await getTeam();
  return (
    <>
      <section className="bg-gradient-to-r from-blue-900 to-blue-800 py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-5xl font-bold">About Bansal Immigration</h1>
          <p className="mt-6 text-2xl text-gray-200">Your Future, Our Priority</p>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-gray-300">
            MARN registered migration agents with over 10+ years of experience, helping thousands of families achieve their Australian dreams through expert guidance and personalized service.
          </p>
        </div>
      </section>
      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 lg:grid-cols-2">
          <div>
            <h2 className="mb-6 text-4xl font-bold text-gray-900">Who We Are</h2>
            <p className="mb-6 text-lg text-gray-600">
              Bansal Immigration Consultants is a premier immigration consultancy firm based in Melbourne, Australia. With over 10+ years of experience, we specialize in providing comprehensive immigration services tailored to meet the unique needs of our clients.
            </p>
            <p className="text-lg text-gray-600">
              Our commitment is encapsulated in our tagline: &quot;Your Future, Our Priority.&quot; We are dedicated to transforming your immigration aspirations into reality through expert guidance, personalized attention, and unwavering support throughout your journey.
            </p>
          </div>
          <Photo src="/img/team/team-bansal-960.jpg" alt="Bansal Immigration Team" className="w-full rounded-2xl shadow-2xl" />
        </div>
      </section>
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-8 text-center text-3xl font-bold">Our team</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {team.map((member) => (
              <div key={member.id} className="rounded-xl bg-white p-6 text-center">
                <h3 className="text-xl font-bold text-sg-navy">{member.name}</h3>
                <p className="text-sm text-sg-light-blue">{member.designation}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/team" className="font-semibold text-sg-light-blue">
              Meet the full team
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
