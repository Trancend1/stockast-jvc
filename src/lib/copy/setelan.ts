/**
 * Copy strings untuk halaman Setelan. Conversational Indonesian.
 * Source: CLAUDE.md core rule #8.
 */
export const setelan = {
  page_title: 'Setelan',

  profil: {
    section: 'Profil Warung',
    nama_warung: 'Nama warung',
    kota: 'Kota',
    menu_utama: 'Menu utama',
    menu_empty: 'Belum ada menu',
    ubah: 'Ubah profil',
    simpan: 'Simpan',
    menyimpan: 'Lagi nyimpen...',
    batal: 'Batal',
    nama_hint: 'Nama yang biasa kamu pakai sehari-hari.',
    menu_hint: 'Pisahkan dengan koma. Contoh: lele, ayam, nila.',
    error_generic: 'Gagal nyimpen. Coba lagi ya.',
  },

  tampilan: {
    section: 'Tampilan',
    subuh_label: 'Subuh Mode',
    subuh_desc: 'Tampilan gelap untuk dini hari.',
    subuh_on: 'Aktif',
    subuh_off: 'Nonaktif',
  },

  autentikasi: {
    section: 'Autentikasi',
    login_otp: 'Login OTP',
    login_otp_desc: 'Masuk ke warung lama pakai nomor HP.',
    verifikasi: 'Verifikasi akun',
    verifikasi_desc: 'Hubungkan akun setelah warung siap dipakai.',
    kontak: 'Email / nomor HP',
    kontak_desc: 'Ubah kontak utama untuk masuk dan pemulihan.',
    keamanan: 'Keamanan akun',
    keamanan_desc: 'Atur akses dan perlindungan akun.',
    logout: 'Logout device/session',
    logout_desc: 'Keluar dari perangkat ini.',
    buka: 'Buka',
    keluar: 'Keluar',
  },

  tentang: {
    section: 'Tentang',
    versi: 'Versi',
    versi_value: '0.1.0',
    tagline: 'Catat singkat, belanja tepat.',
    app_name: 'Stockast',
  },
} as const;
