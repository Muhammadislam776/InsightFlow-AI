"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, Database, ShieldCheck, Play, PieChart, CheckCircle2 } from "lucide-react";

interface LoadingIndicatorProps {
  onComplete?: () => void;
}

const STEPS = [
  { label: "Understanding your question...", icon: Sparkles, color: "text-accent-orange" },
  { label: "Checking approved data schema...", icon: Database, color: "text-primary" },
  { label: "Validating query allowlist & security...", icon: ShieldCheck, color: "text-blue-600" },
  { label: "Running safe read-only analytics...", icon: Play, color: "text-status-success" },
  { label: "Preparing visualization...", icon: PieChart, color: "text-purple-600" },
];

export function QueryLoadingIndicator({ onComplete }: LoadingIndicatorProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          if (onComplete) onComplete();
          return prev;
        }
      });
    }, 380);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="rounded-2xl border border-border bg-surface p-8 shadow-card flex flex-col items-center justify-center my-6 max-w-lg mx-auto text-center animate-in fade-in">
      <div className="relative mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light border border-blue-200">
        {React.createElement(STEPS[currentStep].icon, {
          className: `w-7 h-7 ${STEPS[currentStep].color} animate-pulse`,
        })}
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-orange opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-orange"></span>
        </span>
      </div>

      <h4 className="text-sm font-bold text-text-primary">
        {STEPS[currentStep].label}
      </h4>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
        <div
          className="bg-primary h-full transition-all duration-300 ease-out rounded-full"
          style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
        />
      </div>

      {/* Sequential Mini Steps Checklist */}
      <div className="w-full mt-6 space-y-2 text-left">
        {STEPS.map((step, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={idx}
              className={`flex items-center space-x-2.5 text-xs transition-opacity ${
                isDone ? "text-status-success font-medium" : isCurrent ? "text-primary font-bold" : "text-text-muted opacity-40"
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
              ) : (
                <div
                  className={`w-4 h-4 rounded-full border-2 shrink-0 ${
                    isCurrent ? "border-primary border-t-transparent animate-spin" : "border-slate-300"
                  }`}
                />
              )}
              <span>{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
