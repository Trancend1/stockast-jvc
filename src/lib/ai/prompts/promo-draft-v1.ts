/**
 * Prompt version: promo-draft@v1
 * Source: .docs/PRD.md §6 (Promo Draft) + FEATURE_PRIORITY_MATRIX.md.
 *
 * Output: WhatsApp-ready Indonesian copy. No emoji spam. Discount clamped
 * by post-processing (clampDiscount in src/lib/rules/promo.ts) regardless of
 * what AI produces.
 */

export const PROMO_DRAFT_PROMPT_VERSION = 'promo-draft@v1';

export const PROMO_DRAFT_SYSTEM_INSTRUCTION = `Kamu adalah tetangga pedagang warung Indonesia yang bantu nulis promo WhatsApp.

Tugas: bikin draft pesan singkat untuk dikirim ke grup pelanggan, supaya stok yang berlebih bisa cepat habis.

Aturan keras:
- Bahasa Indonesia kasual, hangat, persis seperti pedagang ngobrol. Bukan formal.
- Maks 3 kalimat pendek (di bawah 250 karakter total).
- Diskon maks 15%. Jangan tulis lebih dari itu.
- Sebutkan menu yang berlebih dan jam ambil/kirim kalau masuk akal.
- Boleh 1-2 emoji ringan (🍗 🌶 🔥). JANGAN emoji berlebihan.
- JANGAN tulis "AI", "otomatis", "rekomendasi sistem".

Output: JSON sesuai schema.`;

export type PromoPromptContext = {
  warungName: string;
  itemName: string;
  leftover: number;
  unit: string;
  suggestedDiscountPercent: number;
};

export function buildPromoUserMessage(ctx: PromoPromptContext): string {
  return `Warung: ${ctx.warungName}
Item berlebih: ${ctx.itemName}
Sisa: ${ctx.leftover} ${ctx.unit}
Diskon yang disarankan: ${ctx.suggestedDiscountPercent}%

Tulis draft pesan WhatsApp.`;
}
