import { APPROVED_SCHEMA } from "../security/schemaCatalog";
import { UserRole } from "../types";

export interface NLTranslationResult {
  sql: string;
  interpretation: string;
  recommendedChart: "bar" | "line" | "pie" | "kpi" | "table" | "area";
  xAxisKey?: string;
  yAxisKeys?: string[];
  isBlockedPrompt?: boolean;
  blockReason?: string;
}

// Prompt injection patterns to guard against
const INJECTION_PATTERNS = [
  /ignore (all |previous |system )?instructions/i,
  /\bdelete\b/i,
  /\bdrop\b/i,
  /\btruncate\b/i,
  /\bupdate\b\s+.*\bset\b/i,
  /\bupdate\b/i,
  /\binsert\b/i,
  /\balter\b/i,
  /\bgrant\b/i,
  /\brevoke\b/i,
  /system prompt/i,
  /api key/i,
  /passwords?/i,
  /credentials?/i,
  /information_schema/i,
  /sqlite_master/i,
];

export function translateNaturalLanguageToSql(
  question: string,
  userRole: UserRole = "ANALYST",
  previousContext?: { question: string; sql: string }
): NLTranslationResult {
  const q = question.trim().toLowerCase();

  // 1. Guard against prompt injection & adversarial questions
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(q)) {
      return {
        sql: "",
        interpretation: "Blocked unsafe prompt attempt. The system enforces strict read-only execution on approved business schemas only.",
        recommendedChart: "table",
        isBlockedPrompt: true,
        blockReason: "POTENTIAL_PROMPT_INJECTION_OR_UNSAFE_INSTRUCTION",
      };
    }
  }

  // 2. Handle follow-up query context
  if (previousContext && (q.startsWith("break that down") || q.startsWith("show only") || q.startsWith("filter by"))) {
    if (q.includes("product")) {
      return {
        sql: `SELECT p.name AS product_name, SUM(oi.subtotal) AS total_revenue, SUM(oi.quantity) AS units_sold FROM order_items oi JOIN products p ON oi.product_id = p.id JOIN orders o ON oi.order_id = o.id WHERE o.status = 'Completed' GROUP BY p.name ORDER BY total_revenue DESC LIMIT 10`,
        interpretation: "Drilling down into total revenue and units sold by product for completed orders.",
        recommendedChart: "bar",
        xAxisKey: "product_name",
        yAxisKeys: ["total_revenue"],
      };
    }
    if (q.includes("north") || q.includes("region")) {
      return {
        sql: `SELECT strftime('%Y-%m', o.order_date) AS month, SUM(o.total_amount) AS revenue FROM orders o JOIN customers c ON o.customer_id = c.id JOIN regions r ON c.region_id = r.id WHERE r.name = 'North America' AND o.status = 'Completed' GROUP BY month ORDER BY month ASC LIMIT 12`,
        interpretation: "Filtered to North America region: monthly sales revenue trend over the last 12 recorded periods.",
        recommendedChart: "line",
        xAxisKey: "month",
        yAxisKeys: ["revenue"],
      };
    }
  }

  // 3. Semantic Intent Matching for Business Questions

  // Intent A: Monthly revenue / Sales over time
  if (
    (q.includes("monthly") || q.includes("month") || q.includes("over time") || q.includes("12 months")) &&
    (q.includes("revenue") || q.includes("sales") || q.includes("growth"))
  ) {
    return {
      sql: `SELECT strftime('%Y-%m', order_date) AS month, ROUND(SUM(total_amount), 2) AS total_revenue, COUNT(id) AS total_orders FROM orders WHERE status != 'Refunded' GROUP BY month ORDER BY month ASC LIMIT 12`,
      interpretation: "Aggregates completed sales revenue and total order volume by calendar month.",
      recommendedChart: "area",
      xAxisKey: "month",
      yAxisKeys: ["total_revenue"],
    };
  }

  // Intent B: Total sales last month / overall sales KPI
  if (
    q.includes("total sales") ||
    q.includes("total revenue") ||
    (q.includes("how much") && q.includes("sales"))
  ) {
    if (q.includes("last month") || q.includes("this month")) {
      return {
        sql: `SELECT ROUND(SUM(total_amount), 2) AS total_revenue, COUNT(id) AS total_orders, ROUND(AVG(total_amount), 2) AS avg_order_value FROM orders WHERE strftime('%Y-%m', order_date) = (SELECT MAX(strftime('%Y-%m', order_date)) FROM orders) AND status != 'Refunded'`,
        interpretation: "Calculates total revenue, order count, and average order value for the most recent calendar month.",
        recommendedChart: "kpi",
        xAxisKey: "total_revenue",
        yAxisKeys: ["total_revenue"],
      };
    }
    return {
      sql: `SELECT ROUND(SUM(total_amount), 2) AS total_revenue, COUNT(id) AS total_orders, ROUND(AVG(total_amount), 2) AS average_order_value FROM orders WHERE status = 'Completed'`,
      interpretation: "Calculates cumulative completed sales revenue, overall order count, and average order value.",
      recommendedChart: "kpi",
      xAxisKey: "total_revenue",
      yAxisKeys: ["total_revenue"],
    };
  }

  // Intent C: Top products by revenue / sales
  if (
    (q.includes("product") || q.includes("products")) &&
    (q.includes("top") || q.includes("highest") || q.includes("best") || q.includes("revenue") || q.includes("sales"))
  ) {
    const limit = q.includes("5") ? 5 : 10;
    return {
      sql: `SELECT p.name AS product_name, p.category, ROUND(SUM(oi.subtotal), 2) AS total_revenue, SUM(oi.quantity) AS units_sold FROM order_items oi JOIN products p ON oi.product_id = p.id JOIN orders o ON oi.order_id = o.id WHERE o.status = 'Completed' GROUP BY p.id, p.name, p.category ORDER BY total_revenue DESC LIMIT ${limit}`,
      interpretation: `Identifies the top ${limit} performing products ranked by total recognized revenue.`,
      recommendedChart: "bar",
      xAxisKey: "product_name",
      yAxisKeys: ["total_revenue"],
    };
  }

  // Intent D: Sales by region / compare regions
  if (q.includes("region") || q.includes("territory") || q.includes("geographic")) {
    return {
      sql: `SELECT r.name AS region_name, ROUND(SUM(o.total_amount), 2) AS total_sales, COUNT(DISTINCT o.customer_id) AS active_customers, ROUND(r.quarterly_target, 2) AS target_quota FROM orders o JOIN customers c ON o.customer_id = c.id JOIN regions r ON c.region_id = r.id WHERE o.status = 'Completed' GROUP BY r.id, r.name ORDER BY total_sales DESC`,
      interpretation: "Compares completed sales revenue and active customer counts across regional territories against targets.",
      recommendedChart: "bar",
      xAxisKey: "region_name",
      yAxisKeys: ["total_sales", "target_quota"],
    };
  }

  // Intent E: Top customers by revenue / LTV
  if (
    q.includes("customer") &&
    (q.includes("top") || q.includes("highest") || q.includes("revenue") || q.includes("spend") || q.includes("ltv"))
  ) {
    const limit = q.includes("5") ? 5 : 10;
    return {
      sql: `SELECT c.name AS customer_name, c.company, c.tier, c.segment, ROUND(SUM(o.total_amount), 2) AS total_spend, COUNT(o.id) AS total_orders FROM customers c JOIN orders o ON c.id = o.customer_id WHERE o.status = 'Completed' GROUP BY c.id, c.name, c.company, c.tier, c.segment ORDER BY total_spend DESC LIMIT ${limit}`,
      interpretation: `Extracts the top ${limit} enterprise and corporate customers ranked by cumulative order revenue.`,
      recommendedChart: "bar",
      xAxisKey: "customer_name",
      yAxisKeys: ["total_spend"],
    };
  }

  // Intent F: Customer distribution by segment or tier
  if (
    q.includes("customer") &&
    (q.includes("segment") || q.includes("tier") || q.includes("distribution") || q.includes("breakdown") || q.includes("growth"))
  ) {
    if (q.includes("growth") || q.includes("month")) {
      return {
        sql: `SELECT strftime('%Y-%m', created_at) AS signup_month, COUNT(id) AS new_customers FROM customers GROUP BY signup_month ORDER BY signup_month ASC LIMIT 12`,
        interpretation: "Tracks new customer acquisitions grouped by calendar month.",
        recommendedChart: "line",
        xAxisKey: "signup_month",
        yAxisKeys: ["new_customers"],
      };
    }
    return {
      sql: `SELECT segment, COUNT(id) AS customer_count, ROUND(AVG(lifetime_value), 2) AS avg_ltv FROM customers GROUP BY segment ORDER BY customer_count DESC`,
      interpretation: "Shows the breakdown of customers across market segments and average lifetime value.",
      recommendedChart: "pie",
      xAxisKey: "segment",
      yAxisKeys: ["customer_count"],
    };
  }

  // Intent G: Marketing campaign performance & ROI
  if (q.includes("campaign") || q.includes("marketing") || q.includes("ad") || q.includes("roi")) {
    return {
      sql: `SELECT name AS campaign_name, channel, budget, spend, conversions, ROUND(revenue_generated, 2) AS revenue, ROUND(revenue_generated / NULLIF(spend, 0), 2) AS roi_multiplier FROM marketing_campaigns ORDER BY revenue DESC`,
      interpretation: "Analyzes marketing campaign ROI, actual spend, conversions, and generated revenue by channel.",
      recommendedChart: "bar",
      xAxisKey: "campaign_name",
      yAxisKeys: ["revenue", "spend"],
    };
  }

  // Intent H: Orders by status or payment method
  if (q.includes("status") || q.includes("payment") || q.includes("billing cycle")) {
    if (q.includes("payment")) {
      return {
        sql: `SELECT payment_method, COUNT(id) AS order_count, ROUND(SUM(total_amount), 2) AS total_volume FROM orders GROUP BY payment_method ORDER BY total_volume DESC`,
        interpretation: "Calculates total order volume and transaction counts categorized by payment method.",
        recommendedChart: "pie",
        xAxisKey: "payment_method",
        yAxisKeys: ["total_volume"],
      };
    }
    return {
      sql: `SELECT status, COUNT(id) AS order_count, ROUND(SUM(total_amount), 2) AS revenue FROM orders GROUP BY status ORDER BY order_count DESC`,
      interpretation: "Breakdown of order volume and associated revenue by processing status.",
      recommendedChart: "pie",
      xAxisKey: "status",
      yAxisKeys: ["order_count"],
    };
  }

  // Intent I: Product category revenue distribution
  if (q.includes("category") || q.includes("categories")) {
    return {
      sql: `SELECT p.category, ROUND(SUM(oi.subtotal), 2) AS category_revenue, COUNT(DISTINCT o.id) AS order_count FROM order_items oi JOIN products p ON oi.product_id = p.id JOIN orders o ON oi.order_id = o.id WHERE o.status = 'Completed' GROUP BY p.category ORDER BY category_revenue DESC`,
      interpretation: "Groups cumulative product sales into high-level commercial categories.",
      recommendedChart: "pie",
      xAxisKey: "category",
      yAxisKeys: ["category_revenue"],
    };
  }

  // Default fallback for general questions matching approved tables
  return {
    sql: `SELECT p.name AS product, ROUND(SUM(oi.subtotal), 2) AS revenue, SUM(oi.quantity) AS units FROM order_items oi JOIN products p ON oi.product_id = p.id JOIN orders o ON oi.order_id = o.id GROUP BY p.name ORDER BY revenue DESC LIMIT 10`,
    interpretation: "Identifies top revenue generating products and quantities across approved orders.",
    recommendedChart: "bar",
    xAxisKey: "product",
    yAxisKeys: ["revenue"],
  };
}

