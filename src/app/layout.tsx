import type { Metadata } from "next";
import "./globals.css";
import { ClientProviders } from "@/components/providers/ClientProviders";

export const metadata: Metadata = {
  title: "InsightFlow AI — Natural-Language Business Intelligence Platform",
  description:
    "Enterprise SaaS platform translating plain-English questions into safe, read-only SQL analytics and interactive visualizations.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-text-primary antialiased min-h-screen">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
