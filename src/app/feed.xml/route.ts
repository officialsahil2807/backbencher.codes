import { NextResponse } from "next/server";
import { getPublishedPosts } from "@/lib/blog/posts";

export async function GET() {
  const posts = getPublishedPosts();
  const siteUrl = "https://backbencher.codes";

  const itemsXml = posts
    .map((post) => {
      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/blog/${post.slug}</guid>
      <description><![CDATA[${post.excerpt}]]></description>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <author>${post.author}</author>
      <category>${post.category}</category>
    </item>`;
    })
    .join("");

  const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Backbencher.codes — Developer Insights &amp; Engineering Blog</title>
    <link>${siteUrl}</link>
    <description>Learn. Code. Build. Deep technical dives into compilers, algorithms, and systems engineering.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
    ${itemsXml}
  </channel>
</rss>`;

  return new NextResponse(rssXml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
