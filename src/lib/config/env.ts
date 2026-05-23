import { z } from 'zod';

/**
 * Single source of truth for environment configuration.
 * Parses and validates `process.env` once at boot.
 * Failing fast here is preferable to runtime null-checks scattered everywhere.
 *
 * Source: .docs/FOUNDATION_BLUEPRINT.md §7.3
 */

// Treat empty strings in .env.local as "not set" for optional URL fields.
const optionalUrl = z
  .string()
  .optional()
  .transform((v) => (v === '' || v === undefined ? undefined : v))
  .pipe(z.string().url().optional());

const optionalString = z
  .string()
  .optional()
  .transform((v) => (v === '' || v === undefined ? undefined : v));

const EnvSchema = z.object({
  // Public — safe in client bundle
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(20),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),

  // Server-only
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20),
  GEMINI_API_KEY: z.string().min(10),

  KV_REST_API_URL: optionalUrl,
  KV_REST_API_TOKEN: optionalString,

  // Phase 1 demo only
  DEMO_USER_ID: optionalString.pipe(z.string().uuid().optional()),
  DEMO_OUTLET_ID: optionalString.pipe(z.string().uuid().optional()),

  // Feature flags
  FEATURE_AUTH_REQUIRED: z.enum(['true', 'false']).default('false'),
  FEATURE_MOCK_WEATHER: z.enum(['true', 'false']).default('true'),
  FEATURE_AI_PARSE_ENABLED: z.enum(['true', 'false']).default('true'),
  FEATURE_PROMO_GENERATION: z.enum(['true', 'false']).default('true'),
  FEATURE_DEMO_AUTOSEED: z.enum(['true', 'false']).default('false'),
  FEATURE_VOICE_INPUT: z.enum(['true', 'false']).default('false'),
  FEATURE_UI_KIT_PREVIEW: z.enum(['true', 'false']).default('false'),

  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment configuration:');
  console.error(parsed.error.flatten().fieldErrors);
  throw new Error('Environment validation failed. Check .env.local against .env.example.');
}

export const env = parsed.data;

export const flags = {
  authRequired: env.FEATURE_AUTH_REQUIRED === 'true',
  mockWeather: env.FEATURE_MOCK_WEATHER === 'true',
  aiParseEnabled: env.FEATURE_AI_PARSE_ENABLED === 'true',
  promoGeneration: env.FEATURE_PROMO_GENERATION === 'true',
  demoAutoseed: env.FEATURE_DEMO_AUTOSEED === 'true',
  voiceInput: env.FEATURE_VOICE_INPUT === 'true',
  uiKitPreview: env.FEATURE_UI_KIT_PREVIEW === 'true',
} as const;
