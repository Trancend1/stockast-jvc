/**
 * Onboarding copy. Variant B (single-page scroll) per wireframe.
 * Target: < 60 detik dari buka app ke Dashboard.
 */
export const onboarding = {
  heading: 'Halo! Yuk kenalan dulu.',
  subheading: '3 pertanyaan aja, ±40 detik.',
  fields: {
    warung_name: {
      label: '1 · nama warung',
      placeholder: 'Warung Bu Yati',
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
} as const;

export const LOCATION_OPTIONS = [
  { value: 'salatiga', label: 'Salatiga, Jawa Tengah' },
  { value: 'jakarta', label: 'Jakarta' },
  { value: 'bandung', label: 'Bandung' },
  { value: 'yogyakarta', label: 'Yogyakarta' },
  { value: 'surabaya', label: 'Surabaya' },
] as const;
