export const belanja = {
  heading: 'Belanja besok',
  cached_badge: 'pakai data tersimpan',
  refresh: 'Hitung ulang',
  catat_cta: 'Catat hari ini',
  riwayat_cta: 'Lihat riwayat 7 hari',
  loading: {
    title: 'Lagi nyiapin rekomendasi besok',
    description: 'Bentar ya, lagi baca catatan kamu seminggu terakhir.',
  },
  empty: {
    no_history_title: 'Belum ada data untuk besok',
    no_history: 'Catat stok 2-3 hari dulu. Setelah itu rekomendasi muncul otomatis.',
    no_menu_title: 'Belum ada menu di warung',
    no_menu: 'Tambah menu utama dulu lewat onboarding.',
  },
  error: {
    title: 'Ada yang kurang beres',
    fallback: 'Coba refresh halaman, atau cek koneksi internet kamu.',
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
