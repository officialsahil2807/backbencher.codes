export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  author: string;
  category: string;
  tags: string[];
  status: "published" | "draft";
  publishedAt: string;
  readingTime: number;
  coverImage?: string;
  seoTitle?: string;
  seoDesc?: string;
}

// Initial seed blog articles
let postsStore: BlogPost[] = [
  {
    id: "post-1",
    slug: "sub-10ms-cloud-compiler-architecture",
    title: "How We Built a Sub-10ms Online Compiler Architecture",
    excerpt: "A deep dive into micro-sandboxing, in-memory WebAssembly isolation, and container orchestration for instant code execution.",
    author: "Backbencher Core Team",
    category: "Architecture",
    tags: ["Compilers", "WebAssembly", "Docker", "Performance"],
    status: "published",
    publishedAt: "2026-03-15",
    readingTime: 6,
    body: `
# How We Built a Sub-10ms Online Compiler Architecture

Online coding sandboxes often suffer from a frustrating 3 to 8 second cold-start latency. When a learner clicks **Run**, they expect instantaneous feedback—similar to their local terminal.

In this deep dive, we explore how Backbencher.codes achieves near-zero latency execution across 14 languages.

---

## 1. The Multi-Tier Execution Matrix

Not all programming languages need to run inside a heavy Linux container on remote servers. We stratified execution into three isolated tiers:

\`\`\`
+--------------------------------------------------------------+
|                   Client Code Submission                     |
+--------------------------------------------------------------+
                               |
            +------------------+------------------+
            |                                     |
            v                                     v
  [Browser Tier: JS/TS/HTML/CSS]        [Cloud Sandbox Tier]
  - Double Null-Origin Iframe           - Warm Pool Containers
  - In-Memory WebAssembly SQLite       - Per-process Cgroups
  - Zero Network Roundtrip (<5ms)       - Sub-second I/O (<150ms)
\`\`\`

### Tier 1: Client-Side WebAssembly & Native Sandboxes
For frontend languages (HTML, CSS, JavaScript) and TypeScript, compilation and execution happen entirely on the user's hardware within a double-isolated null-origin iframe:
- **TypeScript:** Fast transpilation via modern AST transforms in ~4ms.
- **SQL:** An in-memory SQLite engine initialized via WebAssembly (\`sql.js\`). Users can run real \`CREATE TABLE\`, \`INSERT\`, and complex joins with structured table output, completely isolated from any server database.

### Tier 2: Warm Pool Micro-Containers
For compiled languages like C++, Rust, and Java, cold VM boot times are unacceptable. We maintain a pool of pre-warmed container sandboxes with:
1. Pre-mounted toolchains (GCC 12, OpenJDK 17, rustc 1.78).
2. Read-only root filesystems.
3. Linux cgroups restricting CPU to 1 core and RAM to 128MB.
4. Strict 5-second process timeout enforced at kernel level.

---

## 2. Preventing Sandbox Escapes

Treating user code as untrusted is non-negotiable. Our security model enforces:
- **No Network Egress:** Containers are strictly disconnected from external network access.
- **No Filesystem Persistence:** All writes are directed to a temporary in-memory \`tmpfs\` capped at 10MB.
- **Resource Limits:** \`ulimit\` controls prevent fork bombs (\`:(){ :|:& };:\`) from starving system threads.

---

## Conclusion

By isolating browser-compatible workflows on the client and streamlining remote execution through pre-warmed Linux workers, Backbencher delivers a snappy, desktop-like development experience in the cloud.
`,
  },
  {
    id: "post-2",
    slug: "memory-safety-rust-vs-cpp",
    title: "Memory Safety in 2026: The Practical Comparison of Rust and C++",
    excerpt: "Analyzing borrow checkers, RAII, smart pointers, and modern memory safety standards in production software.",
    author: "Alex Hunter",
    category: "Languages",
    tags: ["Rust", "C++", "Memory Safety", "Systems"],
    status: "published",
    publishedAt: "2026-03-22",
    readingTime: 5,
    body: `
# Memory Safety in 2026: The Practical Comparison of Rust and C++

Memory safety bugs—buffer overflows, use-after-free, and data races—account for approximately 70% of high-severity vulnerabilities across major codebases including Chromium and Windows.

Both C++ (via modern C++20/23 standards) and Rust offer powerful paradigms to write high-performance software. How do their approaches differ in practice?

---

## 1. Rust's Borrow Checker: Compile-Time Verification

Rust eliminates data races and dangling pointers by enforcing ownership rules at compile time:
1. Each value in Rust has an owner.
2. There can only be one owner at a time.
3. When the owner goes out of scope, the value is dropped.

\`\`\`rust
fn process_data(data: Vec<i32>) {
    println!("Vector length: {}", data.len());
} // data dropped here

fn main() {
    let numbers = vec![1, 2, 3];
    process_data(numbers);
    // println!("{:?}", numbers); // COMPILE ERROR: value borrowed after move!
}
\`\`\`

The compiler guarantees memory safety without needing a garbage collector or runtime overhead.

---

## 2. Modern C++: RAII and Smart Pointers

Modern C++ avoids raw pointers through RAII (*Resource Acquisition Is Initialization*) and smart pointers (\`std::unique_ptr\`, \`std::shared_ptr\`):

\`\`\`cpp
#include <memory>
#include <iostream>

void demonstrate() {
    auto ptr = std::make_unique<int>(42);
    std::cout << *ptr << std::endl;
} // automatically deleted when leaving scope
\`\`\`

While smart pointers vastly improve safety, the C++ compiler cannot always catch subtle iterator invalidations or concurrent data races during compilation.

---

## Summary

- **Rust** provides ironclad safety through strict compile-time checks, ideal for critical infrastructure and network services.
- **C++** offers unmatched ecosystem maturity, backwards compatibility, and flexibility, especially in game engines and legacy systems.
`,
  },
  {
    id: "post-3",
    slug: "mastering-python-gil-and-asyncio",
    title: "Understanding Python's GIL & Concurrent Programming in Python 3.12+",
    excerpt: "Demystifying the Global Interpreter Lock, asyncio concurrency, and the new subinterpreter performance models.",
    author: "Sarah Lin",
    category: "Python",
    tags: ["Python", "Concurrency", "Asyncio", "Performance"],
    status: "published",
    publishedAt: "2026-04-02",
    readingTime: 4,
    body: `
# Understanding Python's GIL & Concurrent Programming in Python 3.12+

For years, developers have debated the Global Interpreter Lock (GIL) in CPython. In Python 3.12 and newer versions, fundamental concurrency improvements make Python faster and more scalable than ever.

---

## What is the Global Interpreter Lock?

The GIL is a mutex that prevents multiple native threads from executing Python bytecodes simultaneously. It simplifies memory management and keeps C-extension libraries thread-safe, but it prevents CPU-bound tasks from scaling linearly across multiple CPU cores in a single process.

---

## Asyncio: Concurrency for I/O-Bound Workloads

For network-heavy or I/O-bound tasks (such as HTTP APIs, scraping, or database queries), \`asyncio\` offers cooperative multitasking:

\`\`\`python
import asyncio

async def fetch_telemetry(sensor_id: int):
    print(f"Reading sensor {sensor_id}...")
    await asyncio.sleep(0.5)
    return {"sensor": sensor_id, "reading": 98.6}

async def main():
    tasks = [fetch_telemetry(i) for i in range(1, 4)]
    results = await asyncio.gather(*tasks)
    print(results)

asyncio.run(main())
\`\`\`

---

## Key Takeaway

Use \`asyncio\` for I/O operations and \`multiprocessing\` (or Python 3.12's per-interpreter GIL) for compute-heavy parallel workloads. Test your code live in our Python Online Compiler!
`,
  },
];

