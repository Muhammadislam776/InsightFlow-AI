"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import {
  Sparkles,
  BarChart3,
  SearchCode,
  Layers,
  History,
  BookOpen,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  LogOut,
  LineChart,
  LayoutDashboard,
  Lock,
} from "lucide-react";

const ANALYST_NAV = [
  { name: "Analyst Hub", href: "/analyst", icon: LayoutDashboard },
  { name: "Ask Data Studio", href: "/analyst/ask-studio", icon: Sparkles, highlight: true },
  { name: "SQL Explorer", href: "/analyst/explore", icon: SearchCode },
  { name: "Dashboard Builder", href: "/analyst/builder", icon: Layers },
  { name: "Saved Dashboards", href: "/analyst/dashboards", icon: BarChart3 },
  { name: "Query Execution History", href: "/analyst/history", icon: History },
  { name: "Semantic Data Catalog", href: "/analyst/catalog", icon: BookOpen },
  { name: "Data Export Center", href: "/analyst/export", icon: FileSpreadsheet },
];

export default function AnalystLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, authLoading, signOut } = useApp();
  const [collapsed, setCollapsed] = React.useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!currentUser) {
        router.push("/login?redirect=/analyst");
      } else if (currentUser.role === "VIEWER") {
        // Viewers are strictly restricted from the Analyst workbench
        router.push("/viewer");
      }
    }
  }, [authLoading, currentUser, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 space-y-3">
        <div className="w-10 h-10 border-3 border-[#2563EB] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-[#64748B]">Verifying Analyst Studio Clearance...</p>
      </div>
    );
  }

  if (!currentUser || currentUser.role === "VIEWER") {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-[#111827]">Analyst Workbench Restricted</h2>
          <p className="text-xs text-[#64748B]">
            Your current role is <strong>VIEWER</strong>. The query studio and dashboard builder require Analyst or Admin privileges.
          </p>
          <button
            onClick={() => router.push("/viewer")}
            className="w-full py-2.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all"
          >
            Go to Executive Viewer Portal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC] font-sans antialiased text-[#111827]">
      {/* Analyst Header */}
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#E2E8F0] bg-white px-6 shadow-xs">
        <div className="flex items-center space-x-3">
          <Link href="/analyst" className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2563EB] text-white shadow-sm">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-black tracking-tight text-[#111827]">
                InsightFlow <span className="text-[#2563EB]">ANALYST</span>
              </span>
            </div>
          </Link>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#2563EB] border border-blue-200">
            Analytics Studio & Query Lab
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            href="/analyst/ask-studio"
            className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-orange-50 text-[#F97316] border border-orange-200 text-xs font-bold hover:bg-orange-100 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Open Ask Studio</span>
          </Link>

          <div className="flex items-center space-x-2.5 pl-3 border-l border-slate-200">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-[#111827]">{currentUser.name}</p>
              <span className="text-[10px] font-bold text-[#2563EB] bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                DATA ANALYST
              </span>
            </div>
            <button
              onClick={async () => {
                await signOut();
                router.push("/login");
              }}
              className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Analyst Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Dedicated Analyst Sidebar */}
        <aside
          className={`relative flex flex-col border-r border-[#E2E8F0] bg-white transition-all duration-300 z-20 ${
            collapsed ? "w-20" : "w-64"
          }`}
        >
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
            {!collapsed && (
              <p className="px-3 mb-2 text-[10px] font-black tracking-wider text-[#94A3B8] uppercase">
                Analytics Tools
              </p>
            )}
            {ANALYST_NAV.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                    isActive
                      ? item.highlight
                        ? "bg-[#F97316] text-white shadow-xs font-bold"
                        : "bg-[#2563EB] text-white shadow-xs font-bold"
                      : item.highlight
                      ? "text-[#F97316] bg-orange-50 hover:bg-orange-100 font-bold"
                      : "text-[#64748B] hover:bg-slate-100 hover:text-[#111827]"
                  }`}
                  title={collapsed ? item.name : undefined}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span className="ml-3 truncate">{item.name}</span>}
                </Link>
              );
            })}
          </div>

          {/* Bottom Sidebar Collapse */}
          <div className="p-3 border-t border-[#E2E8F0]">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="w-full flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              {!collapsed && <span className="ml-2 text-xs font-medium">Collapse</span>}
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto px-6 py-6 md:px-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
