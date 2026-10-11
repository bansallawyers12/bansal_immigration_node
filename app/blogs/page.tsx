import type { Metadata } from "next";
import Link from "next/link";
import { Photo } from "@/components/media/Photo";
import { listBlogs } from "@/lib/content";

export const metadata: Metadata = {
  title: { absolute: "Blog | Bansal Immigration" },
  description: "Immigration news, visa updates, and guidance from Bansal Immigration.",
};

export default async function BlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? 1) || 1);
  const perPage = 12;
  const { posts, total } = await listBlogs((page - 1) * perPage, perPage);
  const hasMore = page * perPage < total;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-4xl font-bold text-sg-navy">Blog</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {posts.map((post) => (
          <article key={post.id} className="rounded-xl bg-white p-5 shadow">
            {post.image ? <Photo src={post.image} alt={post.imageAlt ?? post.title} className="mb-4 h-40 w-full rounded object-cover" /> : null}
            {post.featured ? <p className="text-xs font-semibold uppercase text-sg-light-blue">Featured</p> : null}
            <h2 className="text-xl font-bold text-sg-navy">
              <Link href={`/blogs/${post.slug}`}>{post.title}</Link>
            </h2>
            <p className="mt-2 line-clamp-3 text-sm text-gray-600">{post.shortDescription}</p>
          </article>
        ))}
      </div>
      {hasMore ? (
        <Link href={`/blogs?page=${page + 1}`} className="mt-8 inline-block font-semibold text-sg-light-blue">
          Load more
        </Link>
      ) : null}
    </div>
  );
}
