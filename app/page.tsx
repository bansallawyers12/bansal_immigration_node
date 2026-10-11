import type { Metadata } from "next";
import Link from "next/link";
import { getHomeContent } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: "Registered Migration Agents Melbourne - Bansal",
  },
  description:
    "MARN listed migration agents in Melbourne for skilled, partner, student and employer-sponsored visas. Talk to Bansal Immigration.",
};

const helpCards = [
  ["/study-australia", "Study in Australia"],
  ["/migrate-to-australia", "Skilled Migration"],
  ["/family-visa", "Family Visas"],
  ["/visitor-visa", "Visitor Visas"],
  ["/business-visas", "Business Visas"],
  ["/employer-sponsored", "Employer Sponsored"],
  ["/appeals", "Appeals & Reviews"],
  ["/citizenship", "Citizenship"],
];

const quotes = [
  ["Be the change that you wish to see in the world.", "Mahatma Gandhi, Father of the Nation"],
  ["Excellence is a continuous process and not an accident.", "Dr. A.P.J. Abdul Kalam, Former President of India"],
  ["Success is not final, failure is not fatal: it is the courage to continue that counts.", "Winston Churchill, Former Prime Minister of the United Kingdom"],
  ["The future belongs to those who believe in the beauty of their dreams.", "Eleanor Roosevelt, Former First Lady of the United States"],
  ["Nothing is impossible, the word itself says 'I'm possible'!", "Audrey Hepburn, Actress and Humanitarian"],
];

const testimonials = [
  {
    name: "Ranjita Samyal",
    text: "We had the privilege of working with Bansal Immigration under the guidance of Mr. Ajay Bansal. I cannot express enough gratitude for the exceptional support we received throughout our PR journey. Ajay is a consummate professional and genuinely remarkable individual who goes above and beyond for his clients. His team demonstrated extraordinary empathy, understanding our situation in depth and tailoring their advice with precision. Every step was handled with meticulous attention to detail. What stood out most was their proactive and transparent communication - we were always kept informed with timely updates and professional guidance.",
    visa: "Local Guide - 26 reviews (2 months ago)",
  },
  {
    name: "Vik Singh",
    text: "I am extremely happy and grateful to Bansal Immigration Consultants for helping me successfully get my student visa grant. From start to finish, the team was professional, supportive, and very clear with every step of the process. They handled my application with care, answered all my questions patiently, and guided me with honesty and confidence. Their experience truly shows - I never felt confused or lost during the entire journey. I highly recommend Bansal Immigration Consultants for genuine, reliable immigration support.",
    visa: "3 reviews (5 months ago)",
  },
  {
    name: "Shipra Sharma",
    text: "I have been with Bansal Immigration for almost six years now and I am very happy with the services provided by them. I have achieved what I came to Australia for, with the excellent advice provided through Bansal Immigration. I have found worth for my every penny with them. I followed everything they asked me to and got the results I wanted for myself. Their consistent support and guidance made my migration journey successful and stress-free.",
    visa: "Local Guide - 18 reviews and 5 photos (2 months ago)",
  },
];

