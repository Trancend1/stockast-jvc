import 'server-only';
import { createHash } from 'node:crypto';
import { parseStockNote } from '@/lib/ai/generate';
import { insertAIAuditLog } from '@/lib/db/queries/ai-audit';
import { listMenuItems } from '@/lib/db/queries/menu-items';
import {
  findStockDraft,
  insertStockDraft,
  updateStockDraftParsed,
  upsertConfirmedStockLog,
} from '@/lib/db/queries/stock-logs';
import { MissingTableError } from '@/lib/db/errors';
import type { Json, StockLogDraftRow, StockLogItemRow, StockLogRow } from '@/lib/db/types';
import type { ParsedStockPayload } from '@/types/domain';
import { THRESHOLDS } from '@/lib/config/thresholds';
import { mapToDomainPayload } from './stock-mapping';

/**
 * Orchestrate: validate raw input → call AI → map AI items to menu IDs →
 * persist draft. Pure-function-friendly (no React, no Server Action mechanics).
 *
 * Source: .docs/SYSTEM_ARCHITECTURE.md §6 (StockService responsibilities).
 */

export type StockServiceFailure =
  | 'INPUT_INVALID'
  | 'AI_PARSE_FAILED'
  | 'AI_VALIDATION_FAILED'
  | 'SERVICE_UNAVAILABLE'
  | 'INTERNAL';

export type ParseAndStoreInput = {
  outletId: string;
  rawInput: string;
  serviceDate: string;
};

export type ParseAndStoreResult =
  | { ok: true; draft: StockLogDraftRow; parsed: ParsedStockPayload }
  | { ok: false; reason: StockServiceFailure; message: string };

export async function parseAndStore(input: ParseAndStoreInput): Promise<ParseAndStoreResult> {
  const trimmed = input.rawInput.trim();
  if (trimmed.length === 0) {
    return { ok: false, reason: 'INPUT_INVALID', message: 'Catatan kosong.' };
  }
  if (trimmed.length > THRESHOLDS.STOCK_NOTE_MAX_CHARS) {
    return { ok: false, reason: 'INPUT_INVALID', message: 'Catatan terlalu panjang.' };
  }

  let draft: StockLogDraftRow;
  try {
    draft = await insertStockDraft({
      outletId: input.outletId,
      rawInput: trimmed,
      serviceDate: input.serviceDate,
    });
  } catch (err) {
    return failureFromError(err);
  }

  const menuItems = await safeListMenuItems(input.outletId);
  const aiResult = await parseStockNote({
    rawInput: trimmed,
    knownMenu: menuItems.map((m) => m.name),
  });

  void writeAudit({
    outletId: input.outletId,
    entityId: draft.id,
    rawInput: trimmed,
    aiMeta: aiResult.meta,
    rawResponse: aiResult.ok ? (aiResult.data as unknown as Json) : null,
  });

  if (!aiResult.ok) {
    await safeMarkDraftRejected(draft.id);
    const reason: StockServiceFailure =
      aiResult.reason === 'SCHEMA_VALIDATION_FAILED'
        ? 'AI_VALIDATION_FAILED'
        : 'AI_PARSE_FAILED';
    return { ok: false, reason, message: aiFailureMessage(aiResult.reason) };
  }

  const mapped = mapToDomainPayload(aiResult.data, menuItems);
  let updated: StockLogDraftRow;
  try {
    updated = await updateStockDraftParsed({
      draftId: draft.id,
      parsedPayload: mapped as unknown as Json,
      status: 'parsed',
    });
  } catch (err) {
    return failureFromError(err);
  }

  return { ok: true, draft: updated, parsed: mapped };
}

export type ConfirmDraftInput = {
  draftId: string;
  outletId: string;
  items: StockLogItemRow[];
};

export type ConfirmDraftResult =
  | { ok: true; log: StockLogRow }
  | {
      ok: false;
      reason: 'NOT_FOUND' | 'CONFLICT_STATE' | 'SERVICE_UNAVAILABLE' | 'INTERNAL';
      message: string;
    };

export async function confirmDraft(input: ConfirmDraftInput): Promise<ConfirmDraftResult> {
  let draft: StockLogDraftRow | null;
  try {
    draft = await findStockDraft(input.draftId);
  } catch (err) {
    return confirmFailureFromError(err);
  }
  if (!draft) {
    return { ok: false, reason: 'NOT_FOUND', message: 'Catatan tidak ditemukan.' };
  }
  if (draft.outlet_id !== input.outletId) {
    return { ok: false, reason: 'NOT_FOUND', message: 'Catatan tidak ditemukan.' };
  }
  if (draft.status === 'confirmed') {
    return { ok: false, reason: 'CONFLICT_STATE', message: 'Sudah disimpan sebelumnya.' };
  }

  try {
    const log = await upsertConfirmedStockLog({
      outletId: input.outletId,
      serviceDate: draft.service_date,
      items: input.items,
      sourceDraftId: draft.id,
    });
    return { ok: true, log };
  } catch (err) {
    return confirmFailureFromError(err);
  }
}

function failureFromError(
  err: unknown,
): { ok: false; reason: StockServiceFailure; message: string } {
  if (err instanceof MissingTableError) {
    return { ok: false, reason: 'SERVICE_UNAVAILABLE', message: err.message };
  }
  return { ok: false, reason: 'INTERNAL', message: errorMessage(err) };
}

function confirmFailureFromError(
  err: unknown,
): { ok: false; reason: 'NOT_FOUND' | 'CONFLICT_STATE' | 'SERVICE_UNAVAILABLE' | 'INTERNAL'; message: string } {
  if (err instanceof MissingTableError) {
    return { ok: false, reason: 'SERVICE_UNAVAILABLE', message: err.message };
  }
  return { ok: false, reason: 'INTERNAL', message: errorMessage(err) };
}

function aiFailureMessage(reason: string): string {
  switch (reason) {
    case 'TIMEOUT':
      return 'Lama banget. Coba lagi sebentar.';
    case 'JSON_PARSE_FAILED':
    case 'SCHEMA_VALIDATION_FAILED':
      return 'Aku belum nangkep catatannya. Coba diketik ulang ya.';
    default:
      return 'Aku belum nangkep catatannya. Coba diketik ulang ya.';
  }
}

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : 'Terjadi kesalahan.';
}

async function safeListMenuItems(outletId: string) {
  try {
    return await listMenuItems(outletId);
  } catch {
    return [];
  }
}

async function safeMarkDraftRejected(draftId: string): Promise<void> {
  try {
    await updateStockDraftParsed({
      draftId,
      parsedPayload: null as unknown as Json,
      status: 'rejected',
    });
  } catch {
    // Best-effort cleanup.
  }
}

function writeAudit(args: {
  outletId: string;
  entityId: string;
  rawInput: string;
  aiMeta: { promptVersion: string; model: string; latencyMs: number };
  rawResponse: Json | null;
}): void {
  const hash = createHash('sha256').update(args.rawInput).digest('hex');
  insertAIAuditLog({
    outlet_id: args.outletId,
    entity_type: 'stock_log_draft',
    entity_id: args.entityId,
    prompt_version: args.aiMeta.promptVersion,
    model: args.aiMeta.model,
    raw_input_hash: hash,
    raw_response: args.rawResponse,
    latency_ms: args.aiMeta.latencyMs,
    cost_usd: null,
  }).catch(() => {
    // Audit is best-effort. Never fail the user flow because of audit write.
  });
}

