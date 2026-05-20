import 'server-only';
import { adminDb } from '../admin';
import { isMissingTableError, throwIfMissingTable } from '../errors';
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
    if (isMissingTableError(error, 'menu_items')) return [];
    throw new Error(`listMenuItems failed: ${error.message}`);
  }
  return (data ?? []) as MenuItemRow[];
}

export type MenuItemSpec = {
  name: string;
  normalizedName: string;
  unit?: string;
};

/**
 * Sync the outlet's menu to exactly the supplied list:
 *   1. Soft-delete rows whose normalized_name is no longer present.
 *   2. Upsert each supplied item — restoring deleted_at=null on re-add.
 *
 * Uses unique (outlet_id, normalized_name) so re-onboarding is idempotent.
 */
export async function syncOutletMenu(
  outletId: string,
  items: ReadonlyArray<MenuItemSpec>,
): Promise<MenuItemRow[]> {
  if (items.length === 0) {
    throw new Error('syncOutletMenu requires at least one menu item');
  }

  const normalizedKeep = items.map((it) => it.normalizedName);
  const now = new Date().toISOString();

  const softDelete = await adminDb()
    .from('menu_items')
    .update({ deleted_at: now, updated_at: now })
    .eq('outlet_id', outletId)
    .is('deleted_at', null)
    .not('normalized_name', 'in', `(${normalizedKeep.map((n) => `"${escapeForIn(n)}"`).join(',')})`);

  if (softDelete.error) {
    throwIfMissingTable(softDelete.error, 'menu_items');
    throw new Error(`syncOutletMenu soft-delete failed: ${softDelete.error.message}`);
  }

  const upsertRows = items.map((it) => ({
    outlet_id: outletId,
    name: it.name,
    normalized_name: it.normalizedName,
    unit: it.unit ?? 'porsi',
    deleted_at: null,
    updated_at: now,
  }));

  const { data, error } = await adminDb()
    .from('menu_items')
    .upsert(upsertRows, { onConflict: 'outlet_id,normalized_name' })
    .select('id, outlet_id, name, normalized_name, unit, deleted_at');

  if (error || !data) {
    throwIfMissingTable(error, 'menu_items');
    throw new Error(`syncOutletMenu upsert failed: ${error?.message ?? 'no rows returned'}`);
  }

  return data as MenuItemRow[];
}

function escapeForIn(value: string): string {
  return value.replace(/"/g, '\\"');
}
