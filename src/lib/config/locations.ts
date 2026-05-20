/**
 * Location options for onboarding. Pair of display label + BMKG adm4 kelurahan
 * code for Phase 2 weather fetch. Phase 1 uses mock weather, so adm4Code may
 * be null for cities we have not mapped yet.
 *
 * Keep this list narrow — it shows in a single <select>. Add cities only as
 * we onboard real merchants there.
 */

export type LocationOption = {
  readonly value: string;
  readonly label: string;
  readonly adm4Code: string | null;
};

export const LOCATION_OPTIONS: ReadonlyArray<LocationOption> = [
  { value: 'salatiga', label: 'Salatiga, Jawa Tengah', adm4Code: '33.73.01.1001' },
  { value: 'jakarta', label: 'Jakarta', adm4Code: null },
  { value: 'bandung', label: 'Bandung', adm4Code: null },
  { value: 'yogyakarta', label: 'Yogyakarta', adm4Code: null },
  { value: 'surabaya', label: 'Surabaya', adm4Code: null },
];

const BY_VALUE = new Map(LOCATION_OPTIONS.map((opt) => [opt.value, opt]));

export function findLocation(value: string): LocationOption | undefined {
  return BY_VALUE.get(value);
}
