# PRD v2 — Stockast

**Date:** 14 Mei 2026
**Status:** Execution-ready for #JuaraVibeCoding MVP + Private Beta foundation
**Owner:** Product Lead

---

## 1. Product Vision

Stockast adalah **asisten keputusan belanja harian** untuk pedagang makanan kecil Indonesia — produk yang mengubah cara informal mereka mencatat stok menjadi keputusan yang lebih percaya diri tanpa mengubah cara mereka bekerja.

Visi 3 tahun: menjadi **standar de facto** untuk pedagang kecil Indonesia yang ingin tahu *"besok belanja berapa?"* — sebagaimana Google Maps adalah standar untuk "jalan mana ke sana?"

Bukan POS. Bukan ERP. Bukan dashboard analytics. **Decision support, 30 detik per hari.**

---

## 2. Target Users

### 2.1 Primary Persona — "Bu Yati"

**Profile:**
- Pemilik warung pecel lele / warteg / gorengan / kaki lima
- Umur 35-55
- Pendidikan SMP-SMA
- Smartphone Android mid-low (Rp 1-3 juta), kuota harian terbatas
- WhatsApp adalah aplikasi utama
- Tidak menggunakan POS, mencatat di kertas/kepala
- Belanja bahan jam 03.00-06.00 di pasar tradisional

**Goals:**
- Belanja secukupnya, tidak buang stok
- Tidak kehilangan penjualan karena kehabisan
- Modal tidak nyangkut di stok mati

**Frustrations:**
- "Kemarin lele sisa banyak, harus diskon"
- "Hari ini ayam habis jam 14.00, kehilangan jam ramai"
- "Pasar dingin sebentar, sudah harus pulang"

**Tech behavior:**
- Buka WhatsApp 50+ kali sehari
- Buka aplikasi non-chat 2-3 kali
- Tidak pernah onboarding > 2 menit
- Tidak baca tutorial

### 2.2 Secondary Persona — "Mas Adit"

**Profile:**
- Pemilik UMKM kuliner yang sudah 1-2 cabang
- Umur 25-40
- Lebih melek teknologi, kadang sudah pakai POS sederhana
- Punya 1-3 karyawan

**Goals:**
- Visibility stok lintas cabang
- Delegasi tanpa kehilangan kontrol
- Data untuk decision yang lebih besar

**Note:** Secondary persona **tidak boleh** mengganggu UX primary persona. Multi-outlet adalah feature lanjutan, bukan default UI.

### 2.3 Non-Users (Anti-Persona)

Stockast **bukan** untuk:
- Restoran berkursi/full-service dengan POS
- Cloud kitchen scale operations
- Catering B2B
- F&B chain dengan inventory management dedicated

Saying no to these prevents feature creep.

---

## 3. Problem Statement

> Pedagang makanan kecil membuat **keputusan finansial penting setiap hari** (berapa belanja besok) dengan **data yang ada di kepala**. Saat tebakan salah, mereka kehilangan margin tipis — entah lewat waste atau lost sales. Tidak ada tools untuk mereka karena POS terlalu rumit, spreadsheet terlalu manual, dan AI assistant generik tidak paham konteks warung Indonesia.

### Validasi Problem (status: BELUM DIEKSEKUSI — blocker Phase 0)
- [ ] Wawancara 5 pedagang nyata sebelum Sprint A (Phase 1 Hari 4)
- [ ] Observasi 1 sesi belanja subuh
- [ ] Validasi: "berapa rupiah loss per minggu karena overstock/stockout?"

**Gating rule:** Sprint A tidak dimulai sampai minimal 2 interview selesai DAN pain point divalidasi. Jika dari 5 pedagang tidak ada yang menyebut ini sebagai top-3 pain point, pivot pertanyaan riset. Jangan build dulu.

**Fallback jika akses pedagang lambat:** Tetap mulai build skeleton (Next.js + Supabase setup, tidak ada keputusan produk) sambil paralel outreach. Tapi keputusan UX/copy/feature scope di-hold sampai minimal 2 interview done.

---

## 4. Product Positioning

### Positioning Statement
> Untuk **pedagang makanan kecil Indonesia** yang **bingung tiap hari berapa harus belanja**, Stockast adalah **asisten belanja harian berbasis AI** yang **mengubah catatan pendek jadi rekomendasi belanja besok yang masuk akal**. Tidak seperti **POS, spreadsheet, atau aplikasi inventory besar**, Stockast **bicara seperti tetangga, bukan seperti software**.

### Tagline (Indonesian, draft options)
1. **"Belanja besok, sudah ketebak."**
2. **"Tahu stok sebelum subuh."**
3. **"Catat singkat, belanja tepat."**

→ Final pick after user testing. Prefer #3 (paling actionable).

### Why Now
- Gemini Flash murah → biaya AI per pedagang sustainable
- Smartphone Android murah penetrasi tinggi di pasar tradisional
- BMKG data publik gratis
- WhatsApp Business sudah jadi norm

