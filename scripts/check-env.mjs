/**
 * scripts/check-env.mjs
 * Validate .env.local against the app's Zod schema.
 * Usage: node scripts/check-env.mjs
 */
import { readFileSync } from 'fs';
import { z } from 'zod';

// Parse .env.local
const raw = readFileSync('.env.local', 'utf8');
const fileVars = {};
for (const line of raw.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const idx = trimmed.indexOf('=');
  if (idx === -1) continue;
  fileVars[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim();
}

// Use only file vars (not process.env) to simulate Next.js .env.local loading
const merged = { ...fileVars };

const optionalUrl = z
  .string()
  .optional()
  .transform((v) => (v === '' || v === undefined ? undefined : v))
  .pipe(z.string().url().optional());

const optionalString = z
  .string()
  .optional()
  .transform((v) => (v === '' || v === undefined ? undefined : v))
  .pipe(z.string().optional());

const EnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(20),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20),
  GEMINI_API_KEY: optionalString,
  GROQ_API_KEY: optionalString,
  KV_REST_API_URL: optionalUrl,
  KV_REST_API_TOKEN: optionalString,
  DEMO_USER_ID: optionalString.pipe(z.string().uuid().optional()),
  DEMO_OUTLET_ID: optionalString.pipe(z.string().uuid().optional()),
  FEATURE_AUTH_REQUIRED: z.enum(['true', 'false']).default('false'),
  FEATURE_MOCK_WEATHER: z.enum(['true', 'false']).default('true'),
  FEATURE_AI_PARSE_ENABLED: z.enum(['true', 'false']).default('true'),
  FEATURE_PROMO_GENERATION: z.enum(['true', 'false']).default('true'),
  FEATURE_DEMO_AUTOSEED: z.enum(['true', 'false']).default('false'),
  FEATURE_VOICE_INPUT: z.enum(['true', 'false']).default('false'),
  FEATURE_UI_KIT_PREVIEW: z.enum(['true', 'false']).default('false'),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

const result = EnvSchema.safeParse(merged);

if (result.success) {
  const d = result.data;
  console.log('✅ .env.local valid\n');
  console.log(
    '  GROQ_API_KEY  :',
    d.GROQ_API_KEY ? d.GROQ_API_KEY.slice(0, 12) + '...' : '(not set)',
  );
  console.log(
    '  GEMINI_API_KEY:',
    d.GEMINI_API_KEY ? d.GEMINI_API_KEY.slice(0, 12) + '...' : '(not set)',
  );
  if (!d.GROQ_API_KEY && !d.GEMINI_API_KEY) {
    console.log('\n⚠️  Tidak ada AI provider! Set GROQ_API_KEY atau GEMINI_API_KEY.');
  } else {
    const provider = d.GROQ_API_KEY ? 'Groq' : 'Gemini';
    console.log(`\n  Active provider: ${provider}`);
  }
} else {
  console.log('❌ Validation errors:\n');
  const errors = result.error.flatten().fieldErrors;
  for (const [field, msgs] of Object.entries(errors)) {
    const val = merged[field];
    const display = val !== undefined ? `"${String(val).slice(0, 40)}"` : '(missing)';
    console.log(`  ${field}: ${msgs.join(', ')}`);
    console.log(`    value: ${display}`);
  }
}