export function generateDataGroundedExplanation(
  question: string,
  rows: Record<string, any>[],
  columns: string[]
): {
  summary: string;
  keyTakeaway: string;
  dataBasis: string;
  limitation: string;
} {
  if (!rows || rows.length === 0) {
    return {
      summary: "No records found matching the specified query criteria in the approved dataset.",
      keyTakeaway: "Zero rows were returned.",
      dataBasis: "Queried against approved analytics tables.",
      limitation: "The dataset does not contain records satisfying these filter conditions.",
    };
  }

  const rowCount = rows.length;
  const firstRow = rows[0];

  // For single row KPI metrics
  if (rowCount === 1) {
    const keys = Object.keys(firstRow);
    const primaryKey = keys[0];
    const val = firstRow[primaryKey];
    const formattedVal = typeof val === "number" ? val.toLocaleString() : String(val);

    return {
      summary: `The total calculated ${primaryKey.replace(/_/g, " ")} is ${formattedVal}.`,
      keyTakeaway: `Observed value of ${primaryKey} is ${formattedVal}.`,
      dataBasis: "Aggregated from verified transactional records in the approved schema.",
      limitation: "Reflects completed records available up to current snapshot date.",
    };
  }

  // For categorical / ranked queries
  const labelKey = Object.keys(firstRow).find(
    (k) => typeof firstRow[k] === "string" && !k.includes("date")
  ) || Object.keys(firstRow)[0];

  const metricKey = Object.keys(firstRow).find(
    (k) => typeof firstRow[k] === "number"
  ) || Object.keys(firstRow)[1] || Object.keys(firstRow)[0];

  const topItem = firstRow[labelKey] || "Top Category";
  const topVal = typeof firstRow[metricKey] === "number" ? firstRow[metricKey].toLocaleString() : firstRow[metricKey];

  let summary = `${topItem} recorded the highest ${metricKey.replace(/_/g, " ")} with ${topVal}.`;
  
  if (rowCount > 1) {
    const secondRow = rows[1];
    const secondItem = secondRow[labelKey];
    const secondVal = typeof secondRow[metricKey] === "number" ? secondRow[metricKey].toLocaleString() : secondRow[metricKey];
    summary += ` It is followed by ${secondItem} (${secondVal}).`;
  }

  return {
    summary,
    keyTakeaway: `${topItem} generated the strongest contribution across the evaluated ${rowCount} entries.`,
    dataBasis: "Grounded directly on verified rows from approved tables.",
    limitation: `Results are constrained to top ${rowCount} rows as governed by analytics safety policies.`,
  };
}
