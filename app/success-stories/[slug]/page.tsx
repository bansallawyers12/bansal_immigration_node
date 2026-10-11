import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStory } from "@/lib/content";
import { sanitizeContent } from "@/lib/sanitize";
import { seoTitle } from "@/lib/seo";

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const story = await getStory(slug);
  if (!story) return {};
  return {
    title: { absolute: seoTitle(story.metaTitle, story.title) },
    description: story.metaDescription || story.excerpt || "",
  };
}

export default async function SuccessStoryPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const story = await getStory(slug);
  if (!story) notFound();
  const html = sanitizeContent(story.content);
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-4xl font-bold text-sg-navy">{story.title}</h1>
      {story.clientName ? <p className="mt-2 text-sg-medium-gray">{story.clientName}</p> : null}
      {story.visaType ? <p className="text-sm font-semibold text-sg-light-blue">{story.visaType}</p> : null}
      {html ? <div className="cms-content mt-8" dangerouslySetInnerHTML={{ __html: html }} /> : null}
    </article>
  );
}
