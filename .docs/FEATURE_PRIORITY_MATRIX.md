# Feature Priority Matrix — Stockast

**Version:** 1.0
**Method:** Each feature scored on Priority, Complexity, Business Impact, User Impact, Risk. Decisions stored as commitments, not opinions.

---

## 1. Scoring Legend

**Priority:** P0 (must) / P1 (should) / P2 (nice) / P3 (defer indefinitely)
**Complexity:** 🟢 Low (< 1 day) / 🟡 Medium (1-5 days) / 🔴 High (> 5 days)
**Business Impact:** ⭐⭐⭐ High / ⭐⭐ Medium / ⭐ Low
**User Impact:** ⭐⭐⭐ High / ⭐⭐ Medium / ⭐ Low
**Risk:** 🛑 High / ⚠️ Medium / ✅ Low

---

## 2. Core MVP (Demo MVP Phase 1)

**Definition:** Required for #JuaraVibeCoding demo. Not shipping these = not a demo.

### Stock Quick Input + AI Parse
- **Priority:** P0
- **Complexity:** 🟡 Medium (3 days)
- **Business Impact:** ⭐⭐⭐
- **User Impact:** ⭐⭐⭐
- **Risk:** ⚠️ Medium (Gemini parse accuracy)
- **Reasoning:** This is the magic moment foundation. Without it, no product. Mitigate risk with strict Zod validation + confirmation step.

### Confirmation Card (AI parse review)
- **Priority:** P0
- **Complexity:** 🟢 Low (1 day)
- **Business Impact:** ⭐⭐⭐
- **User Impact:** ⭐⭐⭐
- **Risk:** ✅ Low
- **Reasoning:** Trust foundation. User sees AI's interpretation before commit. Cheap to build, expensive to skip.

### Belanja Card (Recommendation Display)
- **Priority:** P0
- **Complexity:** 🟡 Medium (2-3 days)
- **Business Impact:** ⭐⭐⭐
- **User Impact:** ⭐⭐⭐
- **Risk:** ⚠️ Medium (visual polish takes iteration)
- **Reasoning:** This IS the product visual identity. Demo magic moment. Screenshot-worthy = viral loop.

### Rule-Based Recommendation Engine
- **Priority:** P0
- **Complexity:** 🟡 Medium (2 days)
- **Business Impact:** ⭐⭐⭐
- **User Impact:** ⭐⭐⭐
- **Risk:** ✅ Low (pure functions, testable)
- **Reasoning:** AI cannot be the recommender. Rules first, AI explains. Conservative baseline = trustworthy.

### Promo Draft Generator + Copy-to-WhatsApp
- **Priority:** P0
- **Complexity:** 🟢 Low (1-2 days)
- **Business Impact:** ⭐⭐⭐
- **User Impact:** ⭐⭐⭐
- **Risk:** ✅ Low
- **Reasoning:** Immediate visible value. Demo-worthy moment. Already in PRD as smart guardrails (15% cap, frequency cap).

### 3-Screen Onboarding
- **Priority:** P0
- **Complexity:** 🟢 Low (1 day)
- **Business Impact:** ⭐⭐⭐
- **User Impact:** ⭐⭐⭐
- **Risk:** ✅ Low
- **Reasoning:** Time-to-value < 60s. Cut from PRD's 7 steps.

### 7-Day History List
- **Priority:** P0
- **Complexity:** 🟢 Low (0.5 day)
- **Business Impact:** ⭐⭐
- **User Impact:** ⭐⭐
- **Risk:** ✅ Low
- **Reasoning:** Bukti data persistence untuk demo. Simple list.

### Pre-loaded Sample Data
- **Priority:** P0
- **Complexity:** 🟢 Low (0.5 day)
- **Business Impact:** ⭐⭐⭐ (demo only)
- **User Impact:** ⭐⭐
- **Risk:** ✅ Low
- **Reasoning:** Demo user sees value immediately, no cold start gap. Bu Yati - Pecel Lele Salatiga.

### Subuh Mode (Dark variant)
- **Priority:** P0 (signature)
- **Complexity:** 🟢 Low (1 day)
- **Business Impact:** ⭐⭐ (differentiation)
- **User Impact:** ⭐⭐⭐ (real context match)
- **Risk:** ✅ Low
- **Reasoning:** Signature detail that shows we understand user context (03.00 belanja). Cheap, memorable.

