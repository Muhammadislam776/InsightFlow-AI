import React from "react";
import Link from "next/link";
import { BarChart3, Sparkles } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 px-6 sm:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <Link href="/" className="inline-flex items-center space-x-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-card">
            <BarChart3 className="h-6 w-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-text-primary">
            InsightFlow<span className="text-primary font-black">AI</span>
          </span>
        </Link>
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">{children}</div>
    </div>
  );
}
