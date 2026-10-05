"use client";

import React, { useState } from "react";
import { BookOpen, Database, Search, ChevronRight, Lock, CheckCircle2 } from "lucide-react";

export default function AnalystCatalogPage() {
  const [search, setSearch] = useState("");
  const [activeTable, setActiveTable] = useState("orders");

  const tables = [
    {
      name: "orders",
      description: "Transactional customer sales orders with fulfillment status, discounts, and regional link.",
      columns: [
        { name: "id", type: "INTEGER", desc: "Unique auto-incrementing order key" },
        { name: "customer_id", type: "INTEGER", desc: "Foreign key referencing customers.id" },
        { name: "total_amount", type: "NUMERIC", desc: "Final order invoice value in USD" },
        { name: "order_date", type: "DATE", desc: "Timestamp when transaction occurred (YYYY-MM-DD)" },
        { name: "status", type: "TEXT", desc: "Order stage: Completed, Processing, Cancelled, Refunded" },
      ],
    },
    {
      name: "products",
      description: "SKU catalog of enterprise offerings, retail prices, categories, and inventory status.",
      columns: [
        { name: "id", type: "INTEGER", desc: "Primary key SKU identifier" },
        { name: "name", type: "TEXT", desc: "Marketed product title" },
        { name: "category", type: "TEXT", desc: "Product family: Software, Analytics, Add-on" },
        { name: "price", type: "NUMERIC", desc: "Standard public customer price per unit" },
        { name: "unit_cost", type: "NUMERIC", desc: "Internal wholesale cost [Admin restricted]", restricted: true },
        { name: "stock_status", type: "TEXT", desc: "Inventory indicator: Available, Low Stock, Backordered" },
      ],
    },
    {
      name: "customers",
      description: "Corporate accounts and client organizations with customer tiers and region mappings.",
      columns: [
        { name: "id", type: "INTEGER", desc: "Account identification key" },
        { name: "name", type: "TEXT", desc: "Primary account contact full name" },
        { name: "company", type: "TEXT", desc: "Corporate legal entity name" },
        { name: "segment", type: "TEXT", desc: "Market segment: Enterprise, Mid-Market, SMB, Startup" },
        { name: "lifetime_value", type: "NUMERIC", desc: "Aggregated historical gross billings (LTV)" },
      ],
    },
    {
      name: "regions",
      description: "Geographic operational regions with quarterly targets and regional leadership.",
      columns: [
        { name: "id", type: "INTEGER", desc: "Territory ID code" },
        { name: "name", type: "TEXT", desc: "Region territory: North America, EMEA, APAC, LATAM" },
        { name: "regional_manager", type: "TEXT", desc: "Assigned territory VP / Manager" },
        { name: "quarterly_target", type: "NUMERIC", desc: "Revenue KPI target for the current quarter" },
      ],
    },
  ];

  const current = tables.find((t) => t.name === activeTable) || tables[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="pb-2 border-b border-[#E2E8F0]">
        <div className="flex items-center space-x-2 text-xs font-bold text-[#2563EB] mb-1">
          <BookOpen className="w-4 h-4" />
          <span>Semantic Business Dictionary</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-[#111827]">
          Data Catalog & Schema Reference
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
          Explore approved relational tables, validated data types, foreign key relationships, and semantic meanings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Table Selector on Left */}
        <div className="md:col-span-4 space-y-2">
          <p className="text-[10px] font-black uppercase text-[#94A3B8] tracking-wider px-1">
            Approved Tables ({tables.length})
          </p>
          {tables.map((t) => (
            <button
              key={t.name}
              onClick={() => setActiveTable(t.name)}
              className={`w-full p-3.5 rounded-2xl border text-left transition-all ${
                activeTable === t.name
                  ? "bg-blue-50/80 border-[#2563EB] text-[#2563EB] shadow-xs"
                  : "bg-white border-slate-200 text-slate-800 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs font-mono">{t.name}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
              <p className="text-[11px] text-[#64748B] mt-1 line-clamp-1">{t.description}</p>
            </button>
          ))}
        </div>

        {/* Selected Table Specification on Right */}
        <div className="md:col-span-8 bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                TABLE SCHEMA
              </span>
              <h2 className="text-lg font-black text-slate-900 font-mono mt-1">{current.name}</h2>
              <p className="text-xs text-[#64748B] mt-0.5">{current.description}</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Approved Read-Only
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[#94A3B8] font-bold uppercase text-[10px]">
                  <th className="py-2">Field</th>
                  <th className="py-2">Type</th>
                  <th className="py-2">Business Definition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {current.columns.map((col) => (
                  <tr key={col.name} className="hover:bg-slate-50/70">
                    <td className="py-2.5 font-mono font-bold text-slate-800">
                      {col.name}
                      {col.restricted && (
                        <span className="ml-1.5 text-[9px] text-rose-600 bg-rose-50 px-1 py-0.2 rounded font-sans font-bold">
                          Admin Only
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 font-mono text-slate-500">{col.type}</td>
                    <td className="py-2.5 text-slate-600">{col.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
