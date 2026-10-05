"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import {
  ShieldCheck,
  Users,
  Settings,
  Activity,
  Award,
  FileText,
  Lock,
  Database,
  Sliders,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Bell,
  Sparkles,
} from "lucide-react";

const ADMIN_NAV = [
  { name: "Command Center", href: "/admin", icon: Sliders },
  { name: "Schema Governance", href: "/admin/governance", icon: Database },
  { name: "SQL Safety Guard", href: "/admin/security-guard", icon: ShieldCheck },
  { name: "RBAC & User Access", href: "/admin/users", icon: Users },
  { name: "System Telemetry", href: "/admin/telemetry", icon: Activity },
  { name: "Security Audit Logs", href: "/admin/audit-logs", icon: FileText },
  { name: "Benchmark Suites", href: "/admin/benchmarks", icon: Award },
  { name: "System Policies & AI", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, authLoading, signOut } = useApp();
  const [collapsed, setCollapsed] = React.useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!currentUser) {
        router.push("/login?redirect=/admin");
      } else if (currentUser.role !== "ADMIN") {
        // Strict Role Redirection: Analysts to /analyst, Viewers to /viewer
        router.push(currentUser.role === "ANALYST" ? "/analyst" : "/viewer");
      }
    }
  }, [authLoading, currentUser, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 space-y-3">
        <div className="w-10 h-10 border-3 border-[#2563EB] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-[#64748B]">Verifying Admin Access Privileges...</p>
      </div>
    );
  }

  if (!currentUser || currentUser.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-[#111827]">Admin Access Restricted</h2>
          <p className="text-xs text-[#64748B]">
            This portal is restricted to Workspace Administrators with schema governance & security clearance.
          </p>
          <button
            onClick={() => router.push(currentUser?.role === "ANALYST" ? "/analyst" : "/viewer")}
            className="w-full py-2.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all"
          >
            Go to Your Assigned Portal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC] font-sans antialiased text-[#111827]">
      {/* Admin Top Header */}
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#E2E8F0] bg-white px-6 shadow-xs">
        <div className="flex items-center space-x-3">
          <Link href="/admin" className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1E3A8A] text-white shadow-sm">
              <ShieldCheck className="h-5 w-5 text-blue-200" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-black tracking-tight text-[#111827]">
                InsightFlow <span className="text-[#2563EB]">ADMIN</span>
              </span>
            </div>
          </Link>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100/70 text-[#1E3A8A] border border-blue-200">
            Enterprise Governance Portal
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-2 text-xs bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold text-slate-700">Root Governance Level</span>
          </div>

          <div className="flex items-center space-x-2.5 pl-3 border-l border-slate-200">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-[#111827]">{currentUser.name}</p>
              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                ADMINISTRATOR
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

      {/* Main Admin Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Dedicated Admin Sidebar */}
        <aside
          className={`relative flex flex-col border-r border-[#E2E8F0] bg-white transition-all duration-300 z-20 ${
            collapsed ? "w-20" : "w-64"
          }`}
        >
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
            {!collapsed && (
              <p className="px-3 mb-2 text-[10px] font-black tracking-wider text-[#94A3B8] uppercase">
                Admin Controls
              </p>
            )}
            {ADMIN_NAV.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#1E3A8A] text-white shadow-xs font-bold"
                      : "text-[#64748B] hover:bg-slate-100 hover:text-[#111827]"
                  }`}
                  title={collapsed ? item.name : undefined}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-white" : "text-[#64748B]"}`} />
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
