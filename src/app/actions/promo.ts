'use server';

import { getDemoContext } from '@/lib/auth/demo-context';
import {
  generatePromosForLatestStock,
  recordPromoCopied,
  type PromoSuggestion,
} from '@/lib/services/PromoService';
import { type ActionResult, fail, ok } from '@/types/action-result';

export type GetPromosData = { promos: PromoSuggestion[] };

export async function getPromosForToday(input?: {
  warungName?: string;
  serviceDate?: string;
}): Promise<ActionResult<GetPromosData>> {
  const { outletId } = getDemoContext();
  const serviceDate = input?.serviceDate ?? todayIsoLocal();
  const warungName = input?.warungName ?? 'Warung';

  const result = await generatePromosForLatestStock({
    outletId,
    warungName,
    serviceDate,
  });

  if (!result.ok) {
    if (result.reason === 'NO_OVERSTOCK') return fail('NOT_FOUND', result.message);
    return fail('INTERNAL', result.message);
  }
  return ok({ promos: result.promos });
}

export async function markPromoCopiedAction(promoId: string): Promise<ActionResult<null>> {
  if (!promoId) return fail('INPUT_INVALID', 'Promo ID kosong.');
  try {
    await recordPromoCopied(promoId);
    return ok(null);
  } catch (err) {
    return fail('INTERNAL', err instanceof Error ? err.message : 'gagal');
  }
}

function todayIsoLocal(): string {
  return new Date().toISOString().slice(0, 10);
}
