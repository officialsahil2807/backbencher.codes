import React from "react";
import type { Metadata } from "next";
import { getPublishedPostsAsync } from "@/lib/blog/posts";
import { BlogListingClient } from "@/components/blog/BlogListingClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Engineering & Compiler Blog | Backbencher.codes",
  description:
    "Deep architectural dives, systems programming analysis, language benchmarks, and compiler internals written for developers.",
  openGraph: {
    title: "Engineering & Compiler Blog | Backbencher.codes",
    description:
      "Deep architectural dives, systems programming analysis, language benchmarks, and compiler internals written for developers.",
    url: "https://backbencher.codes/blog",
  },
};

export default async function BlogListingPage() {
  const allPosts = await getPublishedPostsAsync();
  return <BlogListingClient initialPosts={allPosts} />;
}
