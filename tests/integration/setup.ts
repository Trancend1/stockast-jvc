import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Load .env.local for integration tests that need real Supabase credentials.
// Does not override vars already set (CI-safe).
function loadEnvLocal() {
  try {
    const raw = readFileSync(resolve(process.cwd(), '.env.local'), 'utf8');
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq < 0) continue;
      const key = trimmed.slice(0, eq).trim();
      const val = trimmed
        .slice(eq + 1)
        .trim()
        .replace(/^["'](.*)["']$/, '$1');
      if (key && process.env[key] === undefined) {
        process.env[key] = val;
      }
    }
  } catch {
    // .env.local absent — rely on process.env already set (CI)
  }
}

loadEnvLocal();
