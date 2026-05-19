import 'server-only';
import { adminDb } from '../admin';
import { throwIfMissingTable } from '../errors';
import type { OutletRow } from '../types';

export type UpdateOutletProfileInput = {
  outletId: string;
  name: string;
  locationLabel: string;
  adm4Code: string | null;
};

export async function updateOutletProfile(
  input: UpdateOutletProfileInput,
): Promise<OutletRow> {
  const { data, error } = await adminDb()
    .from('outlets')
    .update({
      name: input.name,
      location_label: input.locationLabel,
      adm4_code: input.adm4Code,
      updated_at: new Date().toISOString(),
    })
    .eq('id', input.outletId)
    .select('id, organization_id, name, location_label, adm4_code')
    .single();

  if (error || !data) {
    throwIfMissingTable(error, 'outlets');
    throw new Error(`updateOutletProfile failed: ${error?.message ?? 'no row returned'}`);
  }
  return data as OutletRow;
}
