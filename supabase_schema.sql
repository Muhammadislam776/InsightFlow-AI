-- ====================================================================
-- InsightFlow AI — Complete Supabase PostgreSQL Schema & Seed Script
-- Project URL: https://oewybbmpooveeopcumav.supabase.co
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Profiles Table (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('ADMIN', 'ANALYST', 'VIEWER')) DEFAULT 'ANALYST',
  organization TEXT DEFAULT 'Acme Enterprises',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Automatic trigger to populate user_profiles when a new user signs up in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, name, email, role, organization)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'ANALYST'),
    COALESCE(NEW.raw_user_meta_data->>'organization', 'Acme Enterprises')
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    role = EXCLUDED.role;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. Business Analytics Tables

-- Regions Table
CREATE TABLE IF NOT EXISTS public.regions (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  regional_manager TEXT NOT NULL,
  quarterly_target NUMERIC(15, 2) NOT NULL
);

-- Customers Table
CREATE TABLE IF NOT EXISTS public.customers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT NOT NULL,
  region_id INTEGER REFERENCES public.regions(id),
  segment TEXT NOT NULL CHECK (segment IN ('Enterprise', 'Mid-Market', 'SMB', 'Startup')),
  tier TEXT NOT NULL CHECK (tier IN ('Platinum', 'Gold', 'Silver')),
  lifetime_value NUMERIC(15, 2) NOT NULL DEFAULT 0,
  created_at DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC(15, 2) NOT NULL,
  unit_cost NUMERIC(15, 2) NOT NULL, -- Sensitive column
  stock_status TEXT NOT NULL DEFAULT 'Available',
  sku TEXT NOT NULL UNIQUE
);

-- Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES public.customers(id),
  order_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL CHECK (status IN ('Completed', 'Shipped', 'Processing', 'Refunded')),
  total_amount NUMERIC(15, 2) NOT NULL,
  discount_amount NUMERIC(15, 2) NOT NULL DEFAULT 0,
  payment_method TEXT NOT NULL,
  billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('Annual', 'Monthly'))
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES public.products(id),
  quantity INTEGER NOT NULL,
  unit_price NUMERIC(15, 2) NOT NULL,
  subtotal NUMERIC(15, 2) NOT NULL
);

-- Marketing Campaigns Table
CREATE TABLE IF NOT EXISTS public.marketing_campaigns (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  channel TEXT NOT NULL,
  budget NUMERIC(15, 2) NOT NULL,
  spend NUMERIC(15, 2) NOT NULL,
  conversions INTEGER NOT NULL,
  revenue_generated NUMERIC(15, 2) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL
);

-- Dashboards Table
CREATE TABLE IF NOT EXISTS public.dashboards (
  id TEXT PRIMARY KEY DEFAULT ('dash_' || floor(extract(epoch from now()))),
  organization_id TEXT DEFAULT 'org_acme_bi',
  name TEXT NOT NULL,
  description TEXT,
  owner TEXT NOT NULL,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  is_favorite BOOLEAN DEFAULT FALSE,
  visibility TEXT CHECK (visibility IN ('public', 'team', 'private')) DEFAULT 'public',
  widgets JSONB DEFAULT '[]'::jsonb
);

