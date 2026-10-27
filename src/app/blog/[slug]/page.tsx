import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { marked } from "marked";
import { ArrowLeft, Calendar, Clock, User, Tag } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AdSlot } from "@/components/ads/AdSlot";
import { getPostBySlugAsync } from "@/lib/blog/posts";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const post = (await getPostBySlugAsync(decodedSlug)) || (await getPostBySlugAsync(slug));

  if (!post) {
    return { title: "Article Not Found | Backbencher.codes" };
  }

  const title = post.seoTitle || `${post.title} | Backbencher.codes`;
  const description = post.seoDesc || post.excerpt;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.publishedAt,
      authors: post.author ? [post.author] : ["Backbencher Team"],
      tags: Array.isArray(post.tags) ? post.tags : [],
      url: `https://backbencher.codes/blog/${post.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `https://backbencher.codes/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const post = (await getPostBySlugAsync(decodedSlug)) || (await getPostBySlugAsync(slug));

  if (!post || post.status !== "published") {
    notFound();
  }

  // Parse markdown safely
  const cleanHtml = await marked.parse(post.body || "");

  return (
    <div
      style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
      className="min-h-screen flex flex-col transition-colors duration-200"
    >
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Navigation Breadcrumb */}
        <Link
          href="/blog"
          style={{ color: "var(--muted)" }}
          className="inline-flex items-center gap-2 text-xs hover:text-[#FF7900] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Articles</span>
        </Link>

        {/* Article Header */}
        <header
          style={{ borderColor: "var(--border)" }}
          className="space-y-4 border-b pb-8"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span
              style={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
                color: "var(--primary)",
              }}
              className="px-2.5 py-1 rounded border text-xs font-mono font-semibold"
            >
              {post.category}
            </span>
            <span style={{ color: "var(--muted)" }} className="flex items-center gap-1 text-xs font-mono">
              <Clock className="w-3.5 h-3.5" />
              {post.readingTime} min read
            </span>
          </div>

          <h1
            style={{ color: "var(--foreground)" }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight"
          >
            {post.title}
          </h1>

          <p
            style={{ color: "var(--muted)" }}
            className="text-base leading-relaxed"
          >
            {post.excerpt}
          </p>

          <div
            style={{ color: "var(--muted-foreground)" }}
            className="flex items-center justify-between pt-2 text-xs font-mono"
          >
            <div className="flex items-center gap-4">
              <span style={{ color: "var(--foreground)" }} className="flex items-center gap-1.5 font-medium">
                <User className="w-3.5 h-3.5 text-[#FF7900]" />
                {post.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {post.publishedAt}
              </span>
            </div>
          </div>
        </header>

        {/* Top AdSlot */}
        <AdSlot placement="blog-article" />

        {/* Article Body with theme variables */}
        <article
          style={{ color: "var(--foreground)" }}
          className="prose max-w-none leading-relaxed text-sm [&_h1]:text-2xl [&_h2]:text-xl [&_h3]:text-lg [&_h1]:font-bold [&_h2]:font-bold [&_h3]:font-bold [&_h1]:text-[var(--foreground)] [&_h2]:text-[var(--foreground)] [&_h3]:text-[var(--foreground)] [&_h1]:mb-3 [&_h2]:mb-3 [&_h3]:mb-2 [&_h1]:mt-6 [&_h2]:mt-5 [&_h3]:mt-4 [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-[var(--muted)] [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_li]:text-[var(--muted)] [&_li]:mb-1 [&_code]:text-[#FF7900] [&_code]:font-mono [&_code]:bg-[var(--card)] [&_code]:border [&_code]:border-[var(--border)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_pre]:bg-[var(--editor)] [&_pre]:border [&_pre]:border-[var(--border)] [&_pre]:rounded-xl [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:my-4 [&_a]:text-[#FF7900] [&_a]:underline hover:[&_a]:text-[#FF963D]"
        >
          <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
        </article>

        {/* Tags */}
        <div
          style={{ borderColor: "var(--border)" }}
          className="pt-6 border-t flex flex-wrap items-center gap-2"
        >
          <span style={{ color: "var(--muted-foreground)" }} className="text-xs uppercase font-mono mr-2">Tags:</span>
          {post.tags.map((tag) => (
            <span
              key={tag}
              style={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
                color: "var(--muted)",
              }}
              className="inline-flex items-center gap-1 px-3 py-1 rounded border text-xs font-mono"
            >
              <Tag className="w-3 h-3 text-[#FF7900]" />
              {tag}
            </span>
          ))}
        </div>

        {/* Interactive Compiler Call to Action */}
        <div
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
          }}
          className="border rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md transition-colors"
        >
          <div className="space-y-1 text-center sm:text-left">
            <h4 style={{ color: "var(--foreground)" }} className="text-base font-bold">Want to test code live?</h4>
            <p style={{ color: "var(--muted)" }} className="text-xs">
              Open our VS Code-like online compiler with 14 languages supported right in your browser.
            </p>
          </div>
          <Link
            href="/compiler"
            className="px-5 py-2.5 bg-[#FF7900] hover:bg-[#FF963D] text-[#0B0B0D] font-bold text-xs rounded-lg transition-all shrink-0 shadow-sm"
          >
            Launch Online IDE →
          </Link>
        </div>

        {/* Bottom AdSlot */}
        <AdSlot placement="blog-article" />
      </main>

      <Footer />
    </div>
  );
}
