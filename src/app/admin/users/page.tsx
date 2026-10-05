"use client";

import React, { useState } from "react";
import { Users, UserPlus, Shield, CheckCircle2, Mail, Building, Trash2 } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([
    { id: "1", name: "Alex Vance", email: "alex.vance@insightflow.ai", role: "ADMIN", org: "InsightFlow Enterprise", status: "ACTIVE" },
    { id: "2", name: "Elena Rostova", email: "elena.r@insightflow.ai", role: "ANALYST", org: "InsightFlow Enterprise", status: "ACTIVE" },
    { id: "3", name: "David Chen", email: "d.chen@insightflow.ai", role: "VIEWER", org: "InsightFlow Enterprise", status: "ACTIVE" },
    { id: "4", name: "Sarah Jenkins", email: "s.jenkins@acme.com", role: "ANALYST", org: "Acme Global", status: "ACTIVE" },
  ]);

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteRole, setInviteRole] = useState<"ADMIN" | "ANALYST" | "VIEWER">("ANALYST");
  const [invitedNotice, setInvitedNotice] = useState(false);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    setUsers([
      ...users,
      {
        id: String(Date.now()),
        name: inviteName || inviteEmail.split("@")[0],
        email: inviteEmail,
        role: inviteRole,
        org: "InsightFlow Enterprise",
        status: "ACTIVE",
      },
    ]);

    setInviteEmail("");
    setInviteName("");
    setInvitedNotice(true);
    setTimeout(() => setInvitedNotice(false), 2500);
  };

  const handleRoleChange = (id: string, newRole: "ADMIN" | "ANALYST" | "VIEWER") => {
    setUsers(users.map((u) => (u.id === id ? { ...u, role: newRole } : u)));
  };

  const handleDelete = (id: string) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="pb-2 border-b border-[#E2E8F0]">
        <div className="flex items-center space-x-2 text-xs font-bold text-[#1E3A8A] mb-1">
          <Users className="w-4 h-4 text-[#2563EB]" />
          <span>Role-Based Access Control (RBAC)</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-[#111827]">
          User Directory & Privilege Management
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
          Manage workspace members, assign RBAC permissions (Admin, Analyst, Viewer), and invite stakeholders.
        </p>
      </div>

      {invitedNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Member successfully invited and RBAC credentials synchronized!</span>
        </div>
      )}

      {/* Invite Member Form */}
      <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-[#111827] flex items-center">
          <UserPlus className="w-4 h-4 mr-2 text-[#2563EB]" />
          Invite New Workspace Member
        </h3>

        <form onSubmit={handleInvite} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="font-semibold text-[#64748B] block mb-1">Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Rachel Zane"
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-[#2563EB] focus:bg-white"
            />
          </div>

          <div>
            <label className="font-semibold text-[#64748B] block mb-1">Work Email</label>
            <input
              type="email"
              required
              placeholder="rachel@company.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-[#2563EB] focus:bg-white"
            />
          </div>

          <div>
            <label className="font-semibold text-[#64748B] block mb-1">Assigned Role</label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-[#2563EB] focus:bg-white font-bold"
            >
              <option value="ADMIN">ADMIN (Full Governance)</option>
              <option value="ANALYST">ANALYST (Queries & Visuals)</option>
              <option value="VIEWER">VIEWER (Read-Only Consumer)</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white rounded-xl font-bold transition-all shadow-xs"
            >
              Send Invite
            </button>
          </div>
        </form>
      </div>

      {/* Users List */}
      <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs">
        <h3 className="text-sm font-bold text-[#111827] mb-3">Active Workspace Members ({users.length})</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[#94A3B8] font-bold uppercase text-[10px]">
                <th className="py-2">User Name</th>
                <th className="py-2">Email</th>
                <th className="py-2">Role Clearance</th>
                <th className="py-2">Organization</th>
                <th className="py-2">Status</th>
                <th className="py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/70">
                  <td className="py-3 font-bold text-slate-900">{u.name}</td>
                  <td className="py-3 text-slate-600 font-mono">{u.email}</td>
                  <td className="py-3">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as any)}
                      className="px-2 py-1 rounded-lg border border-slate-200 text-xs font-bold text-[#1E3A8A] bg-white outline-none"
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="ANALYST">ANALYST</option>
                      <option value="VIEWER">VIEWER</option>
                    </select>
                  </td>
                  <td className="py-3 text-slate-600">{u.org}</td>
                  <td className="py-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Remove Member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
