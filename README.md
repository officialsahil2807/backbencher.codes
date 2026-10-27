# Backbencher.codes — Modern Programming Education Platform & Cloud IDE

> **Brand Tagline:** Learn. Code. Build.  
> **Domain:** [https://backbencher.codes](https://backbencher.codes)  
> **Production Target:** Vercel

---

## ⚡ Overview

**Backbencher.codes** is a production-grade developer platform inspired by Programiz and Visual Studio Code. It delivers a fast, dark-mode online IDE with instant code execution across 14 programming languages, a technical engineering blog, and non-intrusive Google AdSense monetization slots.

### Key Highlights
- **VS Code-like Online Compiler:** Powered by Monaco Editor with syntax highlighting, automatic indentation, bracket-pair colorization, active line highlight, minimap, multi-file explorer, code folding, and font zooming.
- **14 Supported Language Environments:**
  - **Browser Native:** HTML, CSS, JavaScript, TypeScript (instant live execution via double-isolated null-origin iframe sandbox).
  - **In-Memory SQLite Sandbox:** Real SQL execution using `sql.js` (WebAssembly) with table formatting.
  - **Isolated Backend Containers:** Python 3.12, C (GCC 12), C++ (C++20), Java 17, Rust 1.78, Dart, PHP 8.3, Swift, and Kotlin.
- **Interactive Standard Input (stdin):** Real stdin support for interactive terminal programs in Python, C, C++, and Java.
- **Zero Registration Required:** Public visitors can run code and read guides immediately. Drafts are preserved locally in the browser.
- **Admin-Only High-Security PIN Authentication:** Accessible exclusively via the secret direct URL `/admin/login`. Protected by per-IP rate limiting, bcrypt verification, and cryptographic HttpOnly cookies.
- **Technical Blog System:** Markdown authoring, category filtering, instant search, reading times, and dynamic RSS 2.0 feed (`/feed.xml`).
- **Google AdSense Ready:** Pre-allocated slots preventing layout shift (CLS), compliant with Google's policies, with an instant development toggle.

---

## 🛠️ Technology Stack

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Styling:** Tailwind CSS v4 + Obsidian Terminal Design System
- **Code Editor:** Monaco Editor (`@monaco-editor/react`)
- **Icons:** Lucide React
- **Transpiler:** Sucrase (TypeScript AST transpilation in browser)
- **Database Engine:** `sql.js` (WebAssembly SQLite Sandbox) + Prisma-ready schema
- **Security:** `jose` (Signed JWT sessions), `isomorphic-dompurify` (XSS sanitization)
- **Deployment:** Vercel

---

## 🔐 Administrator Authentication & Security PIN

Per platform specifications, there are no public &quot;Sign In&quot; or &quot;Register&quot; buttons anywhere on the website.

### How to access the Admin Dashboard:
1. Navigate directly to:
   \`\`\`
   http://localhost:3000/admin/login
   (or https://backbencher.codes/admin/login in production)
   \`\`\`
2. Enter the **High-Security Admin PIN**.
   - Default local PIN: `849201`
   - Configurable via the `ADMIN_SECURITY_PIN` environment variable.
3. Once verified, you will be redirected to `/admin` where you can:
   - Create, edit, and preview technical articles.
   - Toggle post status between **Draft** and **Published**.
   - Set URL slugs, categories, tags, and custom SEO metadata.
   - Delete articles with confirmation.

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js 18+ (tested with v24.11.0)
- npm 9+

### 1. Clone & Install Dependencies
\`\`\`bash
git clone https://github.com/your-username/webbb.git
cd webbb
npm install
\`\`\`

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
\`\`\`bash
cp .env.example .env.local
\`\`\`

Update `.env.local` if desired:
\`\`\`env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_ADS_ENABLED=false
ADMIN_SECURITY_PIN=849201
ADMIN_SESSION_SECRET=backbencher-super-secret-admin-session-key-32chars
\`\`\`

### 3. Start Development Server
\`\`\`bash
npm run dev
\`\`\`
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Production Build & Validation

Run the optimized Next.js build:
\`\`\`bash
npm run build
\`\`\`

Run production server:
\`\`\`bash
npm start
\`\`\`

---

## 🚢 Vercel Deployment & Custom Domain Setup

1. **Deploy to Vercel:**
   - Push your code to a GitHub repository.
   - Import the project into Vercel.
   - Add environment variables in Vercel Project Settings:
     - `ADMIN_SECURITY_PIN` (set your secret production PIN)
     - `ADMIN_SESSION_SECRET` (generate a 32+ character random string)
     - `NEXT_PUBLIC_SITE_URL` = `https://backbencher.codes`
     - `NEXT_PUBLIC_ADS_ENABLED` = `false` (until AdSense is approved)
     - `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID` = `ca-pub-XXXXXXXXXXXXXXXX`

2. **Configure Custom Domain (`backbencher.codes`):**
   - In Vercel Project Settings &gt; **Domains**, add `backbencher.codes` and `www.backbencher.codes`.
   - Update your DNS records at your registrar:
     - **A Record:** `@` points to `76.76.21.21`
     - **CNAME Record:** `www` points to `cname.vercel-dns.com`
   - Vercel will automatically provision a free SSL/TLS certificate with automatic HTTPS renewal.

---

## 📈 Google AdSense Approval Checklist

- [x] High-quality, original technical content in `/blog`.
- [x] Clear Privacy Policy (`/privacy`), Terms of Service (`/terms`), and Disclaimer (`/disclaimer`).
- [x] Fixed-height ad containers preventing Cumulative Layout Shift (CLS).
- [x] No ads placed over interactive editor controls, terminal output, or buttons.
- [x] Dynamic `sitemap.xml` and `robots.txt` indexing valid pages.
- [x] Fast page load times and mobile-responsive layouts.
- [ ] Submit `https://backbencher.codes` for review in the Google AdSense console.
- [ ] Once approved, set `NEXT_PUBLIC_ADS_ENABLED=true` in Vercel environment variables.

---

## 📄 License

Proprietary © Backbencher.codes. Built for developers worldwide.
