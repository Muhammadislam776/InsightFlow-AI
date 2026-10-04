"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { AppProvider, useApp } from "@/context/AppContext";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { GlobalSearchModal } from "@/components/layout/GlobalSearchModal";
import { Lock, ArrowRight, ShieldCheck } from "lucide-react";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, authLoading } = useApp();

  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [authLoading, currentUser, pathname, router]);

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-10 h-10 border-3 border-[#2563EB] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-[#64748B]">
          Verifying InsightFlow AI Authentication...
        </p>
      </div>
    );
  }

  // Not logged in gate
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-[#111827]">Authentication Required</h2>
          <p className="text-xs text-[#64748B] leading-relaxed">
            You must be signed in with a registered account to view this analytics panel. Users must sign up first before logging in.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <Link
              href={`/login?redirect=${encodeURIComponent(pathname)}`}
              className="flex-1 py-2.5 px-4 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all text-center shadow-md shadow-blue-500/20"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="flex-1 py-2.5 px-4 rounded-full border border-slate-200 hover:bg-slate-50 text-[#111827] text-xs font-bold transition-all text-center"
            >
              Sign Up First
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated user: Render full dashboard with Header & Sidebar
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans antialiased text-text-primary">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto px-6 py-6 md:px-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
      <GlobalSearchModal />
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProvider>
      <DashboardContent>{children}</DashboardContent>
    </AppProvider>
  );
}
