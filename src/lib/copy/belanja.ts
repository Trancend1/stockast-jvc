export const belanja = {
  heading: 'Belanja besok',
  cached_badge: 'pakai data tersimpan',
  refresh: 'Hitung ulang',
  catat_cta: 'Catat hari ini',
  riwayat_cta: 'Lihat riwayat 7 hari',
  empty: {
    no_history: 'Catat stok dulu beberapa hari, baru rekomendasi muncul.',
    no_menu: 'Belum ada menu di warung ini.',
  },
  confidence: {
    'Pola jelas': 'Pola jelas',
    'Data baru, hati-hati': 'Data baru — hati-hati ya',
    'Tidak yakin': 'Belum yakin',
  },
  share: {
    copy: 'Salin ke WhatsApp',
    copied: 'Sudah disalin!',
  },
  weekday: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'] as const,
} as const;

export const promoCopy = {
  heading: 'Promo siap kirim',
  none: 'Stok pas, belum perlu promo.',
  badge_diskon: 'diskon',
  copy: 'Salin ke WhatsApp',
  copied: 'Sudah disalin!',
} as const;