import { createClient } from "@supabase/supabase-js";

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey || url.includes("your-project-id") || anonKey.includes("your-anon-key")) {
    return null;
  }
  return createClient(url, anonKey);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRowToPost(row: any): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt || "",
    body: row.body,
    author: row.author || "Backbencher Team",
    category: row.category || "General",
    tags: Array.isArray(row.tags) ? row.tags : [],
    status: row.status as "published" | "draft",
    publishedAt: row.published_at || new Date().toISOString().split("T")[0],
    readingTime: row.reading_time || 5,
    coverImage: row.cover_image,
    seoTitle: row.seo_title,
    seoDesc: row.seo_desc,
  };
}

export async function getPublishedPostsAsync(): Promise<BlogPost[]> {
  try {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("status", "published");

      if (!error && data && data.length > 0) {
        const supabasePosts = data.map(mapRowToPost);
        const supabaseSlugs = new Set(supabasePosts.map((p) => p.slug));
        const defaultSeeds = postsStore.filter(
          (p) => p.status === "published" && !supabaseSlugs.has(p.slug)
        );
        const combined = [...supabasePosts, ...defaultSeeds];
        combined.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
        return combined;
      }
    }
  } catch (err) {
    console.warn("Error fetching posts from Supabase:", err);
  }
  return getPublishedPosts();
}

export async function getPostBySlugAsync(slug: string): Promise<BlogPost | undefined> {
  try {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (!error && data) {
        return mapRowToPost(data);
      }
    }
  } catch (err) {
    console.warn(`Error fetching post '${slug}' from Supabase:`, err);
  }
  return getPostBySlug(slug);
}

export function getPublishedPosts(): BlogPost[] {
  return postsStore.filter((p) => p.status === "published");
}

export function getAllPosts(): BlogPost[] {
  return [...postsStore];
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return postsStore.find((p) => p.slug === slug);
}

export function savePost(post: BlogPost): void {
  const existingIdx = postsStore.findIndex((p) => p.id === post.id);
  if (existingIdx >= 0) {
    postsStore[existingIdx] = post;
  } else {
    postsStore.unshift(post);
  }
}

export function deletePost(id: string): boolean {
  const initialLength = postsStore.length;
  postsStore = postsStore.filter((p) => p.id !== id);
  return postsStore.length < initialLength;
}

