'use server';

import { revalidatePath } from 'next/cache';
import { requireOutletAccess } from '@/lib/auth/session';
import {
  getTomorrowRecommendation,
  type BelanjaCardItem,
} from '@/lib/services/RecommendationService';
import { type ActionResult, fail, ok } from '@/types/action-result';
import { tomorrowIsoUtc } from '@/lib/utils';
import type { Recommendation } from '@/types/domain';
import { THRESHOLDS } from '@/lib/config/thresholds';
import { checkRateLimit } from '@/lib/kv';

export type BelanjaCardData = {
  outletId: string;
  serviceDate: string;
  items: BelanjaCardItem[];
  summary: string;
  confidenceLabel: Recommendation['confidenceLabel'];
  cached: boolean;
};

export async function getBelanjaCard(input?: {
  serviceDate?: string;
  forceRefresh?: boolean;
}): Promise<ActionResult<BelanjaCardData>> {
  const ctx = await requireOutletAccess();
  const serviceDate = input?.serviceDate ?? tomorrowIsoUtc();

  if (input?.forceRefresh) {
    const quota = await checkRateLimit({
      scope: 'ai',
      identity: ctx.userId,
      limit: THRESHOLDS.RATE_LIMIT.AI_PER_USER_PER_DAY,
      windowSec: 24 * 60 * 60,
    });
    if (!quota.allowed) {
      return fail('QUOTA_EXCEEDED', 'Batas refresh AI harian habis. Coba lagi besok ya.', {
        retryAfterSec: quota.retryAfterSec,
        resetAt: quota.resetAt,
        store: quota.store,
      });
    }
  }

  const result = await getTomorrowRecommendation(ctx.db, {
    outletId: ctx.outletId,
    serviceDate,
    forceRefresh: input?.forceRefresh ?? false,
  });

  if (!result.ok) {
    if (result.reason === 'NO_MENU' || result.reason === 'NO_HISTORY') {
      return fail('NOT_FOUND', result.message, { reason: result.reason });
    }
    return fail('INTERNAL', result.message);
  }

  if (input?.forceRefresh) revalidatePath('/dashboard');
  return ok(result.data);
}
