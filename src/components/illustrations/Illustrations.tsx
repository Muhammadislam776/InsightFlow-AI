import React from "react";

export function HeroAnalyticsIllustration({ className = "w-full h-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 480" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="heroBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563EB" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="heroLightGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#EFF6FF" />
          <stop offset="100%" stopColor="#DBEAFE" />
        </linearGradient>
        <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#EA580C" />
        </linearGradient>
        <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="130%" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#1E3A8A" floodOpacity="0.08" />
        </filter>
      </defs>

      {/* Background Soft Glow Circles */}
      <circle cx="480" cy="120" r="140" fill="#EFF6FF" opacity="0.6" />
      <circle cx="120" cy="380" r="100" fill="#FFF7ED" opacity="0.5" />

      {/* Main Elevated BI Board */}
      <rect x="70" y="50" width="460" height="340" rx="20" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" filter="url(#cardShadow)" />

      {/* Top Header Mockup */}
      <rect x="70" y="50" width="460" height="48" rx="20" fill="#F8FAFC" />
      <circle cx="102" cy="74" r="6" fill="#DC2626" opacity="0.8" />
      <circle cx="122" cy="74" r="6" fill="#F59E0B" opacity="0.8" />
      <circle cx="142" cy="74" r="6" fill="#16A34A" opacity="0.8" />
      <rect x="170" y="66" width="220" height="16" rx="8" fill="#FFFFFF" stroke="#E2E8F0" />
      <text x="182" y="78" fill="#64748B" fontSize="9" fontFamily="sans-serif" fontWeight="500">
        "Show monthly revenue for this year"
      </text>

      {/* AI Processing Chip with Badge */}
      <rect x="400" y="65" width="112" height="18" rx="9" fill="#FFF7ED" stroke="#FED7AA" />
      <circle cx="410" cy="74" r="4" fill="#F97316" />
      <text x="418" y="77" fill="#C2410C" fontSize="8" fontWeight="600" fontFamily="sans-serif">
        SAFE SQL · READ-ONLY
      </text>

      {/* KPI Cards inside visual */}
      <rect x="100" y="118" width="120" height="65" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
      <text x="114" y="136" fill="#64748B" fontSize="9" fontWeight="500">Total Revenue</text>
      <text x="114" y="158" fill="#111827" fontSize="16" fontWeight="700">$854,900</text>
      <text x="114" y="174" fill="#16A34A" fontSize="9" fontWeight="600">↑ +14.2% YoY</text>

      <rect x="235" y="118" width="120" height="65" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
      <text x="249" y="136" fill="#64748B" fontSize="9" fontWeight="500">Total Orders</text>
      <text x="249" y="158" fill="#111827" fontSize="16" fontWeight="700">1,248</text>
      <text x="249" y="174" fill="#2563EB" fontSize="9" fontWeight="600">Enterprise Tiers</text>

      <rect x="370" y="118" width="130" height="65" rx="10" fill="#EFF6FF" stroke="#BFDBFE" />
      <text x="384" y="136" fill="#1E40AF" fontSize="9" fontWeight="600">AI Confidence</text>
      <text x="384" y="158" fill="#1E3A8A" fontSize="16" fontWeight="700">99.8%</text>
      <text x="384" y="174" fill="#2563EB" fontSize="9" fontWeight="500">100% Validated SQL</text>

      {/* Main Chart Section */}
      <rect x="100" y="200" width="400" height="165" rx="12" fill="#FFFFFF" stroke="#E2E8F0" />
      
      {/* Grid Lines */}
      <line x1="125" y1="230" x2="475" y2="230" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
      <line x1="125" y1="270" x2="475" y2="270" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
      <line x1="125" y1="310" x2="475" y2="310" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />

      {/* Area Gradient Flow */}
      <path
        d="M 130 330 Q 180 300 230 290 T 330 240 T 430 220 L 470 235 L 470 340 L 130 340 Z"
        fill="url(#heroLightGrad)"
        opacity="0.7"
      />
      
      {/* Dynamic Line Curve */}
      <path
        d="M 130 330 Q 180 300 230 290 T 330 240 T 430 220 L 470 235"
        stroke="#2563EB"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Data Points */}
      <circle cx="130" cy="330" r="4.5" fill="#FFFFFF" stroke="#2563EB" strokeWidth="3" />
      <circle cx="230" cy="290" r="4.5" fill="#FFFFFF" stroke="#2563EB" strokeWidth="3" />
      <circle cx="330" cy="240" r="4.5" fill="#FFFFFF" stroke="#2563EB" strokeWidth="3" />
      <circle cx="430" cy="220" r="5.5" fill="#F97316" stroke="#FFFFFF" strokeWidth="2" />

      {/* Orange Accent AI Annotation Card */}
      <g transform="translate(370, 260)" filter="url(#cardShadow)">
        <rect width="180" height="90" rx="10" fill="#FFFFFF" stroke="#FDBA74" strokeWidth="1.5" />
        <rect x="12" y="10" width="22" height="22" rx="6" fill="#FFF7ED" />
        <path d="M 23 15 L 23 27 M 17 21 L 29 21" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
        <text x="40" y="24" fill="#C2410C" fontSize="10" fontWeight="700">AI INSIGHT</text>
        <text x="12" y="46" fill="#111827" fontSize="9" fontWeight="600">Peak month reached</text>
        <text x="12" y="60" fill="#64748B" fontSize="8">Q4 Enterprise renewals</text>
        <text x="12" y="74" fill="#2563EB" fontSize="8" fontWeight="600">+28.4% above median</text>
      </g>

      {/* Floating Query Pill on Left */}
      <g transform="translate(30, 240)" filter="url(#cardShadow)">
        <rect width="170" height="62" rx="12" fill="#FFFFFF" stroke="#BFDBFE" strokeWidth="1.2" />
        <circle cx="24" cy="31" r="10" fill="#EFF6FF" />
        <circle cx="24" cy="31" r="5" fill="#2563EB" />
        <text x="42" y="26" fill="#1E3A8A" fontSize="9" fontWeight="700">NATURAL LANGUAGE</text>
        <text x="42" y="42" fill="#64748B" fontSize="8.5">"Top 10 enterprise accounts"</text>
      </g>
    </svg>
  );
}

