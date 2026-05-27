'use server';

import { requireOutletAccess } from '@/lib/auth/session';
import { THRESHOLDS } from '@/lib/config/thresholds';
import { getOutletProfile } from '@/lib/db/queries/outlets';
import { checkRateLimit } from '@/lib/kv';
import {
  getTomorrowRecommendation,
  type BelanjaCardItem,
} from '@/lib/services/RecommendationService';
import { tomorrowIsoUtc } from '@/lib/utils';
import { getWeatherForOutlet } from '@/lib/weather';
import { fail, ok, type ActionResult } from '@/types/action-result';
import type { Recommendation } from '@/types/domain';
import { revalidatePath } from 'next/cache';

export type BelanjaCardData = {
  outletId: string;
  serviceDate: string;
  warungName: string | null;
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

  // Rate limit only applies when we might actually call the AI.
  // Cache hits return before any AI call, so we gate here only for
  // forceRefresh (always hits AI) or when we can't know yet (cold path).
  // The actual AI call inside getTomorrowRecommendation is guarded by the
  // cache check — if cached, no AI call happens and quota is not consumed.
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

  const outlet = await getOutletProfile(ctx.db, ctx.outletId);
  const weather = await getWeatherForOutlet({
    serviceDate,
    adm4Code: outlet?.adm4_code ?? null,
  });

  const result = await getTomorrowRecommendation(ctx.db, {
    outletId: ctx.outletId,
    serviceDate,
    weather: weather.category,
    forceRefresh: input?.forceRefresh ?? false,
  });

  if (!result.ok) {
    if (result.reason === 'NO_MENU' || result.reason === 'NO_HISTORY') {
      return fail('NOT_FOUND', result.message, { reason: result.reason });
    }
    return fail('INTERNAL', result.message);
  }

  if (input?.forceRefresh) revalidatePath('/dashboard');
  return ok({ ...result.data, warungName: outlet?.name ?? null });
}
