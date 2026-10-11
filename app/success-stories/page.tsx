import type { Metadata } from "next";
import Link from "next/link";
import { Photo } from "@/components/media/Photo";
import { listStories } from "@/lib/content";

export const metadata: Metadata = {
  title: { absolute: "Success Stories | Bansal Immigration" },
  description: "Client success stories from Bansal Immigration.",
};

export default async function SuccessStoriesPage() {
  const stories = await listStories(0, 12);
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-4xl font-bold text-sg-navy">Success Stories</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {stories.map((story) => (
          <article key={story.id} className="rounded-xl bg-white p-5 shadow">
            {story.featured ? <p className="text-xs font-semibold uppercase text-sg-light-blue">Featured</p> : null}
            {story.image ? <Photo src={story.image} alt={story.title} className="mb-4 h-40 w-full rounded object-cover" /> : null}
            <h2 className="text-xl font-bold text-sg-navy">
              <Link href={`/success-stories/${story.slug}`}>{story.title}</Link>
            </h2>
            {story.visaType ? <p className="mt-1 text-sm text-sg-light-blue">{story.visaType}</p> : null}
            <p className="mt-2 line-clamp-3 text-sm text-gray-600">{story.excerpt}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
