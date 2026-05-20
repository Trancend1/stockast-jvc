/**
 * All magic numbers in the product live here, nowhere else.
 * Source: .docs/SYSTEM_ARCHITECTURE.md §4 (recommendation formula) +
 *         .docs/EXECUTION_BLUEPRINT.md §9 (cost ceiling) +
 *         .docs/FEATURE_PRIORITY_MATRIX.md (promo caps).
 *
 * Editing a constant here = a deliberate product decision worth a commit.
 */
export const THRESHOLDS = {
  // Recommendation rule engine
  WEATHER_FACTOR: {
    unknown: 1.0,
    hujan_deras: 0.85,
    mendung: 0.95,
    cerah_libur: 1.05,
  },
  WEEKDAY_FACTOR_MIN: 0.85,
  WEEKDAY_FACTOR_MAX: 1.15,
  GUARDRAIL_MIN: 0.8,
  GUARDRAIL_MAX: 1.2,

  // Confidence labeling
  COLD_START_DAYS: 3,
  PATTERN_CLEAR_STDDEV_RATIO: 0.3,
  HISTORY_WINDOW_DAYS: 7,
  OUTLIER_SIGMA: 2,

  // AI model selection — verify Day 1 via scripts/verify-gemini-model.ts
  AI_MODEL: {
    PARSE: 'gemini-2.0-flash',
    EXPLAIN: 'gemini-2.0-flash',
    BULK: 'gemini-2.0-flash-lite',
  },
  AI_TIMEOUT_MS: 5_000,
  AI_MAX_RETRIES: 2,
  AI_CACHE_TTL_SEC: 3_600,

  // Promo guardrails
  PROMO_DISCOUNT_CAP_PERCENT: 15,
  PROMO_FREQUENCY_PER_DAY: 1,

  // Rate limits (see SYSTEM_ARCHITECTURE.md §15)
  RATE_LIMIT: {
    AI_PER_USER_PER_DAY: 30,
    OTP_PER_PHONE_PER_15MIN: 3,
    REQ_PER_IP_PER_MIN: 100,
  },

  // Cost ceilings — see PRD §9.3, EXECUTION_BLUEPRINT §10
  COST_CEILING_IDR_PER_USER_MONTH: 5_000,
  COST_TARGET_IDR_PER_USER_MONTH: 1_500,

  // Idempotency
  IDEMPOTENCY_TTL_HOURS: 24,

  // Input limits
  STOCK_NOTE_MAX_CHARS: 2_000,
  MENU_NAME_MAX_CHARS: 60,

  // Onboarding form
  ONBOARDING: {
    WARUNG_NAME_MAX: 80,
    MENU_LIST_MAX_CHARS: 200,
    MENU_ITEMS_MAX: 20,
    MENU_TEXTAREA_ROWS: 3,
  },
} as const;

export type WeatherCategory = keyof typeof THRESHOLDS.WEATHER_FACTOR;
