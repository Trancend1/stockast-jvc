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
  fields: {
    warung_name: {
      label: '1 · nama warung',
      placeholder: 'Warung kamu',
      help: 'biar aku bisa nyebut nama',
    },
    location: {
      label: '2 · kota / kecamatan',
      placeholder: 'pilih kota',
      help: 'buat dapet info cuaca nanti',
    },
    menu: {
      label: '3 · jualan apa aja?',
      placeholder: 'pecel lele, ayam goreng, tahu...',
      help: 'pisahkan pakai koma',
    },
  },
  submit: 'Mulai catat stok',
  finishing: 'Lagi siapin warung kamu...',
  errors: {
    profile_failed: 'Gagal nyimpen data warung. Coba lagi ya.',
    menu_empty: 'Minimal 1 menu ya.',
  },
} as const;
