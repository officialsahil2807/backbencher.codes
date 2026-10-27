import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CompilerIDE } from "@/components/compiler/CompilerIDE";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AdSlot } from "@/components/ads/AdSlot";
import { LanguageLogo } from "@/components/compiler/LanguageLogo";
import { LANGUAGES } from "@/lib/compiler/languages";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const langConfig = LANGUAGES[lang.toLowerCase()];

  if (!langConfig) {
    return {
      title: "Compiler Not Found | Backbencher.codes",
    };
  }

  return {
    title: `${langConfig.name} Online Compiler (${langConfig.version}) | Backbencher.codes`,
    description: `Run ${langConfig.name} code online in a VS Code-like workspace. ${langConfig.description} Zero setup, instant execution, standard input (stdin) support.`,
  };
}

export default async function LanguageCompilerPage({ params }: PageProps) {
  const { lang } = await params;
  const normalizedLang = lang.toLowerCase();
  const langConfig = LANGUAGES[normalizedLang];

  if (!langConfig) {
    notFound();
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
    >
      <Navbar />

      <main className="flex-1 max-w-[1720px] w-full mx-auto p-3 sm:p-4 md:p-6 flex flex-col gap-4">
        {/* Top header banner with language metadata */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center p-1.5 shrink-0 shadow-sm">
                <LanguageLogo languageId={langConfig.id} size={20} />
              </div>
              {langConfig.name} Online Compiler &amp; Editor
              <span
                className="text-xs px-2 py-0.5 rounded font-mono"
                style={{
                  backgroundColor: "var(--card)",
                  color: "var(--muted)",
                  border: "1px solid var(--border)",
                }}
              >
                {langConfig.version}
              </span>
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
              {langConfig.description}
            </p>
          </div>
        </div>

        {/* Ad slot reserved space above editor */}
        <AdSlot placement="compiler-top" className="max-w-4xl mx-auto w-full" />

        {/* The VS Code-like Online Compiler */}
        <CompilerIDE initialLanguage={normalizedLang} />

        {/* Ad slot reserved space below editor */}
        <AdSlot placement="compiler-bottom" className="max-w-4xl mx-auto w-full" />
      </main>

      <Footer />
    </div>
  );
}
