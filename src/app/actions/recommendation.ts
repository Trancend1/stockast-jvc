'use server';

import { revalidatePath } from 'next/cache';
import { getDemoContext } from '@/lib/auth/demo-context';
import {
  getTomorrowRecommendation,
  type BelanjaCardItem,
} from '@/lib/services/RecommendationService';
import { type ActionResult, fail, ok } from '@/types/action-result';
import { tomorrowIsoUtc } from '@/lib/utils';
import type { Recommendation } from '@/types/domain';

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
  const { outletId } = getDemoContext();
  const serviceDate = input?.serviceDate ?? tomorrowIsoUtc();

  const result = await getTomorrowRecommendation({
    outletId,
    serviceDate,
    forceRefresh: input?.forceRefresh ?? false,
  });

  if (!result.ok) {
    if (result.reason === 'NO_MENU' || result.reason === 'NO_HISTORY') {
      return fail('NOT_FOUND', result.message);
    }
    return fail('INTERNAL', result.message);
  }

  if (input?.forceRefresh) revalidatePath('/dashboard');
  return ok(result.data);
}
