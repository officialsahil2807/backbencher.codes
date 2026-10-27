import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth/admin";
import { getAllPosts, savePost, deletePost, BlogPost } from "@/lib/blog/posts";
import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export async function GET() {
  const isAuthed = await verifyAdminSession();
  if (!isAuthed) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  // Try fetching from Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient() || (await createServerSupabaseClient());
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("published_at", { ascending: false });

      if (!error && data && data.length > 0) {
        // Map snake_case to camelCase
        const mappedPosts: BlogPost[] = data.map((row) => ({
          id: row.id,
          slug: row.slug,
          title: row.title,
          excerpt: row.excerpt || "",
          body: row.body,
          author: row.author || "Backbencher Team",
          category: row.category || "General",
          tags: row.tags || [],
          status: row.status as "published" | "draft",
          publishedAt: row.published_at || new Date().toISOString().split("T")[0],
          readingTime: row.reading_time || 5,
          coverImage: row.cover_image,
          seoTitle: row.seo_title,
          seoDesc: row.seo_desc,
        }));
        return NextResponse.json({ posts: mappedPosts, source: "supabase" });
      }
    } catch (e) {
      console.warn("Supabase posts fetch failed, falling back to local posts:", e);
    }
  }

  // Fallback to local store
  const posts = getAllPosts();
  return NextResponse.json({ posts, source: "local" });
}

export async function POST(req: NextRequest) {
  const isAuthed = await verifyAdminSession();
  if (!isAuthed) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const postData: Partial<BlogPost> = await req.json();

    if (!postData.title || !postData.body) {
      return NextResponse.json(
        { error: "Title and markdown body are required." },
        { status: 400 }
      );
    }

    const slug =
      postData.slug ||
      postData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    const newPost: BlogPost = {
      id: postData.id || `post-${Date.now()}`,
      slug,
      title: postData.title,
      excerpt: postData.excerpt || postData.title,
      body: postData.body,
      author: postData.author || "Backbencher Administrator",
      category: postData.category || "General",
      tags: postData.tags || ["Programming"],
      status: postData.status || "published",
      publishedAt: postData.publishedAt || new Date().toISOString().split("T")[0],
      readingTime: Math.max(1, Math.round(postData.body.split(/\s+/).length / 200)),
      coverImage: postData.coverImage,
      seoTitle: postData.seoTitle,
      seoDesc: postData.seoDesc,
    };

    // Save to local cache
    savePost(newPost);

    // Save to Supabase if configured
    if (isSupabaseConfigured()) {
      try {
        const supabase = createAdminClient() || (await createServerSupabaseClient());
        await supabase.from("posts").upsert({
          id: newPost.id,
          slug: newPost.slug,
          title: newPost.title,
          excerpt: newPost.excerpt,
          body: newPost.body,
          author: newPost.author,
          category: newPost.category,
          tags: newPost.tags,
          status: newPost.status,
          published_at: newPost.publishedAt,
          reading_time: newPost.readingTime,
          cover_image: newPost.coverImage,
          seo_title: newPost.seoTitle,
          seo_desc: newPost.seoDesc,
        });
      } catch (e) {
        console.warn("Failed to persist post to Supabase:", e);
      }
    }

    return NextResponse.json({ success: true, post: newPost });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const isAuthed = await verifyAdminSession();
  if (!isAuthed) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Post ID is required." }, { status: 400 });
  }

  const deleted = deletePost(id);

  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient() || (await createServerSupabaseClient());
      await supabase.from("posts").delete().eq("id", id);
    } catch (e) {
      console.warn("Failed to delete post from Supabase:", e);
    }
  }

  return NextResponse.json({ success: deleted });
}
