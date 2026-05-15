import 'server-only';
import { adminDb } from '../admin';
import type { Json } from '../types';

export type RecommendationRow = {
  id: string;
  outlet_id: string;
  service_date: string;
  items: Json;
  reasoning: string;
  confidence_label: 'Pola jelas' | 'Data baru, hati-hati' | 'Tidak yakin';
  audit: Json;
  created_at: string;
};

export type UpsertRecommendationInput = {
  outletId: string;
  serviceDate: string;
  items: Json;
  reasoning: string;
  confidenceLabel: 'Pola jelas' | 'Data baru, hati-hati' | 'Tidak yakin';
  audit: Json;
};

export async function upsertRecommendation(
  input: UpsertRecommendationInput,
): Promise<RecommendationRow> {
  const { data, error } = await adminDb()
    .from('recommendations')
    .upsert(
      {
        outlet_id: input.outletId,
        service_date: input.serviceDate,
        items: input.items,
        reasoning: input.reasoning,
        confidence_label: input.confidenceLabel,
        audit: input.audit,
      },
      { onConflict: 'outlet_id,service_date' },
    )
    .select('id, outlet_id, service_date, items, reasoning, confidence_label, audit, created_at')
    .single();

  if (error || !data) {
    throw new Error(`upsertRecommendation failed: ${error?.message ?? 'no row returned'}`);
  }
  return data as RecommendationRow;
}

export async function findRecommendation(
  outletId: string,
  serviceDate: string,
): Promise<RecommendationRow | null> {
  const { data, error } = await adminDb()
    .from('recommendations')
    .select('id, outlet_id, service_date, items, reasoning, confidence_label, audit, created_at')
    .eq('outlet_id', outletId)
    .eq('service_date', serviceDate)
    .maybeSingle();

  if (error) {
    throw new Error(`findRecommendation failed: ${error.message}`);
  }
  return (data ?? null) as RecommendationRow | null;
}
