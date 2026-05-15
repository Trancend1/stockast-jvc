import { flags as envFlags } from './env';

/**
 * Runtime feature flags. Env-driven during Phase 1-2; promote to a flag service
 * only if Phase 3 demand emerges (see FUTURE_ROADMAP.md).
 */
export const featureFlags = envFlags;

export type FeatureFlag = keyof typeof featureFlags;

export function isEnabled(flag: FeatureFlag): boolean {
  return featureFlags[flag] === true;
}
