import { isSubuhTime } from '@/lib/subuh';

export const SUBUH_CLASS_NAME = 'subuh-mode';
export const SUBUH_DATA_ATTR = 'data-subuh';
export const SUBUH_STORAGE_KEY = 'stockast.subuh.override';
export const SUBUH_START_MINUTES = 2 * 60;
export const SUBUH_END_MINUTES = 5 * 60 + 30;

export type SubuhOverride = 'on' | 'off' | null;

export function resolveSubuhMode(override: SubuhOverride, now: Date): boolean {
  if (override === 'on') return true;
  if (override === 'off') return false;
  return isSubuhTime(now);
}
