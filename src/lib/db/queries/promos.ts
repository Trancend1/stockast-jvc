import 'server-only';
import { adminDb } from '../admin';

export type PromoDraftRow = {
  id: string;
  outlet_id: string;
  service_date: string;
  message: string;
  discount_percent: number | null;
  status: 'draft' | 'copied' | 'dismissed';
  created_at: string;
};

export type InsertPromoDraftInput = {
  outletId: string;
  serviceDate: string;
  message: string;
  discountPercent: number;
};

export async function insertPromoDraft(input: InsertPromoDraftInput): Promise<PromoDraftRow> {
  const { data, error } = await adminDb()
    .from('promo_drafts')
    .insert({
      outlet_id: input.outletId,
      service_date: input.serviceDate,
      message: input.message,
      discount_percent: input.discountPercent,
      status: 'draft',
    })
    .select('id, outlet_id, service_date, message, discount_percent, status, created_at')
    .single();
  if (error || !data) {
    throw new Error(`insertPromoDraft failed: ${error?.message ?? 'no row'}`);
  }
  return data as PromoDraftRow;
}

export async function countPromosToday(
  outletId: string,
  serviceDate: string,
): Promise<number> {
  const { count, error } = await adminDb()
    .from('promo_drafts')
    .select('id', { count: 'exact', head: true })
    .eq('outlet_id', outletId)
    .eq('service_date', serviceDate);
  if (error) {
    throw new Error(`countPromosToday failed: ${error.message}`);
  }
  return count ?? 0;
}

export async function markPromoCopied(promoId: string): Promise<void> {
  const { error } = await adminDb()
    .from('promo_drafts')
    .update({ status: 'copied' })
    .eq('id', promoId);
  if (error) {
    throw new Error(`markPromoCopied failed: ${error.message}`);
  }
}
