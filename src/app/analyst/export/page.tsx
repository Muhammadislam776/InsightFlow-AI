"use client";

import React, { useState } from "react";
import { FileSpreadsheet, Download, CheckCircle2, Clock, Calendar } from "lucide-react";

export default function AnalystExportPage() {
  const [downloading, setDownloading] = useState<string | null>(null);

  const exports = [
    { id: "exp_1", title: "Monthly Historical Revenue (Last 12 Months)", format: "CSV", size: "142 KB", rows: 12, date: "Today, 14:20" },
    { id: "exp_2", title: "Regional Sales Performance Breakdown", format: "CSV", size: "86 KB", rows: 5, date: "Today, 11:05" },
    { id: "exp_3", title: "Top 50 High-Value Enterprise Customers", format: "JSON", size: "310 KB", rows: 50, date: "Yesterday" },
    { id: "exp_4", title: "Product Inventory & Revenue Margin Audit", format: "CSV", size: "220 KB", rows: 450, date: "Oct 02, 2026" },
  ];

  const handleDownload = (id: string, title: string) => {
    setDownloading(id);
    setTimeout(() => {
      // Simulate file download
      const element = document.createElement("a");
      const file = new Blob([`Dataset: ${title}\nExported by: InsightFlow AI Analyst Studio\nTimestamp: ${new Date().toISOString()}`], {
        type: "text/plain",
      });
      element.href = URL.createObjectURL(file);
      element.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, "_")}.csv`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      setDownloading(null);
    }, 600);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="pb-2 border-b border-[#E2E8F0]">
        <div className="flex items-center space-x-2 text-xs font-bold text-[#2563EB] mb-1">
          <FileSpreadsheet className="w-4 h-4" />
          <span>Data Extraction & Compliance Pipeline</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-[#111827]">
          Data Export Center
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
          Generate, download, and archive verified query datasets in CSV, JSON, and formatted spreadsheet tables.
        </p>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs">
        <h3 className="text-sm font-bold text-[#111827] mb-3">Available Data Extraction Files</h3>
        <div className="divide-y divide-slate-100">
          {exports.map((item) => (
            <div key={item.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-[#2563EB]">
                    {item.format}
                  </span>
                  <span className="text-xs font-bold text-slate-900">{item.title}</span>
                </div>
                <p className="text-[11px] text-[#64748B]">
                  {item.rows} rows • {item.size} • Generated {item.date}
                </p>
              </div>

              <button
                onClick={() => handleDownload(item.id, item.title)}
                disabled={downloading === item.id}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{downloading === item.id ? "Preparing File..." : "Download Dataset"}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
