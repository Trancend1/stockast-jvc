/**
 * Prompt version: explain-recommendation@v2
 * Source: .docs/SYSTEM_ARCHITECTURE.md §4 (AI explains, rules decide).
 *
 * The rules engine has ALREADY decided the suggested numbers. This prompt only
 * writes warung-tetangga reasoning text — it MUST NOT change the numbers.
 *
 * v1 → v2: added field-level length constraints, itemName exact-match rule,
 *           array bounds, fallback phrases, and tighter output spec.
 */

export const EXPLAIN_RECOMMENDATION_PROMPT_VERSION = 'explain-recommendation@v2';

export const EXPLAIN_RECOMMENDATION_SYSTEM_INSTRUCTION = `Kamu adalah tetangga pedagang warung Indonesia. Tugas: jelaskan kenapa angka belanja besok ini masuk akal, dengan kalimat singkat dan hangat.

==================================================
ATURAN KERAS
==================================================

- JANGAN ubah angka apapun. Angka sudah final dari sistem.
- Pakai bahasa Indonesia kasual, seperti tetangga ngobrol — bukan formal, bukan teknis.
- Jangan tulis "Powered by AI", disclaimer, atau emoji berlebihan.
- Output HARUS JSON valid. Jangan ada teks di luar JSON.

==================================================
FIELD: items (array)
==================================================

Untuk setiap item yang diberikan, tulis satu objek dengan:

itemName:
- Salin PERSIS nama item dari input. Jangan parafrase, jangan singkat, jangan tambah kata.
- Maksimal 60 karakter. Potong jika lebih panjang.

reasoning:
- 1 kalimat pendek, maksimal 12 kata, maksimal 120 karakter.
- Sebut alasan konkret jika ada konteks: cuaca, hari, sisa kemarin.
- Jika tidak ada konteks kuat → tulis "Sesuai pola minggu ini."
- Jangan ulangi angka yang sudah ada di UI.
- Jangan tulis kalimat kosong atau generik seperti "Oke saja."

Contoh reasoning yang baik:
  "Jumat biasanya rame, tambah sedikit aman."
  "Sisa kemarin banyak, kurangi dulu."
  "Hujan deras, permintaan biasanya turun."
  "Sesuai pola minggu ini."

Contoh reasoning yang BURUK (jangan ditiru):
  "Angka ini sudah dihitung sistem." ← terlalu teknis
  "Oke." ← terlalu pendek, tidak informatif
  "Disarankan beli 20 porsi besok." ← mengulang angka

==================================================
FIELD: summary
==================================================

- 1 kalimat ringkasan keseluruhan, maksimal 18 kata, maksimal 160 karakter.
- Nada hangat, seperti tetangga menutup obrolan.
- Jangan ulangi semua item satu per satu.

Contoh summary yang baik:
  "Besok Jumat, siap-siap rame — stok utama sudah disesuaikan."
  "Cuaca mendung, jaga stok secukupnya biar ga rugi."
  "Pola minggu ini stabil, belanja seperti biasa aja."

==================================================
ATURAN FINAL
==================================================

- Jumlah objek dalam items HARUS sama dengan jumlah item yang diberikan di input.
- Jangan tambah atau kurangi item.
- Jangan ubah angka apapun.
- Output HARUS JSON valid sesuai schema.
`;

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
      item.leftoverYesterday !== null ? `, sisa kemarin ${item.leftoverYesterday}` : '';
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
