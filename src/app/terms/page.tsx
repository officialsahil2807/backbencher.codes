import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FileText, CheckCircle, Ban, AlertTriangle, ShieldX } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | Backbencher.codes",
  description: "Terms and conditions for utilizing Backbencher.codes compilers and services.",
};

export default function TermsOfServicePage() {
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
            <FileText className="w-3.5 h-3.5" />
            <span>Usage Agreement</span>
          </div>

          <h1
            style={{ color: "var(--foreground)" }}
            className="text-3xl sm:text-4xl font-black tracking-tight"
          >
            Terms of Service
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
            className="p-6 rounded-2xl border space-y-2.5 shadow-sm"
          >
            <h2
              style={{ color: "var(--foreground)" }}
              className="text-lg font-bold flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4 text-[#FF7900]" />
              <span>1. Acceptance of Terms</span>
            </h2>
            <p>
              By accessing, browsing, or running code on Backbencher.codes, you confirm that you have read, understood, and agreed to be bound by these Terms of Service. If you do not agree to these terms, please discontinue using our compilers and web services immediately.
            </p>
          </div>

          {/* Section 2 */}
          <div
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
            className="p-6 rounded-2xl border space-y-2.5 shadow-sm"
          >
            <h2
              style={{ color: "var(--foreground)" }}
              className="text-lg font-bold flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-[#FF7900]" />
              <span>2. Permitted Educational Use</span>
            </h2>
            <p>
              Backbencher.codes provides zero-setup, cloud-accelerated programming compilers and developer education materials. You agree to use the platform solely for lawful development, testing, learning, algorithmic experimentation, and educational purposes.
            </p>
          </div>

          {/* Section 3 */}
          <div
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
            className="p-6 rounded-2xl border space-y-3 shadow-sm"
          >
            <h2
              style={{ color: "var(--foreground)" }}
              className="text-lg font-bold flex items-center gap-2"
            >
              <Ban className="w-4 h-4 text-red-500" />
              <span>3. Strictly Prohibited Activities</span>
            </h2>
            <p>You strictly agree NOT to utilize the code execution runners or sandboxes to:</p>
            <ul className="list-disc pl-5 space-y-1.5 marker:text-[#FF7900]">
              <li>Engage in cryptocurrency mining, botnet operation, or distributed denial-of-service (DDoS) traffic generation.</li>
              <li>Perform port scanning, probe vulnerabilities, or attempt unauthorized penetration testing against third-party servers.</li>
              <li>Distribute, compile, or execute malware, worms, ransomware, or spyware.</li>
              <li>Attempt to escape container sandbox boundaries, alter host cgroups, or compromise runner kernel parameters.</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
            className="p-6 rounded-2xl border space-y-2.5 shadow-sm"
          >
            <h2
              style={{ color: "var(--foreground)" }}
              className="text-lg font-bold flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>4. Disclaimer of Warranties</span>
            </h2>
            <p>
              All compiler tools, playgrounds, tutorials, and services are provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind, whether express or implied. We do not warrant that execution services will be completely error-free or uninterrupted.
            </p>
          </div>

          {/* Section 5 */}
          <div
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
            className="p-6 rounded-2xl border space-y-2.5 shadow-sm"
          >
            <h2
              style={{ color: "var(--foreground)" }}
              className="text-lg font-bold flex items-center gap-2"
            >
              <ShieldX className="w-4 h-4 text-red-400" />
              <span>5. Limitation of Liability</span>
            </h2>
            <p>
              In no event shall Backbencher.codes, its maintainers, or hosting partners be held liable for any indirect, incidental, punitive, or consequential damages resulting from your use of or inability to use our platform or compilers.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
