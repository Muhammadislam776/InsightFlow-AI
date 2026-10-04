# InsightFlow AI — Natural-Language Business Intelligence Platform

InsightFlow AI is a full-stack, enterprise-grade AI-powered Business Intelligence SaaS platform that translates plain-English questions into safe, read-only SQL, executes validated queries against an approved semantic schema, grounds AI explanations in verified data, and automatically generates interactive data visualizations.

---

## 🚀 Key Highlights & Capabilities

- **Natural Language to Safe SQL Engine**: Ask questions like:
  - *"What were our total sales last month?"*
  - *"Show monthly revenue for the last 12 months."*
  - *"Which products generated the highest revenue?"*
  - *"Compare sales between regions."*
  - *"Show me the top 10 customers by revenue."*
- **Strict Read-Only & Security Pipeline**:
  - AST SQL Parser with strict keyword allowlisting (`SELECT` and CTEs only).
  - Unconditional blocking of write and DDL statements (`INSERT`, `UPDATE`, `DELETE`, `DROP`, `ALTER`, `TRUNCATE`, `EXEC`, etc.).
  - Prevention of SQL comment evasion and semicolon-based multiple statement injection.
  - Read-only database connection execution sandbox.
  - Automatic row limit enforcement (`LIMIT 1000`) and 30-second query execution timeouts.
- **Role-Based Access Control (RBAC)**:
  - **ADMIN**: Full schema dictionary governance, user invites, cache management, telemetry monitoring, benchmarks.
  - **ANALYST**: Natural language querying, dashboard creation, follow-up drill-downs, CSV data exports.
  - **VIEWER**: Read-only exploration of permitted metrics; sensitive columns (e.g. `unit_cost`) and raw exports masked.
  - Live role switcher in global header for instant role switching and permission verification.
- **Data-Aware Interactive Visualizations**:
  - Dynamically renders Area/Line charts for time-series trends, Bar charts for categorical comparisons, Donut/Pie charts for distributions, KPI metric cards, and full interactive Data Tables.
  - Interactive table view with column sorting, live row filtering, pagination, and CSV export.
  - Fullscreen toggle, chart type switching, and pin-to-dashboard workflow.
- **SQL Transparency & Grounded Explanations**:
  - Expandable SQL inspection block with syntax highlighting and explanation of "What this query does".
  - Grounded AI summaries with explicit *Data Basis* and *Data Limitations* notices.
  - Contextual follow-up question prompts ("Break that down by product", "Compare with last year", etc.).
- **Interactive Dashboards & Builder**:
  - Pre-built executive boards: *Sales Overview*, *Marketing Performance*, *Customer Analytics*, *Executive Summary*.
  - Full Dashboard Builder for creating custom widget layouts and saving questions.
- **Enterprise Features**:
  - **Data Catalog**: Semantic dictionary of approved tables, column types, and role access levels.
  - **Telemetry & Monitoring**: Live 24-hour traffic charts, queries by role, cache hit ratios, and security incident logs.
  - **Automated Benchmarks**: Live benchmark runner evaluating NL-to-SQL translation accuracy and adversarial injection resistance.
  - **Global Command Bar**: Press `Ctrl+K` to search dashboards, queries, and catalog metrics.

---

## 🛠 Tech Stack

- **Frontend**: Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, Lucide React, Recharts, Framer Motion
- **Backend & Database**: Next.js API Routes, Node.js native SQLite database (`node:sqlite`) with pre-seeded e-commerce & SaaS business datasets
- **Security & Caching**: AST allowlist parser, SQL sanitizer, role-scoped in-memory query cache with TTL invalidation

---

## 🚦 Getting Started

### 1. Start the Production Server
```bash
npm start
```
The application will be accessible at [http://localhost:3000](http://localhost:3000).

### 2. Run Verification Test Suite
```bash
node test_suite.js
```
Executes all 10 automated test scenarios verifying public landing page, safe queries, adversarial intercepts, benchmarks, and CSV exports.

---

## 📁 Application Structure

- `/` — Public Marketing Landing Page
- `/overview` — Overview Dashboard with KPIs, recent questions, and AI insight highlights
- `/ask` — Ask Data (Core Natural Language Interface)
- `/explore` — Query Result Explorer & Visualizer
- `/dashboards` — Saved Dashboards Directory
- `/dashboards/builder` — Dashboard Builder & Widget Composer
- `/dashboards/[id]` — Single Dashboard View
- `/history` — Query History & Security Audit Logs
- `/catalog` — Semantic Layer Data Catalog & Dictionary
- `/monitoring` — Usage Telemetry & Guardrail Intercept Monitoring
- `/benchmarks` — NL-to-SQL Accuracy & Safety Benchmark Suite
- `/settings` — Admin Workspace Governance, Users, and Cache
- `/profile` — User Profile & Role Preferences
- `/login`, `/signup`, `/forgot-password`, `/reset-password` — Authentication
