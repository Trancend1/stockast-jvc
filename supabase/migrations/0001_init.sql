-- ─────────────────────────────────────────────────────────────────────────
-- Stockast initial schema
-- Source: .docs/FOUNDATION_BLUEPRINT.md §4.1
-- Convention: snake_case, plural tables, soft-delete via deleted_at,
--             created_at/updated_at on every table, RLS enabled on user data.
-- ─────────────────────────────────────────────────────────────────────────

set search_path = public;

-- ─── Identity ────────────────────────────────────────────────────────────
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  phone text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null references users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists outlets (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  location_label text not null,
  adm4_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists memberships (
  user_id uuid not null references users(id) on delete cascade,
  organization_id uuid not null references organizations(id) on delete cascade,
  role text not null check (role in ('owner', 'staff')),
  created_at timestamptz not null default now(),
  primary key (user_id, organization_id)
);

-- ─── Menu ────────────────────────────────────────────────────────────────
create table if not exists menu_items (
  id uuid primary key default gen_random_uuid(),
  outlet_id uuid not null references outlets(id) on delete cascade,
  name text not null,
  normalized_name text not null,
  unit text not null default 'porsi',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (outlet_id, normalized_name)
);

-- ─── Stock ───────────────────────────────────────────────────────────────
create table if not exists stock_log_drafts (
  id uuid primary key default gen_random_uuid(),
  outlet_id uuid not null references outlets(id) on delete cascade,
  raw_input text not null,
  service_date date not null,
  status text not null check (status in ('pending', 'parsed', 'confirmed', 'rejected')),
  parsed_payload jsonb,
  idempotency_key text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists stock_logs (
  id uuid primary key default gen_random_uuid(),
  outlet_id uuid not null references outlets(id) on delete cascade,
  service_date date not null,
  items jsonb not null,
  source_draft_id uuid references stock_log_drafts(id),
  confirmed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (outlet_id, service_date)
);

-- ─── Recommendations ─────────────────────────────────────────────────────
create table if not exists recommendations (
  id uuid primary key default gen_random_uuid(),
  outlet_id uuid not null references outlets(id) on delete cascade,
  service_date date not null,
  items jsonb not null,
  reasoning text not null,
  confidence_label text not null check (
    confidence_label in ('Pola jelas', 'Data baru, hati-hati', 'Tidak yakin')
  ),
  audit jsonb not null,
  created_at timestamptz not null default now(),
  unique (outlet_id, service_date)
);

-- ─── Promos ──────────────────────────────────────────────────────────────
create table if not exists promo_drafts (
  id uuid primary key default gen_random_uuid(),
  outlet_id uuid not null references outlets(id) on delete cascade,
  service_date date not null,
  message text not null,
  discount_percent int check (discount_percent between 0 and 15),
  status text not null check (status in ('draft', 'copied', 'dismissed')),
  created_at timestamptz not null default now()
);

-- ─── Weather (BMKG cache) ────────────────────────────────────────────────
create table if not exists weather_snapshots (
  id uuid primary key default gen_random_uuid(),
  adm4_code text not null,
  forecast_date date not null,
  payload jsonb not null,
  fetched_at timestamptz not null default now(),
  unique (adm4_code, forecast_date)
);

-- ─── Audit (AI calls) ────────────────────────────────────────────────────
create table if not exists ai_audit_logs (
  id uuid primary key default gen_random_uuid(),
  outlet_id uuid references outlets(id) on delete set null,
  entity_type text not null,
  entity_id uuid,
  prompt_version text not null,
  model text not null,
  raw_input_hash text not null,
  raw_response jsonb,
  latency_ms int,
  cost_usd numeric(10, 6),
  created_at timestamptz not null default now()
);

-- ─── Indexes ─────────────────────────────────────────────────────────────
create index if not exists idx_stock_logs_outlet_date on stock_logs (outlet_id, service_date desc);
create index if not exists idx_recommendations_outlet_date on recommendations (outlet_id, service_date desc);
create index if not exists idx_weather_adm4_date on weather_snapshots (adm4_code, forecast_date);
create index if not exists idx_drafts_outlet_status on stock_log_drafts (outlet_id, status, created_at desc);
create index if not exists idx_audit_entity on ai_audit_logs (entity_type, entity_id);
create index if not exists idx_memberships_user on memberships (user_id);

-- ─── Helper: user's org IDs (used in every RLS policy) ───────────────────
create or replace function auth_user_orgs()
returns setof uuid
language sql
stable
security definer
set search_path = public
as $$
  select organization_id from memberships where user_id = auth.uid();
$$;

-- ─── RLS ─────────────────────────────────────────────────────────────────
alter table organizations enable row level security;
alter table outlets enable row level security;
alter table memberships enable row level security;
alter table menu_items enable row level security;
alter table stock_log_drafts enable row level security;
alter table stock_logs enable row level security;
alter table recommendations enable row level security;
alter table promo_drafts enable row level security;
alter table ai_audit_logs enable row level security;

-- Organizations: members can read, owners can write
create policy "members read own organizations"
  on organizations for select
  using (id in (select auth_user_orgs()));

create policy "owners write own organizations"
  on organizations for all
  using (
    id in (
      select organization_id from memberships
      where user_id = auth.uid() and role = 'owner'
    )
  );

-- Memberships: user can see their own memberships
create policy "users read own memberships"
  on memberships for select
  using (user_id = auth.uid());

-- Outlets: gated by organization
create policy "members read outlets"
  on outlets for select
  using (organization_id in (select auth_user_orgs()));

create policy "owners write outlets"
  on outlets for all
  using (
    organization_id in (
      select organization_id from memberships
      where user_id = auth.uid() and role = 'owner'
    )
  );

-- Helper to check outlet → org → user gate (used by remaining tables)
create or replace function auth_owns_outlet(p_outlet_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from outlets o
    join memberships m on m.organization_id = o.organization_id
    where o.id = p_outlet_id and m.user_id = auth.uid()
  );
$$;

create policy "members access menu_items"
  on menu_items for all
  using (auth_owns_outlet(outlet_id));

create policy "members access stock_log_drafts"
  on stock_log_drafts for all
  using (auth_owns_outlet(outlet_id));

create policy "members access stock_logs"
  on stock_logs for all
  using (auth_owns_outlet(outlet_id));

create policy "members access recommendations"
  on recommendations for all
  using (auth_owns_outlet(outlet_id));

create policy "members access promo_drafts"
  on promo_drafts for all
  using (auth_owns_outlet(outlet_id));

create policy "members access ai_audit_logs"
  on ai_audit_logs for select
  using (outlet_id is null or auth_owns_outlet(outlet_id));

-- Weather snapshots are non-tenant data; readable by any authenticated user.
alter table weather_snapshots enable row level security;
create policy "authenticated read weather"
  on weather_snapshots for select
  using (auth.role() = 'authenticated');

-- ─── Updated_at triggers ─────────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

do $$
declare t text;
begin
  for t in select unnest(array[
    'users', 'organizations', 'outlets', 'menu_items', 'stock_log_drafts'
  ])
  loop
    execute format('drop trigger if exists trg_%I_updated_at on %I', t, t);
    execute format(
      'create trigger trg_%I_updated_at before update on %I
       for each row execute function set_updated_at()',
      t, t
    );
  end loop;
end $$;