export default async function Home() {
  const home = await getHomeContent();
  const [lead, ...team] = home.team;

  return (
    <>
      <section className="relative flex min-h-[70vh] items-center overflow-hidden">
        <picture className="absolute inset-0 h-full w-full">
          <source
            type="image/avif"
            srcSet="/img/homepage-480.avif 480w, /img/homepage-768.avif 768w, /img/homepage-1280.avif 1280w, /img/homepage.avif 1920w"
            sizes="100vw"
          />
          <img
            src="/img/homepage-768.jpg"
            alt="Australian immigration consultation - Melbourne skyline"
            className="h-full w-full object-cover"
          />
        </picture>
        <div className="absolute inset-0 bg-[rgba(30,58,138,0.7)]" />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-4">
          <div className="max-w-md rounded-lg bg-white p-4 shadow-2xl">
            <h1 className="text-2xl font-bold leading-tight text-sg-navy md:text-3xl">
              Registered Migration Agents in Melbourne
            </h1>
            <p className="mt-3 text-base leading-relaxed text-sg-dark-gray">
              Professional Australian immigration consultants helping you achieve permanent residency, study abroad, and
              family reunification in Australia. Registered with the Office of the Migration Agents Registration
              Authority (OMARA).
            </p>
            <Link href="/book-an-appointment" className="mt-4 inline-block rounded-lg bg-sg-light-blue px-5 py-2 text-sm font-semibold text-white">
              Book Free Consultation
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-white to-blue-50/30 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-16 text-center">
            <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
              Our Services
            </span>
            <h2 className="mt-4 text-4xl font-bold text-sg-navy md:text-5xl">How we can help you</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-sg-medium-gray">
              Comprehensive immigration solutions tailored to your unique needs and goals
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {helpCards.map(([href, label]) => (
              <div key={href} className="rounded-xl bg-white p-6 text-center shadow-sm">
                <h3 className="text-lg font-semibold text-sg-dark-gray">{label}</h3>
                <Link href={href} className="mt-2 inline-block text-sm font-medium text-sg-light-blue hover:underline">
                  Find out more
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h2 className="text-4xl font-bold text-sg-navy">Why Choose Bansal Immigration?</h2>
          <p className="mx-auto mt-4 max-w-3xl text-xl text-sg-medium-gray">
            We&apos;re not just consultants; we&apos;re your partners in achieving your migration dreams
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="text-2xl font-bold text-sg-navy">Registered with the Office of the Migration Agents Registration Authority (OMARA).</h3>
              <p className="mt-4 text-sg-medium-gray">All our migration agents are registered with the Office of the Migration Agents Registration Authority (OMARA).</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-sg-navy">Proven Track Record</h3>
              <p className="mt-4 text-sg-medium-gray">With over 10+ years of experience and 10,000+ successful cases, we have the expertise you need.</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-sg-navy">Personalized Service</h3>
              <p className="mt-4 text-sg-medium-gray">Every case is unique. We provide personalized attention and customized solutions.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-sg-light-gray py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <blockquote className="text-3xl font-bold italic text-sg-navy">{quotes[0][0]}</blockquote>
          <cite className="mt-4 block text-sg-dark-gray">— {quotes[0][1]}</cite>
        </div>
      </section>

      <section className="bg-sg-light-gray py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold text-sg-navy">Latest from Our Blog</h2>
            <p className="mx-auto mt-4 max-w-3xl text-xl text-sg-medium-gray">
              Stay updated with the latest immigration news, tips, and insights from our experts
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {home.blogs.map((blog) => (
              <article key={blog.id} className="rounded-lg bg-white p-6">
                {blog.image ? <img src={blog.image} alt={blog.imageAlt ?? blog.title} className="mb-4 h-48 w-full rounded-lg object-cover" /> : null}
                <h3 className="line-clamp-2 text-xl font-bold text-sg-navy">{blog.title}</h3>
                <p className="mt-3 line-clamp-3 text-sg-medium-gray">{blog.shortDescription}</p>
                <Link href={`/blogs/${blog.slug}`} className="mt-4 inline-block font-semibold text-sg-light-blue">
                  Read More
                </Link>
              </article>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/blogs" className="inline-block rounded-lg bg-sg-light-blue px-8 py-4 font-semibold text-white">
              View All Blogs
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center text-4xl font-bold text-sg-navy">What Our Clients Say</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {testimonials.map((item) => (
              <figure key={item.name} className="rounded-lg bg-white p-8 text-center shadow-sm">
                <blockquote className="italic text-sg-medium-gray">&ldquo;{item.text}&rdquo;</blockquote>
                <figcaption className="mt-4 border-t pt-4">
                  <div className="font-bold text-sg-navy">{item.name}</div>
                  <div className="font-medium text-sg-light-blue">{item.visa}</div>
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/success-stories" className="inline-block rounded-lg border-2 border-sg-light-blue px-8 py-4 font-semibold text-sg-navy">
              View Success Stories
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center text-4xl font-bold text-sg-navy">Meet Our Expert Team</h2>
          {lead ? (
            <div className="mx-auto mt-12 max-w-sm text-center">
              {lead.image ? <img src={lead.image} alt={lead.name} className="mx-auto h-72 w-64 object-contain" /> : null}
              <h3 className="mt-4 text-2xl font-bold text-sg-navy">{lead.name}</h3>
              <p className="font-semibold text-sg-light-blue">
                {lead.designation} {lead.marn ? `(MARN: ${lead.marn})` : ""}
              </p>
              <p className="mt-3 text-sm text-sg-medium-gray">{lead.description}</p>
            </div>
          ) : null}
          <div className="mx-auto mt-8 grid max-w-5xl gap-8 md:grid-cols-2">
            {team.map((member) => (
              <div key={member.id} className="text-center">
                {member.image ? <img src={member.image} alt={member.name} className="mx-auto h-72 w-64 object-contain" /> : null}
                <h3 className="mt-4 text-xl font-bold text-sg-navy">{member.name}</h3>
                <p className="text-sm font-semibold text-sg-light-blue">
                  {member.designation} {member.marn ? `(MARN: ${member.marn})` : ""}
                </p>
                <p className="mt-3 text-sm text-sg-medium-gray">{member.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href={home.meetLink || "/contact"} className="inline-block rounded-lg bg-sg-light-blue px-8 py-4 font-semibold text-white">
              Contact Our Team
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-sg-light-gray py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2">
          <div>
            <h2 className="text-4xl font-bold text-sg-navy">We&apos;re here to help</h2>
            <p className="mt-4 text-xl text-sg-dark-gray">
              Start your migration journey today. Or, if you have a question, get in touch with our team.
            </p>
          </div>
          <div className="space-y-4">
            <Link href="/book-an-appointment" className="block rounded-lg bg-sg-navy px-8 py-4 text-center text-lg font-bold text-white">
              Book an Appointment
            </Link>
            <Link href="/contact" className="block rounded-lg bg-sg-light-blue px-8 py-4 text-center text-lg font-bold text-sg-navy">
              Make an Enquiry
            </Link>
            <a href={site.phoneTel} className="block rounded-lg border-2 border-sg-navy px-8 py-4 text-center text-lg font-bold text-sg-navy">
              Call {site.phoneDisplay}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
