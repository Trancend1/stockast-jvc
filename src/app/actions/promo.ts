'use server';

import { requireOutletAccess } from '@/lib/auth/session';
import { THRESHOLDS } from '@/lib/config/thresholds';
import { isPromoGenerationEnabled } from '@/lib/feature-gates';
import { checkRateLimit } from '@/lib/kv';
import {
  generatePromosForLatestStock,
  recordPromoCopied,
  type PromoSuggestion,
} from '@/lib/services/PromoService';
import { todayIsoWib } from '@/lib/utils';
import { fail, ok, type ActionResult } from '@/types/action-result';

export type GetPromosData = { promos: PromoSuggestion[] };

export async function getPromosForToday(input?: {
  warungName?: string;
  serviceDate?: string;
}): Promise<ActionResult<GetPromosData>> {
  const ctx = await requireOutletAccess();
  const serviceDate = input?.serviceDate ?? todayIsoWib();
  const warungName = input?.warungName ?? 'Warung';

  if (!isPromoGenerationEnabled()) {
    return ok({ promos: [] });
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

  const result = await generatePromosForLatestStock(ctx.db, {
    outletId: ctx.outletId,
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
  const ctx = await requireOutletAccess();
  try {
    await recordPromoCopied(ctx.db, promoId, ctx.outletId);
    return ok(null);
  } catch (err) {
    return fail('INTERNAL', err instanceof Error ? err.message : 'gagal');
  }
}
