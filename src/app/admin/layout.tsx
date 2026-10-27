import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Portal | Backbencher.codes",
  description: "Restricted administrative publishing and monetization portal.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