### Belanja Card Signature Animation
- **Priority:** P0 (signature)
- **Complexity:** 🟢 Low (1 day)
- **Business Impact:** ⭐⭐⭐ (demo wow)
- **User Impact:** ⭐⭐
- **Risk:** ✅ Low
- **Reasoning:** Number count-up + item stagger + weather morph. ONE animation, premium polish.

### Mock Weather (Hardcoded for Demo)
- **Priority:** P0
- **Complexity:** 🟢 Low (0.5 day)
- **Business Impact:** ⭐⭐⭐ (demo reliability)
- **User Impact:** N/A (invisible)
- **Risk:** ✅ Low
- **Reasoning:** BMKG real API is demo killer. Mock cuaca for Phase 1, real Phase 2.

---

## 2.5. Phase 1.5 — JVC Submission Sprint (Pulled Forward)

**Decision date:** 2026-05-16
**Definition:** Features pulled from Phase 2/3 into pre-submission sprint untuk demo memorable. Deployment di-hold sampai Sprint F selesai.

### Pola Mingguan Visualization (PULLED from Phase 3)
- **Priority:** P0 (Phase 1.5 wow layer)
- **Complexity:** 🟡 Medium (2 days — SVG manual, no recharts)
- **Business Impact:** ⭐⭐⭐ (demo wow + retention)
- **User Impact:** ⭐⭐⭐ (aha moment "AI tahu pola warung")
- **Risk:** ✅ Low
- **Reasoning:** Bar chart per item × 7 hari + auto-insight ("Tiap Jumat lele +20%"). Leverage `weekdayRatio()` yang sudah ada di rules engine. Cheap, big narrative payoff buat judge.

### Voice Input via Gemini Audio (PULLED from Phase 3, BEHIND FLAG)
- **Priority:** P1 (Phase 1.5 conditional)
- **Complexity:** 🟡 Medium (3 days)
- **Business Impact:** ⭐⭐⭐ (massive differentiator kalau jalan)
- **User Impact:** ⭐⭐⭐ (Bu Yati Android low-end, voice >>> typing)
- **Risk:** ⚠️ Medium (accuracy Indonesian casual)
- **Reasoning:** Build behind `FEATURE_VOICE_INPUT` flag. Demo kalau dry-run lurus 5x; goyang → flag tetap OFF, sembunyikan tombol. Reward besar, fallback aman.

### Offline PWA + Draft Queue (PULLED from Phase 2)
- **Priority:** P0 (Phase 1.5 reliability)
- **Complexity:** 🟡 Medium (3 days)
- **Business Impact:** ⭐⭐ (product credibility)
- **User Impact:** ⭐⭐⭐ (subuh sinyal lemah validated by research)
- **Risk:** ⚠️ Medium (service worker complexity)
- **Reasoning:** `next-pwa` plugin, cache shell + last Belanja Card, draft input queue IndexedDB sync on online. Demo subuh mode + offline = compelling narrative.

### Pre-Seeded Sample Data on Onboarding (NEW for Phase 1.5)
- **Priority:** P0 (Phase 1.5 demo critical)
- **Complexity:** 🟢 Low (0.5 day)
- **Business Impact:** ⭐⭐⭐ (demo blocker)
- **User Impact:** ⭐⭐ (instant value)
- **Risk:** ✅ Low
- **Reasoning:** Belanja Card butuh ≥3 hari data. Onboarding selesai → ensure 7 hari demo seed sudah ada di `DEMO_OUTLET_ID`. Tanpa ini, demo gagal di submission flow.

### Cuaca Mock Card on Dashboard (NEW for Phase 1.5)
- **Priority:** P1 (Phase 1.5)
- **Complexity:** 🟢 Low (0.5 day)
- **Business Impact:** ⭐⭐ (demo realism)
- **User Impact:** ⭐⭐ (visualize "kenapa rekomendasi turun")
- **Risk:** ✅ Low
- **Reasoning:** Visual placeholder buat weather factor. Hardcode 3-state cycling. BMKG real tetap Phase 2.

---

## 3. Important But Later (Private Beta — Phase 2)

**Note (2026-05-16):** Offline PWA dipindah ke Phase 1.5 (lihat §2.5). Sisanya tetap di Phase 2.

