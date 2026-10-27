"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Terminal, Search, Menu, X, Code2, Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/theme/ThemeContext";
import { LanguageLogo } from "@/components/compiler/LanguageLogo";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { theme, toggleTheme } = useTheme();

  const languages = [
    { name: "Python", href: "/compiler/python" },
    { name: "C++", href: "/compiler/cpp" },
    { name: "C", href: "/compiler/c" },
    { name: "Java", href: "/compiler/java" },
    { name: "JavaScript", href: "/compiler/javascript" },
    { name: "TypeScript", href: "/compiler/typescript" },
    { name: "Rust", href: "/compiler/rust" },
    { name: "SQL", href: "/compiler/sql" },
    { name: "HTML / CSS", href: "/compiler/html" },
    { name: "Dart", href: "/compiler/dart" },
    { name: "PHP", href: "/compiler/php" },
    { name: "Swift", href: "/compiler/swift" },
    { name: "Kotlin", href: "/compiler/kotlin" },
  ];

  const filteredLanguages = languages.filter((l) =>
    l.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isDark = theme === "dark";

  return (
    <nav
      style={{
        backgroundColor: isDark ? "rgba(11,11,13,0.92)" : "rgba(248,248,250,0.92)",
        borderBottom: `1px solid ${isDark ? "#292929" : "#E4E4E7"}`,
      }}
      className="sticky top-0 z-40 w-full backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[#FF7900] flex items-center justify-center text-[#0B0B0D] font-black text-sm shadow-[0_0_15px_rgba(255,121,0,0.3)] group-hover:scale-105 transition-transform">
              &lt;&gt;
            </div>
            <div className="flex flex-col">
              <span
                className="font-bold text-base tracking-tight group-hover:text-[#FF7900] transition-colors"
                style={{ color: "var(--foreground)" }}
              >
                Backbencher<span className="text-[#FF7900]">.codes</span>
              </span>
              <span style={{ color: "var(--muted)" }} className="text-[10px] tracking-wider uppercase font-mono">
                Learn. Code. Build.
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              href="/"
              style={{ color: "var(--muted)" }}
              className="hover:text-[#FF7900] transition-colors"
            >
              Home
            </Link>
            <Link
              href="/compiler"
              style={{ color: "var(--foreground)" }}
              className="flex items-center gap-1.5 hover:text-[#FF7900] transition-colors"
            >
              <Terminal className="w-4 h-4 text-[#FF7900]" />
              Online Compiler
            </Link>
            <Link
              href="/#languages"
              style={{ color: "var(--muted)" }}
              className="hover:text-[#FF7900] transition-colors"
            >
              Languages
            </Link>
            <Link
              href="/blog"
              style={{ color: "var(--muted)" }}
              className="hover:text-[#FF7900] transition-colors"
            >
              Blog
            </Link>
          </div>

          {/* Search & CTAs */}
          <div className="hidden md:flex items-center gap-3">
            {/* Search trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              style={{
                backgroundColor: "var(--card)",
                border: `1px solid var(--border)`,
                color: "var(--muted)",
              }}
              className="flex items-center gap-2 px-3 py-1.5 hover:opacity-80 rounded-lg text-xs transition-opacity"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search compilers...</span>
              <kbd
                style={{
                  backgroundColor: "var(--background)",
                  border: `1px solid var(--border)`,
                  color: "var(--muted-foreground)",
                }}
                className="px-1.5 py-0.5 rounded text-[10px] font-mono"
              >
                Ctrl K
              </kbd>
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              style={{
                backgroundColor: "var(--card)",
                border: `1px solid var(--border)`,
                color: "var(--muted)",
              }}
              className="p-2 rounded-lg hover:opacity-80 transition-opacity"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Launch Compiler CTA */}
            <Link
              href="/compiler"
              className="flex items-center gap-1.5 px-4 py-2 bg-[#FF7900] hover:bg-[#FF963D] text-[#0B0B0D] font-bold text-xs rounded-lg transition-all shadow-[0_0_20px_rgba(255,121,0,0.2)] hover:scale-105 active:scale-95"
            >
              <Code2 className="w-4 h-4" />
              <span>Start Coding</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              style={{ color: "var(--muted)" }}
              className="p-2 hover:text-[#FF7900] transition-colors"
              title="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setSearchOpen(true)}
              style={{ color: "var(--muted)" }}
              className="p-2 hover:text-[#FF7900] transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ color: "var(--muted)" }}
              className="p-2 hover:text-[#FF7900] transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: "var(--card)",
            borderBottom: `1px solid var(--border)`,
          }}
          className="md:hidden px-4 pt-3 pb-5 space-y-3"
        >
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: "var(--foreground)" }}
            className="block hover:text-[#FF7900] font-medium text-sm py-1 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/compiler"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[#FF7900] font-semibold text-sm py-1"
          >
            Online Compiler
          </Link>
          <Link
            href="/#languages"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: "var(--muted)" }}
            className="block hover:text-[#FF7900] font-medium text-sm py-1 transition-colors"
          >
            Languages
          </Link>
          <Link
            href="/blog"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: "var(--muted)" }}
            className="block hover:text-[#FF7900] font-medium text-sm py-1 transition-colors"
          >
            Blog
          </Link>
          <div className="pt-2">
            <Link
              href="/compiler"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FF7900] text-[#0B0B0D] font-bold text-sm rounded-lg"
            >
              Start Coding Now
            </Link>
          </div>
        </div>
      )}

      {/* Quick Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center pt-24 px-4">
          <div
            style={{
              backgroundColor: "var(--card)",
              border: `1px solid var(--border)`,
            }}
            className="rounded-xl max-w-lg w-full overflow-hidden shadow-2xl"
          >
            <div
              style={{ borderBottom: `1px solid var(--border)` }}
              className="flex items-center px-4 py-3"
            >
              <Search className="w-4 h-4 text-[#FF7900] mr-3" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search languages or compilers (e.g. Python, C++, Rust)..."
                style={{ color: "var(--foreground)" }}
                className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--muted-foreground)]"
              />
              <button
                onClick={() => setSearchOpen(false)}
                style={{
                  color: "var(--muted)",
                  backgroundColor: "var(--hover-bg)",
                }}
                className="text-xs hover:opacity-80 px-2 py-1 rounded"
              >
                ESC
              </button>
            </div>

            <div className="max-h-64 overflow-y-auto p-2">
              <div style={{ color: "var(--muted-foreground)" }} className="text-[10px] uppercase font-bold tracking-wider px-3 py-1.5">
                Languages & Compilers
              </div>
              {filteredLanguages.map((l) => {
                const langId = l.href.replace("/compiler/", "");
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setSearchOpen(false)}
                    style={{ color: "var(--foreground)" }}
                    className="flex items-center justify-between px-3 py-2 text-xs rounded hover:bg-[var(--hover-bg)] transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <LanguageLogo languageId={langId} size={16} />
                      <span className="font-medium">{l.name}</span>
                    </div>
                    <span className="text-[11px] text-[#FF7900] group-hover:translate-x-0.5 transition-transform">
                      Open Compiler →
                    </span>
                  </Link>
                );
              })}
              {filteredLanguages.length === 0 && (
                <div style={{ color: "var(--muted-foreground)" }} className="text-center py-6 text-xs">
                  No compilers matching &quot;{searchQuery}&quot;
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
