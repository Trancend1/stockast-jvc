/**
 * Shared Indonesian copy. Conversational, never formal/translated.
 * Source: CLAUDE.md core rule #8.
 *
 * NEVER inline these strings in components. Add new strings here.
 */
export const common = {
  brand: 'Stockast',
  tagline: 'Catat singkat, belanja tepat.',
  cta: {
    lanjut: 'Lanjut',
    simpan: 'Simpan',
    batal: 'Batal',
    ubah: 'Ubah',
    coba_lagi: 'Coba lagi',
    salin_wa: 'Salin ke WhatsApp',
  },
  state: {
    loading: 'Sebentar ya...',
    saving: 'Lagi nyimpen...',
    saved: 'Tersimpan',
    error_generic: 'Ada yang nggak beres. Coba sebentar lagi ya.',
  },
} as const;
