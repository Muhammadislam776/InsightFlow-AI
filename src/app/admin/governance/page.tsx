"use client";

import React, { useState } from "react";
import { Database, ShieldCheck, Lock, CheckCircle2, AlertCircle, Eye, EyeOff, Save } from "lucide-react";

export default function AdminSchemaGovernance() {
  const [tables, setTables] = useState([
    {
      name: "orders",
      displayName: "Customer Orders",
      rowCount: "12,480",
      status: "APPROVED_READ_ONLY",
      columns: [
        { name: "id", type: "INTEGER", sensitive: false, accessibleRoles: ["ADMIN", "ANALYST", "VIEWER"] },
        { name: "customer_id", type: "INTEGER", sensitive: false, accessibleRoles: ["ADMIN", "ANALYST", "VIEWER"] },
        { name: "total_amount", type: "NUMERIC", sensitive: false, accessibleRoles: ["ADMIN", "ANALYST", "VIEWER"] },
        { name: "order_date", type: "DATE", sensitive: false, accessibleRoles: ["ADMIN", "ANALYST", "VIEWER"] },
        { name: "status", type: "TEXT", sensitive: false, accessibleRoles: ["ADMIN", "ANALYST", "VIEWER"] },
      ],
    },
    {
      name: "products",
      displayName: "Product Inventory",
      rowCount: "450",
      status: "APPROVED_READ_ONLY",
      columns: [
        { name: "id", type: "INTEGER", sensitive: false, accessibleRoles: ["ADMIN", "ANALYST", "VIEWER"] },
        { name: "name", type: "TEXT", sensitive: false, accessibleRoles: ["ADMIN", "ANALYST", "VIEWER"] },
        { name: "price", type: "NUMERIC", sensitive: false, accessibleRoles: ["ADMIN", "ANALYST", "VIEWER"] },
        { name: "unit_cost", type: "NUMERIC", sensitive: true, accessibleRoles: ["ADMIN"] }, // Restricted from Analysts and Viewers!
        { name: "stock_status", type: "TEXT", sensitive: false, accessibleRoles: ["ADMIN", "ANALYST", "VIEWER"] },
      ],
    },
    {
      name: "customers",
      displayName: "Accounts & Clients",
      rowCount: "3,120",
      status: "APPROVED_READ_ONLY",
      columns: [
        { name: "id", type: "INTEGER", sensitive: false, accessibleRoles: ["ADMIN", "ANALYST", "VIEWER"] },
        { name: "name", type: "TEXT", sensitive: false, accessibleRoles: ["ADMIN", "ANALYST", "VIEWER"] },
        { name: "company", type: "TEXT", sensitive: false, accessibleRoles: ["ADMIN", "ANALYST", "VIEWER"] },
        { name: "lifetime_value", type: "NUMERIC", sensitive: false, accessibleRoles: ["ADMIN", "ANALYST", "VIEWER"] },
        { name: "email", type: "TEXT", sensitive: true, accessibleRoles: ["ADMIN", "ANALYST"] },
      ],
    },
  ]);

  const [savedNotice, setSavedNotice] = useState(false);

  const toggleSensitive = (tableName: string, colName: string) => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.name !== tableName) return t;
        return {
          ...t,
          columns: t.columns.map((c) =>
            c.name === colName ? { ...c, sensitive: !c.sensitive } : c
          ),
        };
      })
    );
  };

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-[#1E3A8A] mb-1">
            <Database className="w-4 h-4 text-[#2563EB]" />
            <span>Schema Governance & Field Permissions</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[#111827]">
            Approved Tables & Sensitive Field Masking
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Administers which database tables the AI may query, and enforces column-level redaction for non-admins.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-bold transition-all shadow-xs"
        >
          <Save className="w-4 h-4" />
          <span>Save Governance Policy</span>
        </button>
      </div>

      {savedNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Schema governance rules saved and propagated to the SQL parser!</span>
        </div>
      )}

      {/* Tables Breakdown */}
      <div className="space-y-4">
        {tables.map((table) => (
          <div key={table.name} className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-blue-50 text-[#2563EB]">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#111827]">{table.displayName}</h3>
                  <p className="text-xs font-mono text-[#64748B]">{table.name} • {table.rowCount} records</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-100 text-emerald-800">
                {table.status}
              </span>
            </div>

            {/* Columns Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[#94A3B8] font-bold uppercase text-[10px]">
                    <th className="py-2">Column Name</th>
                    <th className="py-2">Data Type</th>
                    <th className="py-2">Sensitivity Classification</th>
                    <th className="py-2">Authorized Roles</th>
                    <th className="py-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {table.columns.map((col) => (
                    <tr key={col.name} className="hover:bg-slate-50/70">
                      <td className="py-2.5 font-mono font-bold text-slate-800">{col.name}</td>
                      <td className="py-2.5 text-[#64748B] font-mono">{col.type}</td>
                      <td className="py-2.5">
                        {col.sensitive ? (
                          <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-700">
                            <Lock className="w-3 h-3 mr-1" /> Sensitive (Redacted)
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                            Standard Field
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 text-[#64748B]">
                        {col.sensitive ? "ADMIN Only" : "ADMIN, ANALYST, VIEWER"}
                      </td>
                      <td className="py-2.5 text-right">
                        <button
                          onClick={() => toggleSensitive(table.name, col.name)}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                          {col.sensitive ? "Unmask Field" : "Mark Sensitive"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
