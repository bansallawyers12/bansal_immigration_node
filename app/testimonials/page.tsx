import type { Metadata } from "next";
import Link from "next/link";
import { listStories } from "@/lib/content";

export const metadata: Metadata = {
  title: { absolute: "Testimonials | Bansal Immigration" },
  description: "Client testimonials and success stories from Bansal Immigration.",
};

const quotes = [
  {
    name: "Ranjita Samyal",
    text: "We had the privilege of working with Bansal Immigration under the guidance of Mr. Ajay Bansal. His team demonstrated extraordinary empathy and kept us informed with timely updates and professional guidance.",
  },
  {
    name: "Vik Singh",
    text: "I am extremely happy and grateful to Bansal Immigration Consultants for helping me successfully get my student visa grant. The team was professional, supportive, and very clear with every step of the process.",
  },
  {
    name: "Shipra Sharma",
    text: "I have been with Bansal Immigration for almost six years now and I am very happy with the services provided by them. Their consistent support and guidance made my migration journey successful and stress-free.",
  },
];

export default async function TestimonialsPage() {
  const stories = await listStories(0, 6);
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-4xl font-bold text-sg-navy">Testimonials</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {quotes.map((item) => (
          <figure key={item.name} className="rounded-xl bg-white p-6 shadow">
            <blockquote className="text-gray-700">&ldquo;{item.text}&rdquo;</blockquote>
            <figcaption className="mt-4 font-semibold text-sg-navy">{item.name}</figcaption>
          </figure>
        ))}
      </div>
      <h2 className="mt-12 text-2xl font-bold text-sg-navy">Success stories</h2>
      <ul className="mt-4 space-y-3">
        {stories.map((story) => (
          <li key={story.id}>
            <Link href={`/success-stories/${story.slug}`} className="text-sg-light-blue hover:underline">
              {story.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
