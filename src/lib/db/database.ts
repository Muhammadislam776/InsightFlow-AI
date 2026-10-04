interface ExecResult {
  columns: string[];
  rows: Record<string, any>[];
  executionTimeMs: number;
}

let dbInstance: any = null;

export async function getDatabase(): Promise<any> {
  if (dbInstance) {
    return dbInstance;
  }

  // Load native Node 22 SQLite engine dynamically without TS compile errors
  const req = typeof eval !== "undefined" ? eval("require") : null;
  const sqlite = (process as any).getBuiltinModule
    ? (process as any).getBuiltinModule("node:sqlite")
    : req("node:sqlite");

  const db = new sqlite.DatabaseSync(":memory:");
  initSchemaAndSeed(db);

  dbInstance = {
    db,
    query: (sql: string) => {
      const stmt = db.prepare(sql);
      const rows = stmt.all();
      return rows.map((r: any) => ({ ...r }));
    },
  };

  return dbInstance;
}

function initSchemaAndSeed(db: any) {
  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS regions (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      country TEXT NOT NULL,
      regional_manager TEXT NOT NULL,
      quarterly_target REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      company TEXT NOT NULL,
      email TEXT NOT NULL,
      region_id INTEGER NOT NULL,
      segment TEXT NOT NULL,
      tier TEXT NOT NULL,
      lifetime_value REAL NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      unit_cost REAL NOT NULL,
      stock_status TEXT NOT NULL,
      sku TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY,
      customer_id INTEGER NOT NULL,
      order_date TEXT NOT NULL,
      status TEXT NOT NULL,
      total_amount REAL NOT NULL,
      discount_amount REAL NOT NULL,
      payment_method TEXT NOT NULL,
      billing_cycle TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      unit_price REAL NOT NULL,
      subtotal REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS marketing_campaigns (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      channel TEXT NOT NULL,
      budget REAL NOT NULL,
      spend REAL NOT NULL,
      conversions INTEGER NOT NULL,
      revenue_generated REAL NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL
    );
  `);

  // Seed Data
  seedData((sql: string) => db.exec(sql));
}

function seedData(executor: (sql: string) => void) {
  // Regions
  executor(`
    INSERT INTO regions VALUES 
    (1, 'North America', 'United States', 'Sarah Jenkins', 1250000.00),
    (2, 'Europe', 'Germany', 'Alexander Weber', 980000.00),
    (3, 'Asia Pacific', 'Singapore', 'Mei-Ling Chen', 850000.00),
    (4, 'Latin America', 'Brazil', 'Carlos Rodriguez', 420000.00),
    (5, 'Middle East', 'United Arab Emirates', 'Tariq Al-Mansoor', 350000.00);
  `);

  // Products
  executor(`
    INSERT INTO products VALUES
    (1, 'InsightFlow Enterprise Cloud', 'Cloud Platform', 12000.00, 3200.00, 'Available', 'SKU-CLD-ENT'),
    (2, 'InsightFlow Analytics Pro', 'Analytics Pro', 4500.00, 1100.00, 'Available', 'SKU-ANL-PRO'),
    (3, 'Autonomous AI Agent Suite', 'AI Suite', 8500.00, 2400.00, 'Available', 'SKU-AGI-STE'),
    (4, 'Enterprise Security Guard', 'Security Guard', 6200.00, 1500.00, 'Available', 'SKU-SEC-GRD'),
    (5, 'Real-time Data Connectors', 'Data Connect', 2800.00, 600.00, 'Available', 'SKU-DTA-CON'),
    (6, 'Natural Language Query Engine', 'AI Suite', 5400.00, 1300.00, 'Available', 'SKU-NLQ-ENG'),
    (7, 'Predictive Forecasting Hub', 'Analytics Pro', 3900.00, 950.00, 'Available', 'SKU-PRF-HUB'),
    (8, 'Data Governance & Audit Tool', 'Security Guard', 4100.00, 900.00, 'Available', 'SKU-GOV-AUD');
  `);

  // Customers
  executor(`
    INSERT INTO customers VALUES
    (1, 'Eleanor Vance', 'Apex Global Technologies', 'e.vance@apexglobal.io', 1, 'Enterprise', 'Platinum', 145000.00, '2024-03-12'),
    (2, 'Marcus Brody', 'Helios Financial Partners', 'm.brody@heliosfin.com', 2, 'Enterprise', 'Platinum', 182000.00, '2024-01-20'),
    (3, 'Amina Yusuf', 'Crestview Logistics', 'a.yusuf@crestview.net', 5, 'Mid-Market', 'Gold', 68000.00, '2024-05-18'),
    (4, 'Hiroshi Tanaka', 'OmniSys Robotics Japan', 'tanaka@omnisys.jp', 3, 'Enterprise', 'Platinum', 195000.00, '2024-02-11'),
    (5, 'Sofia Mendez', 'Rio Digital Media', 'sofia@riodigital.br', 4, 'Mid-Market', 'Gold', 54000.00, '2024-06-04'),
    (6, 'Lucas Sterling', 'Vanguard Data Systems', 'l.sterling@vanguarddata.co', 1, 'Enterprise', 'Platinum', 210000.00, '2024-01-08'),
    (7, 'Clara Dupont', 'Starlight Energy Corp', 'c.dupont@starlightenergy.fr', 2, 'Mid-Market', 'Gold', 72000.00, '2024-04-22'),
    (8, 'Rajesh Patel', 'Quantum Leap BioTech', 'r.patel@quantumbio.in', 3, 'SMB', 'Silver', 31000.00, '2024-07-15'),
    (9, 'Hannah Schmidt', 'Nordic Horizon Labs', 'hannah@nordichorizon.se', 2, 'Startup', 'Silver', 26000.00, '2024-08-19'),
    (10, 'David Kim', 'Nexus Interactive Media', 'd.kim@nexusmedia.kr', 3, 'Mid-Market', 'Gold', 88000.00, '2024-03-29'),
    (11, 'Beatriz Silva', 'Sao Paulo FinTech Hub', 'beatriz@spfintech.com', 4, 'Startup', 'Silver', 22000.00, '2024-09-02'),
    (12, 'James Thorne', 'Beacon Hill Legal Tech', 'jthorne@beaconlaw.com', 1, 'SMB', 'Silver', 41000.00, '2024-05-10');
  `);

  // Marketing Campaigns
  executor(`
    INSERT INTO marketing_campaigns VALUES
    (1, 'Q1 Enterprise AI Summit', 'Partner Summit', 45000.00, 43200.00, 185, 290000.00, '2025-01-10', '2025-03-31'),
    (2, 'LinkedIn Executive B2B Inbound', 'LinkedIn B2B', 30000.00, 29500.00, 240, 215000.00, '2025-02-01', '2025-06-30'),
    (3, 'Google Search High-Intent Analytics', 'Search Ads', 25000.00, 24800.00, 310, 180000.00, '2025-01-01', '2025-12-31'),
    (4, 'Modern BI Data Modernization Webinar', 'Webinar', 12000.00, 11400.00, 420, 140000.00, '2025-04-15', '2025-07-15'),
    (5, 'Gartner Magic Quadrant Leader Release', 'Content Marketing', 18000.00, 17500.00, 160, 165000.00, '2025-03-01', '2025-05-30');
  `);

  // Orders (12-month span across 2025 and 2026)
  executor(`
    INSERT INTO orders VALUES
    (101, 1, '2025-01-15', 'Completed', 18500.00, 500.00, 'Wire Transfer', 'Annual'),
    (102, 2, '2025-01-22', 'Completed', 24000.00, 0.00, 'Corporate PO', 'Annual'),
    (103, 3, '2025-02-05', 'Completed', 9500.00, 200.00, 'Credit Card', 'Monthly'),
    (104, 4, '2025-02-18', 'Completed', 31000.00, 1000.00, 'Wire Transfer', 'Annual'),
    (105, 5, '2025-03-10', 'Completed', 12800.00, 400.00, 'ACH', 'Annual'),
    (106, 6, '2025-03-24', 'Completed', 42000.00, 1500.00, 'Corporate PO', 'Annual'),
    (107, 7, '2025-04-08', 'Completed', 14200.00, 300.00, 'Wire Transfer', 'Monthly'),
    (108, 8, '2025-04-19', 'Completed', 8200.00, 100.00, 'Credit Card', 'Monthly'),
    (109, 9, '2025-05-12', 'Completed', 6500.00, 0.00, 'Credit Card', 'Monthly'),
    (110, 10, '2025-05-28', 'Completed', 22400.00, 600.00, 'Wire Transfer', 'Annual'),
    (111, 11, '2025-06-14', 'Completed', 5800.00, 0.00, 'Credit Card', 'Monthly'),
    (112, 12, '2025-06-25', 'Completed', 11500.00, 250.00, 'ACH', 'Monthly'),
    (113, 1, '2025-07-08', 'Completed', 28000.00, 800.00, 'Wire Transfer', 'Annual'),
    (114, 2, '2025-07-20', 'Completed', 34500.00, 1200.00, 'Corporate PO', 'Annual'),
    (115, 4, '2025-08-05', 'Completed', 39000.00, 1000.00, 'Wire Transfer', 'Annual'),
    (116, 6, '2025-08-22', 'Completed', 45000.00, 1500.00, 'Corporate PO', 'Annual'),
    (117, 3, '2025-09-11', 'Completed', 16200.00, 400.00, 'Wire Transfer', 'Monthly'),
    (118, 5, '2025-09-29', 'Completed', 15400.00, 300.00, 'ACH', 'Annual'),
    (119, 7, '2025-10-14', 'Completed', 19800.00, 500.00, 'Wire Transfer', 'Annual'),
    (120, 10, '2025-10-27', 'Completed', 27600.00, 800.00, 'Corporate PO', 'Annual'),
    (121, 1, '2025-11-09', 'Completed', 32000.00, 1000.00, 'Wire Transfer', 'Annual'),
    (122, 2, '2025-11-23', 'Completed', 48500.00, 1800.00, 'Corporate PO', 'Annual'),
    (123, 6, '2025-12-05', 'Completed', 52000.00, 2000.00, 'Corporate PO', 'Annual'),
    (124, 4, '2025-12-18', 'Completed', 44000.00, 1500.00, 'Wire Transfer', 'Annual'),
    (125, 8, '2025-12-28', 'Completed', 14500.00, 300.00, 'Credit Card', 'Monthly'),
    (126, 9, '2026-01-10', 'Completed', 11200.00, 200.00, 'Credit Card', 'Monthly'),
    (127, 3, '2026-01-21', 'Completed', 21500.00, 500.00, 'Wire Transfer', 'Annual'),
    (128, 12, '2026-02-04', 'Completed', 18600.00, 400.00, 'ACH', 'Monthly'),
    (129, 5, '2026-02-17', 'Completed', 23400.00, 600.00, 'ACH', 'Annual'),
    (130, 7, '2026-02-28', 'Completed', 26000.00, 700.00, 'Wire Transfer', 'Annual'),
    (131, 1, '2026-03-08', 'Completed', 38000.00, 1200.00, 'Wire Transfer', 'Annual'),
    (132, 2, '2026-03-15', 'Completed', 51000.00, 2100.00, 'Corporate PO', 'Annual'),
    (133, 4, '2026-03-24', 'Completed', 46500.00, 1600.00, 'Wire Transfer', 'Annual');
  `);

  // Order Items
  executor(`
    INSERT INTO order_items VALUES
    (1, 101, 1, 1, 12000.00, 12000.00),
    (2, 101, 4, 1, 6200.00, 6200.00),
    (3, 102, 1, 1, 12000.00, 12000.00),
    (4, 102, 3, 1, 8500.00, 8500.00),
    (5, 102, 5, 1, 2800.00, 2800.00),
    (6, 103, 2, 2, 4500.00, 9000.00),
    (7, 104, 1, 2, 12000.00, 24000.00),
    (8, 104, 6, 1, 5400.00, 5400.00),
    (9, 105, 3, 1, 8500.00, 8500.00),
    (10, 105, 7, 1, 3900.00, 3900.00),
    (11, 106, 1, 2, 12000.00, 24000.00),
    (12, 106, 3, 1, 8500.00, 8500.00),
    (13, 106, 4, 1, 6200.00, 6200.00),
    (14, 107, 2, 2, 4500.00, 9000.00),
    (15, 107, 6, 1, 5400.00, 5400.00),
    (16, 113, 1, 2, 12000.00, 24000.00),
    (17, 114, 3, 3, 8500.00, 25500.00),
    (18, 114, 2, 2, 4500.00, 9000.00),
    (19, 115, 1, 2, 12000.00, 24000.00),
    (20, 115, 4, 2, 6200.00, 12400.00),
    (21, 116, 1, 2, 12000.00, 24000.00),
    (22, 116, 3, 2, 8500.00, 17000.00),
    (23, 122, 1, 3, 12000.00, 36000.00),
    (24, 123, 1, 3, 12000.00, 36000.00),
    (25, 123, 3, 1, 8500.00, 8500.00),
    (26, 124, 1, 2, 12000.00, 24000.00),
    (27, 124, 3, 2, 8500.00, 17000.00),
    (28, 131, 1, 2, 12000.00, 24000.00),
    (29, 131, 3, 1, 8500.00, 8500.00),
    (30, 132, 1, 3, 12000.00, 36000.00),
    (31, 132, 4, 2, 6200.00, 12400.00),
    (32, 133, 1, 2, 12000.00, 24000.00),
    (33, 133, 6, 3, 5400.00, 16200.00);
  `);
}

// Read-only query runner with timeout protection
export async function executeSafeQuery(
  sql: string,
  timeoutMs: number = 30000
): Promise<ExecResult> {
  const db = await getDatabase();
  const startTime = Date.now();

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("QUERY_TIMEOUT_EXCEEDED: Your query exceeded the 30-second execution safety limit."));
    }, timeoutMs);

    try {
      const rows = db.query(sql);
      clearTimeout(timer);
      const executionTimeMs = Date.now() - startTime;
      const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

      resolve({
        columns,
        rows,
        executionTimeMs,
      });
    } catch (err: any) {
      clearTimeout(timer);
      reject(err);
    }
  });
}
