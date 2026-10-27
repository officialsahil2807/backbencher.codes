import React from "react";
import { redirect } from "next/navigation";
import { verifyAdminSession } from "@/lib/auth/admin";
import { PostEditor } from "@/components/admin/PostEditor";

export default async function NewPostPage() {
  const isAuthed = await verifyAdminSession();
  if (!isAuthed) {
    redirect("/admin/login?next=/admin/posts/new");
  }

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-[#F5F5F5] py-8">
      <div className="max-w-5xl mx-auto px-6 mb-4">
        <h1 className="text-xl font-black text-[#F5F5F5]">Create New Article</h1>
        <p className="text-xs text-[#A1A1AA]">
          Draft and publish technical articles to Backbencher.codes with Supabase synchronization.
        </p>
      </div>
      <PostEditor isEditing={false} />
    </div>
  );
}
