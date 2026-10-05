"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Bell,
  HelpCircle,
  User,
  BarChart3,
  CheckCircle,
  Sparkles,
  Settings,
  LogOut,
  ChevronDown,
  ExternalLink,
  Lock,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

export function Header() {
  const router = useRouter();
  const {
    currentUser,
    notifications,
    unreadCount,
    markNotificationsAsRead,
    setSearchOpen,
    signOut,
  } = useApp();

  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-surface px-6 shadow-subtle">
      {/* Left: Brand Identity */}
      <div className="flex items-center space-x-3">
        <Link href="/overview" className="group flex items-center space-x-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-card transition-all duration-200 group-hover:scale-105 group-hover:bg-primary-hover">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-text-primary group-hover:text-primary transition-colors">
              InsightFlow<span className="text-primary font-black">AI</span>
            </span>
          </div>
        </Link>
        <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-primary-light text-primary border border-blue-200">
          <Sparkles className="w-3 h-3 mr-1 text-accent-orange" />
          AI Analytics
        </span>
      </div>

      {/* Center: Global Search Bar */}
      <div className="flex-1 max-w-lg mx-6">
        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center w-full justify-between px-3.5 py-2 text-sm text-text-secondary bg-background hover:bg-slate-100 border border-border rounded-xl transition-all shadow-subtle group"
        >
          <div className="flex items-center space-x-2.5">
            <Search className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
            <span className="text-text-muted text-xs sm:text-sm font-normal">
              Search dashboards, queries, catalog metrics...
            </span>
          </div>
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-medium text-text-secondary bg-surface border border-border rounded shadow-subtle">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right Controls: Notifications + Help + Profile */}
      <div className="flex items-center space-x-3">

        {/* Notifications Icon with Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setNotifMenuOpen(!notifMenuOpen);
              setProfileMenuOpen(false);
              if (!notifMenuOpen) markNotificationsAsRead();
            }}
            aria-label="Notifications"
            className="relative p-2 rounded-xl text-text-secondary hover:text-primary hover:bg-primary-light transition-all"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-orange opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent-orange"></span>
              </span>
            )}
          </button>

          {notifMenuOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-surface border border-border shadow-elevated p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-border px-2">
                <span className="font-semibold text-sm text-text-primary">Workspace Alerts</span>
                <span className="text-xs text-text-muted">3 events</span>
              </div>
              <div className="divide-y divide-border/60 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="py-2.5 px-2 hover:bg-background rounded-lg transition-colors">
                    <div className="flex items-start justify-between">
                      <span className="text-xs font-semibold text-text-primary">{n.title}</span>
                      <span className="text-[10px] text-text-muted">{n.time}</span>
                    </div>
                    <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">{n.description}</p>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-border mt-1 text-center">
                <Link
                  href="/monitoring"
                  onClick={() => setNotifMenuOpen(false)}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  View full security & usage activity
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Help Icon Modal Trigger */}
        <button
          onClick={() => setHelpModalOpen(true)}
          aria-label="Help Documentation"
          className="p-2 rounded-xl text-text-secondary hover:text-primary hover:bg-primary-light transition-all"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setProfileMenuOpen(!profileMenuOpen);
              setNotifMenuOpen(false);
            }}
            className="flex items-center space-x-2 p-1 pl-1.5 pr-2.5 rounded-full hover:bg-slate-100 border border-slate-200 hover:border-slate-300 transition-all shadow-2xs group"
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-blue-500/20 shadow-xs bg-slate-200">
                <img
                  src={
                    currentUser?.role === "ADMIN"
                      ? "/images/avatar-admin.jpg"
                      : currentUser?.role === "VIEWER"
                      ? "/images/avatar-viewer.jpg"
                      : "/images/avatar-analyst.jpg"
                  }
                  alt={currentUser?.name || "User Avatar"}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
            </div>

            <div className="text-left hidden sm:flex flex-col pr-1">
              <span className="text-xs font-bold text-[#111827] leading-tight">
                {currentUser?.name || "Member"}
              </span>
              <span className="text-[10px] font-semibold text-slate-500 leading-tight">
                {currentUser?.role === "ADMIN" ? "Administrator" : currentUser?.role === "VIEWER" ? "Executive Viewer" : "Data Analyst"}
              </span>
            </div>

            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${
              currentUser?.role === "ADMIN"
                ? "bg-rose-50 text-rose-700 border-rose-200"
                : currentUser?.role === "VIEWER"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-blue-50 text-[#2563EB] border-blue-200"
            }`}>
              {currentUser?.role || "GUEST"}
            </span>

            <ChevronDown className="w-3.5 h-3.5 text-text-secondary group-hover:text-text-primary transition-colors" />
          </button>

          {profileMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-3xl bg-white border border-slate-200 shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="p-3.5 border-b border-slate-100 bg-slate-50/70 rounded-2xl mb-1.5 space-y-2.5">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-blue-500/20 shadow-sm shrink-0 bg-slate-200">
                    <img
                      src={
                        currentUser?.role === "ADMIN"
                          ? "/images/avatar-admin.jpg"
                          : currentUser?.role === "VIEWER"
                          ? "/images/avatar-viewer.jpg"
                          : "/images/avatar-analyst.jpg"
                      }
                      alt={currentUser?.name || "Profile"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-black text-slate-900 truncate">{currentUser?.name || "Active User"}</p>
                    <p className="text-xs text-slate-500 truncate">{currentUser?.email || "user@insightflow.ai"}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                    currentUser?.role === "ADMIN"
                      ? "bg-rose-50 text-rose-700 border-rose-200"
                      : currentUser?.role === "VIEWER"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-blue-50 text-[#2563EB] border-blue-200"
                  }`}>
                    {currentUser?.role === "ADMIN" ? "System Admin" : currentUser?.role === "VIEWER" ? "Executive Viewer" : "Lead Data Analyst"}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">Acme Analytics Org</span>
                </div>
              </div>

              <div className="space-y-0.5">
                <Link
                  href="/profile"
                  onClick={() => setProfileMenuOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 text-xs font-medium text-text-secondary hover:text-primary hover:bg-primary-light rounded-lg transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>My Profile</span>
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setProfileMenuOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 text-xs font-medium text-text-secondary hover:text-primary hover:bg-primary-light rounded-lg transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>Workspace Preferences</span>
                </Link>
                <Link
                  href="/monitoring"
                  onClick={() => setProfileMenuOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 text-xs font-medium text-text-secondary hover:text-primary hover:bg-primary-light rounded-lg transition-colors"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Usage & Security</span>
                </Link>
                <div className="border-t border-border my-1"></div>
                <button
                  onClick={async () => {
                    setProfileMenuOpen(false);
                    await signOut();
                    router.push("/login");
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-medium text-status-danger hover:bg-red-50 rounded-lg transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Help Modal */}
      {helpModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl max-w-lg w-full p-6 shadow-elevated border border-border animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-base font-bold text-text-primary flex items-center">
                <HelpCircle className="w-5 h-5 text-primary mr-2" />
                InsightFlow AI Analytics Guide
              </h3>
              <button
                onClick={() => setHelpModalOpen(false)}
                className="text-text-muted hover:text-text-primary text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <div className="mt-4 space-y-3 text-xs text-text-secondary leading-relaxed">
              <p>
                <strong className="text-text-primary">Natural Language to Safe SQL:</strong> You can ask questions in English such as:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-primary">
                <li>"What were our total sales last month?"</li>
                <li>"Show monthly revenue for the last 12 months."</li>
                <li>"Which products generated the highest revenue?"</li>
                <li>"Compare sales between regions."</li>
                <li>"Show me the top 10 customers by revenue."</li>
              </ul>
              <div className="p-3 bg-primary-light rounded-xl border border-blue-200 mt-2">
                <p className="text-primary-dark font-medium flex items-center">
                  <Lock className="w-3.5 h-3.5 mr-1 text-primary" />
                  100% Read-Only Safety Assurance
                </p>
                <p className="text-text-secondary mt-1">
                  Queries run strictly against an approved semantic schema. Write operations (DROP, DELETE, UPDATE) and injections are intercepted and blocked before execution.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setHelpModalOpen(false)}
                className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-semibold hover:bg-primary-hover transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
