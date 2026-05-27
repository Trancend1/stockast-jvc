'use server';

import { requireOutletAccess } from '@/lib/auth/session';
import { THRESHOLDS } from '@/lib/config/thresholds';
import type { StockLogItemRow } from '@/lib/db/types';
import { isAiParseEnabled } from '@/lib/feature-gates';
import { checkRateLimit } from '@/lib/kv';
import { confirmDraft, parseAndStore } from '@/lib/services/StockService';
import { type ActionResult, fail, ok } from '@/types/action-result';
import type { ParsedStockPayload } from '@/types/domain';
import { revalidatePath } from 'next/cache';

export type ParseAndSaveStockInput = {
  rawInput: string;
  serviceDate: string;
};

export type ParseAndSaveStockData = {
  draftId: string;
  parsed: ParsedStockPayload;
};

export async function parseAndSaveStockDraft(
  input: ParseAndSaveStockInput,
): Promise<ActionResult<ParseAndSaveStockData>> {
  const ctx = await requireOutletAccess();

  if (!isAiParseEnabled()) {
    return fail('SERVICE_UNAVAILABLE', 'Fitur AI parsing lagi dimatikan sementara.');
  }

  const trimmed = input.rawInput?.trim() ?? '';
  if (trimmed.length === 0) {
    return fail('INPUT_INVALID', 'Isinya kosong nih.');
  }
  if (trimmed.length > THRESHOLDS.STOCK_NOTE_MAX_CHARS) {
    return fail('INPUT_INVALID', 'Kepanjangan. Ringkas sedikit.');
  }

  // BUG-01: validate serviceDate format before it reaches the DB date column
  const serviceDate = input.serviceDate?.trim() ?? '';
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(serviceDate) ||
    isNaN(new Date(serviceDate + 'T00:00:00Z').getTime())
  ) {
    return fail('INPUT_INVALID', 'Tanggal tidak valid.');
  }

  const quota = await checkRateLimit({
    scope: 'ai',
    identity: ctx.userId,
    limit: THRESHOLDS.RATE_LIMIT.AI_PER_USER_PER_DAY,
    windowSec: 24 * 60 * 60,
  });
  if (!quota.allowed) {
    return fail('QUOTA_EXCEEDED', 'Batas AI harian habis. Coba lagi besok ya.', {
      retryAfterSec: quota.retryAfterSec,
      resetAt: quota.resetAt,
      store: quota.store,
    });
  }

  const result = await parseAndStore(ctx.db, {
    outletId: ctx.outletId,
    rawInput: trimmed,
    serviceDate: input.serviceDate,
  });

  if (!result.ok) {
    return fail(serviceFailureToCode(result.reason), result.message);
  }
  return ok({ draftId: result.draft.id, parsed: result.parsed });
}

export type ConfirmStockInput = {
  draftId: string;
  items: StockLogItemRow[];
};

export type ConfirmStockData = {
  stockLogId: string;
};

export async function confirmStockLog(
  input: ConfirmStockInput,
): Promise<ActionResult<ConfirmStockData>> {
  const ctx = await requireOutletAccess();

  if (!input.draftId || !input.items || input.items.length === 0) {
    return fail('INPUT_INVALID', 'Catatan kosong.');
  }

  const result = await confirmDraft(ctx.db, {
    draftId: input.draftId,
    outletId: ctx.outletId,
    items: input.items,
  });

  if (!result.ok) {
    if (result.reason === 'NOT_FOUND') return fail('NOT_FOUND', result.message);
    if (result.reason === 'CONFLICT_STATE') return fail('CONFLICT_STATE', result.message);
    if (result.reason === 'SERVICE_UNAVAILABLE') return fail('SERVICE_UNAVAILABLE', result.message);
    return fail('INTERNAL', result.message);
  }

  revalidatePath('/dashboard');
  return ok({ stockLogId: result.log.id });
}

function serviceFailureToCode(reason: string) {
  switch (reason) {
    case 'INPUT_INVALID':
      return 'INPUT_INVALID' as const;
    case 'AI_PARSE_FAILED':
      return 'AI_PARSE_FAILED' as const;
    case 'AI_VALIDATION_FAILED':
      return 'AI_VALIDATION_FAILED' as const;
    case 'SERVICE_UNAVAILABLE':
      return 'SERVICE_UNAVAILABLE' as const;
    default:
      return 'INTERNAL' as const;
  }
}
