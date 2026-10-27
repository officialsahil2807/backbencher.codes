import React from "react";
import { notFound, redirect } from "next/navigation";
import { verifyAdminSession } from "@/lib/auth/admin";
import { PostEditor } from "@/components/admin/PostEditor";
import { getAllPosts } from "@/lib/blog/posts";
import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/client";

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const isAuthed = await verifyAdminSession();
  if (!isAuthed) {
    redirect("/admin/login");
  }

  const { id } = await params;

  // Try fetching from Supabase first if configured
  let post = null;
  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient() || (await createServerSupabaseClient());
      const { data } = await supabase.from("posts").select("*").eq("id", id).single();
      if (data) {
        post = {
          id: data.id,
          slug: data.slug,
          title: data.title,
          excerpt: data.excerpt,
          body: data.body,
          author: data.author,
          category: data.category,
          tags: data.tags || [],
          status: data.status as "published" | "draft",
          publishedAt: data.published_at,
          readingTime: data.reading_time,
          coverImage: data.cover_image,
          seoTitle: data.seo_title,
          seoDesc: data.seo_desc,
        };
      }
    } catch {
      // Fallback to local
    }
  }

  if (!post) {
    const posts = getAllPosts();
    post = posts.find((p) => p.id === id);
  }

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-[#F5F5F5] py-8">
      <div className="max-w-5xl mx-auto px-6 mb-4">
        <h1 className="text-xl font-black text-[#F5F5F5]">Edit Article</h1>
        <p className="text-xs text-[#A1A1AA]">
          Updating &quot;{post.title}&quot;
        </p>
      </div>
      <PostEditor initialPost={post} isEditing={true} />
    </div>
  );
}
