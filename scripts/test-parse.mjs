/**
 * scripts/test-parse.mjs
 * End-to-end test: parse stock note via Groq, validate with Zod schema.
 */
import { readFileSync } from 'fs';
import { z } from 'zod';

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

const GROQ_KEY = env.GROQ_API_KEY;
const MODEL = 'llama-3.3-70b-versatile';

const SYSTEM = `Kamu adalah asisten AI yang membantu pedagang warung Indonesia mencatat stok dan penjualan harian dari catatan singkat, bahasa santai, typo ringan, singkatan, atau percakapan kasual.

Tugas: Baca input pedagang lalu ubah menjadi data terstruktur JSON.

ATURAN:
- sold dan leftover HARUS integer atau null. JANGAN isi dengan string/kata.
- "habis" tanpa angka → leftover = 0
- "sisa banyak" / "masih banyak" / "sisa sedikit" → leftover = null
- "lumayan laku" / "laris" → sold = null
- Setiap nama menu = satu item dalam array items.
- Output HARUS JSON valid. Jangan ada teks di luar JSON.

Schema yang diharapkan:
{
  "items": [
    {
      "candidateName": "string (maks 60 karakter)",
      "sold": "integer atau null",
      "leftover": "integer atau null",
      "unit": "string atau null",
      "confidence": "high | medium | low"
    }
  ],
  "weatherMention": "hujan_deras | mendung | cerah_libur | unknown | null",
  "notes": "string atau null"
}`;

const INPUT = `Siomay ayam habis jam 2, hakau udang sisa 3, pao ayam masih banyak, pangsit goreng habis duluan, ceker pedas sisa sedikit, lumpia goreng sisa 5, batagor lumayan laku malam ini.`;

const ParsedStockItemSchema = z.object({
  candidateName: z.string().min(1).max(60),
  sold: z.number().int().min(0).max(10_000).nullable(),
  leftover: z.number().int().min(0).max(10_000).nullable(),
  unit: z.string().min(1).max(20).nullable(),
  confidence: z.enum(['high', 'medium', 'low']),
});

const ParsedStockPayloadSchema = z.object({
  items: z.array(ParsedStockItemSchema).min(1).max(20),
  weatherMention: z.enum(['unknown', 'hujan_deras', 'mendung', 'cerah_libur']).nullable(),
  notes: z.string().max(500).nullable(),
});

console.log('Input:', INPUT);
console.log('\nParsing...\n');

const start = Date.now();
const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${GROQ_KEY}`,
  },
  body: JSON.stringify({
    model: MODEL,
    messages: [
      { role: 'system', content: SYSTEM },
      {
        role: 'user',
        content: `Menu belum diketahui — pakai nama yang ditulis pedagang.\n\nCatatan pedagang:\n"""\n${INPUT}\n"""`,
      },
    ],
    temperature: 0.2,
    response_format: { type: 'json_object' },
  }),
});

const ms = Date.now() - start;

if (!res.ok) {
  console.error('ERROR:', res.status, await res.text());
  process.exit(1);
}

const data = await res.json();
const text = data.choices?.[0]?.message?.content || '';

let json;
try {
  json = JSON.parse(text);
} catch {
  console.error('JSON parse failed:', text);
  process.exit(1);
}

const validated = ParsedStockPayloadSchema.safeParse(json);
if (!validated.success) {
  console.error('Zod validation failed:', JSON.stringify(validated.error.flatten(), null, 2));
  console.error('Raw JSON:', JSON.stringify(json, null, 2));
  process.exit(1);
}

console.log(`✅ Parse OK (${ms}ms, ${validated.data.items.length} items)\n`);
for (const it of validated.data.items) {
  const sold = it.sold !== null ? `sold=${it.sold}` : 'sold=null';
  const left = it.leftover !== null ? `leftover=${it.leftover}` : 'leftover=null';
  console.log(
    `  ${it.candidateName.padEnd(22)} ${sold.padEnd(12)} ${left.padEnd(14)} conf=${it.confidence}`,
  );
}
console.log(`\nWeather: ${validated.data.weatherMention ?? 'null'}`);
console.log(`Notes  : ${validated.data.notes ?? 'null'}`);
