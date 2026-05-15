-- ─────────────────────────────────────────────────────────────────────────
-- Stockast demo seed: Warung Bu Yati — Pecel Lele Salatiga
-- Source: PRD.md §2.1 (Bu Yati persona) + §10 (sample warung) + EXECUTION_BLUEPRINT.md §2 Phase 1.
--
-- IDs must match .env.local DEMO_USER_ID / DEMO_OUTLET_ID for Phase 1 single-tenant demo.
-- Service dates generated relative to a fixed anchor (2026-05-14, day before #JuaraVibeCoding window).
-- ─────────────────────────────────────────────────────────────────────────

set search_path = public;

-- Disable RLS for seed (we are not authenticated as a normal user here)
set local row_security = off;

-- Demo user (id matches DEMO_USER_ID in .env.example)
insert into users (id, phone)
values ('00000000-0000-0000-0000-000000000001', null)
on conflict (id) do nothing;

-- Demo org
insert into organizations (id, name, owner_id)
values (
  '00000000-0000-0000-0000-000000000100',
  'Warung Bu Yati',
  '00000000-0000-0000-0000-000000000001'
)
on conflict (id) do nothing;

-- Demo membership
insert into memberships (user_id, organization_id, role)
values (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000100',
  'owner'
)
on conflict do nothing;

-- Demo outlet (id matches DEMO_OUTLET_ID)
-- adm4_code 33.73.01.1001 = a Salatiga kelurahan; placeholder until Phase 2 real BMKG mapping.
insert into outlets (id, organization_id, name, location_label, adm4_code)
values (
  '00000000-0000-0000-0000-000000000010',
  '00000000-0000-0000-0000-000000000100',
  'Warung Bu Yati',
  'Salatiga, Jawa Tengah',
  '33.73.01.1001'
)
on conflict (id) do nothing;

-- Menu items
insert into menu_items (id, outlet_id, name, normalized_name, unit) values
  ('00000000-0000-0000-0000-000000001001', '00000000-0000-0000-0000-000000000010', 'Pecel Lele',    'pecel lele',    'porsi'),
  ('00000000-0000-0000-0000-000000001002', '00000000-0000-0000-0000-000000000010', 'Ayam Goreng',   'ayam goreng',   'porsi'),
  ('00000000-0000-0000-0000-000000001003', '00000000-0000-0000-0000-000000000010', 'Tahu Goreng',   'tahu goreng',   'porsi'),
  ('00000000-0000-0000-0000-000000001004', '00000000-0000-0000-0000-000000000010', 'Tempe Goreng',  'tempe goreng',  'porsi'),
  ('00000000-0000-0000-0000-000000001005', '00000000-0000-0000-0000-000000000010', 'Nasi Putih',    'nasi putih',    'porsi')
on conflict (outlet_id, normalized_name) do nothing;

-- 7 days of stock logs ending yesterday (anchor 2026-05-14)
insert into stock_logs (outlet_id, service_date, items, confirmed_at) values
  ('00000000-0000-0000-0000-000000000010', '2026-05-08', jsonb_build_array(
    jsonb_build_object('menu_item_id', '00000000-0000-0000-0000-000000001001', 'sold', 28, 'leftover', 2,  'unit', 'porsi'),
    jsonb_build_object('menu_item_id', '00000000-0000-0000-0000-000000001002', 'sold', 22, 'leftover', 0,  'unit', 'porsi'),
    jsonb_build_object('menu_item_id', '00000000-0000-0000-0000-000000001003', 'sold', 40, 'leftover', 8,  'unit', 'porsi'),
    jsonb_build_object('menu_item_id', '00000000-0000-0000-0000-000000001004', 'sold', 35, 'leftover', 5,  'unit', 'porsi'),
    jsonb_build_object('menu_item_id', '00000000-0000-0000-0000-000000001005', 'sold', 55, 'leftover', 0,  'unit', 'porsi')
  ), '2026-05-08 22:00:00+07'),
  ('00000000-0000-0000-0000-000000000010', '2026-05-09', jsonb_build_array(
    jsonb_build_object('menu_item_id', '00000000-0000-0000-0000-000000001001', 'sold', 31, 'leftover', 0,  'unit', 'porsi'),
    jsonb_build_object('menu_item_id', '00000000-0000-0000-0000-000000001002', 'sold', 24, 'leftover', 1,  'unit', 'porsi'),
    jsonb_build_object('menu_item_id', '00000000-0000-0000-0000-000000001003', 'sold', 38, 'leftover', 4,  'unit', 'porsi'),
    jsonb_build_object('menu_item_id', '00000000-0000-0000-0000-000000001004', 'sold', 33, 'leftover', 7,  'unit', 'porsi'),
    jsonb_build_object('menu_item_id', '00000000-0000-0000-0000-000000001005', 'sold', 58, 'leftover', 2,  'unit', 'porsi')
  ), '2026-05-09 22:10:00+07'),
  ('00000000-0000-0000-0000-000000000010', '2026-05-10', jsonb_build_array(
    jsonb_build_object('menu_item_id', '00000000-0000-0000-0000-000000001001', 'sold', 30, 'leftover', 0,  'unit', 'porsi'),
    jsonb_build_object('menu_item_id', '00000000-0000-0000-0000-000000001002', 'sold', 25, 'leftover', 0,  'unit', 'porsi'),
    jsonb_build_object('menu_item_id', '00000000-0000-0000-0000-000000001003', 'sold', 42, 'leftover', 3,  'unit', 'porsi'),
    jsonb_build_object('menu_item_id', '00000000-0000-0000-0000-000000001004', 'sold', 36, 'leftover', 4,  'unit', 'porsi'),
    jsonb_build_object('menu_item_id', '00000000-0000-0000-0000-000000001005', 'sold', 60, 'leftover', 0,  'unit', 'porsi')
  ), '2026-05-10 22:05:00+07'),
  ('00000000-0000-0000-0000-000000000010', '2026-05-11', jsonb_build_array(
    jsonb_build_object('menu_item_id', '00000000-0000-0000-0000-000000001001', 'sold', 26, 'leftover', 6,  'unit', 'porsi'),
    jsonb_build_object('menu_item_id', '00000000-0000-0000-0000-000000001002', 'sold', 20, 'leftover', 2,  'unit', 'porsi'),
    jsonb_build_object('menu_item_id', '00000000-0000-0000-0000-000000001003', 'sold', 37, 'leftover', 5,  'unit', 'porsi'),
    jsonb_build_object('menu_item_id', '00000000-0000-0000-0000-000000001004', 'sold', 32, 'leftover', 6,  'unit', 'porsi'),
    jsonb_build_object('menu_item_id', '00000000-0000-0000-0000-000000001005', 'sold', 50, 'leftover', 3,  'unit', 'porsi')
  ), '2026-05-11 22:20:00+07'),
  ('00000000-0000-0000-0000-000000000010', '2026-05-12', jsonb_build_array(
    jsonb_build_object('menu_item_id', '00000000-0000-0000-0000-000000001001', 'sold', 29, 'leftover', 1,  'unit', 'porsi'),
    jsonb_build_object('menu_item_id', '00000000-0000-0000-0000-000000001002', 'sold', 23, 'leftover', 2,  'unit', 'porsi'),
    jsonb_build_object('menu_item_id', '00000000-0000-0000-0000-000000001003', 'sold', 41, 'leftover', 2,  'unit', 'porsi'),
    jsonb_build_object('menu_item_id', '00000000-0000-0000-0000-000000001004', 'sold', 34, 'leftover', 4,  'unit', 'porsi'),
    jsonb_build_object('menu_item_id', '00000000-0000-0000-0000-000000001005', 'sold', 56, 'leftover', 1,  'unit', 'porsi')
  ), '2026-05-12 22:00:00+07'),
  ('00000000-0000-0000-0000-000000000010', '2026-05-13', jsonb_build_array(
    jsonb_build_object('menu_item_id', '00000000-0000-0000-0000-000000001001', 'sold', 32, 'leftover', 0,  'unit', 'porsi'),
    jsonb_build_object('menu_item_id', '00000000-0000-0000-0000-000000001002', 'sold', 26, 'leftover', 0,  'unit', 'porsi'),
    jsonb_build_object('menu_item_id', '00000000-0000-0000-0000-000000001003', 'sold', 44, 'leftover', 1,  'unit', 'porsi'),
    jsonb_build_object('menu_item_id', '00000000-0000-0000-0000-000000001004', 'sold', 37, 'leftover', 3,  'unit', 'porsi'),
    jsonb_build_object('menu_item_id', '00000000-0000-0000-0000-000000001005', 'sold', 62, 'leftover', 0,  'unit', 'porsi')
  ), '2026-05-13 22:00:00+07'),
  ('00000000-0000-0000-0000-000000000010', '2026-05-14', jsonb_build_array(
    jsonb_build_object('menu_item_id', '00000000-0000-0000-0000-000000001001', 'sold', 25, 'leftover', 5,  'unit', 'porsi'),
    jsonb_build_object('menu_item_id', '00000000-0000-0000-0000-000000001002', 'sold', 24, 'leftover', 0,  'unit', 'porsi'),
    jsonb_build_object('menu_item_id', '00000000-0000-0000-0000-000000001003', 'sold', 39, 'leftover', 6,  'unit', 'porsi'),
    jsonb_build_object('menu_item_id', '00000000-0000-0000-0000-000000001004', 'sold', 35, 'leftover', 5,  'unit', 'porsi'),
    jsonb_build_object('menu_item_id', '00000000-0000-0000-0000-000000001005', 'sold', 54, 'leftover', 2,  'unit', 'porsi')
  ), '2026-05-14 22:00:00+07')
on conflict (outlet_id, service_date) do nothing;
