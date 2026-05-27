/**
 * Hand-rolled DB types for Phase 1. Tracked in git (not gitignored) because
 * Docker-based local Supabase is not yet running, so `pnpm db:types` cannot
 * generate it on CI.
 *
 * Phase 2 plan: once local Supabase runs in CI (or types are pre-generated
 * and committed), this file becomes the output of `pnpm db:types` and can
 * be re-added to .gitignore.
 *
 * Source: supabase/migrations/0001_init.sql
 *
 * Keep this in sync with the migration columns we actually consume from the
 * app code (not every column needs to be here — only what services read/write).
 */

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type StockLogItemRow = {
  menu_item_id: string | null;
  sold: number;
  leftover: number;
  unit: string;
};

export type MenuItemRow = {
  id: string;
  outlet_id: string;
  name: string;
  normalized_name: string;
  unit: string;
  deleted_at: string | null;
};

export type StockLogDraftRow = {
  id: string;
  outlet_id: string;
  raw_input: string;
  service_date: string;
  status: 'pending' | 'parsed' | 'confirmed' | 'rejected';
  parsed_payload: Json | null;
  idempotency_key: string | null;
  created_at: string;
};

export type StockLogRow = {
  id: string;
  outlet_id: string;
  service_date: string;
  items: StockLogItemRow[];
  source_draft_id: string | null;
  confirmed_at: string;
  created_at: string;
  deleted_at: string | null;
};

export type OutletRow = {
  id: string;
  organization_id: string;
  name: string;
  location_label: string;
  adm4_code: string | null;
};

export type AIAuditLogInsert = {
  outlet_id: string | null;
  entity_type: string;
  entity_id: string | null;
  prompt_version: string;
  model: string;
  raw_input_hash: string;
  raw_response: Json | null;
  latency_ms: number | null;
  cost_usd: number | null;
};
