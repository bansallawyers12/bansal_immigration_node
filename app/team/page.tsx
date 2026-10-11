import type { Metadata } from "next";
import { Photo } from "@/components/media/Photo";
import { getTeam } from "@/lib/content";

export const metadata: Metadata = {
  title: { absolute: "Our Team | Bansal Immigration" },
  description: "Meet the registered migration agents and staff at Bansal Immigration.",
};

export default async function TeamPage() {
  const team = await getTeam();
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-4xl font-bold text-sg-navy">Our Team</h1>
      <p className="mt-4 max-w-3xl text-lg text-sg-medium-gray">
        Professional migration agents with years of experience helping you achieve your Australian dreams.
      </p>
      <div className="mt-10 grid gap-8 md:grid-cols-2">
        {team.map((member) => (
          <article key={member.id} className="rounded-xl bg-white p-6 text-center shadow">
            {member.image ? <Photo src={member.image} alt={member.name} className="mx-auto h-72 w-64 object-contain" /> : null}
            <h2 className="mt-4 text-2xl font-bold text-sg-navy">{member.name}</h2>
            <p className="font-semibold text-sg-light-blue">
              {member.designation} {member.marn ? `(MARN: ${member.marn})` : ""}
            </p>
            <p className="mt-3 text-sm text-sg-medium-gray">{member.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