**Definition:** Required for real users (10-50 beta cohort). Not for demo, but blocks scaling.

### Phone OTP Auth (Supabase)
- **Priority:** P1
- **Complexity:** 🟡 Medium (2 days)
- **Business Impact:** ⭐⭐⭐
- **User Impact:** ⭐⭐
- **Risk:** ⚠️ Medium (OTP cost + delivery in Indonesia)
- **Reasoning:** Real users need auth. Phone OTP cocok untuk audience. Verify Supabase OTP provider works in Indonesia.

### Multi-Tenancy + RLS Policies
- **Priority:** P1
- **Complexity:** 🟡 Medium (2 days)
- **Business Impact:** ⭐⭐⭐ (foundational)
- **User Impact:** ⭐ (invisible)
- **Risk:** ⚠️ Medium (mistakes here = data leak)
- **Reasoning:** Foundational. Test thoroughly. Once shipped, hard to migrate.

### Real BMKG Integration + Cache
- **Priority:** P1
- **Complexity:** 🟡 Medium (3 days)
- **Business Impact:** ⭐⭐
- **User Impact:** ⭐⭐
- **Risk:** ⚠️ Medium (BMKG reliability)
- **Reasoning:** Real weather adds rec accuracy. Cache + 24h grace prevents demo-killer scenarios.

### adm4_code Mapping (Real Locations)
- **Priority:** P1
- **Complexity:** 🟡 Medium (2 days)
- **Business Impact:** ⭐⭐
- **User Impact:** ⭐
- **Risk:** ⚠️ Medium
- **Reasoning:** Required for BMKG. **Per phase:** Phase 1 demo = hardcode 5 cities (Salatiga, Jakarta, Yogya, Solo, Semarang). Phase 2 beta = expand ke 50 popular cities. Phase 3+ = full mapping via BMKG official list, fallback dropdown for unmatched.

### Rate Limiting (Vercel KV)
- **Priority:** P1
- **Complexity:** 🟢 Low (1 day)
- **Business Impact:** ⭐⭐⭐ (cost control)
- **User Impact:** ⭐ (invisible)
- **Risk:** ✅ Low
- **Reasoning:** Prevent runaway AI costs. Foundational from real-user phase.

### AI Audit Log
- **Priority:** P1
- **Complexity:** 🟢 Low (1 day)
- **Business Impact:** ⭐⭐ (debug + future training)
- **User Impact:** ⭐
- **Risk:** ✅ Low
- **Reasoning:** Save raw inputs + outputs from day 1. Free training data. Cheap to add early.

### Offline Draft Input (PWA) — MOVED TO PHASE 1.5
- **Status:** Pulled forward to Phase 1.5 per 2026-05-16 decision (lihat §2.5).

### Error Tracking (Sentry)
- **Priority:** P1
- **Complexity:** 🟢 Low (0.5 day)
- **Business Impact:** ⭐⭐
- **User Impact:** ⭐ (invisible)
- **Risk:** ✅ Low
- **Reasoning:** Free tier. Catches issues real users hit.

### Product Analytics (PostHog)
- **Priority:** P1
- **Complexity:** 🟢 Low (0.5 day)
- **Business Impact:** ⭐⭐⭐ (data-driven decisions)
- **User Impact:** ⭐ (invisible)
- **Risk:** ✅ Low
- **Reasoning:** Need to measure funnel to improve. Free tier.

### Beta Feedback Mechanism (in-app)
- **Priority:** P1
- **Complexity:** 🟢 Low (0.5 day)
- **Business Impact:** ⭐⭐⭐
- **User Impact:** ⭐⭐
- **Risk:** ✅ Low
- **Reasoning:** Real users will have insights. Make it easy to share.

---

## 4. Important But Later (Production v1 — Phase 3)

**Note (2026-05-16):** Voice Input + Pola Mingguan dipindah ke Phase 1.5 (lihat §2.5). WhatsApp Cloud API + Multi-Staff tetap di Phase 3.

### WhatsApp Cloud API Integration
- **Priority:** P1
- **Complexity:** 🔴 High (5+ days, includes Meta approval)
- **Business Impact:** ⭐⭐⭐ (push notification capability)
- **User Impact:** ⭐⭐⭐
- **Risk:** 🛑 High (Meta approval timeline, template restrictions)
- **Reasoning:** Big retention unlock (push reminders). Defer until product proven, approval starts in parallel.

