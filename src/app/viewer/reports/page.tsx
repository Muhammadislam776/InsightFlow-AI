"use client";

import React, { useState } from "react";
import {
  FileText,
  Download,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  Eye,
  X,
  FileCheck,
  ShieldCheck,
} from "lucide-react";

interface ReportItem {
  id: string;
  title: string;
  date: string;
  size: string;
  author: string;
  description: string;
  pages: number;
  tags: string[];
}

export default function ViewerReportsPage() {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [previewReport, setPreviewReport] = useState<ReportItem | null>(null);

  const reports: ReportItem[] = [
    {
      id: "rep-1",
      title: "Q3 FY2026 Executive Performance Briefing",
      date: "Oct 01, 2026",
      size: "1.2 MB PDF",
      author: "CFO & Strategy Office",
      description: "Comprehensive financial deck covering gross margin expansion, ARR milestones ($8.5M), and headcount productivity.",
      pages: 24,
      tags: ["Financials", "Board Deck", "Verified"],
    },
    {
      id: "rep-2",
      title: "Monthly Sales Attainment & Regional Review",
      date: "Sep 30, 2026",
      size: "840 KB PDF",
      author: "Revenue Operations",
      description: "Breakdown of regional quota attainment across North America, EMEA, and APAC with pipeline velocity metrics.",
      pages: 16,
      tags: ["Sales Operations", "Monthly Review"],
    },
    {
      id: "rep-3",
      title: "Annual Customer Retention & Cohort Study",
      date: "Sep 15, 2026",
      size: "2.4 MB PDF",
      author: "Analytics Team",
      description: "Net revenue retention matrix, multi-year cohort decay curves, and churn prevention recommendations.",
      pages: 32,
      tags: ["Customer Success", "Retention"],
    },
    {
      id: "rep-4",
      title: "Corporate Governance & Data Security Audit",
      date: "Sep 01, 2026",
      size: "520 KB PDF",
      author: "Security & Legal Compliance",
      description: "Annual verification of SQL AST safety filters, zero destructive command incidents, and SOC2 compliance snapshot.",
      pages: 12,
      tags: ["Governance", "Security", "SOC2"],
    },
  ];

  const handleDownload = (id: string, title: string) => {
    setDownloadingId(id);
    setTimeout(() => {
      setDownloadingId(null);
      // Simulate file download
      const element = document.createElement("a");
      const file = new Blob([`InsightFlow AI - Executive Briefing: ${title}\nPublished Date: Oct 2026\nStatus: Certified\nAll metrics verified by analytics engine.`], {
        type: "text/plain",
      });
      element.href = URL.createObjectURL(file);
      element.download = `${title.replace(/\s+/g, "_")}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 800);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="pb-4 border-b border-[#E2E8F0] flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-[#2563EB] mb-1">
            <FileText className="w-4 h-4" />
            <span className="uppercase tracking-wider">Executive Publications & Downloads</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111827]">
            Published Board Briefings
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1 max-w-2xl">
            Curated board decks, financial retrospectives, and quarterly executive summaries prepared for stakeholders.
          </p>
        </div>
      </div>

      {/* Visual Showcase Card */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-4 z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-200 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Certified Executive Publications • Board Ready</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black leading-tight text-white">
              Official Executive Board Room Analytics Briefings
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-xl">
              All published decks contain verified metric snapshots generated from approved data pipelines with full provenance tracking and mathematical verification.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setPreviewReport(reports[0])}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-md shadow-blue-500/30"
              >
                <span>Preview Q3 Executive Deck</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 h-56 lg:h-full relative overflow-hidden">
            <img
              src="/images/executive-briefings.jpg"
              alt="Executive Board Room Analytics Reports"
              className="w-full h-full object-cover object-center opacity-90 hover:opacity-100 transition-opacity duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-900/90 via-transparent to-transparent" />
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((rep) => (
          <div
            key={rep.id}
            className="group bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-xs hover:shadow-lg hover:border-blue-300 transition-all duration-200 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {rep.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563EB] border border-blue-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="text-[11px] text-slate-400 font-medium">{rep.date}</span>
              </div>

              <h3 className="text-base font-bold text-slate-900 group-hover:text-[#2563EB] transition-colors">
                {rep.title}
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                {rep.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700">{rep.pages} Pages</span> • {rep.size}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPreviewReport(rep)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center space-x-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>
                <button
                  onClick={() => handleDownload(rep.id, rep.title)}
                  disabled={downloadingId === rep.id}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{downloadingId === rep.id ? "Preparing..." : "Download"}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Report Preview Modal */}
      {previewReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 text-[#2563EB] rounded-xl">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{previewReport.title}</h3>
                  <p className="text-xs text-slate-500">{previewReport.author} • {previewReport.date}</p>
                </div>
              </div>
              <button
                onClick={() => setPreviewReport(null)}
                className="p-2 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto">
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm aspect-video bg-slate-100 relative">
                <img
                  src="/images/executive-briefings.jpg"
                  alt="Briefing Preview"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase text-slate-400">Executive Summary Synopsis</h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  {previewReport.description} This document has passed automated data provenance checks and contains certified board deck materials.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Classification</span>
                  <p className="text-xs font-black text-slate-900 mt-0.5">Board Confidential</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Total Pages</span>
                  <p className="text-xs font-black text-slate-900 mt-0.5">{previewReport.pages} Slides</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">File Footprint</span>
                  <p className="text-xs font-black text-slate-900 mt-0.5">{previewReport.size}</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-500">Certified by InsightFlow Audit Engine</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPreviewReport(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200"
                >
                  Close
                </button>
                <button
                  onClick={() => handleDownload(previewReport.id, previewReport.title)}
                  className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-xs flex items-center space-x-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Full PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
