import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Photo } from "@/components/media/Photo";
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

export default function BlogDetailPage({ params }: { params: Promise<Params> }) {
  return (
    <Suspense fallback={<p className="mx-auto max-w-3xl px-4 py-16 text-sg-medium-gray">Loading article…</p>}>
      <BlogArticle params={params} />
    </Suspense>
  );
}

async function BlogArticle({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = await getBlog(slug);
  if (!post) notFound();
  const html = sanitizeContent(post.description);
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-4xl font-bold text-sg-navy">{post.title}</h1>
      {post.author ? <p className="mt-2 text-sm text-gray-500">{post.author}</p> : null}
      {post.image ? <Photo src={post.image} alt={post.imageAlt ?? post.title} className="mt-6 w-full rounded-xl" /> : null}
      {html ? <div className="cms-content mt-8" dangerouslySetInnerHTML={{ __html: html }} /> : null}
    </article>
  );
}
