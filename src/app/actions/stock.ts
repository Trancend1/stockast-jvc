'use server';

import { revalidatePath } from 'next/cache';
import { getDemoContext } from '@/lib/auth/demo-context';
import { confirmDraft, parseAndStore } from '@/lib/services/StockService';
import type { StockLogItemRow } from '@/lib/db/types';
import type { ParsedStockPayload } from '@/types/domain';
import { type ActionResult, fail, ok } from '@/types/action-result';
import { THRESHOLDS } from '@/lib/config/thresholds';

/**
 * Server Action surface for stock flow. Never throws to the client.
 * Each function maps service-level results to ActionResult<T>.
 *
 * Source: CLAUDE.md core rule #5.
 */

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
  const { outletId } = getDemoContext();

  const trimmed = input.rawInput?.trim() ?? '';
  if (trimmed.length === 0) {
    return fail('INPUT_INVALID', 'Isinya kosong nih.');
  }
  if (trimmed.length > THRESHOLDS.STOCK_NOTE_MAX_CHARS) {
    return fail('INPUT_INVALID', 'Kepanjangan. Ringkas sedikit.');
  }

  const result = await parseAndStore({
    outletId,
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
  const { outletId } = getDemoContext();

  if (!input.draftId || input.items.length === 0) {
    return fail('INPUT_INVALID', 'Catatan kosong.');
  }

  const result = await confirmDraft({
    draftId: input.draftId,
    outletId,
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
