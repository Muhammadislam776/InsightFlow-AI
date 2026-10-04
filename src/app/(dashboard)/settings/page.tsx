"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Users,
  Shield,
  Database,
  Cpu,
  Trash2,
  RefreshCw,
  Plus,
  Lock,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function SettingsAdminPage() {
  const { currentUser } = useApp();
  const [activeTab, setActiveTab] = useState("workspace");
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cacheMessage, setCacheMessage] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("ANALYST");

  const isAdmin = currentUser.role === "ADMIN";

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      setSettings(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleClearCache = async () => {
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "CLEAR_CACHE", user: currentUser.name }),
      });
      const data = await res.json();
      setCacheMessage(data.message || "Cache successfully purged.");
      fetchSettings();
      setTimeout(() => setCacheMessage(null), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "INVITE_USER",
          payload: { email: inviteEmail, role: inviteRole, name: inviteEmail.split("@")[0] },
          user: currentUser.name,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setInviteEmail("");
        fetchSettings();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading || !settings) {
    return <div className="p-12 text-center text-xs text-text-muted">Loading workspace settings...</div>;
  }

  // Role Gate: if not ADMIN, show restricted message (Requirement 8, 42)
  if (!isAdmin) {
    return (
      <div className="p-12 rounded-2xl border border-red-200 bg-red-50/50 text-center max-w-lg mx-auto space-y-3">
        <Lock className="w-8 h-8 text-status-danger mx-auto" />
        <h2 className="text-base font-bold text-text-primary">Administrative Access Restricted</h2>
        <p className="text-xs text-text-secondary">
          Your current role (<strong>{currentUser.role}</strong>) does not have permission to modify system configuration or manage organization members. Switch to <strong>ADMIN</strong> using the header role switcher to explore this panel.
        </p>
      </div>
    );
  }

  const tabs = [
    { id: "workspace", label: "Workspace & Profile" },
    { id: "users", label: "Users & Roles" },
    { id: "ai", label: "AI & Query Limits" },
    { id: "cache", label: "Cache Management" },
    { id: "audit", label: "Audit Logs" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="pb-2 border-b border-border/80">
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          Settings & Administration
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
          Configure security governance, user permissions, AI execution limits, and cache invalidation.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border space-x-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-text-secondary hover:text-text-primary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Workspace */}
      {activeTab === "workspace" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-card space-y-4">
            <h3 className="text-sm font-bold text-text-primary">Workspace Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-text-secondary block mb-1">Organization</label>
                <input
                  type="text"
                  disabled
                  value={settings.workspace.name}
                  className="w-full px-3 py-2 bg-slate-50 border border-border rounded-xl text-text-primary"
                />
              </div>
              <div>
                <label className="font-semibold text-text-secondary block mb-1">Subscription Plan</label>
                <input
                  type="text"
                  disabled
                  value={settings.workspace.plan}
                  className="w-full px-3 py-2 bg-slate-50 border border-border rounded-xl text-text-primary font-bold text-primary"
                />
              </div>
              <div>
                <label className="font-semibold text-text-secondary block mb-1">Database Region</label>
                <input
                  type="text"
                  disabled
                  value={settings.workspace.region}
                  className="w-full px-3 py-2 bg-slate-50 border border-border rounded-xl text-text-primary font-mono"
                />
              </div>
              <div>
                <label className="font-semibold text-text-secondary block mb-1">Created</label>
                <input
                  type="text"
                  disabled
                  value={settings.workspace.createdAt}
                  className="w-full px-3 py-2 bg-slate-50 border border-border rounded-xl text-text-primary"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Users & Roles (Section 54) */}
      {activeTab === "users" && (
        <div className="space-y-6">
          {/* Invite Form */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
            <h3 className="text-sm font-bold text-text-primary mb-3">Invite Team Member</h3>
            <form onSubmit={handleInviteUser} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="colleague@insightflow.ai"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="flex-1 px-3 py-2 text-xs bg-background border border-border rounded-xl outline-hidden focus:border-primary"
              />
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="px-3 py-2 text-xs bg-background border border-border rounded-xl font-medium"
              >
                <option value="ADMIN">ADMIN</option>
                <option value="ANALYST">ANALYST</option>
                <option value="VIEWER">VIEWER</option>
              </select>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-semibold hover:bg-primary-hover flex items-center justify-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Send Invite</span>
              </button>
            </form>
          </div>

          {/* Users List */}
          <div className="rounded-2xl border border-border bg-surface shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-text-secondary border-b border-border">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Name</th>
                    <th className="px-4 py-3 font-semibold">Email</th>
                    <th className="px-4 py-3 font-semibold">Role</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {settings.users.map((u: any) => (
                    <tr key={u.id} className="hover:bg-slate-50/70">
                      <td className="px-5 py-3.5 font-bold text-text-primary">{u.name}</td>
                      <td className="px-4 py-3.5 text-text-secondary">{u.email}</td>
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-primary border border-blue-200">
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-status-success font-medium flex items-center">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        Active
                      </td>
                      <td className="px-4 py-3.5 text-text-muted">{u.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AI Configuration (Section 56) */}
      {activeTab === "ai" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-card space-y-4">
            <h3 className="text-sm font-bold text-text-primary">AI Engine & Query Governance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-text-secondary block mb-1">Model Architecture</label>
                <input
                  type="text"
                  disabled
                  value={settings.aiConfig.model}
                  className="w-full px-3 py-2 bg-slate-50 border border-border rounded-xl text-text-primary font-mono text-[11px]"
                />
              </div>
              <div>
                <label className="font-semibold text-text-secondary block mb-1">Guardrail Enforcement</label>
                <input
                  type="text"
                  disabled
                  value={settings.aiConfig.guardrailEnforcement}
                  className="w-full px-3 py-2 bg-slate-50 border border-border rounded-xl text-green-700 font-bold"
                />
              </div>
              <div>
                <label className="font-semibold text-text-secondary block mb-1">Row Limit Enforcement</label>
                <input
                  type="text"
                  disabled
                  value={`${settings.queryLimits.defaultLimit} Rows (Hard cap: ${settings.queryLimits.maxLimit})`}
                  className="w-full px-3 py-2 bg-slate-50 border border-border rounded-xl text-text-primary"
                />
              </div>
              <div>
                <label className="font-semibold text-text-secondary block mb-1">Query Timeout SLA</label>
                <input
                  type="text"
                  disabled
                  value={`${settings.queryLimits.queryTimeoutSec} seconds`}
                  className="w-full px-3 py-2 bg-slate-50 border border-border rounded-xl text-text-primary"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Cache Management (Section 46) */}
      {activeTab === "cache" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
              <span className="text-xs font-semibold text-text-secondary">Cached Slots</span>
              <div className="mt-2 text-2xl font-extrabold text-primary">
                {settings.cacheStats.totalEntries} entries
              </div>
              <span className="text-[11px] text-text-muted mt-1 block">Role-scoped memory keys</span>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
              <span className="text-xs font-semibold text-text-secondary">Cache Hit Ratio</span>
              <div className="mt-2 text-2xl font-extrabold text-status-success">
                {settings.cacheStats.hitRate}%
              </div>
              <span className="text-[11px] text-text-muted mt-1 block">
                {settings.cacheStats.hits} hits / {settings.cacheStats.misses} misses
              </span>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
              <span className="text-xs font-semibold text-text-secondary">Execution Time Saved</span>
              <div className="mt-2 text-2xl font-extrabold text-accent-orange">
                {settings.cacheStats.totalSavedTimeSec} sec
              </div>
              <span className="text-[11px] text-text-muted mt-1 block">Cumulative CPU latency saved</span>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6 shadow-card space-y-4">
            <h3 className="text-sm font-bold text-text-primary">Cache Operations</h3>
            <p className="text-xs text-text-secondary">
              Purge all cached results across organizations and roles. Fresh queries will re-execute against the read-only database.
            </p>

            {cacheMessage && (
              <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-status-success text-xs font-medium flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{cacheMessage}</span>
              </div>
            )}

            <button
              onClick={handleClearCache}
              className="px-4 py-2.5 rounded-xl bg-red-50 text-status-danger hover:bg-status-danger hover:text-white border border-red-200 transition-colors text-xs font-semibold flex items-center space-x-1.5"
            >
              <Trash2 className="w-4 h-4" />
              <span>Purge Cache Now</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: Audit Logs */}
      {activeTab === "audit" && (
        <div className="rounded-2xl border border-border bg-surface shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-text-secondary border-b border-border">
                <tr>
                  <th className="px-5 py-3 font-semibold">Action</th>
                  <th className="px-4 py-3 font-semibold">User</th>
                  <th className="px-4 py-3 font-semibold">Details</th>
                  <th className="px-4 py-3 font-semibold">IP</th>
                  <th className="px-4 py-3 font-semibold">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {settings.auditLogs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-text-primary">{log.user}</td>
                    <td className="px-4 py-3.5 text-text-secondary max-w-sm truncate">{log.details}</td>
                    <td className="px-4 py-3.5 font-mono text-text-muted">{log.ip}</td>
                    <td className="px-4 py-3.5 text-text-muted">{log.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
