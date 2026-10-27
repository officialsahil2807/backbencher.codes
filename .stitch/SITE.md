# Backbencher.codes — Site Constitution & Roadmap

## 1. Core Identity
- **Project Name:** Backbencher.codes
- **Stitch Project ID:** 17664511784400995872
- **Mission:** Learn programming, experiment with code, and run programs in an advanced online workspace inspired by VS Code and Programiz.
- **Tagline:** Learn. Code. Build.
- **Target Audience:** Developers, computer science students, self-taught coders, and technical writers.
- **Voice:** Precision-engineered, empowering, developer-first, pragmatic.

## 2. Visual Language
- **Vibe:** Obsidian Minimalist · Technical Precision · Amber/Orange Energy
- **Palette:** `#0B0B0D` (bg), `#141416` (card/nav), `#101012` (editor), `#FF7900` (accent), `#292929` (borders), `#F5F5F5` (text).

## 3. Architecture & File Structure
- Next.js 14 App Router
- `app/`
  - `page.tsx` (Homepage)
  - `compiler/` & `compiler/[lang]/page.tsx` (Online Compiler & IDE)
  - `tutorials/` & `tutorials/[lang]/` (Tutorials library)
  - `blog/` & `blog/[slug]/` (Blog & technical guides)
  - `admin/` (Secure admin dashboard for blog publishing)
  - `api/compiler/execute/` (Sandboxed & backend execution API)
  - `api/blog/` & `api/admin/` (Blog CRUD & authentication)
  - `sitemap.ts`, `robots.ts`, `feed.xml/route.ts`

## 4. Live Sitemap
- [ ] `/` (Homepage)
- [ ] `/compiler` & `/compiler/[lang]` (VS Code-like Online IDE)
- [ ] `/tutorials` & `/tutorials/[lang]/[topic]` (Tutorial Hub)
- [ ] `/blog` & `/blog/[slug]` (Articles & Insights)
- [ ] `/admin` & `/admin/login` (Admin Dashboard)
- [ ] `/privacy`, `/terms`, `/disclaimer` (Legal & AdSense compliance)

## 5. Roadmap
- **High Priority:**
  - Complete Stitch MCP design generation for Homepage, IDE, Tutorials, and Blog.
  - Full Next.js application scaffold with Tailwind, Lucide, Framer Motion, and Monaco Editor.
  - VS Code-like IDE with 3 panels, multi-file tree, tabs, IndexedDB persistence, and toolbar.
  - Multi-language execution engine (all 14 languages) with real execution adapters.
- **Medium Priority:**
  - Searchable tutorial library for all 14 languages with "Try it online" compiler integration.
  - Blog system with admin-only authentication, markdown/rich-text publishing, categories, and tags.
  - Google AdSense slot components with layout-shift prevention.
- **Low Priority:**
  - RSS feed generation, JSON-LD schema, dynamic sitemap, automated tests, deployment guides.
