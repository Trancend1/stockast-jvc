/**
 * Day-1 gate: verify the Gemini model names pinned in `lib/config/thresholds.ts`
 * still exist on Google's API.
 *
 * Source: .docs/SYSTEM_ARCHITECTURE.md §2 (model name discipline) +
 *         FOUNDATION_BLUEPRINT.md §3 (Day-0 gate).
 *
 * Run: pnpm verify-gemini
 *
 * Exit code 0 = all good. Non-zero = pinned model missing → update thresholds.ts.
 *
 * The script writes the resolved list to .docs/models.json so the team has a
 * frozen record of what was available on Day 1.
 */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { THRESHOLDS } from '../src/lib/config/thresholds';

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error('❌ GEMINI_API_KEY is missing. Add it to .env.local.');
  process.exit(2);
}

type ModelEntry = {
  name: string;
  displayName?: string;
  supportedGenerationMethods?: string[];
};

type ListModelsResponse = {
  models?: ModelEntry[];
};

async function listModels(): Promise<ModelEntry[]> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Gemini list-models failed: ${res.status} ${res.statusText}`);
  }
  const json = (await res.json()) as ListModelsResponse;
  return json.models ?? [];
}

function stripPrefix(name: string): string {
  return name.startsWith('models/') ? name.slice('models/'.length) : name;
}

async function main() {
  console.error('→ Listing Gemini models from generativelanguage.googleapis.com …');
  const all = await listModels();
  const names = all.map((m) => stripPrefix(m.name));

  const pinned = Object.values(THRESHOLDS.AI_MODEL);
  const missing = pinned.filter((p) => !names.includes(p));

  const out = {
    fetchedAt: new Date().toISOString(),
    pinned: THRESHOLDS.AI_MODEL,
    available: names,
    candidates: all
      .filter((m) => (m.supportedGenerationMethods ?? []).includes('generateContent'))
      .map((m) => ({ name: stripPrefix(m.name), displayName: m.displayName })),
  };

  writeFileSync(resolve(process.cwd(), '.docs/models.json'), JSON.stringify(out, null, 2));

  if (missing.length > 0) {
    console.error('❌ Pinned models not found on Gemini API:');
    for (const m of missing) console.error('   - ' + m);
    console.error('Edit src/lib/config/thresholds.ts AI_MODEL to a valid model from .docs/models.json.');
    process.exit(1);
  }

  console.error('✅ All pinned models exist on the API. Recorded → .docs/models.json');
}

main().catch((err) => {
  console.error('❌ Verification failed:', err instanceof Error ? err.message : err);
  process.exit(3);
});
