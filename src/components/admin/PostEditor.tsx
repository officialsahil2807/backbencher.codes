"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Check } from "lucide-react";
import { BlogPost } from "@/lib/blog/posts";

interface PostEditorProps {
  initialPost?: Partial<BlogPost>;
  isEditing?: boolean;
}

export function PostEditor({ initialPost, isEditing = false }: PostEditorProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialPost?.title || "");
  const [slug, setSlug] = useState(initialPost?.slug || "");
  const [category, setCategory] = useState(initialPost?.category || "Compilers");
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt || "");
  const [body, setBody] = useState(initialPost?.body || "");
  const [tags, setTags] = useState(initialPost?.tags?.join(", ") || "Programming, Web");
  const [status, setStatus] = useState<"published" | "draft">(initialPost?.status || "published");
  const [seoTitle, setSeoTitle] = useState(initialPost?.seoTitle || "");
  const [seoDesc, setSeoDesc] = useState(initialPost?.seoDesc || "");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Auto-generate slug on title change if not manually edited
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEditing && (!slug || slug === title.toLowerCase().replace(/[^a-z0-9]+/g, "-"))) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setError("Article title and markdown body cannot be empty.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const payload: Partial<BlogPost> = {
      id: initialPost?.id,
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      excerpt: excerpt || title,
      body,
      category,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      status,
      seoTitle,
      seoDesc,
    };

    try {
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save post.");
      }

      setSavedSuccess(true);
      setTimeout(() => {
        router.push("/admin");
      }, 1000);
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Top action header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#292929]">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-xs text-[#A1A1AA] hover:text-[#F5F5F5] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#141416] p-1 rounded-lg border border-[#292929] text-xs">
            <button
              type="button"
              onClick={() => setStatus("draft")}
              className={`px-3 py-1 rounded font-semibold transition-colors ${
                status === "draft"
                  ? "bg-amber-500/20 text-amber-400"
                  : "text-[#A1A1AA] hover:text-white"
              }`}
            >
              Draft
            </button>
            <button
              type="button"
              onClick={() => setStatus("published")}
              className={`px-3 py-1 rounded font-semibold transition-colors ${
                status === "published"
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "text-[#A1A1AA] hover:text-white"
              }`}
            >
              Published
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2 bg-[#FF7900] hover:bg-[#FF963D] disabled:opacity-50 text-[#0B0B0D] font-bold text-xs rounded-lg transition-all shadow-[0_0_15px_rgba(255,121,0,0.2)]"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isEditing ? "Update Article" : "Save & Publish"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-950/40 border border-red-900/50 text-xs text-red-300">
          {error}
        </div>
      )}

      {/* Main Form Fields */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Title & Body */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-[#A1A1AA] mb-1">
              Article Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Understanding Modern Compiler Architecture"
              className="w-full px-4 py-2.5 bg-[#141416] border border-[#292929] focus:border-[#FF7900] rounded-xl text-[#F5F5F5] font-bold text-base outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#A1A1AA] mb-1">
              Excerpt / Brief Summary
            </label>
            <textarea
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A short description that appears on cards and search results..."
              className="w-full px-4 py-2 bg-[#141416] border border-[#292929] focus:border-[#FF7900] rounded-xl text-xs text-[#F5F5F5] outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#A1A1AA] mb-1">
              Markdown Body *
            </label>
            <textarea
              rows={18}
              required
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="# Article Header&#10;&#10;Write rich markdown with code snippets, headers, and explanations here..."
              className="w-full px-4 py-3 bg-[#101012] border border-[#292929] focus:border-[#FF7900] rounded-xl text-xs text-[#F5F5F5] font-mono leading-relaxed outline-none"
            />
          </div>
        </div>

        {/* Right Column: Metadata & SEO */}
        <div className="space-y-4">
          <div className="bg-[#141416] border border-[#292929] rounded-xl p-4 space-y-4">
            <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-[#FF7900]">
              Post Configuration
            </h4>

            <div>
              <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1">
                URL Slug
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="article-url-slug"
                className="w-full px-3 py-1.5 bg-[#0B0B0D] border border-[#292929] focus:border-[#FF7900] rounded text-xs font-mono text-[#F5F5F5] outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1">
                Category
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Architecture, Languages, Performance"
                className="w-full px-3 py-1.5 bg-[#0B0B0D] border border-[#292929] focus:border-[#FF7900] rounded text-xs text-[#F5F5F5] outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Compilers, Rust, WebAssembly"
                className="w-full px-3 py-1.5 bg-[#0B0B0D] border border-[#292929] focus:border-[#FF7900] rounded text-xs text-[#F5F5F5] outline-none"
              />
            </div>
          </div>

          <div className="bg-[#141416] border border-[#292929] rounded-xl p-4 space-y-4">
            <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-[#A1A1AA]">
              SEO Metadata
            </h4>

            <div>
              <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1">
                Meta Title
              </label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="Custom SEO Title Tag"
                className="w-full px-3 py-1.5 bg-[#0B0B0D] border border-[#292929] focus:border-[#FF7900] rounded text-xs text-[#F5F5F5] outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1">
                Meta Description
              </label>
              <textarea
                rows={3}
                value={seoDesc}
                onChange={(e) => setSeoDesc(e.target.value)}
                placeholder="Summary for search engine snippets (up to 160 characters)"
                className="w-full px-3 py-1.5 bg-[#0B0B0D] border border-[#292929] focus:border-[#FF7900] rounded text-xs text-[#F5F5F5] outline-none resize-none"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
