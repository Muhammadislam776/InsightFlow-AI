"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  Layers,
  SearchCode,
  History,
  BookOpen,
  Activity,
  Award,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Flame,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

export function Sidebar() {
  const pathname = usePathname();
  const { currentUser } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  const mainNavItems = [
    {
      name: "Overview",
      href: "/overview",
      icon: LayoutDashboard,
      roles: ["ADMIN", "ANALYST", "VIEWER"],
    },
    {
      name: "Ask Data",
      href: "/ask",
      icon: Sparkles,
      roles: ["ADMIN", "ANALYST", "VIEWER"],
      highlight: true,
      badge: "AI Core",
    },
    {
      name: "Dashboards",
      href: "/dashboards",
      icon: Layers,
      roles: ["ADMIN", "ANALYST", "VIEWER"],
    },
    {
      name: "Explore",
      href: "/explore",
      icon: SearchCode,
      roles: ["ADMIN", "ANALYST", "VIEWER"],
    },
    {
      name: "Query History",
      href: "/history",
      icon: History,
      roles: ["ADMIN", "ANALYST", "VIEWER"],
    },
    {
      name: "Data Catalog",
      href: "/catalog",
      icon: BookOpen,
      roles: ["ADMIN", "ANALYST", "VIEWER"],
    },
  ];

  const monitoringNavItems = [
    {
      name: "Usage & Monitoring",
      href: "/monitoring",
      icon: Activity,
      roles: ["ADMIN", "ANALYST"],
    },
    {
      name: "Benchmarks",
      href: "/benchmarks",
      icon: Award,
      roles: ["ADMIN", "ANALYST"],
    },
  ];

  const adminNavItems = [
    {
      name: "Settings & Admin",
      href: "/settings",
      icon: Settings,
      roles: ["ADMIN"],
    },
  ];

  const filterByRole = (items: typeof mainNavItems) =>
    items.filter((item) => item.roles.includes(currentUser.role));

  const visibleMain = filterByRole(mainNavItems);
  const visibleMonitoring = filterByRole(monitoringNavItems);
  const visibleAdmin = filterByRole(adminNavItems);

  return (
    <aside
      className={`relative flex flex-col border-r border-border bg-surface transition-all duration-300 ease-in-out z-20 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Main Section */}
        <div>
          {!collapsed && (
            <p className="px-3 mb-2 text-[11px] font-bold tracking-wider text-text-muted uppercase">
              Main
            </p>
          )}
          <nav className="space-y-1">
            {visibleMain.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/overview" && pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative flex items-center rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? item.highlight
                        ? "bg-accent-orange text-white shadow-subtle font-bold"
                        : "bg-primary text-white shadow-subtle font-bold"
                      : item.highlight
                      ? "text-text-primary bg-accent-orangeLight hover:bg-orange-100/70 border border-orange-200/50"
                      : "text-text-secondary hover:bg-slate-100 hover:text-text-primary"
                  }`}
                  title={collapsed ? item.name : undefined}
                >
                  <Icon
                    className={`h-4 w-4 transition-transform duration-200 group-hover:scale-110 ${
                      isActive
                        ? "text-white"
                        : item.highlight
                        ? "text-accent-orange"
                        : "text-text-secondary group-hover:text-primary"
                    }`}
                  />
                  {!collapsed && (
                    <span className="ml-3 flex-1 truncate">{item.name}</span>
                  )}
                  {!collapsed && item.badge && (
                    <span
                      className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-accent-orange text-white"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Monitoring Section */}
        {visibleMonitoring.length > 0 && (
          <div>
            {!collapsed && (
              <p className="px-3 mb-2 text-[11px] font-bold tracking-wider text-text-muted uppercase">
                Monitoring
              </p>
            )}
            <nav className="space-y-1">
              {visibleMonitoring.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group relative flex items-center rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-primary text-white shadow-subtle font-bold"
                        : "text-text-secondary hover:bg-slate-100 hover:text-text-primary"
                    }`}
                    title={collapsed ? item.name : undefined}
                  >
                    <Icon
                      className={`h-4 w-4 transition-transform duration-200 group-hover:scale-110 ${
                        isActive ? "text-white" : "text-text-secondary group-hover:text-primary"
                      }`}
                    />
                    {!collapsed && <span className="ml-3 truncate">{item.name}</span>}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}

        {/* Admin Section */}
        {visibleAdmin.length > 0 && (
          <div>
            {!collapsed && (
              <p className="px-3 mb-2 text-[11px] font-bold tracking-wider text-text-muted uppercase">
                Admin
              </p>
            )}
            <nav className="space-y-1">
              {visibleAdmin.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group relative flex items-center rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-primary text-white shadow-subtle font-bold"
                        : "text-text-secondary hover:bg-slate-100 hover:text-text-primary"
                    }`}
                    title={collapsed ? item.name : undefined}
                  >
                    <Icon
                      className={`h-4 w-4 transition-transform duration-200 group-hover:scale-110 ${
                        isActive ? "text-white" : "text-text-secondary group-hover:text-primary"
                      }`}
                    />
                    {!collapsed && <span className="ml-3 truncate">{item.name}</span>}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>

      {/* Security Status Box at Bottom of Sidebar */}
      {!collapsed && (
        <div className="p-3 m-3 rounded-xl bg-slate-50 border border-border">
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-status-success animate-pulse"></span>
            <span className="text-[11px] font-bold text-text-primary">
              Read-Only Guard Active
            </span>
          </div>
          <p className="text-[10px] text-text-secondary mt-1">
            Role: <strong className="text-primary">{currentUser.role}</strong>
          </p>
        </div>
      )}

      {/* Collapse / Expand Toggle Button */}
      <div className="p-3 border-t border-border flex items-center justify-between">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-background border border-transparent hover:border-border transition-all"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          {!collapsed && <span className="ml-2 text-xs font-medium text-text-secondary">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
