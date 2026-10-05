"use client";

import React, { useState } from "react";
import { Settings, Sliders, ShieldCheck, Save, CheckCircle2, Cpu, Database, Lock } from "lucide-react";

export default function AdminSettingsPage() {
  const [maxRows, setMaxRows] = useState(100);
  const [cacheTtlSeconds, setCacheTtlSeconds] = useState(300);
  const [allowAiSqlGeneration, setAllowAiSqlGeneration] = useState(true);
  const [strictSchemaValidation, setStrictSchemaValidation] = useState(true);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
      <div className="pb-2 border-b border-[#E2E8F0]">
        <div className="flex items-center space-x-2 text-xs font-bold text-[#1E3A8A] mb-1">
          <Settings className="w-4 h-4 text-[#2563EB]" />
          <span>System Governance & Parameters</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-[#111827]">
          Admin System Policies & AI Guardrails
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
          Configure runtime row constraints, cache invalidation schedules, AI model generation thresholds, and security parameters.
        </p>
      </div>

      {savedNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Workspace configuration policies updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Policy Group 1: Query Execution Limits */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#111827] flex items-center">
            <Sliders className="w-4 h-4 mr-2 text-[#2563EB]" />
            Query Execution Safety Limits
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Mandatory Query Row Limit (Default LIMIT)
              </label>
              <input
                type="number"
                min={10}
                max={500}
                value={maxRows}
                onChange={(e) => setMaxRows(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-[#2563EB] focus:bg-white font-mono"
              />
              <p className="text-[11px] text-[#64748B] mt-1">Appended automatically to every SELECT query.</p>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Cache Expiration TTL (Seconds)
              </label>
              <input
                type="number"
                min={30}
                max={3600}
                value={cacheTtlSeconds}
                onChange={(e) => setCacheTtlSeconds(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-[#2563EB] focus:bg-white font-mono"
              />
              <p className="text-[11px] text-[#64748B] mt-1">Repeated queries within this window serve from memory.</p>
            </div>
          </div>
        </div>

        {/* Policy Group 2: AI Guardrails */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#111827] flex items-center">
            <ShieldCheck className="w-4 h-4 mr-2 text-emerald-600" />
            AI Semantic Guardrails
          </h3>

          <div className="space-y-3 text-xs">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={allowAiSqlGeneration}
                onChange={(e) => setAllowAiSqlGeneration(e.target.checked)}
                className="w-4 h-4 rounded text-[#2563EB] focus:ring-0"
              />
              <div>
                <span className="font-bold text-slate-800">Enable Natural-Language to SQL Parsing</span>
                <p className="text-[11px] text-[#64748B]">Allows Analysts and Viewers to prompt business queries.</p>
              </div>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={strictSchemaValidation}
                onChange={(e) => setStrictSchemaValidation(e.target.checked)}
                className="w-4 h-4 rounded text-[#2563EB] focus:ring-0"
              />
              <div>
                <span className="font-bold text-slate-800">Strict Schema Verification Only</span>
                <p className="text-[11px] text-[#64748B]">Rejects any query referencing uncatalogued fields.</p>
              </div>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="inline-flex items-center space-x-1.5 px-6 py-3 rounded-full bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-bold transition-all shadow-xs"
        >
          <Save className="w-4 h-4" />
          <span>Save System Policies</span>
        </button>
      </form>
    </div>
  );
}
