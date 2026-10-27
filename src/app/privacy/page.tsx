import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Shield, Lock, EyeOff, HardDrive, Cpu, Cookie, Server, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Backbencher.codes",
  description: "Privacy policy and data protection practices at Backbencher.codes.",
};

export default function PrivacyPolicyPage() {
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
            <Shield className="w-3.5 h-3.5" />
            <span>Data Protection &amp; Security</span>
          </div>

          <h1
            style={{ color: "var(--foreground)" }}
            className="text-3xl sm:text-4xl font-black tracking-tight"
          >
            Privacy Policy
          </h1>
          <p
            style={{ color: "var(--muted-foreground)" }}
            className="text-xs font-mono"
          >
            Last updated: March 2026 • Effective Date: March 2026
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
              <Lock className="w-4 h-4 text-[#FF7900]" />
              <span>1. Introduction</span>
            </h2>
            <p>
              Backbencher.codes (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) operates the website https://backbencher.codes. We respect the privacy of our users and are committed to protecting personal data. This Privacy Policy outlines what information is processed, how it is handled, and your rights when using our online compilers, IDE workspaces, and educational articles.
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
              <EyeOff className="w-4 h-4 text-[#FF7900]" />
              <span>2. No Account Registration Required</span>
            </h2>
            <p>
              Backbencher.codes does not mandate user accounts, credit cards, or profile creation to use our compilers, code editors, or read our blog guides. You can explore, write, and execute code instantly without providing personal identifying information.
            </p>
          </div>

          {/* Section 3 */}
          <div
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
            className="p-6 rounded-2xl border space-y-2.5 shadow-sm"
          >
            <h2
              style={{ color: "var(--foreground)" }}
              className="text-lg font-bold flex items-center gap-2"
            >
              <HardDrive className="w-4 h-4 text-[#FF7900]" />
              <span>3. Code Storage and Local Drafts</span>
            </h2>
            <p>
              When you write or test source code in our browser-based compiler, drafts are saved locally inside your device&apos;s browser storage (<code className="px-1.5 py-0.5 rounded text-xs font-mono" style={{ backgroundColor: "var(--hover-bg)", color: "var(--foreground)" }}>localStorage</code>). Your code snippets remain on your local machine and are not saved to our persistent user databases.
            </p>
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
              <Cpu className="w-4 h-4 text-[#FF7900]" />
              <span>4. Code Execution and Sandboxing</span>
            </h2>
            <p>
              When you click &quot;Run&quot; for compiled or backend languages (such as C++, Java, Rust, or Python), your code and optional stdin are transmitted over encrypted HTTPS to isolated, warm-pool execution sandbox containers strictly to compile and execute your program. Execution outputs (<code className="px-1.5 py-0.5 rounded text-xs font-mono" style={{ backgroundColor: "var(--hover-bg)", color: "var(--foreground)" }}>stdout</code>, <code className="px-1.5 py-0.5 rounded text-xs font-mono" style={{ backgroundColor: "var(--hover-bg)", color: "var(--foreground)" }}>stderr</code>, exit status) are returned to your browser and immediately discarded. We do not inspect, sell, or retain private intellectual property.
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
              <Cookie className="w-4 h-4 text-[#FF7900]" />
              <span>5. Cookies and Google AdSense</span>
            </h2>
            <p>
              We may utilize third-party advertising partners, including Google AdSense, to display non-intrusive advertisements across our platform. Google uses cookies (including the DoubleClick cookie) to serve ads based on your prior visits to our site or other websites on the internet. You can review or opt out of personalized advertising at any time by visiting Google&apos;s Ads Settings (<a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-[#FF7900] hover:underline">www.aboutads.info</a>).
            </p>
          </div>

          {/* Section 6 */}
          <div
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
            className="p-6 rounded-2xl border space-y-2.5 shadow-sm"
          >
            <h2
              style={{ color: "var(--foreground)" }}
              className="text-lg font-bold flex items-center gap-2"
            >
              <Server className="w-4 h-4 text-[#FF7900]" />
              <span>6. Server Diagnostics and Security</span>
            </h2>
            <p>
              Like most online developer platforms, our servers automatically record basic request metadata (such as IP addresses, browser user-agents, and timestamps) solely for rate limiting, DDoS mitigation, and system diagnostics.
            </p>
          </div>

          {/* Section 7 */}
          <div
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
            className="p-6 rounded-2xl border space-y-2.5 shadow-sm"
          >
            <h2
              style={{ color: "var(--foreground)" }}
              className="text-lg font-bold flex items-center gap-2"
            >
              <Mail className="w-4 h-4 text-[#FF7900]" />
              <span>7. Contact Us</span>
            </h2>
            <p>
              If you have any questions, feedback, or concerns regarding this Privacy Policy, please reach out to our team at <a href="mailto:privacy@backbencher.codes" className="text-[#FF7900] hover:underline font-mono">privacy@backbencher.codes</a>.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
