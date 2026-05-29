export const ONBOARDING_STORAGE_KEY = 'stockast.onboarding.v1';

export type OnboardingState = {
  warungName: string;
  location: string;
  menu: string;
  completedAt: string;
};

export function readOnboardingState(): OnboardingState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as OnboardingState;
    // BUG-20: validate required fields — a partial/corrupt entry must not pass
    if (
      !parsed.completedAt ||
      typeof parsed.warungName !== 'string' ||
      parsed.warungName.trim().length === 0 ||
      typeof parsed.location !== 'string' ||
      parsed.location.trim().length === 0
    )
      return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeOnboardingState(state: OnboardingState): void {
  localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(state));
}

export function clearOnboardingState(): void {
  localStorage.removeItem(ONBOARDING_STORAGE_KEY);
}
