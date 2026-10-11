import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlog } from "@/lib/content";
import { sanitizeContent } from "@/lib/sanitize";
import { seoTitle } from "@/lib/seo";

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlog(slug);
  if (!post) return {};
  return {
    title: { absolute: seoTitle(post.metaTitle, post.title) },
    description: post.metaDescription || post.shortDescription || "",
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = await getBlog(slug);
  if (!post) notFound();
  const html = sanitizeContent(post.description);
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-4xl font-bold text-sg-navy">{post.title}</h1>
      {post.author ? <p className="mt-2 text-sm text-gray-500">{post.author}</p> : null}
      {post.image ? <img src={post.image} alt={post.imageAlt ?? post.title} className="mt-6 w-full rounded-xl" /> : null}
      {html ? <div className="cms-content mt-8" dangerouslySetInnerHTML={{ __html: html }} /> : null}
    </article>
  );
}
