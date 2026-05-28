/**
 * scripts/check-gemini.mjs
 * Test AI provider connectivity (Groq or Gemini).
 * Usage: node scripts/check-gemini.mjs
 */
import { readFileSync } from 'fs';

const raw = readFileSync('.env.local', 'utf8');
const env = Object.fromEntries(
  raw
    .split('\n')
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    }),
);

const groqKey = env.GROQ_API_KEY || '';
const geminiKey = env.GEMINI_API_KEY || '';

async function testProvider(name, baseUrl, apiKey, model) {
  console.log(`\nTesting ${name}...`);
  console.log(`  Key   : ${apiKey.slice(0, 12)}...`);
  console.log(`  Model : ${model}`);

  try {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: 'Kamu asisten warung.' },
          { role: 'user', content: 'Balas dengan satu kata: halo' },
        ],
        temperature: 0.1,
        max_tokens: 10,
        response_format: { type: 'text' },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      const is429 = res.status === 429;
      const isDaily = text.includes('PerDay') || text.includes('per_day') || text.includes('daily');
      console.log(
        `  Status: ${res.status} ${is429 ? '(QUOTA EXHAUSTED' + (isDaily ? ' - daily' : ' - per-minute') + ')' : ''}`,
      );
      if (!is429) console.log(`  Error : ${text.slice(0, 150)}`);
      return false;
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content?.trim();
    console.log(`  Status: OK ✓`);
    console.log(`  Reply : ${reply}`);
    return true;
  } catch (e) {
    console.log(`  Status: ERROR - ${e.message.slice(0, 100)}`);
    return false;
  }
}

let ok = false;

if (groqKey) {
  ok = await testProvider(
    'Groq (llama-3.3-70b)',
    'https://api.groq.com/openai/v1',
    groqKey,
    'llama-3.3-70b-versatile',
  );
} else {
  console.log('\nGroq: tidak dikonfigurasi (GROQ_API_KEY kosong)');
}

if (!ok && geminiKey) {
  ok = await testProvider(
    'Gemini (gemini-2.0-flash) via OpenAI-compat',
    'https://generativelanguage.googleapis.com/v1beta/openai',
    geminiKey,
    'gemini-2.0-flash',
  );
} else if (!groqKey && !geminiKey) {
  console.log('Gemini: tidak dikonfigurasi (GEMINI_API_KEY kosong)');
}

console.log(
  '\n' + (ok ? '✅ Provider aktif, siap dipakai.' : '❌ Tidak ada provider yang berfungsi.'),
);
if (!ok) {
  console.log('\nCara fix:');
  console.log('  1. Daftar Groq gratis di https://console.groq.com/keys');
  console.log('  2. Tambahkan GROQ_API_KEY=gsk_... ke .env.local');
  console.log('  3. Restart dev server: pnpm dev');
}
