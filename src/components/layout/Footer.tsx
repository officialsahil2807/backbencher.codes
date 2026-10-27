import React from "react";
import Link from "next/link";
import { Terminal, Shield, ExternalLink, Heart, Coffee } from "lucide-react";

export function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "var(--background)",
        borderTop: "1px solid var(--border)",
        color: "var(--muted)",
      }}
      className="w-full text-xs mt-16 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Support Backbencher.codes Banner */}
        <div
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
          }}
          className="relative overflow-hidden rounded-2xl border p-6 sm:p-8 mb-12 shadow-lg group hover:border-[#FF7900]/40 transition-all duration-300"
        >
          {/* Ambient gradient lighting */}
          <div
            className="absolute -right-20 -top-20 w-64 h-64 rounded-full pointer-events-none opacity-15 blur-3xl group-hover:opacity-25 transition-opacity"
            style={{ backgroundColor: "#0070BA" }}
          />
          <div
            className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full pointer-events-none opacity-15 blur-3xl group-hover:opacity-25 transition-opacity"
            style={{ backgroundColor: "#FF7900" }}
          />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#FF7900]/10 text-[#FF7900] border border-[#FF7900]/20 font-mono">
                <Heart className="w-3.5 h-3.5 fill-current text-rose-500 animate-pulse" />
                <span>Support Backbencher.codes</span>
              </div>
              <h3
                style={{ color: "var(--foreground)" }}
                className="text-lg sm:text-xl font-extrabold tracking-tight"
              >
                Help Keep Our Online Compilers Free &amp; Fast
              </h3>
              <p
                style={{ color: "var(--muted)" }}
                className="text-xs sm:text-sm leading-relaxed"
              >
                Backbencher.codes is created to provide fast, zero-setup, and high-performance coding compilers for developers, students, and educators worldwide. If this tool helped you code, learn, or build, consider supporting our cloud server &amp; execution infrastructure.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
              <a
                href="https://paypal.me/sahilkamble2807"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#0070BA] hover:bg-[#005EA6] transition-all shadow-[0_4px_20px_rgba(0,112,186,0.35)] hover:scale-[1.02] active:scale-[0.98]"
              >
                {/* Official PayPal SVG */}
                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.78.78 0 0 1 .77-.654h6.399c2.093 0 3.774.453 5.04 1.358 1.275.912 1.905 2.274 1.874 4.053-.028 1.637-.624 3.033-1.786 4.187-1.155 1.146-2.678 1.764-4.57 1.854h-1.848a.78.78 0 0 0-.77.654l-.79 4.966a.641.641 0 0 1-.633.74h-.504l.15-.94h-.97zm3.177-8.87h1.43c1.378 0 2.456-.412 3.23-1.236.784-.836 1.185-1.921 1.203-3.254.02-1.3-.396-2.263-1.248-2.888-.843-.618-2.02-.927-3.53-.927H7.728l-2.05 12.923h2.366l.78-4.908a1.42 1.42 0 0 1 1.43-1.188z" />
                </svg>
                <span>Support via PayPal</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#FF7900] flex items-center justify-center text-[#0B0B0D] font-black text-xs">
                &lt;&gt;
              </div>
              <span style={{ color: "var(--foreground)" }} className="font-bold text-sm">
                Backbencher<span className="text-[#FF7900]">.codes</span>
              </span>
            </Link>
            <p style={{ color: "var(--muted-foreground)" }} className="leading-relaxed text-[11px]">
              High-performance programming education platform and browser-based coding workspace inspired by Visual Studio Code. Zero setup required.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-500 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All compiler runtimes operational</span>
            </div>
          </div>

          {/* Quick Compilers */}
          <div>
            <h4 style={{ color: "var(--foreground)" }} className="font-bold text-xs uppercase tracking-wider mb-3 font-mono">
              Popular Compilers
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <Link href="/compiler/python" className="hover:text-[#FF7900] transition-colors">
                  Python Online Compiler
                </Link>
              </li>
              <li>
                <Link href="/compiler/cpp" className="hover:text-[#FF7900] transition-colors">
                  C++ Online Compiler
                </Link>
              </li>
              <li>
                <Link href="/compiler/c" className="hover:text-[#FF7900] transition-colors">
                  C Online Compiler
                </Link>
              </li>
              <li>
                <Link href="/compiler/java" className="hover:text-[#FF7900] transition-colors">
                  Java Online Compiler
                </Link>
              </li>
              <li>
                <Link href="/compiler/javascript" className="hover:text-[#FF7900] transition-colors">
                  JavaScript Playground
                </Link>
              </li>
              <li>
                <Link href="/compiler/rust" className="hover:text-[#FF7900] transition-colors">
                  Rust Online Compiler
                </Link>
              </li>
              <li>
                <Link href="/compiler/sql" className="hover:text-[#FF7900] transition-colors">
                  SQL SQLite Sandbox
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Resources */}
          <div>
            <h4 style={{ color: "var(--foreground)" }} className="font-bold text-xs uppercase tracking-wider mb-3 font-mono">
              Resources
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <a
                  href="https://paypal.me/sahilkamble2807"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#FF7900] transition-colors flex items-center gap-1.5 font-bold text-[#0070BA] dark:text-[#38a9f5]"
                >
                  <Heart className="w-3 h-3 fill-current text-rose-500 shrink-0" />
                  <span>Support Backbencher.codes</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-75" />
                </a>
              </li>
              <li>
                <Link href="/compiler" className="hover:text-[#FF7900] transition-colors">
                  Online IDE Workspace
                </Link>
              </li>
              <li>
                <Link href="/#languages" className="hover:text-[#FF7900] transition-colors">
                  Supported Languages
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#FF7900] transition-colors">
                  Developer Blog &amp; Guides
                </Link>
              </li>
              <li>
                <Link href="/feed.xml" className="hover:text-[#FF7900] transition-colors flex items-center gap-1">
                  RSS Feed <ExternalLink className="w-2.5 h-2.5" />
                </Link>
              </li>
              <li>
                <Link href="/sitemap.xml" className="hover:text-[#FF7900] transition-colors">
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Policies */}
          <div>
            <h4 style={{ color: "var(--foreground)" }} className="font-bold text-xs uppercase tracking-wider mb-3 font-mono">
              Legal &amp; Compliance
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <Link href="/privacy" className="hover:text-[#FF7900] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#FF7900] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-[#FF7900] transition-colors">
                  Disclaimer
                </Link>
              </li>
              <li>
                <span style={{ color: "var(--muted-foreground)" }} className="flex items-center gap-1 pt-2">
                  <Shield className="w-3 h-3 text-[#FF7900]" />
                  Double-isolated sandbox security
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div
          style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}
          className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]"
        >
          <p>© {new Date().getFullYear()} Backbencher.codes. All rights reserved. Built for developers worldwide.</p>
          <div className="flex items-center gap-3">
            <a
              href="https://paypal.me/sahilkamble2807"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[#0070BA] dark:text-[#38a9f5] hover:underline font-semibold"
            >
              <Heart className="w-3 h-3 fill-current text-rose-500" />
              <span>Support via PayPal</span>
            </a>
            <span>•</span>
            <span className="text-[#FF7900]">Learn. Code. Build.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
