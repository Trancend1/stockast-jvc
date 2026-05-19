/**
 * Stock input + parse confirm copy.
 */
export const stock = {
  cancel: 'Batal',
  input: {
    heading: 'Catat hari ini',
    subheading: 'Tulis aja apa adanya. Aku bakal rapihin.',
    placeholder: 'lele sisa 5 dari 30, ayam habis jam 2, hujan sore',
    submit: 'Baca catatan',
    offline_submit: 'Simpan offline',
    parsing: 'Lagi baca catatan kamu...',
    char_limit_label: 'maks 2000 karakter',
  },
  parsing: {
    heading: 'Lagi baca catatan kamu',
    subheading: 'Sebentar ya, AI lagi nyusun ulang biar rapi.',
  },
  voice: {
    idle: '🎙 Pakai suara',
    listening: '🔴 Mendengarkan...',
    denied: '🚫 Mic ditolak',
  },
  offline: {
    queued_title: 'Tersimpan offline',
    queued_description:
      'Belum ada sinyal — catatannya udah aku simpan. Buka lagi nanti pas online buat dikirim.',
    queued_again: 'Catat lagi',
    banner_draft_available: 'Ada draft offline',
    banner_restore: 'Pulihkan draft',
    banner_discard: 'Hapus',
    offline_indicator: 'Mode offline',
  },
  confirm: {
    heading: 'Ini yang aku tangkap',
    subheading: 'Cek dulu ya. Kalau ada yang salah, tinggal benerin.',
    save: 'Ya, simpan',
    edit: 'Ubah',
    item: {
      sold_label: 'laku',
      leftover_label: 'sisa',
      unknown_unit: 'porsi',
      low_confidence: 'Aku kurang yakin',
      medium_confidence: 'Cek lagi',
      high_confidence: 'Aman',
    },
    weather: {
      hujan_deras: 'Hujan deras',
      mendung: 'Mendung',
      cerah_libur: 'Cerah / libur',
      unknown: 'Cuaca biasa',
    },
  },
  errors: {
    parse_failed:
      'Aku belum nangkep catatannya. Coba diketik ulang ya, contoh: "lele sisa 5 dari 30".',
    parse_timeout: 'Lama banget. Coba lagi sebentar.',
    save_failed: 'Belum kesimpan. Sinyal kamu gimana?',
    empty: 'Isinya kosong nih.',
    too_long: 'Kepanjangan. Ringkas sedikit.',
  },
} as const;