---

## 5. Core Value Proposition

| User says | Stockast delivers |
|---|---|
| "Kemarin lele sisa banyak" | "Belanja besok 25 ekor aja, kemarin sisa 5 dari 30" |
| "Hujan sore besok" | "Cuaca biasanya bikin sepi 20%, kurangi sedikit" |
| "Stok masih banyak nih" | "Promo aja: 'Stok masih segar, harga sore lebih hemat' [Copy ke WA]" |

**Core promise:** 30 detik catat → 30 detik baca rekomendasi → keputusan lebih percaya diri.

---

## 6. Feature Breakdown

### 6.1 Core MVP Features (Demo + Foundation)

| Feature | Description | Why critical |
|---|---|---|
| **Stock Quick Input** | Textarea bahasa natural, AI parse, confirm card | Magic moment, low-friction input |
| **Belanja Card** | Shareable, screenshotable shopping list besok | Demo magic + viral loop |
| **Promo Draft** | Copy-to-WhatsApp untuk overstock | Immediate value, demo wow |
| **Riwayat 7 hari** | Simple list/timeline catatan stok | Bukti data persistence |
| **Onboarding 3-layar** | Nama warung → lokasi (dropdown) → menu utama | Reach app value < 60s |

### 6.2 Private Beta Features (Real users)

| Feature | Description |
|---|---|
| **Auth (phone OTP via Supabase)** | Bisa dipakai multi-device |
| **Tenant isolation (RLS)** | Real data, real users |
| **Real BMKG integration** | Cache per region |
| **Recommendation audit log** | Debug + future training |
| **Rate limiting** | Cost control |
| **Offline draft input** | Subuh sinyal lemah |

### 6.3 Production v1 Features

| Feature | Description |
|---|---|
| **WhatsApp Cloud API** | Push notification ke nomor pedagang |
| **Multi-staff role** | Untuk Mas Adit persona |
| **Pola Mingguan visualization** | Habit-forming insight |
| **Voice input (Gemini Audio)** | Differentiator besar |

### 6.4 Out of Scope (jangan dibahas dulu)

- Dynamic pricing otomatis
- Marketplace supplier
- POS integration
- Multi-outlet kompleks UI
- Web scraping event lokal
- Forecasting ML engine (`laris.ai`)

---

## 7. User Stories

### Stock Input Flow
- **US-1:** Sebagai Bu Yati, saya ingin mengetik "lele sisa 5 dari 30 ekor, ayam habis" agar saya tidak perlu mengisi form panjang.
- **US-2:** Sebagai Bu Yati, saya ingin melihat hasil parsing AI sebelum disimpan agar saya bisa koreksi kalau salah.
- **US-3:** Sebagai Bu Yati, saya ingin app tetap bisa dipakai walau sinyal jelek agar pekerjaan subuh saya tidak terganggu.

### Recommendation Flow
- **US-4:** Sebagai Bu Yati, saya ingin lihat rekomendasi belanja besok dalam 1 kartu yang bisa di-screenshot agar saya bisa share ke supplier.
- **US-5:** Sebagai Bu Yati, saya ingin tahu kenapa rekomendasi turun/naik agar saya percaya angkanya.
- **US-6:** Sebagai Bu Yati, saya ingin rekomendasi tetap muncul walau cuaca tidak update agar saya tidak ketinggalan info.

### Promo Flow
- **US-7:** Sebagai Bu Yati, saya ingin draft pesan promo otomatis saat stok berlebih agar saya tinggal copy ke WA.
- **US-8:** Sebagai Bu Yati, saya ingin edit draft promo sebelum kirim agar bahasanya sesuai gaya saya.

### Mas Adit (Phase 3)
- **US-9:** Sebagai Mas Adit, saya ingin staff bisa input stok tanpa bisa export data agar kontrol tetap di saya.

---

## 8. User Journey (Magic Moment Locked)

### 8.1 First-Time Journey (Day 1)
```
Open app
  → "Selamat datang. Nama warung?" [Warung Bu Yati]
  → "Di mana?" [dropdown: Salatiga, Jakarta, ...]
  → "Menu utama?" [text: pecel lele, ayam goreng, tahu]
  → Sample data populated (last 7 days dummy)
  → Land on Dashboard with sample Belanja Card
```
Time target: **< 60 seconds**

### 8.2 Daily Journey (Day 2+)

**Evening (tutup warung, ~21.00):**
```
Open app
  → Tap "Catat hari ini"
  → Type: "lele sisa 5 dari 30, ayam habis jam 2, hujan sore"
  → 3s → Preview card muncul (5 items parsed)
  → Tap "Ya, simpan" (atau edit inline)
  → Land on "Belanja Besok" card (computed)
```
Time target: **< 30 seconds**

**Morning (sebelum belanja, ~02.45):**
```
Open app
  → Lihat Belanja Card langsung (cached)
  → Tap "Salin ke WhatsApp" → share ke supplier
```
Time target: **< 10 seconds**