### Voice Input (Gemini Audio) — MOVED TO PHASE 1.5
- **Status:** Pulled forward behind `FEATURE_VOICE_INPUT` flag per 2026-05-16 decision (lihat §2.5).

### Pola Mingguan Visualization — MOVED TO PHASE 1.5
- **Status:** Pulled forward per 2026-05-16 decision (lihat §2.5).

### Multi-Staff Role Support
- **Priority:** P2
- **Complexity:** 🟡 Medium (3 days)
- **Business Impact:** ⭐⭐ (Mas Adit persona)
- **User Impact:** ⭐
- **Risk:** ✅ Low
- **Reasoning:** For secondary persona. Defer until primary persona proven.

### Menu Dictionary with Fuzzy Matching
- **Priority:** P2
- **Complexity:** 🟡 Medium (3 days)
- **Business Impact:** ⭐⭐
- **User Impact:** ⭐⭐
- **Risk:** ⚠️ Medium (matching wrong = trust loss)
- **Reasoning:** Variations: "lele", "pecel lele", "lele goreng". Start with exact match + manual merge, fuzzy in Phase 3.

### Data Export (JSON/CSV)
- **Priority:** P2
- **Complexity:** 🟢 Low (1 day)
- **Business Impact:** ⭐ (compliance + trust)
- **User Impact:** ⭐
- **Risk:** ✅ Low
- **Reasoning:** Nice to have. Required for GDPR-style compliance long-term.

### Soft Delete + Audit Trail
- **Priority:** P2
- **Complexity:** 🟢 Low (1 day)
- **Business Impact:** ⭐
- **User Impact:** ⭐ (safety net)
- **Risk:** ✅ Low
- **Reasoning:** Recover from accidental delete. Cheap, defer until accidental delete becomes pattern.

---

## 5. Experimental (Phase 4 — Validate Before Build)

**Definition:** Promising but unproven. Build only when data supports it.

### Multi-Outlet Dashboard
- **Priority:** P2
- **Complexity:** 🔴 High (10+ days)
- **Business Impact:** ⭐⭐ (Mas Adit persona)
- **User Impact:** ⭐⭐
- **Risk:** ⚠️ Medium (scope creep)
- **Reasoning:** Only after Mas Adit persona validated through user demand, not assumption.

### Supplier Marketplace (B2B Revenue)
- **Priority:** P3
- **Complexity:** 🔴 High (months)
- **Business Impact:** ⭐⭐⭐ (potential)
- **User Impact:** ⭐⭐
- **Risk:** 🛑 High (different business entirely)
- **Reasoning:** Could be biggest revenue driver but is a different product. Validate via partnership first, not build.

### ML Forecasting Engine (`laris.ai`)
- **Priority:** P3
- **Complexity:** 🔴 High (months)
- **Business Impact:** ⭐⭐
- **User Impact:** ⭐⭐ (marginal over rules + Gemini)
- **Risk:** 🛑 High (data, infra, expertise required)
- **Reasoning:** Not required for product success. Rules + Gemini explanation works. Defer indefinitely until clear ROI.

### Dynamic Pricing Suggestions
- **Priority:** P3
- **Complexity:** 🟡 Medium (5 days)
- **Business Impact:** ⭐⭐ (margin lift potential)
- **User Impact:** ⭐⭐
- **Risk:** 🛑 High (social impact, ethics)
- **Reasoning:** Strong guardrails required. Test on overstock-only scenario first. Risk of suggesting predatory pricing.

### Referral Program
- **Priority:** P2
- **Complexity:** 🟡 Medium (3 days)
- **Business Impact:** ⭐⭐⭐ (growth)
- **User Impact:** ⭐
- **Risk:** ⚠️ Medium (fraud potential)
- **Reasoning:** Build after Phase 3 retention proven. Untested viral mechanic = wasted effort.

### Local Event Structured Input
- **Priority:** P3
- **Complexity:** 🟡 Medium (2 days)
- **Business Impact:** ⭐
- **User Impact:** ⭐⭐
- **Risk:** ✅ Low
- **Reasoning:** User-driven event input. Useful in theory; in practice, low adoption likely. Test on private beta first.

