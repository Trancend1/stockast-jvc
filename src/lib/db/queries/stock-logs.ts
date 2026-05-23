import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';
import { isMissingTableError, throwIfMissingTable } from '../errors';
import type { Json, StockLogDraftRow, StockLogItemRow, StockLogRow } from '../types';

export type InsertStockDraftInput = {
  outletId: string;
  rawInput: string;
  serviceDate: string;
  idempotencyKey?: string;
};

export async function insertStockDraft(
  db: SupabaseClient,
  input: InsertStockDraftInput,
): Promise<StockLogDraftRow> {
  const { data, error } = await db
    .from('stock_log_drafts')
    .insert({
      outlet_id: input.outletId,
      raw_input: input.rawInput,
      service_date: input.serviceDate,
      status: 'pending',
      idempotency_key: input.idempotencyKey ?? null,
    })
    .select(
      'id, outlet_id, raw_input, service_date, status, parsed_payload, idempotency_key, created_at',
    )
    .single();

  if (error || !data) {
    throwIfMissingTable(error, 'stock_log_drafts');
    throw new Error(`insertStockDraft failed: ${error?.message ?? 'no row returned'}`);
  }
  return data as StockLogDraftRow;
}

export type UpdateStockDraftParsedInput = {
  draftId: string;
  parsedPayload: Json;
  status: 'parsed' | 'rejected';
};

export async function updateStockDraftParsed(
  db: SupabaseClient,
  input: UpdateStockDraftParsedInput,
): Promise<StockLogDraftRow> {
  const { data, error } = await db
    .from('stock_log_drafts')
    .update({
      parsed_payload: input.parsedPayload,
      status: input.status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', input.draftId)
    .select(
      'id, outlet_id, raw_input, service_date, status, parsed_payload, idempotency_key, created_at',
    )
    .single();

  if (error || !data) {
    throwIfMissingTable(error, 'stock_log_drafts');
    throw new Error(`updateStockDraftParsed failed: ${error?.message ?? 'no row returned'}`);
  }
  return data as StockLogDraftRow;
}

export type ConfirmStockLogInput = {
  outletId: string;
  serviceDate: string;
  items: StockLogItemRow[];
  sourceDraftId: string;
};

export async function upsertConfirmedStockLog(
  db: SupabaseClient,
  input: ConfirmStockLogInput,
): Promise<StockLogRow> {
  const now = new Date().toISOString();
  const { data, error } = await db
    .from('stock_logs')
    .upsert(
      {
        outlet_id: input.outletId,
        service_date: input.serviceDate,
        items: input.items,
        source_draft_id: input.sourceDraftId,
        confirmed_at: now,
      },
      { onConflict: 'outlet_id,service_date' },
    )
    .select(
      'id, outlet_id, service_date, items, source_draft_id, confirmed_at, created_at, deleted_at',
    )
    .single();

  if (error || !data) {
    throwIfMissingTable(error, 'stock_logs');
    throw new Error(`upsertConfirmedStockLog failed: ${error?.message ?? 'no row returned'}`);
  }

  const draftUpdate = await db
    .from('stock_log_drafts')
    .update({ status: 'confirmed', updated_at: now })
    .eq('id', input.sourceDraftId);

  if (draftUpdate.error) {
    throwIfMissingTable(draftUpdate.error, 'stock_log_drafts');
    throw new Error(`mark draft confirmed failed: ${draftUpdate.error.message}`);
  }

  return data as StockLogRow;
}

export async function findStockDraft(
  db: SupabaseClient,
  draftId: string,
): Promise<StockLogDraftRow | null> {
  const { data, error } = await db
    .from('stock_log_drafts')
    .select(
      'id, outlet_id, raw_input, service_date, status, parsed_payload, idempotency_key, created_at',
    )
    .eq('id', draftId)
    .maybeSingle();

  if (error) {
    if (isMissingTableError(error, 'stock_log_drafts')) return null;
    throw new Error(`findStockDraft failed: ${error.message}`);
  }
  return (data ?? null) as StockLogDraftRow | null;
}

export async function listRecentStockLogs(
  db: SupabaseClient,
  outletId: string,
  days: number,
): Promise<StockLogRow[]> {
  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceDate = since.toISOString().slice(0, 10);

  const { data, error } = await db
    .from('stock_logs')
    .select(
      'id, outlet_id, service_date, items, source_draft_id, confirmed_at, created_at, deleted_at',
    )
    .eq('outlet_id', outletId)
    .is('deleted_at', null)
    .gte('service_date', sinceDate)
    .order('service_date', { ascending: false });

  if (error) {
    if (isMissingTableError(error, 'stock_logs')) return [];
    throw new Error(`listRecentStockLogs failed: ${error.message}`);
  }
  return (data ?? []) as StockLogRow[];
}
