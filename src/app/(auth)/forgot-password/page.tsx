"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-surface py-8 px-6 sm:px-10 rounded-3xl border border-border shadow-card space-y-6 animate-in fade-in">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-extrabold text-text-primary">Reset Password</h2>
        <p className="text-xs text-text-secondary">We will send a secure password reset link to your email</p>
      </div>

      {submitted ? (
        <div className="p-4 bg-green-50 text-status-success rounded-xl border border-green-200 text-xs space-y-2 text-center">
          <CheckCircle2 className="w-6 h-6 mx-auto text-status-success" />
          <p className="font-bold">Reset Link Sent!</p>
          <p className="text-text-secondary">
            Check your inbox for instructions to reset your password.
          </p>
          <div className="pt-2">
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Return to Sign In
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-text-secondary block mb-1">Corporate Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-text-muted absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex.vance@insightflow.ai"
                className="w-full pl-9 pr-3 py-2.5 bg-background border border-border rounded-xl text-text-primary outline-hidden focus:border-primary"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-hover shadow-subtle transition-all flex items-center justify-center space-x-1.5"
          >
            <span>Send Reset Instructions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <div className="text-center pt-2">
            <Link href="/login" className="text-text-secondary hover:text-text-primary text-xs">
              Back to Sign In
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
