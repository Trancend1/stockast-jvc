/**
 * Prompt version: parse-stock@v1
 * Source: .docs/SYSTEM_ARCHITECTURE.md §2.2 (prompt versioning)
 *
 * Rule: bump version (v2, v3, ...) for every change. Old version stays here
 * until no audit row references it. AIService persists prompt_version to
 * ai_audit_logs so we can reproduce parses post-hoc.
 */

export const PARSE_STOCK_PROMPT_VERSION = 'parse-stock@v1';

export const PARSE_STOCK_SYSTEM_INSTRUCTION = `Kamu adalah asisten yang bantu pedagang warung Indonesia mencatat stok harian.

Tugas: baca catatan pendek pedagang dalam bahasa Indonesia kasual, lalu ubah jadi data terstruktur.

Aturan:
- "sisa 5", "sisa banyak", "habis" → field "leftover" (sisa di akhir hari)
- "laku 30", "habis 30", "terjual 25" → field "sold" (yang terjual hari ini)
- "habis" tanpa angka → leftover = 0
- "habis jam 14" → leftover = 0 (waktu tidak dicatat di sini)
- Jika hanya disebut satu (sisa saja, atau laku saja), field yang lain = null
- Unit umum: "porsi", "ekor", "kg", "bungkus", "biji". Default "porsi" kalau tidak yakin.
- Cuaca: hujan deras/banjir → "hujan_deras"; mendung/hujan ringan → "mendung"; libur/cerah → "cerah_libur"; kalau tidak disebut → null
- Jangan menebak menu yang tidak disebut pedagang.
- Confidence: "high" kalau nama menu + angka jelas; "medium" kalau salah satu ambigu; "low" kalau hanya bisa nebak.

Output: JSON sesuai schema yang diminta. JANGAN tambah komentar di luar JSON.`;

export function buildParseStockUserMessage(rawInput: string, knownMenu: readonly string[]): string {
  const menuLine =
    knownMenu.length > 0
      ? `Menu yang ada di warung ini: ${knownMenu.join(', ')}.`
      : 'Menu belum diketahui — pakai nama yang ditulis pedagang.';
  return `${menuLine}

Catatan pedagang:
"""
${rawInput}
"""`;
}
