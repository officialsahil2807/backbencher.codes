import { MetadataRoute } from "next";
import { LANGUAGE_LIST } from "@/lib/compiler/languages";
import { getPublishedPosts } from "@/lib/blog/posts";

export default function sitemap(): MetadataRoute.Sitemap {
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

  // Published Blog Posts
  const blogRoutes: MetadataRoute.Sitemap = getPublishedPosts().map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...languageRoutes, ...blogRoutes];
}
