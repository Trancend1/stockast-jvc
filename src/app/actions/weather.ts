'use server';

import { requireOutletAccess } from '@/lib/auth/session';
import { getOutletProfile } from '@/lib/db/queries/outlets';
import { getWeatherForOutlet, type WeatherSnapshot } from '@/lib/weather';
import { type ActionResult, fail, ok } from '@/types/action-result';
import { tomorrowIsoUtc } from '@/lib/utils';

export type CuacaCardData = {
  weather: WeatherSnapshot;
};

export async function getCuacaCardData(input?: {
  serviceDate?: string;
}): Promise<ActionResult<CuacaCardData>> {
  const ctx = await requireOutletAccess();
  const serviceDate = input?.serviceDate ?? tomorrowIsoUtc();

  try {
    const outlet = await getOutletProfile(ctx.db, ctx.outletId);
    const weather = await getWeatherForOutlet({
      serviceDate,
      adm4Code: outlet?.adm4_code ?? null,
    });
    return ok({ weather });
  } catch (error) {
    return fail(
      'WEATHER_FETCH_FAILED',
      error instanceof Error ? error.message : 'Cuaca belum berhasil dimuat.',
    );
  }
}
