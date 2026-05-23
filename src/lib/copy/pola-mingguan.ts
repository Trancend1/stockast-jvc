export const polaMingguan = {
  action: 'Pola Mingguan',
  heading: 'Pola minggu ini',
  page_title: 'Pola Mingguan',
  subheading: 'Penjualan rata-rata per hari, 7 hari terakhir.',
  empty: 'Catat 3 hari dulu, pola bakal muncul di sini.',
  insight_up: (item: string, weekday: string, pct: number) =>
    `Tiap ${weekday}, ${item} biasanya +${pct}% di atas rata-rata.`,
  insight_down: (item: string, weekday: string, pct: number) =>
    `Tiap ${weekday}, ${item} biasanya −${pct}% di bawah rata-rata.`,
  bar_label_no_data: '—',
} as const;
