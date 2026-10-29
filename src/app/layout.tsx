import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/lib/theme/ThemeContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://backbencher.codes"),
  title: {
    default: "Backbencher.codes — Learn. Code. Build. | Online Compiler & IDE",
    template: "%s | Backbencher.codes",
  },
  description:
    "An advanced VS Code-like online compiler and programming workspace supporting Python, C, C++, Java, Rust, JavaScript, TypeScript, SQL, Dart, and more. Zero setup, instant execution, standard input (stdin) support.",
  keywords: [
    "online compiler",
    "online IDE",
    "python compiler",
    "c++ compiler",
    "rust compiler",
    "web ide",
    "learn programming",
    "programiz alternative",
    "backbencher codes",
  ],
  authors: [{ name: "Backbencher.codes Team" }],
  creator: "Backbencher.codes",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://backbencher.codes",
    siteName: "Backbencher.codes",
    title: "Backbencher.codes — Learn. Code. Build.",
    description:
      "Advanced VS Code-like online coding IDE and programming workspace. Execute 14+ languages in your browser with zero configuration.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Backbencher.codes — Learn. Code. Build.",
    description:
      "Advanced VS Code-like online coding IDE and programming workspace. Execute 14+ languages in your browser with zero configuration.",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    apple: [
      { url: "/apple-icon.svg", type: "image/svg+xml" },
    ],
  },
  other: {
    "google-adsense-account": "ca-pub-4897524780440810",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Backbencher.codes Online Compiler",
    url: "https://backbencher.codes",
    description:
      "An advanced browser-based VS Code-like coding IDE and multi-language compiler platform.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4897524780440810"
          crossOrigin="anonymous"
        />
        <script
          id="structured-data-jsonld"
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className="min-h-full flex flex-col"
        suppressHydrationWarning
        style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