### 8.3 Magic Moment (Demo)
> Judge melihat user mengetik **"lele sisa 5 dari 30 ekor, ayam habis, hujan tadi sore"** → 3 detik kemudian muncul **Belanja Card untuk besok** dengan jumlah yang masuk akal + alasannya + tombol "Salin ke WhatsApp" yang menghasilkan pesan siap share.

Semua keputusan produk diukur terhadap kalimat ini.

---

## 9. Success Metrics

### 9.1 Demo Metrics (Event #JuaraVibeCoding)
- Time to magic moment: **< 90 seconds** from app open
- Demo flow zero crashes across 5 consecutive runs
- 1 signature visual moment (Belanja Card) memorable enough untuk judges share

### 9.2 Private Beta Metrics (10-50 pedagang nyata)
- **Activation:** 60% pedagang menyelesaikan onboarding + 1 stock log dalam hari pertama
- **Retention D7:** 40% pedagang aktif setelah 7 hari
- **Retention D28:** 25% pedagang aktif setelah 28 hari
- **Recommendation engagement:** 50% rekomendasi dibuka sebelum jam belanja
- **Trust signal:** Manual override rate < 30% setelah 7 hari (artinya AI dipercaya cukup)

### 9.3 Business Metrics (Post-Submission)
Business metrics defer to post-submission. Demo success = 5-min flow, zero visible bugs, ≥1 judge requests link. Cost/CAC/support metrics live in `.docs/FUTURE_ROADMAP.md` until real-user phase begins.

### 9.4 Counter-Metrics (Hindari)
- Stockout frequency naik > 5% (artinya rekomendasi terlalu konservatif)
- Waste naik > 5% (artinya rekomendasi terlalu agresif)
- Time-in-app per session naik tanpa retention naik (sign of confusion)

---

## 10. MVP Scope (Locked)

### IN
1. Pre-loaded sample warung untuk demo (Bu Yati - Pecel Lele Salatiga)
2. 3-screen onboarding
3. Natural language stock input + AI parse + confirm
4. Belanja Card (rule-based + AI explanation)
5. Promo draft + copy-to-WhatsApp
6. Riwayat 7 hari (simple list)
7. 1 signature visual moment (Belanja Card design polish)

### OUT (untuk demo, ada di backlog Private Beta)
- Real auth (demo pakai single hardcoded user)
- Real BMKG (demo pakai dummy weather)
- WhatsApp Cloud API (copy-to-WA cukup)
- Multi-tenancy + RLS infrastructure (single tenant cukup untuk demo)
- Async job queue (Server Actions cukup)
- Offline PWA
- Audit log infrastructure
- Multi-staff role
- Voice input

### Sukses MVP =
Judge demo selesai dalam 5 menit dengan **0 bug visible**, dan minimal **1 judge minta link untuk coba sendiri**.

---

## 11. Future Roadmap (Post-Submission)

Submission MVP scope is locked at §10. Post-submission roadmap (private beta, monetization, scale, multi-staff, WhatsApp Cloud API, ML forecasting) lives in `.docs/FUTURE_ROADMAP.md` and is explicitly out of current execution scope.

---

## 12. Risks & Assumptions

### Critical Assumptions (must validate)
| Assumption | Risk if wrong | Validation method |
|---|---|---|
| Pedagang mau belajar app baru | Total product failure | 5 user interviews pre-build |
| Pedagang punya smartphone yang bisa run PWA modern | Limited TAM | Survey + Indonesia smartphone data |
| AI parse Indonesian casual accurately enough | Trust collapse | Test 30 utterances, target 85% accuracy |
| Recommendation cukup akurat untuk dipercaya | Churn tinggi | A/B test rekomendasi vs gut feeling, week 4 |
| Pedagang punya willingness to pay (Phase 4) | No monetization | Defer until 100 user retention proven |

### Technical Risks
| Risk | Impact | Mitigation |
|---|---|---|
| Gemini API outage saat demo | Catastrophic | Mock fallback dengan canned response |
| BMKG API unreliable | Recommendation degraded | Cache + 24h grace period |
| Cost per user > revenue per user | Unsustainable | Rate limit + monitor from day 1 |
| Hallucination AI parse menambah item fiktif | Trust collapse | Strict Zod validation + menu dictionary match |

### Business Risks
| Risk | Mitigation |
|---|---|
| Pedagang tidak mau onboarding sendiri | Field activation team (Phase 3) |
| Kompetitor (POS player) menambah fitur serupa | Speed + niche depth |
| Regulasi data WhatsApp Cloud API | Copy-to-WA fallback selalu jalan |

### Anti-Assumption (yang tidak boleh diandalkan)
- "Pedagang akan promote ke teman lewat WhatsApp" — mungkin, tapi jangan dependency
- "AI akan lebih murah dalam 1 tahun" — mungkin, tapi budget untuk harga sekarang
- "Pedagang akan upgrade premium" — belum terbukti, jangan build for it dulu
