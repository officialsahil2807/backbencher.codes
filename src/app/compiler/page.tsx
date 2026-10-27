import React from "react";
import type { Metadata } from "next";
import { CompilerIDE } from "@/components/compiler/CompilerIDE";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AdSlot } from "@/components/ads/AdSlot";

export const metadata: Metadata = {
  title: "Online Compiler & IDE | Backbencher.codes",
  description:
    "Fast, VS Code-like online compiler and code editor supporting Python, C, C++, Java, Rust, JavaScript, TypeScript, SQL, Dart, and more with instant execution.",
};

export default function CompilerPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}>
      <Navbar />

      <main className="flex-1 max-w-[1720px] w-full mx-auto p-3 sm:p-4 md:p-6 flex flex-col gap-4">
        {/* Ad slot reserved space above editor */}
        <AdSlot placement="compiler-top" className="max-w-4xl mx-auto w-full" />

        {/* The VS Code-like Online Compiler */}
        <CompilerIDE initialLanguage="python" />

        {/* Ad slot reserved space below editor */}
        <AdSlot placement="compiler-bottom" className="max-w-4xl mx-auto w-full" />
      </main>

      <Footer />
    </div>
  );
}
