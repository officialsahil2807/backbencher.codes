import { MetadataRoute } from "next";
import { LANGUAGE_LIST } from "@/lib/compiler/languages";
import { getPublishedPostsAsync } from "@/lib/blog/posts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = "https://backbencher.codes";
  const now = new Date();

  // Core pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/compiler`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/disclaimer`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  // 14 Language Compiler Pages
  const languageRoutes: MetadataRoute.Sitemap = LANGUAGE_LIST.map((lang) => ({
    url: `${siteUrl}/compiler/${lang.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // Published Blog Posts (Live from Supabase)
  const publishedPosts = await getPublishedPostsAsync();
  const blogRoutes: MetadataRoute.Sitemap = publishedPosts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...languageRoutes, ...blogRoutes];
}