---

## 6. Remove Entirely (Kill List)

**Definition:** From original PRD or generic feature wishes. Not building.

### AIModelRouter Abstraction
- **Why kill:** Premature abstraction. Single `getModel(task)` function suffices until 1000+ users.

### 9-Step Validation Pipeline
- **Why kill:** Zod parse + 1 business rule check covers 90% of need. Add complexity when actual failures justify.

### Golden Test Dataset (100 examples Phase 1)
- **Why kill:** Premature. 10-15 examples for Phase 1 testing, 100 in Phase 3 when accuracy targets matter.

### Real-Time Job Queue Infrastructure (Phase 1)
- **Why kill:** Server Actions + Vercel Cron suffices. Real queue infrastructure (Inngest) when concurrency forces it.

### Recommendation Levels 0-4 with % Caps
- **Why kill:** Over-engineered. Use 2 levels: "Data baru, hati-hati" vs "Pola jelas". Caps adjustable internally.

### Observability Stack (Phase 1)
- **Why kill:** `console.error` + Vercel logs covers demo phase. Add Sentry/PostHog in Phase 2.

### Custom Design System from Scratch
- **Why kill:** shadcn/ui + Tailwind config extension covers it. Building bespoke design system is 6-month effort.

### Microservices Architecture
- **Why kill:** Single Next.js app handles 10K+ users fine. Microservices = premature org optimization.

### Docker / Kubernetes Setup
- **Why kill:** Serverless covers it. No infrastructure team to run K8s.

### Custom Indonesian NLP Layer
- **Why kill:** Gemini handles Indonesian well. Custom NLP = months of work for marginal accuracy gain.

### Public API for Third Parties
- **Why kill:** No demand. Build only if a paying customer specifically requests.

### Native iOS / Android App
- **Why kill:** PWA covers it. Native app = doubled effort, marginal benefit at our scale.

### Real-Time Multi-User Collaboration
- **Why kill:** Not a collaborative product. Single owner per outlet model is correct.

### Recommendation A/B Testing Infrastructure
- **Why kill:** Too few users for statistical significance until 1K+ active. Defer infrastructure.

### Web Scraping for Event Detection
- **Why kill:** Legal risk + maintenance burden + low accuracy. User-input events suffices.

### Voice Notifications (TTS)
- **Why kill:** No clear user demand. Push notification covers it.

### Loyalty / Gamification System
- **Why kill:** Wrong audience. Pedagang need utility, not points.

### Animated Onboarding Tour
- **Why kill:** Good products don't need tours. If onboarding needs explanation, simplify onboarding.

### Glassmorphism / Neumorphism UI
- **Why kill:** Slop-coded aesthetic. Stockast aesthetic is warm, friendly, not techy.

### Recommendation "Confidence Percentage" UI
- **Why kill:** Users don't understand "73% confidence". Use plain language: "Pola jelas" / "Data baru".

---

## 7. Decision Framework (For Future Features)

When considering a new feature, score it:

```
Should I build this?
  ├─ Does it serve the magic moment? → If no, defer
  ├─ Can I demo it in 30 seconds? → If no, defer
  ├─ Does it fit Bu Yati persona? → If no, defer
  ├─ Is complexity < expected impact? → If no, defer
  ├─ Is it reversible if wrong? → If no, slow down
  └─ Will it still matter at 10K users? → If no, defer
```

If all answers green: prototype 1 day, ship behind feature flag, measure.
If any red: write 1-pager, sit on it 1 week, revisit.

---

## 8. Summary Matrix

| Bucket | Count | Phase |
|---|---|---|
| **Core MVP (P0)** | 10 features | Phase 1 (Sprint A-C, DONE on `feat/sprint-b-magic-layer`) |
| **JVC Submission Pull-Forward** | 5 features | Phase 1.5 (Sprint D-E-F, decision 2026-05-16) |
| **Important Later (P1)** | 9 features | Phase 2-3 (Beta → Production) |
| **Experimental (P2-P3)** | 7 features | Phase 4+ (Validate first) |
| **Kill List** | 21 features | Never (unless data forces) |

**Ratio:** 15 build before submission : 21 explicitly NOT building.

That ratio is the discipline. AI Slop products are the ones that flip this ratio.
