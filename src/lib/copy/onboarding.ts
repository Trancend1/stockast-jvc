/**
 * Onboarding copy. Variant B (single-page scroll) per wireframe.
 * Target: < 60 detik dari buka app ke Dashboard.
 *
 * Location options moved to `src/lib/config/locations.ts` — they pair labels
 * with BMKG adm4 codes and belong in config, not copy.
 */
export const onboarding = {
  heading: 'Halo! Yuk kenalan dulu.',
  subheading: '3 pertanyaan aja, ±40 detik.',
  step_label: (current: number, total: number) => `Step ${current} dari ${total}`,
  fields: {
    warung_name: {
      title: 'Nama warung kamu apa?',
      description: 'Aku pakai nama ini untuk menyapa dan merapikan catatan stok harianmu.',
      label: 'Nama warung',
      placeholder: 'Contoh: Dinsum',
      help: 'Bisa nama asli warung atau nama panggilan yang biasa dipakai.',
    },
    location: {
      title: 'Warungmu ada di mana?',
      description:
        'Lokasi membantu Stockast membaca pola cuaca dan membuat saran belanja lebih relevan.',
      label: 'Kota / kecamatan',
      placeholder: 'Pilih kota',
      help: 'Pilih area terdekat dengan tempat jualanmu.',
    },
    menu: {
      title: 'Menu apa saja yang kamu jual?',
      description:
        'Tulis menu utama yang ingin kamu pantau. Pisahkan dengan koma agar mudah dibaca.',
      label: 'Daftar menu',
      placeholder: '',
      help: 'Mulai dari menu yang paling sering disiapkan setiap hari.',
    },
  },
  previous: 'Kembali',
  next: 'Lanjut',
  submit: 'Mulai catat stok',
  finishing: 'Lagi siapin warung kamu...',
  errors: {
    profile_failed: 'Gagal nyimpen data warung. Coba lagi ya.',
    menu_empty: 'Minimal 1 menu ya.',
  },
} as const;
