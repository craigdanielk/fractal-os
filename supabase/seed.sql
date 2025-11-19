-- ================================================
-- FRACTΛL Seed Data
-- Production seed data for initial setup
-- ================================================

-- ================================================
-- CLIENTS
-- ================================================
insert into clients (id, name, notes, tenant_id, created_at, updated_at)
values
  ('11111111-0000-0000-0000-000000000001', 
   'R17 Ventures', 
   'Performance marketing agency & internal operations client',
   (select id from tenants limit 1),
   now(),
   now()),
  ('11111111-0000-0000-0000-000000000002', 
   'Champion Grip', 
   'Lawn bowls grip & sports accessories brand',
   (select id from tenants limit 1),
   now(),
   now()),
  ('11111111-0000-0000-0000-000000000003', 
   'WCT Pay', 
   'Payment solutions provider',
   (select id from tenants limit 1),
   now(),
   now())
on conflict (id) do nothing;

-- ================================================
-- PROJECTS
-- ================================================
insert into projects (id, client_id, project_name, description, status, tenant_id, created_at, updated_at)
values
  -- R17 Ventures
  ('22222222-0000-0000-0000-000000000001',
   '11111111-0000-0000-0000-000000000001',
   'R17 – Website Migration & OS Integration',
   'Aramedes migration, Boum landing page, FractalOS integration into agency workflow',
   'in_progress',
   (select id from tenants limit 1),
   now(),
   now()),
  -- Champion Grip
  ('22222222-0000-0000-0000-000000000002',
   '11111111-0000-0000-0000-000000000002',
   'CG – Automation + Packaging + Distribution OS',
   'Champion Grip OS integration, packaging specs automation, distributor onboarding',
   'in_progress',
   (select id from tenants limit 1),
   now(),
   now()),
  -- WCT Pay
  ('22222222-0000-0000-0000-000000000003',
   '11111111-0000-0000-0000-000000000003',
   'WCT — Marketing Engine Setup',
   'Campaign setup, landing page build, ad strategy & competitor analysis',
   'planning',
   (select id from tenants limit 1),
   now(),
   now())
on conflict (id) do nothing;

-- ================================================
-- TASKS
-- ================================================
insert into tasks (id, project_id, task_name, notes, status, tenant_id, created_at, updated_at)
values
  -- R17 tasks
  ('33333333-0000-0000-0000-000000000001',
   '22222222-0000-0000-0000-000000000001',
   'Aramedes Homepage Rebuild',
   'Recreate premium hero + product grid inside Shopify Prestige theme',
   'in_progress',
   (select id from tenants limit 1),
   now(),
   now()),
  ('33333333-0000-0000-0000-000000000002',
   '22222222-0000-0000-0000-000000000001',
   'Boum Landing Page MVP',
   'Impact Last theme early-bird landing page with subscription onboarding',
   'not_started',
   (select id from tenants limit 1),
   now(),
   now()),
  -- Champion Grip tasks
  ('33333333-0000-0000-0000-000000000003',
   '22222222-0000-0000-0000-000000000002',
   'Champion Grip OS Schema',
   'Finalise DBs (Products, Distributors, Orders, Channel Partners)',
   'in_progress',
   (select id from tenants limit 1),
   now(),
   now()),
  ('33333333-0000-0000-0000-000000000004',
   '22222222-0000-0000-0000-000000000002',
   'Packaging + International Labels',
   'Upload dimensions, weight specs, Canva templates, shipping presets',
   'not_started',
   (select id from tenants limit 1),
   now(),
   now()),
  -- WCT Pay tasks
  ('33333333-0000-0000-0000-000000000005',
   '22222222-0000-0000-0000-000000000003',
   'Competitor Research Engine',
   'CI stack for discovering competitor funnels, ads, keywords',
   'in_progress',
   (select id from tenants limit 1),
   now(),
   now()),
  ('33333333-0000-0000-0000-000000000006',
   '22222222-0000-0000-0000-000000000003',
   'Ad Account Setup + Events',
   'Pixel setup, server-side tracking, lead form and conversions API',
   'not_started',
   (select id from tenants limit 1),
   now(),
   now())
on conflict (id) do nothing;

-- ================================================
-- TIME ENTRIES
-- ================================================
insert into time_entries (id, task_id, duration_hours, notes, session_date, tenant_id, created_at, updated_at)
values
  ('44444444-0000-0000-0000-000000000001',
   '33333333-0000-0000-0000-000000000001',
   2.5, 
   'Aramedes hero rebuild',
   current_date,
   (select id from tenants limit 1),
   now(),
   now()),
  ('44444444-0000-0000-0000-000000000002',
   '33333333-0000-0000-0000-000000000003',
   1.2, 
   'Champion Grip DB design',
   current_date,
   (select id from tenants limit 1),
   now(),
   now()),
  ('44444444-0000-0000-0000-000000000003',
   '33333333-0000-0000-0000-000000000005',
   1.0, 
   'WCT competitor scrape',
   current_date,
   (select id from tenants limit 1),
   now(),
   now())
on conflict (id) do nothing;