-- Query History Table
CREATE TABLE IF NOT EXISTS public.query_history (
  id TEXT PRIMARY KEY DEFAULT ('qh_' || floor(extract(epoch from now()))),
  user_id TEXT,
  user_name TEXT NOT NULL,
  user_role TEXT NOT NULL,
  question TEXT NOT NULL,
  generated_sql TEXT NOT NULL,
  execution_time_ms INTEGER NOT NULL,
  rows_returned INTEGER NOT NULL,
  status TEXT NOT NULL,
  visualization TEXT NOT NULL,
  error_message TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id TEXT PRIMARY KEY DEFAULT ('aud_' || floor(extract(epoch from now()))),
  user_name TEXT NOT NULL,
  user_role TEXT NOT NULL,
  action TEXT NOT NULL,
  details TEXT NOT NULL,
  ip_address TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 4. Enable Row Level Security (RLS) & Policies
-- ====================================================================

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.query_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow read access to authenticated and anon users for read-only analytics
CREATE POLICY "Allow read on regions" ON public.regions FOR SELECT USING (true);
CREATE POLICY "Allow read on customers" ON public.customers FOR SELECT USING (true);
CREATE POLICY "Allow read on products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow read on orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow read on order_items" ON public.order_items FOR SELECT USING (true);
CREATE POLICY "Allow read on marketing_campaigns" ON public.marketing_campaigns FOR SELECT USING (true);
CREATE POLICY "Allow read on dashboards" ON public.dashboards FOR SELECT USING (true);
CREATE POLICY "Allow insert dashboards" ON public.dashboards FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow read on query_history" ON public.query_history FOR SELECT USING (true);
CREATE POLICY "Allow insert on query_history" ON public.query_history FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow read on audit_logs" ON public.audit_logs FOR SELECT USING (true);
CREATE POLICY "Allow read on user_profiles" ON public.user_profiles FOR SELECT USING (true);
CREATE POLICY "Allow update self user_profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = id);

-- ====================================================================
-- 5. Seed Data
-- ====================================================================

-- Regions Seed
INSERT INTO public.regions (id, name, country, regional_manager, quarterly_target) VALUES
(1, 'North America', 'United States', 'Sarah Jenkins', 1250000.00),
(2, 'Europe', 'Germany', 'Alexander Weber', 980000.00),
(3, 'Asia Pacific', 'Singapore', 'Mei-Ling Chen', 850000.00),
(4, 'Latin America', 'Brazil', 'Carlos Rodriguez', 420000.00),
(5, 'Middle East', 'United Arab Emirates', 'Tariq Al-Mansoor', 350000.00)
ON CONFLICT (id) DO NOTHING;

-- Products Seed
INSERT INTO public.products (id, name, category, price, unit_cost, stock_status, sku) VALUES
(1, 'InsightFlow Enterprise Cloud', 'Cloud Platform', 12000.00, 3200.00, 'Available', 'SKU-CLD-ENT'),
(2, 'InsightFlow Analytics Pro', 'Analytics Pro', 4500.00, 1100.00, 'Available', 'SKU-ANL-PRO'),
(3, 'Autonomous AI Agent Suite', 'AI Suite', 8500.00, 2400.00, 'Available', 'SKU-AGI-STE'),
(4, 'Enterprise Security Guard', 'Security Guard', 6200.00, 1500.00, 'Available', 'SKU-SEC-GRD'),
(5, 'Real-time Data Connectors', 'Data Connect', 2800.00, 600.00, 'Available', 'SKU-DTA-CON'),
(6, 'Natural Language Query Engine', 'AI Suite', 5400.00, 1300.00, 'Available', 'SKU-NLQ-ENG'),
(7, 'Predictive Forecasting Hub', 'Analytics Pro', 3900.00, 950.00, 'Available', 'SKU-PRF-HUB'),
(8, 'Data Governance & Audit Tool', 'Security Guard', 4100.00, 900.00, 'Available', 'SKU-GOV-AUD')
ON CONFLICT (id) DO NOTHING;

-- Customers Seed
INSERT INTO public.customers (id, name, company, email, region_id, segment, tier, lifetime_value, created_at) VALUES
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
(12, 'James Thorne', 'Beacon Hill Legal Tech', 'jthorne@beaconlaw.com', 1, 'SMB', 'Silver', 41000.00, '2024-05-10')
ON CONFLICT (id) DO NOTHING;

-- Marketing Campaigns Seed
INSERT INTO public.marketing_campaigns (id, name, channel, budget, spend, conversions, revenue_generated, start_date, end_date) VALUES
(1, 'Q1 Enterprise AI Summit', 'Partner Summit', 45000.00, 43200.00, 185, 290000.00, '2025-01-10', '2025-03-31'),
(2, 'LinkedIn Executive B2B Inbound', 'LinkedIn B2B', 30000.00, 29500.00, 240, 215000.00, '2025-02-01', '2025-06-30'),
(3, 'Google Search High-Intent Analytics', 'Search Ads', 25000.00, 24800.00, 310, 180000.00, '2025-01-01', '2025-12-31'),
(4, 'Modern BI Data Modernization Webinar', 'Webinar', 12000.00, 11400.00, 420, 140000.00, '2025-04-15', '2025-07-15'),
(5, 'Gartner Magic Quadrant Leader Release', 'Content Marketing', 18000.00, 17500.00, 160, 165000.00, '2025-03-01', '2025-05-30')
ON CONFLICT (id) DO NOTHING;

-- Orders Seed
INSERT INTO public.orders (id, customer_id, order_date, status, total_amount, discount_amount, payment_method, billing_cycle) VALUES
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
(133, 4, '2026-03-24', 'Completed', 46500.00, 1600.00, 'Wire Transfer', 'Annual')
ON CONFLICT (id) DO NOTHING;

-- Order Items Seed
INSERT INTO public.order_items (id, order_id, product_id, quantity, unit_price, subtotal) VALUES
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
(33, 133, 6, 3, 5400.00, 16200.00)
ON CONFLICT (id) DO NOTHING;

-- Reset sequence IDs
SELECT setval('public.regions_id_seq', (SELECT MAX(id) FROM public.regions));
SELECT setval('public.customers_id_seq', (SELECT MAX(id) FROM public.customers));
SELECT setval('public.products_id_seq', (SELECT MAX(id) FROM public.products));
SELECT setval('public.orders_id_seq', (SELECT MAX(id) FROM public.orders));
SELECT setval('public.order_items_id_seq', (SELECT MAX(id) FROM public.order_items));
SELECT setval('public.marketing_campaigns_id_seq', (SELECT MAX(id) FROM public.marketing_campaigns));
