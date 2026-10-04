"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Layers, Sparkles, BookOpen, Clock, ArrowRight } from "lucide-react";
import { useApp } from "@/context/AppContext";

export function GlobalSearchModal() {
  const router = useRouter();
  const { searchOpen, setSearchOpen } = useApp();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(!searchOpen);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen, setSearchOpen]);

  if (!searchOpen) return null;

  const quickLinks = [
    { title: "Ask Data: Monthly Revenue", type: "Query", href: "/ask?q=Show monthly revenue for the last 12 months", icon: Sparkles },
    { title: "Sales Overview Dashboard", type: "Dashboard", href: "/dashboards/dash_sales_overview", icon: Layers },
    { title: "Products & Order Line Items", type: "Data Catalog", href: "/catalog?search=products", icon: BookOpen },
    { title: "Query History & Security Logs", type: "History", href: "/history", icon: Clock },
  ];

  const handleSelect = (href: string) => {
    setSearchOpen(false);
    router.push(href);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-surface rounded-2xl shadow-elevated border border-border overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="flex items-center px-4 py-3 border-b border-border bg-background/50">
          <Search className="w-5 h-5 text-text-muted mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a question, dashboard name, or metric..."
            autoFocus
            className="w-full bg-transparent text-sm text-text-primary placeholder-text-muted outline-hidden font-medium"
            onKeyDown={(e) => {
              if (e.key === "Enter" && query.trim()) {
                handleSelect(`/ask?q=${encodeURIComponent(query)}`);
              }
            }}
          />
          <kbd className="px-2 py-0.5 text-[10px] font-mono text-text-muted bg-surface border border-border rounded">
            ESC
          </kbd>
        </div>

        <div className="p-3">
          <p className="text-[11px] font-bold text-text-muted uppercase px-3 py-1">Quick Suggestions</p>
          <div className="space-y-1 mt-1">
            {quickLinks.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(item.href)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-100 text-left transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-primary-light text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-text-primary">{item.title}</p>
                      <p className="text-[10px] text-text-muted">{item.type}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-primary transition-transform group-hover:translate-x-1" />
                </button>
              );
            })}
          </div>

          {query.trim() && (
            <div className="mt-3 pt-3 border-t border-border px-3">
              <button
                onClick={() => handleSelect(`/ask?q=${encodeURIComponent(query)}`)}
                className="w-full flex items-center justify-between p-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors"
              >
                <span>Ask InsightFlow AI: "{query}"</span>
                <Sparkles className="w-4 h-4 text-accent-orange" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
