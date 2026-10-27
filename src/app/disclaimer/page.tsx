import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AlertCircle, ShieldCheck, ExternalLink, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Disclaimer | Backbencher.codes",
  description: "General disclaimer regarding compiler outputs, educational materials, and code execution.",
};

export default function DisclaimerPage() {
  return (
    <div
      style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
      className="min-h-screen flex flex-col transition-colors duration-200"
    >
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <header
          style={{ borderColor: "var(--border)" }}
          className="border-b pb-6 space-y-2"
        >
          <div
            style={{
              backgroundColor: "var(--card)",
              borderColor: "var(--border)",
              color: "var(--primary)",
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono font-semibold"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Legal Disclaimer</span>
          </div>

          <h1
            style={{ color: "var(--foreground)" }}
            className="text-3xl sm:text-4xl font-black tracking-tight"
          >
            Disclaimer
          </h1>
          <p
            style={{ color: "var(--muted-foreground)" }}
            className="text-xs font-mono"
          >
            Last updated: March 2026 • Version 1.2
          </p>
        </header>

        <section
          style={{ color: "var(--muted)" }}
          className="space-y-6 text-sm leading-relaxed"
        >
          {/* Section 1 */}
          <div
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
            className="p-6 rounded-2xl border space-y-2 shadow-sm"
          >
            <h2
              style={{ color: "var(--foreground)" }}
              className="text-lg font-bold flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-[#FF7900]" />
              <span>1. Educational Purposes Only</span>
            </h2>
            <p>
              The information, programming examples, code compilation outputs, tutorials, and technical articles provided on Backbencher.codes are intended solely for educational, informational, and experimental software development purposes.
            </p>
          </div>

          {/* Section 2 */}
          <div
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
            className="p-6 rounded-2xl border space-y-2 shadow-sm"
          >
            <h2
              style={{ color: "var(--foreground)" }}
              className="text-lg font-bold flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-[#FF7900]" />
              <span>2. No Production Guarantees</span>
            </h2>
            <p>
              While we strive to provide accurate compiler environments, latest language toolchains, and optimized execution runtimes, users should thoroughly test, profile, and security-audit any algorithms, code snippets, or scripts in their own staging environments before deploying them in production or mission-critical systems.
            </p>
          </div>

          {/* Section 3 */}
          <div
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
            className="p-6 rounded-2xl border space-y-2 shadow-sm"
          >
            <h2
              style={{ color: "var(--foreground)" }}
              className="text-lg font-bold flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4 text-[#FF7900]" />
              <span>3. External Links &amp; Third-Party Services</span>
            </h2>
            <p>
              Backbencher.codes may reference external open-source documentation, third-party specifications, or software libraries. We do not endorse or assume liability for the accuracy, uptime, or privacy practices of external third-party resources.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
