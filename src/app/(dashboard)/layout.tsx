"use client";

import React from "react";
import { AppProvider } from "@/context/AppContext";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { GlobalSearchModal } from "@/components/layout/GlobalSearchModal";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProvider>
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
    </AppProvider>
  );
}
