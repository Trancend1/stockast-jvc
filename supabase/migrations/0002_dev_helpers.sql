-- ─────────────────────────────────────────────────────────────────────────
-- Dev helpers: schema introspection functions for seed scripts.
-- Called by scripts/seed-dimsum.ts (and any future seed scripts) via
-- supabase.rpc('get_columns_meta', { p_table: '...' }) using service_role.
--
-- These functions are read-only (STABLE, SECURITY DEFINER, info_schema only).
-- They are safe to deploy to production — they expose no data, only metadata.
-- ─────────────────────────────────────────────────────────────────────────

set search_path = public;

-- Returns column metadata for a public-schema table.
-- Used by seed scripts to build INSERT payloads without hardcoding column lists.
create or replace function public.get_columns_meta(p_table text)
returns table (
  column_name      text,
  data_type        text,
  udt_name         text,
  is_nullable      text,
  column_default   text,
  ordinal_position int
)
language sql
stable
security definer
set search_path = public, pg_catalog, information_schema
as $$
  select
    c.column_name::text,
    c.data_type::text,
    c.udt_name::text,
    c.is_nullable::text,
    c.column_default::text,
    c.ordinal_position::int
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name   = p_table
  order by c.ordinal_position;
$$;

-- Returns foreign-key relationships for a table (column → foreign table.column).
-- Useful for determining insertion order in seed scripts.
create or replace function public.get_fk_meta(p_table text)
returns table (
  column_name    text,
  foreign_table  text,
  foreign_column text
)
language sql
stable
security definer
set search_path = public, pg_catalog, information_schema
as $$
  select
    kcu.column_name::text,
    ccu.table_name::text  as foreign_table,
    ccu.column_name::text as foreign_column
  from information_schema.table_constraints    tc
  join information_schema.key_column_usage     kcu
    on  tc.constraint_name = kcu.constraint_name
    and tc.table_schema    = kcu.table_schema
  join information_schema.constraint_column_usage ccu
    on  ccu.constraint_name = tc.constraint_name
    and ccu.table_schema    = tc.table_schema
  where tc.constraint_type = 'FOREIGN KEY'
    and tc.table_schema    = 'public'
    and tc.table_name      = p_table;
$$;

-- Grant to service_role (used by seed scripts + admin ops).
-- authenticated excluded: end users have no need for schema info.
grant execute on function public.get_columns_meta(text) to service_role;
grant execute on function public.get_fk_meta(text)      to service_role;
