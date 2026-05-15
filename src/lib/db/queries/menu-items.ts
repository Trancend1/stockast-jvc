import 'server-only';
import { adminDb } from '../admin';
import type { MenuItemRow } from '../types';

/**
 * Read menu items for an outlet. Excludes soft-deleted rows.
 */
export async function listMenuItems(outletId: string): Promise<MenuItemRow[]> {
  const { data, error } = await adminDb()
    .from('menu_items')
    .select('id, outlet_id, name, normalized_name, unit, deleted_at')
    .eq('outlet_id', outletId)
    .is('deleted_at', null)
    .order('name', { ascending: true });

  if (error) {
    throw new Error(`listMenuItems failed: ${error.message}`);
  }
  return (data ?? []) as MenuItemRow[];
}
