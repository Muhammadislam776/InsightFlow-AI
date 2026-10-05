"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Bell,
  HelpCircle,
  User,
  ShieldCheck,
  Sparkles,
  Settings,
  LogOut,
  ChevronDown,
  Lock,
  Eye,
  BarChart3,
  CheckCircle2,
  ExternalLink,
  Layers,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

interface PortalHeaderProps {
  portalType: "ADMIN" | "ANALYST" | "VIEWER";
  portalTitle: string;
  badgeLabel: string;
}

export function PortalHeader({ portalType, portalTitle, badgeLabel }: PortalHeaderProps) {
  const router = useRouter();
  const { currentUser, signOut, notifications, unreadCount, markNotificationsAsRead } = useApp();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const role = currentUser?.role || portalType;

  // Role visual identity mapping
  const roleConfig = {
    ADMIN: {
      avatar: "/images/avatar-admin.jpg",
      roleLabel: "ADMIN",
      accountType: "System Administrator",
      badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
      ringColor: "ring-rose-500/30",
      dotColor: "bg-rose-500",
      icon: ShieldCheck,
      homeHref: "/admin",
    },
    ANALYST: {
      avatar: "/images/avatar-analyst.jpg",
      roleLabel: "ANALYST",
      accountType: "Lead Data Analyst",
      badgeColor: "bg-blue-50 text-[#2563EB] border-blue-200",
      ringColor: "ring-blue-500/30",
      dotColor: "bg-[#2563EB]",
      icon: BarChart3,
      homeHref: "/analyst",
    },
    VIEWER: {
      avatar: "/images/avatar-viewer.jpg",
      roleLabel: "VIEWER",
      accountType: "Executive Viewer",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      ringColor: "ring-emerald-500/30",
      dotColor: "bg-emerald-500",
      icon: Eye,
      homeHref: "/viewer",
    },
  }[role] || {
    avatar: "/images/avatar-analyst.jpg",
    roleLabel: role,
    accountType: "Platform User",
    badgeColor: "bg-slate-50 text-slate-700 border-slate-200",
    ringColor: "ring-slate-300",
    dotColor: "bg-slate-500",
    icon: User,
    homeHref: "/overview",
  };

  const IconComponent = roleConfig.icon;

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    if (portalType === "VIEWER") {
      router.push(`/viewer/dashboards?q=${encodeURIComponent(searchQuery)}`);
    } else if (portalType === "ANALYST") {
      router.push(`/analyst/ask-studio?q=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push(`/admin/audit-logs?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#E2E8F0] bg-white/95 backdrop-blur-md px-4 sm:px-6 shadow-xs">
      {/* Left: Brand Identity & Portal Tag */}
      <div className="flex items-center space-x-3">
        <Link href={roleConfig.homeHref} className="group flex items-center space-x-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#2563EB] to-blue-500 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-all">
            <IconComponent className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-black tracking-tight text-[#111827]">
              InsightFlow <span className="text-[#2563EB]">{portalTitle}</span>
            </span>
          </div>
        </Link>

        <span className="hidden md:inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#2563EB] border border-blue-200">
          <ShieldCheck className="w-3 h-3 text-[#2563EB]" />
          <span>{badgeLabel}</span>
        </span>
      </div>

      {/* Center: Global Search Bar */}
      <div className="hidden lg:flex flex-1 max-w-md mx-6">
        <form onSubmit={handleGlobalSearch} className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${portalType === "VIEWER" ? "dashboards & briefings..." : "queries, metrics, catalog..."}`}
            className="w-full pl-9 pr-14 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-slate-400"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[9px] font-mono font-bold text-slate-400 bg-white border border-slate-200 rounded shadow-xs">
            Enter
          </kbd>
        </form>
      </div>

      {/* Right Controls: Engine Status, Notifications, Help, Profile */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Real-time Status Badge */}
        <div className="hidden xl:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>AST Safety Guard Active</span>
        </div>

        {/* Notifications Icon with Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setNotifOpen(!notifOpen);
              setProfileOpen(false);
              if (!notifOpen) markNotificationsAsRead();
            }}
            aria-label="Notifications"
            className="p-2 rounded-xl text-slate-500 hover:text-[#2563EB] hover:bg-blue-50 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F97316] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F97316]"></span>
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-slate-200 shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 px-2">
                <span className="font-bold text-xs text-slate-900">Workspace Alerts</span>
                <span className="text-[10px] font-semibold text-slate-400">Live Telemetry</span>
              </div>
              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="py-2.5 px-2 hover:bg-slate-50 rounded-xl transition-colors">
                    <div className="flex items-start justify-between">
                      <span className="text-xs font-bold text-slate-900">{n.title}</span>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{n.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Help Guide Modal Trigger */}
        <button
          onClick={() => setHelpOpen(true)}
          aria-label="Help Guide"
          className="p-2 rounded-xl text-slate-500 hover:text-[#2563EB] hover:bg-blue-50 transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Profile with Small Circled Image as Account Type */}
        <div className="relative pl-1">
          <button
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotifOpen(false);
            }}
            className="flex items-center space-x-2 p-1 pl-1.5 pr-2.5 rounded-full hover:bg-slate-100 border border-slate-200 hover:border-slate-300 transition-all shadow-2xs group"
          >
            {/* Small Circled Image with Role Ring Indicator */}
            <div className="relative">
              <div className={`w-8 h-8 rounded-full overflow-hidden ring-2 ${roleConfig.ringColor} shadow-xs bg-slate-200`}>
                <img
                  src={roleConfig.avatar}
                  alt={currentUser?.name || "User Avatar"}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Online indicator dot */}
              <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ${roleConfig.dotColor} border-2 border-white`} />
            </div>

            {/* User Name & Account Type Badge */}
            <div className="text-left hidden sm:flex flex-col pr-1">
              <span className="text-xs font-bold text-[#111827] leading-tight">
                {currentUser?.name || "Member"}
              </span>
              <span className="text-[10px] font-semibold text-slate-500 leading-tight">
                {roleConfig.accountType}
              </span>
            </div>

            {/* Small Pill Badge */}
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${roleConfig.badgeColor}`}>
              {roleConfig.roleLabel}
            </span>

            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-colors" />
          </button>

          {/* Interactive Profile Dropdown */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-3xl bg-white border border-slate-200 shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              {/* Profile Card Header */}
              <div className="p-3.5 border-b border-slate-100 bg-slate-50/70 rounded-2xl mb-1.5 space-y-2.5">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-full overflow-hidden ring-2 ${roleConfig.ringColor} shadow-sm shrink-0 bg-slate-200`}>
                    <img
                      src={roleConfig.avatar}
                      alt={currentUser?.name || "Profile"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-black text-slate-900 truncate">
                      {currentUser?.name || "Active Member"}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {currentUser?.email || "user@insightflow.ai"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${roleConfig.badgeColor}`}>
                    {roleConfig.accountType}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">Acme Analytics Org</span>
                </div>
              </div>

              {/* Navigation Options */}
              <div className="space-y-0.5 text-xs font-semibold text-slate-700">
                <Link
                  href="/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center space-x-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>My Profile & Preferences</span>
                </Link>

                <Link
                  href="/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center space-x-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Workspace Settings</span>
                </Link>

                {currentUser?.role === "ADMIN" && (
                  <Link
                    href="/admin/users"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center space-x-2.5 px-3 py-2 rounded-xl hover:bg-rose-50 text-rose-700 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-rose-500" />
                    <span>RBAC Directory & Roles</span>
                  </Link>
                )}

                <div className="border-t border-slate-100 my-1"></div>

                <button
                  onClick={async () => {
                    setProfileOpen(false);
                    await signOut();
                    router.push("/login");
                  }}
                  className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors text-left font-bold"
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
      {helpOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-blue-50 text-[#2563EB]">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">InsightFlow AI Assistant</h3>
                  <p className="text-xs text-slate-500">Security & Analytics Overview</p>
                </div>
              </div>
              <button
                onClick={() => setHelpOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs text-slate-600 leading-relaxed">
              <p>
                InsightFlow AI operates under a <strong>Deterministic AST Read-Only Firewall</strong>. You can ask questions in plain English, and the engine translates them into safe, indexed SQL queries.
              </p>
              <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100 space-y-1">
                <p className="font-bold text-[#1E3A8A]">Active Session Security:</p>
                <p className="text-[11px] text-slate-600">
                  Role: <strong>{roleConfig.accountType}</strong> • All queries are strictly verified for sensitive column masking and row limits.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setHelpOpen(false)}
                className="px-4 py-2 bg-[#2563EB] text-white rounded-xl text-xs font-bold hover:bg-[#1D4ED8] transition-colors shadow-xs"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