export function SecurityShieldIllustration({ className = "w-24 h-24" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="60" cy="60" r="52" fill="#EFF6FF" />
      <path
        d="M 60 22 L 86 33 C 86 58 76 82 60 92 C 44 82 34 58 34 33 Z"
        fill="#2563EB"
      />
      <path
        d="M 60 27 L 81 36 C 81 57 72 77 60 85 C 48 77 39 57 39 36 Z"
        fill="#1E3A8A"
      />
      {/* Checkmark and lock pin */}
      <path
        d="M 52 58 L 58 64 L 70 50"
        stroke="#FFFFFF"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="90" cy="88" r="14" fill="#FFF7ED" stroke="#F97316" strokeWidth="2" />
      <path d="M 86 88 L 90 92 L 95 85" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function EmptyStateIllustration({
  title = "No data yet",
  description = "Get started by asking a natural language question.",
  className = "w-64 h-48",
}: {
  title?: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <svg viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect x="30" y="30" width="180" height="120" rx="16" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" strokeDasharray="6 6" />
        <circle cx="120" cy="75" r="28" fill="#EFF6FF" />
        <path
          d="M 112 75 H 128 M 120 67 V 83"
          stroke="#2563EB"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <rect x="75" y="115" width="90" height="8" rx="4" fill="#E2E8F0" />
        <rect x="90" y="129" width="60" height="6" rx="3" fill="#F1F5F9" />
        <circle cx="170" cy="50" r="6" fill="#F97316" opacity="0.8" />
        <circle cx="65" cy="130" r="4" fill="#3B82F6" opacity="0.6" />
      </svg>
      <h3 className="mt-4 text-base font-semibold text-text-primary">{title}</h3>
      <p className="mt-1 text-sm text-text-secondary max-w-sm">{description}</p>
    </div>
  );
}
