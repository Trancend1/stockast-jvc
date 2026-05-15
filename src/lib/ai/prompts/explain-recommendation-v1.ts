/**
 * Prompt version: explain-recommendation@v1
 * Source: .docs/SYSTEM_ARCHITECTURE.md §4 (AI explains, rules decide).
 *
 * The rules engine has ALREADY decided the suggested numbers. This prompt only
 * writes warung-tetangga reasoning text — it MUST NOT change the numbers.
 */

export const EXPLAIN_RECOMMENDATION_PROMPT_VERSION = 'explain-recommendation@v1';

export const EXPLAIN_RECOMMENDATION_SYSTEM_INSTRUCTION = `Kamu adalah tetangga pedagang warung Indonesia. Tugas: jelaskan kenapa angka belanja besok ini masuk akal, dengan kalimat singkat dan hangat.

Aturan keras:
- JANGAN ubah angka apapun. Angka sudah final dari sistem.
- Pakai bahasa Indonesia kasual, seperti tetangga ngobrol — bukan formal, bukan teknis.
- Maks 1 kalimat per item, maks 12 kata.
- Sebut alasan kalau ada konteks (cuaca, hari, sisa kemarin). Kalau tidak ada konteks kuat, cukup bilang "sesuai pola minggu ini".
- Ringkasan keseluruhan: 1 kalimat, maks 18 kata.

Jangan tulis "Powered by AI", jangan tulis disclaimer, jangan emoji berlebihan.

Output: JSON sesuai schema.`;

export type ExplainItemContext = {
  itemName: string;
  base: number;
  suggested: number;
  weatherFactor: number;
  weekdayFactor: number;
  leftoverYesterday: number | null;
};

export type ExplainPromptContext = {
  weather: 'unknown' | 'hujan_deras' | 'mendung' | 'cerah_libur';
  weekdayLabel: string;
  items: ExplainItemContext[];
};

export function buildExplainUserMessage(ctx: ExplainPromptContext): string {
  const lines: string[] = [];
  lines.push(`Konteks besok: ${ctx.weekdayLabel}, cuaca ${weatherToText(ctx.weather)}.`);
  lines.push('');
  lines.push('Item rekomendasi (angka sudah final, jangan diubah):');
  for (const item of ctx.items) {
    const diff = item.suggested - item.base;
    const direction = diff > 0 ? '+' : diff < 0 ? '−' : '±';
    const leftover =
      item.leftoverYesterday !== null
        ? `, sisa kemarin ${item.leftoverYesterday}`
        : '';
    lines.push(
      `- ${item.itemName}: dari rata-rata ${round(item.base)} jadi ${item.suggested} (${direction}${Math.abs(diff)})${leftover}`,
    );
  }
  return lines.join('\n');
}

function weatherToText(w: ExplainPromptContext['weather']): string {
  switch (w) {
    case 'hujan_deras':
      return 'hujan deras';
    case 'mendung':
      return 'mendung';
    case 'cerah_libur':
      return 'cerah / libur';
    default:
      return 'biasa';
  }
}

function round(n: number): number {
  return Math.round(n);
}
