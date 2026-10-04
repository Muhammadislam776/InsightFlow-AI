"use client";

import React, { useState } from "react";
import { User, Shield, Building, Mail, CheckCircle2 } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function ProfilePage() {
  const { currentUser } = useApp();
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-2xl animate-in fade-in duration-200">
      <div className="pb-2 border-b border-border/80">
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          User Profile & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
          Manage your personal account details, notification preferences, and session security.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 shadow-card space-y-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center text-white text-xl font-bold shadow-card">
            {currentUser.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <h3 className="text-base font-bold text-text-primary">{currentUser.name}</h3>
            <p className="text-xs text-text-secondary">{currentUser.email}</p>
            <div className="flex items-center space-x-2 mt-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary text-white">
                {currentUser.role}
              </span>
              <span className="text-xs text-text-muted">Acme Enterprises BI Hub</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs pt-4 border-t border-border">
          <div>
            <label className="font-semibold text-text-secondary block mb-1">Full Name</label>
            <input
              type="text"
              defaultValue={currentUser.name}
              className="w-full px-3 py-2 bg-background border border-border rounded-xl text-text-primary outline-hidden focus:border-primary"
            />
          </div>

          <div>
            <label className="font-semibold text-text-secondary block mb-1">Email Address</label>
            <input
              type="email"
              disabled
              defaultValue={currentUser.email}
              className="w-full px-3 py-2 bg-slate-50 border border-border rounded-xl text-text-muted"
            />
          </div>

          <div>
            <label className="font-semibold text-text-secondary block mb-1">Role & Permissions</label>
            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200">
              <p className="font-bold text-primary">
                Assigned Role: {currentUser.role}
              </p>
              <p className="text-text-secondary mt-1">
                {currentUser.role === "ADMIN"
                  ? "Full administrative control over schema, users, and cache."
                  : currentUser.role === "ANALYST"
                  ? "Permission to ask questions, create queries, build dashboards, and export CSVs."
                  : "Read-only access to approved metrics and team dashboards."}
              </p>
            </div>
          </div>

          {savedNotice && (
            <div className="p-3 bg-green-50 text-status-success rounded-xl border border-green-200 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Profile preferences successfully saved!</span>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover shadow-subtle transition-all"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
