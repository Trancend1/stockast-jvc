import { THRESHOLDS } from '@/lib/config/thresholds';

/**
 * Pure helpers for onboarding payload normalization. No DB, no React, no
 * env reads — safe to unit test.
 */

const NORMALIZE_TRIM = /[\s\-_]+/g;
const NORMALIZE_PUNCT = /[^\p{L}\p{N}\s]+/gu;

export function parseMenuList(rawInput: string): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const token of rawInput.split(/[,;\n]/)) {
    const trimmed = token.trim().replace(/\s+/g, ' ');
    if (trimmed.length === 0) continue;
    if (trimmed.length > THRESHOLDS.MENU_NAME_MAX_CHARS) continue;

    const normalized = normalizeMenuName(trimmed);
    if (normalized.length === 0) continue;
    if (seen.has(normalized)) continue;
    seen.add(normalized);

    result.push(titleCase(trimmed));
    if (result.length >= THRESHOLDS.ONBOARDING.MENU_ITEMS_MAX) break;
  }

  return result;
}

export function normalizeMenuName(name: string): string {
  return name
    .toLocaleLowerCase('id-ID')
    .replace(NORMALIZE_PUNCT, ' ')
    .replace(NORMALIZE_TRIM, ' ')
    .trim();
}

function titleCase(input: string): string {
  return input
    .split(' ')
    .map((word) => (word.length === 0 ? word : word[0]!.toUpperCase() + word.slice(1).toLowerCase()))
    .join(' ');
}

export type OnboardingProfilePayload = {
  warungName: string;
  location: string;
  menu: string;
};

export type NormalizedProfile = {
  warungName: string;
  locationValue: string;
  menuItems: ReadonlyArray<{ name: string; normalizedName: string }>;
};

export function normalizeOnboardingProfile(
  input: OnboardingProfilePayload,
): NormalizedProfile | { error: 'INVALID_NAME' | 'INVALID_LOCATION' | 'NO_MENU' } {
  const warungName = input.warungName.trim();
  if (warungName.length === 0 || warungName.length > THRESHOLDS.ONBOARDING.WARUNG_NAME_MAX) {
    return { error: 'INVALID_NAME' };
  }

  const locationValue = input.location.trim();
  if (locationValue.length === 0) {
    return { error: 'INVALID_LOCATION' };
  }

  const parsed = parseMenuList(input.menu);
  if (parsed.length === 0) return { error: 'NO_MENU' };

  return {
    warungName,
    locationValue,
    menuItems: parsed.map((name) => ({ name, normalizedName: normalizeMenuName(name) })),
  };
}
