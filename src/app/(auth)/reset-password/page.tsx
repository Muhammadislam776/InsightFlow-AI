"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight, CheckCircle2 } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setDone(true);
      setTimeout(() => router.push("/login"), 2000);
    }
  };

  return (
    <div className="bg-surface py-8 px-6 sm:px-10 rounded-3xl border border-border shadow-card space-y-6 animate-in fade-in">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-extrabold text-text-primary">Set New Password</h2>
        <p className="text-xs text-text-secondary">Choose a secure password for your account</p>
      </div>

      {done ? (
        <div className="p-4 bg-green-50 text-status-success rounded-xl border border-green-200 text-xs text-center space-y-2">
          <CheckCircle2 className="w-6 h-6 mx-auto" />
          <p className="font-bold">Password Reset Successful!</p>
          <p className="text-text-secondary">Redirecting to sign in...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-text-secondary block mb-1">New Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-text-muted absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-background border border-border rounded-xl text-text-primary outline-hidden focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-text-secondary block mb-1">Confirm New Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-text-muted absolute left-3 top-3" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-background border border-border rounded-xl text-text-primary outline-hidden focus:border-primary"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-hover shadow-subtle transition-all flex items-center justify-center space-x-1.5"
          >
            <span>Update Password</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      )}
    </div>
  );
}
