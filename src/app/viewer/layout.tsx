"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import {
  LayoutDashboard,
  Layers,
  Sparkles,
  TrendingUp,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { PortalHeader } from "@/components/layout/PortalHeader";

const VIEWER_NAV = [
  { name: "Executive Cockpit", href: "/viewer", icon: LayoutDashboard },
  { name: "Published Dashboards", href: "/viewer/dashboards", icon: Layers },
  { name: "AI Narrative Insights", href: "/viewer/insights", icon: Sparkles },
  { name: "Key Business Metrics", href: "/viewer/metrics", icon: TrendingUp },
  { name: "Executive Briefings", href: "/viewer/reports", icon: FileText },
];

export default function ViewerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, authLoading } = useApp();
  const [collapsed, setCollapsed] = React.useState(false);

  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.push("/login?redirect=/viewer");
    }
  }, [authLoading, currentUser, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 space-y-3">
        <div className="w-10 h-10 border-3 border-[#2563EB] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-[#64748B]">Loading Executive Dashboard...</p>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC] font-sans antialiased text-[#111827]">
      {/* High-fidelity Portal Header with Small Circled Image Account Type */}
      <PortalHeader
        portalType="VIEWER"
        portalTitle="VIEWER"
        badgeLabel="Executive Read-Only Portal"
      />

      {/* Main Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Dedicated Viewer Sidebar */}
        <aside
          className={`relative flex flex-col border-r border-[#E2E8F0] bg-white transition-all duration-300 z-20 ${
            collapsed ? "w-20" : "w-64"
          }`}
        >
          <div className="flex-1 overflow-y-auto px-3 py-5 space-y-1.5">
            {!collapsed && (
              <p className="px-3 mb-2 text-[10px] font-black tracking-wider text-[#94A3B8] uppercase">
                Executive Views
              </p>
            )}
            {VIEWER_NAV.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center rounded-2xl px-3.5 py-3 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20 font-bold"
                      : "text-[#64748B] hover:bg-slate-50 hover:text-[#111827]"
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
        <main className="flex-1 overflow-y-auto px-6 py-8 md:px-10">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
