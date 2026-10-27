"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Terminal,
  Play,
  Cpu,
  Zap,
  ShieldCheck,
  Code2,
  FolderTree,
  ChevronDown,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AdSlot } from "@/components/ads/AdSlot";
import { LANGUAGE_LIST } from "@/lib/compiler/languages";
import { LanguageLogo } from "@/components/compiler/LanguageLogo";

function HighlightedCode({ code, lang }: { code: string; lang: string }) {
  const lines = code.split('\n');
  const kwRe = lang === 'python'
    ? /\b(def|return|if|else|elif|for|in|range|while|import|from|class|True|False|None|and|or|not|print|len)\b/g
    : lang === 'rust'
    ? /\b(fn|let|mut|pub|use|struct|impl|enum|match|if|else|for|while|return|self|true|false|vec|println|Vec|String)\b/g
    : lang === 'cpp'
    ? /\b(int|void|return|include|std|vector|string|double|auto|const|double|static_cast|main|cout|cin|endl|accumulate|size)\b/g
    : /\b(type|interface|function|const|let|var|return|if|else|for|while|async|await|new|true|false|string|number|boolean|Result|parseScore|isNaN|Number|console|log|outcome)\b/g;

  return (
    <div
      style={{ backgroundColor: "var(--editor)", color: "var(--foreground)" }}
      className="p-4 overflow-x-auto font-mono text-[11px] leading-[1.65] min-h-[220px] transition-colors"
    >
      {lines.map((line, li) => {
        if (!line && li === lines.length - 1) return null;
        const parts: Array<{t: string; text: string}> = [];
        const commentStart = lang === 'python' ? line.indexOf('#') : line.indexOf('//');
        const strStart = line.search(/["'`]/);
        const main = commentStart >= 0 && (strStart < 0 || commentStart < strStart) ? line.slice(0, commentStart) : line;
        const comment = commentStart >= 0 && (strStart < 0 || commentStart < strStart) ? line.slice(commentStart) : null;

        let last = 0;
        const re = new RegExp(kwRe.source, 'g');
        let m;
        while ((m = re.exec(main)) !== null) {
          if (m.index > last) parts.push({t: 'plain', text: main.slice(last, m.index)});
          parts.push({t: 'kw', text: m[0]});
          last = m.index + m[0].length;
        }
        if (last < main.length) parts.push({t: 'plain', text: main.slice(last)});
        if (comment) parts.push({t: 'comment', text: comment});

        return (
          <div key={li} className="flex leading-relaxed">
            <span
              style={{ color: "var(--muted-foreground)" }}
              className="w-7 shrink-0 text-right pr-3 select-none text-[10px] opacity-40 font-mono"
            >
              {li + 1}
            </span>
            <span className="flex-1 whitespace-pre">
              {parts.map((p, pi) => (
                <span
                  key={pi}
                  style={{
                    color: p.t === 'kw'
                      ? '#FF7900'
                      : p.t === 'comment'
                      ? '#6B7280'
                      : 'var(--foreground)',
                    fontWeight: p.t === 'kw' ? 'bold' : 'normal',
                    fontStyle: p.t === 'comment' ? 'italic' : 'normal',
                  }}
                >{p.text}</span>
              ))}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function HomePage() {
  const [activePreviewTab, setActivePreviewTab] = useState<"python" | "cpp" | "typescript" | "rust">("python");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const previewSnippets = {
    python: {
      lang: "Python 3.12",
      filename: "main.py",
      code: `def calculate_primes(limit: int) -> list[int]:
    """Sieve of Eratosthenes algorithm"""
    primes = []
    sieve = [True] * (limit + 1)
    for p in range(2, limit + 1):
        if sieve[p]:
            primes.append(p)
            for i in range(p * p, limit + 1, p):
                sieve[i] = False
    return primes

result = calculate_primes(30)
print(f"⚡ Primes up to 30: {result}")
# Output: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]`,
      output: "⚡ Primes up to 30: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]\nProgram finished with exit code 0 (14ms).",
    },
    cpp: {
      lang: "C++20",
      filename: "solution.cpp",
      code: `#include <iostream>
#include <vector>
#include <numeric>

int main() {
    std::vector<int> scores = {98, 87, 92, 100, 95};
    int total = std::accumulate(scores.begin(), scores.end(), 0);
    double average = static_cast<double>(total) / scores.size();
    
    std::cout << "⚡ Processed " << scores.size() << " student benchmarks.\\n";
    std::cout << "Average score: " << average << "%\\n";
    return 0;
}`,
      output: "⚡ Processed 5 student benchmarks.\nAverage score: 94.4%\nProgram finished with exit code 0 (21ms).",
    },
    typescript: {
      lang: "TypeScript 5.4",
      filename: "compiler.ts",
      code: `type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

function parseScore(input: string): Result<number, string> {
  const val = Number(input);
  return isNaN(val) ? { ok: false, error: "Invalid numeric token" } : { ok: true, value: val };
}

const outcome = parseScore("100");
console.log("Validated Result:", outcome);`,
      output: 'Validated Result: { ok: true, value: 100 }\nProgram finished with exit code 0 (8ms).',
    },
    rust: {
      lang: "Rust 1.78",
      filename: "main.rs",
      code: `fn main() {
    let dataset = vec!["Concurrency", "Memory Safety", "Zero Cost"];
    for (idx, topic) in dataset.iter().enumerate() {
        println!("{}. Modern Systems Paradigm: {}", idx + 1, topic);
    }
}`,
      output: "1. Modern Systems Paradigm: Concurrency\n2. Modern Systems Paradigm: Memory Safety\n3. Modern Systems Paradigm: Zero Cost\nProgram finished with exit code 0 (32ms).",
    },
  };

  const faqs = [
    {
      q: "Is Backbencher.codes completely free to use?",
      a: "Yes. All online compilers, code editors, and learning sandboxes on Backbencher.codes are 100% free with no registration or sign-in required.",
    },
    {
      q: "Which programming languages and compilers are supported?",
      a: "We support 14 industry-standard programming languages: Python, C, C++, Java, JavaScript, TypeScript, HTML/CSS, Rust, SQL, Dart, PHP, Swift, and Kotlin, each equipped with genuine compilers and runtime environments.",
    },
    {
      q: "Can I enter standard input (stdin) for interactive programs?",
      a: "Absolutely. In languages like Python, C, C++, and Java, open the 'Standard Input (stdin)' tab in the output panel to provide user input before clicking Run.",
    },
    {
      q: "How does Backbencher.codes execute code securely?",
      a: "Web technologies (HTML, CSS, JS, TS) run inside double-isolated, null-origin sandboxed iframes. Backend languages run inside isolated sandboxed cloud containers with strict CPU, memory, and timeout quotas.",
    },
    {
      q: "Are my code drafts saved automatically?",
      a: "Yes. Your code edits and multi-file projects are automatically stored locally in your browser's local storage. Your source code remains entirely private to your device.",
    },
  ];

  return (
    <div
      style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
      className="min-h-screen flex flex-col transition-colors duration-200"
    >
      <Navbar />

      <main className="flex-1 flex flex-col">
        {/* HERO SECTION */}
        <section className="relative px-4 sm:px-6 lg:px-8 pt-16 pb-20 max-w-7xl mx-auto w-full overflow-hidden">
          {/* Subtle radial orange glow in background */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#FF7900]/10 blur-[120px] rounded-full pointer-events-none -z-10" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Left Column */}
            <div className="lg:col-span-6 space-y-6">
              <div
                style={{ backgroundColor: "var(--card)", borderColor: "var(--border)", color: "var(--primary)" }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono"
              >
                <span className="w-2 h-2 rounded-full bg-[#FF7900] animate-pulse" />
                <span>Next-Gen Online IDE & Compiler</span>
              </div>

              <h1
                style={{ color: "var(--foreground)" }}
                className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]"
              >
                Code smarter. <br />
                <span className="text-[#FF7900] underline decoration-[#FF7900]/30 underline-offset-8">
                  Build anything.
                </span>
              </h1>

              <p
                style={{ color: "var(--muted)" }}
                className="text-base sm:text-lg leading-relaxed max-w-xl"
              >
                Learn programming, experiment with code, and run your programs in one powerful online workspace inspired by Visual Studio Code. Zero setup required.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/compiler"
                  className="flex items-center gap-2 px-6 py-3.5 bg-[#FF7900] hover:bg-[#FF963D] text-[#0B0B0D] font-extrabold text-sm rounded-xl transition-all shadow-[0_0_25px_rgba(255,121,0,0.3)] hover:scale-105 active:scale-95"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start Coding Now</span>
                </Link>

                <Link
                  href="#languages"
                  style={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)"
                  }}
                  className="flex items-center gap-2 px-6 py-3.5 border hover:border-[#FF7900] font-semibold text-sm rounded-xl transition-all hover:scale-105"
                >
                  <span>Explore Languages</span>
                  <ArrowRight className="w-4 h-4" style={{ color: "var(--muted)" }} />
                </Link>
              </div>

              {/* Feature Pills */}
              <div
                style={{ borderColor: "var(--border)" }}
                className="grid grid-cols-3 gap-3 pt-6 border-t"
              >
                <div className="space-y-1">
                  <div style={{ color: "var(--foreground)" }} className="text-sm font-bold">14+ Languages</div>
                  <div style={{ color: "var(--muted-foreground)" }} className="text-[11px]">Native & Cloud</div>
                </div>
                <div className="space-y-1">
                  <div style={{ color: "var(--foreground)" }} className="text-sm font-bold">Sub-second Run</div>
                  <div style={{ color: "var(--muted-foreground)" }} className="text-[11px]">Instant Feedback</div>
                </div>
                <div className="space-y-1">
                  <div style={{ color: "var(--foreground)" }} className="text-sm font-bold">100% Free</div>
                  <div style={{ color: "var(--muted-foreground)" }} className="text-[11px]">No Account Needed</div>
                </div>
              </div>
            </div>

            {/* Hero Right Column: Animated IDE Preview */}
            <div className="lg:col-span-6">
              <div
                style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
                className="rounded-xl border shadow-2xl overflow-hidden font-mono text-xs transition-colors"
              >
                {/* Window Bar */}
                <div
                  style={{ backgroundColor: "var(--toolbar)", borderColor: "var(--border)" }}
                  className="flex items-center justify-between px-4 py-2.5 border-b"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/80" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span style={{ color: "var(--muted-foreground)" }} className="text-[11px]">
                    Backbencher Workspace — {previewSnippets[activePreviewTab].filename}
                  </span>
                  <Link
                    href={`/compiler/${activePreviewTab}`}
                    className="flex items-center gap-1 text-[11px] text-[#FF7900] hover:underline"
                  >
                    Open Live <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>

                {/* Tab selector */}
                <div
                  style={{ backgroundColor: "var(--tab-bar)", borderColor: "var(--border)" }}
                  className="flex items-center border-b overflow-x-auto"
                >
                  {(["python", "cpp", "typescript", "rust"] as const).map((tab) => {
                    const isActive = activePreviewTab === tab;
                    return (
                      <button
                        key={tab}
                        onClick={() => setActivePreviewTab(tab)}
                        style={{
                          backgroundColor: isActive ? "var(--editor)" : "transparent",
                          color: isActive ? "var(--primary)" : "var(--muted)",
                          borderRight: "1px solid var(--border)",
                          borderTop: isActive ? "2px solid var(--primary)" : "2px solid transparent",
                        }}
                        className="px-4 py-2 text-xs transition-colors font-medium"
                      >
                        {previewSnippets[tab].filename}
                      </button>
                    );
                  })}
                </div>

                {/* Syntax-Highlighted Code Body */}
                <HighlightedCode
                  code={previewSnippets[activePreviewTab].code}
                  lang={activePreviewTab}
                />

                {/* Simulated Terminal Output */}
                <div
                  style={{ backgroundColor: "var(--output-bg)", borderColor: "var(--border)" }}
                  className="border-t p-3 text-[11px] transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5 text-emerald-500 font-semibold font-mono text-[10px] uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        stdout
                      </span>
                      <span style={{ color: "var(--muted-foreground)" }} className="text-[10px] font-mono">
                        exit code 0 · {previewSnippets[activePreviewTab].lang}
                      </span>
                    </div>
                    <span
                      style={{ backgroundColor: "var(--card)", borderColor: "var(--border)", color: "var(--muted)" }}
                      className="text-[10px] font-mono px-2 py-0.5 rounded border"
                    >
                      ✓ 14ms
                    </span>
                  </div>
                  <pre
                    style={{ color: "var(--foreground)" }}
                    className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed opacity-90"
                  >
                    {previewSnippets[activePreviewTab].output}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AD SLOT: HOMEPAGE TOP */}
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <AdSlot placement="homepage-banner" />
        </div>

        {/* 14-LANGUAGES GRID SECTION */}
        <section id="languages" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <h2 className="text-xs uppercase font-mono font-bold tracking-widest text-[#FF7900]">
              Supported Ecosystems
            </h2>
            <h3 style={{ color: "var(--foreground)" }} className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              14 Online Compilers & Playgrounds
            </h3>
            <p style={{ color: "var(--muted)" }} className="text-sm">
              Pick your preferred programming environment. Zero installation, preconfigured runtimes, ready in milliseconds.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {LANGUAGE_LIST.map((lang) => (
              <div
                key={lang.id}
                style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
                className="group p-5 border hover:border-[#FF7900] rounded-xl flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center p-1.5 shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                        <LanguageLogo languageId={lang.id} size={20} />
                      </div>
                      <h4
                        style={{ color: "var(--foreground)" }}
                        className="font-bold text-sm group-hover:text-[#FF7900] transition-colors"
                      >
                        {lang.name}
                      </h4>
                    </div>
                    <span
                      style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--muted)" }}
                      className="text-[10px] px-2 py-0.5 rounded border font-mono"
                    >
                      {lang.version}
                    </span>
                  </div>

                  <p
                    style={{ color: "var(--muted)" }}
                    className="text-xs leading-relaxed mb-4 line-clamp-2"
                  >
                    {lang.description}
                  </p>
                </div>

                <div
                  style={{ borderColor: "var(--border)" }}
                  className="pt-3 border-t flex items-center justify-between"
                >
                  <span style={{ color: "var(--muted-foreground)" }} className="text-[10px] uppercase font-mono tracking-wider">
                    {lang.category === "browser" ? "Browser Native" : lang.category === "sql" ? "SQLite Sandbox" : "Cloud Container"}
                  </span>
                  <Link
                    href={`/compiler/${lang.id}`}
                    className="flex items-center gap-1 text-xs font-bold text-[#FF7900] group-hover:translate-x-0.5 transition-transform"
                  >
                    Launch IDE →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* WHY BACKBENCHER.CODES FEATURE GRID */}
        <section
          style={{ borderColor: "var(--border)" }}
          className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t"
        >
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs uppercase font-mono font-bold tracking-widest text-[#FF7900]">
              Why Backbencher.codes?
            </h2>
            <h3 style={{ color: "var(--foreground)" }} className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Engineered for Developers
            </h3>
            <p style={{ color: "var(--muted)" }} className="text-sm">
              Unlike cluttered tutorial sites with fake buttons, Backbencher provides a real developer-grade IDE with real compilation output.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Cpu,
                title: "Genuine Execution Engine",
                desc: "Real compilers for C, C++, Java, Rust, Swift, Kotlin, Dart, and Python with stdout, stderr, compile diagnostics, exit status, and elapsed millisecond timing.",
              },
              {
                icon: Code2,
                title: "Monaco Editor Intelligence",
                desc: "Powered by the engine behind VS Code: syntax highlighting, bracket matching, active line highlight, minimap, formatting, and auto-closing.",
              },
              {
                icon: FolderTree,
                title: "Multi-File Workspace",
                desc: "Create, rename, and manage multiple files in your browser project tree. Download single files or export your entire project as a ZIP archive.",
              },
              {
                icon: ShieldCheck,
                title: "Double-Isolated Security",
                desc: "Web scripts execute inside strict null-origin sandboxes without access to your cookies or storage. Untrusted code is never run on host servers.",
              },
              {
                icon: Zap,
                title: "Sub-second Cloud Execution",
                desc: "Optimized micro-container instances and in-memory WebAssembly SQLite engine delivering results in milliseconds.",
              },
              {
                icon: Terminal,
                title: "Interactive Standard Input",
                desc: "Test interactive CLI tools and algorithms with custom stdin inputs for Python, C, C++, and Java without restrictions.",
              },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
                  className="p-6 border rounded-xl space-y-3 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#FF7900]/10 flex items-center justify-center text-[#FF7900]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 style={{ color: "var(--foreground)" }} className="font-bold text-base">{f.title}</h4>
                  <p style={{ color: "var(--muted)" }} className="text-xs leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* FAQ ACCORDION SECTION */}
        <section
          style={{ borderColor: "var(--border)" }}
          className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full border-t"
        >
          <div className="text-center mb-12 space-y-2">
            <h2 className="text-xs uppercase font-mono font-bold tracking-widest text-[#FF7900]">
              Frequently Asked Questions
            </h2>
            <h3 style={{ color: "var(--foreground)" }} className="text-3xl font-extrabold tracking-tight">
              Got Questions? We&apos;ve Got Answers.
            </h3>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
                  className="border rounded-xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    style={{ color: "var(--foreground)" }}
                    className="w-full flex items-center justify-between p-4 text-left font-bold text-sm hover:text-[#FF7900] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      style={{ color: isOpen ? "#FF7900" : "var(--muted)" }}
                      className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isOpen && (
                    <div
                      style={{ borderColor: "var(--border)", color: "var(--muted)" }}
                      className="px-4 pb-4 text-xs leading-relaxed border-t pt-3"
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* BOTTOM CALL TO ACTION */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full text-center">
          <div
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
            className="border rounded-2xl p-8 sm:p-12 space-y-6 shadow-xl transition-colors"
          >
            <h3 style={{ color: "var(--foreground)" }} className="text-2xl sm:text-3xl font-black">
              Ready to code without limits?
            </h3>
            <p style={{ color: "var(--muted)" }} className="text-xs sm:text-sm max-w-lg mx-auto">
              Jump directly into our VS Code-like online compiler. No login, no credit cards, no setup delays.
            </p>
            <Link
              href="/compiler"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#FF7900] hover:bg-[#FF963D] text-[#0B0B0D] font-extrabold text-sm rounded-xl transition-all shadow-[0_0_30px_rgba(255,121,0,0.3)] hover:scale-105 active:scale-95"
            >
              <Code2 className="w-4 h-4" />
              <span>Launch Online Compiler</span>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
