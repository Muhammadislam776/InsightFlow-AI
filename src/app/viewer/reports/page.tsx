"use client";

import React from "react";
import { FileText, Download, CheckCircle2, Calendar } from "lucide-react";

export default function ViewerReportsPage() {
  const reports = [
    { title: "Q3 2026 Executive Performance Briefing", date: "Oct 01, 2026", size: "1.2 MB PDF", author: "CFO & Strategy Office" },
    { title: "Monthly Sales Attainment & Regional Review", date: "Sep 30, 2026", size: "840 KB PDF", author: "Revenue Operations" },
    { title: "Annual Customer Retention & Cohort Study", date: "Sep 15, 2026", size: "2.4 MB PDF", author: "Analytics Team" },
    { title: "Corporate Governance & Data Security Audit", date: "Sep 01, 2026", size: "520 KB PDF", author: "Security & Legal" },
  ];

  const handleDownload = (title: string) => {
    alert(`Downloading verified executive document: "${title}"`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="pb-2 border-b border-[#E2E8F0]">
        <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 mb-1">
          <FileText className="w-4 h-4" />
          <span>Executive Downloads & Publications</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-[#111827]">
          Published Executive Briefings
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
          Curated board decks, financial retrospectives, and quarterly executive summaries prepared for stakeholders.
        </p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-xs">
        <h3 className="text-sm font-bold text-[#111827] mb-3">Available Executive Publications</h3>
        <div className="divide-y divide-slate-100">
          {reports.map((rep, idx) => (
            <div key={idx} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900">{rep.title}</h4>
                <p className="text-xs text-[#64748B]">
                  Published: {rep.date} • {rep.size} • Prepared by {rep.author}
                </p>
              </div>

              <button
                onClick={() => handleDownload(rep.title)}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Report</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
