"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Calendar, Clock, ArrowRight, Tag, BookOpen } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AdSlot } from "@/components/ads/AdSlot";
import { BlogPost } from "@/lib/blog/posts";

interface BlogListingClientProps {
  initialPosts: BlogPost[];
}

export function BlogListingClient({ initialPosts }: BlogListingClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = ["All", ...Array.from(new Set(initialPosts.map((p) => p.category)))];

  const filteredPosts = initialPosts.filter((post) => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div
      style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
      className="min-h-screen flex flex-col transition-colors duration-200"
    >
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Blog Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)", color: "var(--primary)" }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Developer Insights &amp; Guides</span>
          </div>
          <h1
            style={{ color: "var(--foreground)" }}
            className="text-3xl sm:text-5xl font-black tracking-tight"
          >
            Engineering &amp; Compiler Blog
          </h1>
          <p
            style={{ color: "var(--muted)" }}
            className="text-sm sm:text-base leading-relaxed"
          >
            Deep architectural dives, systems programming analysis, language benchmarks, and compiler internals written for developers.
          </p>
        </div>

        {/* Search and Category Filter Bar */}
        <div
          style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 border p-4 rounded-xl transition-colors"
        >
          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    backgroundColor: isSelected ? "var(--primary)" : "transparent",
                    color: isSelected ? "#0B0B0D" : "var(--muted)",
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    isSelected ? "font-bold shadow-sm" : "hover:text-[#FF7900]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--muted-foreground)" }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter articles..."
              style={{
                backgroundColor: "var(--background)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
              className="w-full pl-9 pr-3 py-1.5 border focus:border-[#FF7900] rounded-lg text-xs outline-none transition-colors"
            />
          </div>
        </div>

        {/* Ad Slot */}
        <AdSlot placement="blog-sidebar" />

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
              className="group border hover:border-[#FF7900] rounded-xl p-6 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 shadow-lg"
            >
              <div className="space-y-3">
                <div style={{ color: "var(--muted)" }} className="flex items-center justify-between text-[11px]">
                  <span
                    style={{
                      backgroundColor: "var(--background)",
                      borderColor: "var(--border)",
                      color: "var(--primary)",
                    }}
                    className="px-2 py-0.5 rounded border font-mono font-semibold"
                  >
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" />
                    {post.readingTime} min read
                  </span>
                </div>

                <Link href={`/blog/${post.slug}`} className="block group-hover:text-[#FF7900] transition-colors">
                  <h2 style={{ color: "var(--foreground)" }} className="text-lg font-bold leading-snug">
                    {post.title}
                  </h2>
                </Link>

                <p style={{ color: "var(--muted)" }} className="text-xs leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {post.tags.map((t) => (
                    <span
                      key={t}
                      style={{
                        backgroundColor: "var(--background)",
                        color: "var(--muted-foreground)",
                        borderColor: "var(--border)",
                      }}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-mono"
                    >
                      <Tag className="w-2.5 h-2.5" />
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div
                style={{ borderColor: "var(--border)" }}
                className="pt-4 mt-4 border-t flex items-center justify-between text-xs"
              >
                <span style={{ color: "var(--muted-foreground)" }} className="flex items-center gap-1.5 text-[11px] font-mono">
                  <Calendar className="w-3 h-3" />
                  {post.publishedAt}
                </span>

                <Link
                  href={`/blog/${post.slug}`}
                  className="flex items-center gap-1 font-bold text-[#FF7900] hover:text-[#FF963D] transition-colors"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
            className="text-center py-16 border rounded-xl space-y-2"
          >
            <p style={{ color: "var(--foreground)" }} className="text-sm font-semibold">No matching articles found.</p>
            <p style={{ color: "var(--muted)" }} className="text-xs">
              Try searching for different keywords or select &quot;All&quot; categories.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
