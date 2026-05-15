# CLAUDE.md — Stockast

> Project memory for Claude Code. Keep rules here short. Detail lives in `.docs/`.

## What this is

AI shopping decision assistant for Indonesian small food merchants (warung). Daily decision-support, not POS/ERP. Magic moment: type "lele sisa 5..." → 3s → Belanja Card with WhatsApp copy button.

Primary persona: **Bu Yati** (35-55, low-end Android, WhatsApp-native, no POS).

## Source of truth

All product/strategy/engineering detail lives in `.docs/`. Read before deciding architecture.

| When you need... | Read |
|---|---|
| Why we're building / product spec | `.docs/PRD.md` |
| How to start coding (folders, layers, boundaries) | `.docs/FOUNDATION_BLUEPRINT.md` |
| Phase/sprint plan, milestones, risks | `.docs/EXECUTION_BLUEPRINT.md` |
| Code rules (types, errors, RLS, naming, commits) | `.docs/ENGINEERING_STANDARDS.md` |
| Architecture layers, services, data flow | `.docs/SYSTEM_ARCHITECTURE.md` |
| Feature scope per phase | `.docs/FEATURE_PRIORITY_MATRIX.md` |
| Visual design tokens, components | `.docs/DESIGN_SYSTEM.md` + `.docs/BRAND_DIRECTION.md` |
| What NOT to ship (anti-slop) | `.docs/AI_SLOP_PREVENTION.md` |
| Launch gates | `.docs/LAUNCH_CHECKLIST.md` |

Always check `.docs/` before inventing patterns. If `.docs/` and code disagree, ask before resolving.

## Core rules (irreducible)

1. **Magic moment first.** Every Phase 1 task must serve the lele→Belanja Card flow. Defer everything else.
2. **AI explains, rules decide.** Recommendation engine = pure functions in `src/lib/rules/`. Gemini only parses input + writes copy. Never let AI make the buy/skip call alone.
3. **AI output is untrusted.** Every Gemini response Zod-validated before persistence.
4. **Boundary discipline:**
   - Components never touch DB or AI directly. Go through Server Actions → service layer.
   - Services don't call other services. Orchestrate at Server Action level.
   - Server-only secrets never in `NEXT_PUBLIC_*`.
5. **Server Actions return `ActionResult<T>`,** never throw to client.
6. **Strict types.** `strict: true`, `noUncheckedIndexedAccess: true`. No `any` without one-line justification.
7. **Magic numbers in `src/lib/config/thresholds.ts` only.**
8. **UI copy in `src/lib/copy/*`,** Indonesian conversational (not formal/translated). Centralized.
9. **Defense in depth:** middleware session check + Server Action role check + Postgres RLS.
10. **No PII in logs:** phone numbers, raw stock notes, full prompts.
11. **Conventional Commits** with scopes: `auth · stock · recommendation · promo · ai · ui · db · infra · docs`.
12. **Forward-only migrations** in `supabase/migrations/`.

## Anti-slop (do not ship)

- Generic Tailwind defaults / purple gradients / Inter font
- "Powered by AI" badges
- English UI strings
- Premature abstractions ("AIModelRouter for future flexibility")
- Phase 2+ infra during Phase 1 (auth, observability, multi-tenant, offline PWA)

Full list: `.docs/AI_SLOP_PREVENTION.md`.

## Stack (locked)

Next.js 15 App Router · React 19 · TS strict · Tailwind v4 · shadcn primitives · Supabase (Postgres + Auth + RLS + Storage) · Gemini direct SDK (`@google/genai`) · Vercel KV (rate-limit/cache) · Vitest · pnpm 9 · Node 22.

Boring tech. No swaps without `.docs/` update.

## Commands

```bash
pnpm dev              # Next dev + Turbopack
pnpm typecheck        # tsc --noEmit
pnpm lint             # ESLint flat
pnpm test             # Vitest
pnpm verify-gemini    # Day-1 model name check
pnpm db:start         # supabase start (Docker)
pnpm db:reset         # migrations + seed
pnpm db:types         # regen src/lib/db/types.ts
```

Before declaring work done: `pnpm typecheck && pnpm lint && pnpm test && pnpm build`.

## Phase tracking (current state)

> **How to use:** Update the "Now" row each session you touch the project. Move finished items to "Done log". Don't rewrite history — append. Keep entries one line.

### Current phase

- **Phase:** 1.5 — JVC Submission Sprint (planning → Sprint D start)
- **Sprint:** Sprint D — Wow Layer (next, on new branch after PR #2 merge)
- **Magic moment ready?** Yes in dev, but Phase 1.5 pulls 2-3 features forward before deploy
- **Next milestone:** M3.5 — JVC Wow Layer ready (dry-run 5x zero-bug), then M4 — Event Submission
- **Deployment status:** **HELD** until Sprint F dry-run passes (user decision 2026-05-16)
- **Last updated:** 2026-05-16 (Phase 1.5 strategy locked)

### Research findings (baked into rules)

From 5 interviews (`.docs/research/`). Key signals for Sprint A:

- **Input pattern confirmed:** short chat-style text — "lele sisa 2 kg, ayam habis" — persis magic moment
- **Rules MUST go down:** Pak Asep "kalau aplikasi bilang beli banyak tapi uangnya nggak ada" → recommendation wajib bisa KURANGI, bukan selalu naikkan
- **Day-of-week matters:** Jumat/weekend +15-30% volume (Bu Maya, Bu Sari confirm) → day context di rules engine
- **Modal constraint is real:** recommendation harus respect budget harian pedagang kecil
- **Weather validated:** 3/5 sebut cuaca sebagai faktor → BMKG hardcode for demo justified
- **WTP signal:** Rp 10K-50K/bulan disebut organik; conditional on proof → freemium Phase 3 valid

### Now (in-flight this session)

_(kosong — Sprint C complete, ready for PR + Vercel deploy)_

### Sprint A — Backbone (DONE)

1. ✅ Onboarding 3-layar (variant B single-page scroll, state local in `localStorage`)
2. ✅ Stock input textarea + Gemini `parseStockNote` via Server Action
3. ✅ AI parse confirm card (editable items, weather mention, confidence badges)
4. ✅ Save to Supabase via service-role admin client (single-tenant DEMO_OUTLET_ID)

### Sprint B — Magic Layer (DONE on branch `feat/sprint-b-magic-layer`)

1. ✅ RecommendationService — fetch 7-day history + menu → `rules.recommend` per item → AI `explain-recommendation@v1` → upsert. AI never decides numbers.
2. ✅ Belanja Card UI on `/dashboard` — signature visual, per-item suggested + reasoning + leftoverYesterday + confidence badge, copy-to-WhatsApp.
3. ✅ PromoService — `promo-detection.ts` pure rule (ratio + min-units) + `promo-draft@v1` Gemini prompt + `clampDiscount` + `validatePromo` defense-in-depth + frequency cap.
4. ✅ Promo card list with copy-to-WA + discount badge.
5. ✅ Riwayat 7 hari at `/riwayat`.
6. ⏸ End-to-end smoke test against local Supabase → moved to Sprint C dry-run.

Catatan teknis:
- Service-role admin client bypass RLS (Phase 1 only); Phase 2 ganti cookie session + RLS.
- `server-only` package belum di-install — pure mapping modules (`stock-mapping`, `recommendation-mapping`, `promo-detection`) sengaja dipisah supaya tests bypass.
- Runtime end-to-end butuh `pnpm db:start` (Docker) + `pnpm db:reset` untuk seed Bu Yati.

### Sprint C — Polish & Demo Prep (DONE on branch `feat/sprint-b-magic-layer`)

1. ✅ Subuh Mode — pure time gate (`src/lib/subuh.ts`, 02:00-05:30 Asia/Jakarta, no DST), `useSubuhMode` hook (manual override via localStorage wins; polls every 60s), `SubuhToggle` button on Dashboard. CSS re-maps `--color-neutral-*` tokens + warmer brand under `.subuh-mode` — global cream→ink swap without rewriting components.
2. ✅ Belanja Card signature animation — keyframe `belanja-card-reveal` (translate + scale-in spring) + per-item stagger via `animation-delay` (120ms base + 60ms increments). Respects `prefers-reduced-motion`.
3. ✅ Empty/loading/error illustrations — `SproutMark`, `NotebookMark`, `CloudMark` SVGs + `EmptyState` component. Replaces generic `<p>` placeholders on `/dashboard` + `/riwayat`. Warmer copy in `lib/copy/belanja.ts`.
4. ✅ Tests: 12 new tests for Subuh time gate boundaries (02:00 inclusive, 05:30 exclusive, Jakarta TZ regardless of runner TZ). 65/65 total green.
5. ⏸ End-to-end smoke against local Supabase — moved to Phase 1.5 Sprint F (butuh Docker).
6. ⏸ Vercel production deploy + dry-run + backup video — moved to Phase 1.5 Sprint F.

### Phase 1.5 — JVC Submission Sprint (decision 2026-05-16, NEXT)

**Goal:** Demo wow + zero-bug + deployment ke production saat submission. Detail: `.docs/EXECUTION_BLUEPRINT.md §2 Phase 1.5`.

**Features pulled forward** (lihat `.docs/FEATURE_PRIORITY_MATRIX.md §2.5`):
- Voice Input ← Phase 3 (behind `FEATURE_VOICE_INPUT` flag, conditional demo)
- Pola Mingguan ← Phase 3 (SVG manual bar chart × 7 hari + auto-insight)
- Offline PWA + draft queue ← Phase 2 (`next-pwa`, IndexedDB sync)
- Pre-seeded sample data (NEW) — Belanja Card jalan instan setelah onboarding
- Cuaca mock card (NEW) — visualkan weather factor sebelum BMKG real

**Sprint D — Wow Layer (3 hari)**
1. Pola Mingguan card on Dashboard (SVG manual, leverage `weekdayRatio`).
2. Pre-seeded sample data on onboarding (ensure 7 hari ke DEMO_OUTLET_ID).
3. Cuaca mock card (3-state cycling, hardcode).

**Sprint E — Reliability Layer (2-3 hari)**
4. Offline PWA: `next-pwa` plugin, cache shell + last Belanja Card, draft queue IndexedDB.
5. Loading skeletons ganti spinner di `/dashboard` + `/catat`.
6. Error recovery: retry button + auto-retry pada `AI_PARSE_FAILED`.
7. Voice input behind `FEATURE_VOICE_INPUT` flag (default OFF di production).

**Sprint F — Submission Prep (2 hari)**
8. Demo script + 3x dry-run < 90s to magic moment.
9. Backup demo video 60s.
10. Mobile real device test (iPhone SE, Android low-end).
11. README polish untuk judge.
12. Vercel `--prod` deploy + custom domain (opsional).
13. Voice flag enable decision (dry-run 5x lurus → ON).

**Milestone gate Phase 1.5:** Demo dry-run 5 menit zero-bug + Vercel live + backup video siap → M4 submission.

**Total estimasi:** 7-9 hari kerja sebelum deployment.

### Up next — Post-JVC

- Phase 2 hardening: real auth + RLS + BMKG + Sentry + PostHog + rate limit + 5 pedagang nyata onboarding.
- Phase 3 (post private beta): WhatsApp Cloud API + Multi-staff + Pricing experiment. *Catatan: user mengindikasikan fitur Phase 3 mungkin ditarik lagi tergantung situasi post-JVC.*

### Done log (append-only, newest first)

- **2026-05-16** — Phase 1.5 strategy locked. Pull Voice (behind flag), Pola Mingguan, Offline PWA forward; new pre-seeded data + cuaca mock. Deployment held until Sprint F dry-run pass. Docs updated: EXECUTION_BLUEPRINT (Phase 1.5 section + M3.5 milestone), FEATURE_PRIORITY_MATRIX (§2.5 + pulled markers), FUTURE_ROADMAP (drift log), LAUNCH_CHECKLIST (Phase 1.5 additions section).
- **2026-05-16** — Sprint C polish landed. Subuh Mode (pure time gate + hook + toggle + dark token remap), Belanja Card spring reveal + item stagger, empty/loading/error illustrations (Sprout/Notebook/Cloud SVG + EmptyState component), warmer Indonesian copy across all states. Env Zod schema fixed to coerce blank `""` to undefined (KV/Sentry URLs). 65/65 tests pass (was 53). Build green, all 5 routes 200 on `pnpm dev`.
- **2026-05-16** — Sprint B magic layer landed on branch `feat/sprint-b-magic-layer`. RecommendationService + explain-recommendation@v1 prompt, PromoService + promo-detection + promo-draft@v1 prompt, BelanjaCard UI with copy-to-WA, PromoCardList, Riwayat 7 hari page, Server Actions getBelanjaCard / getPromosForToday / getRiwayat7d / markPromoCopiedAction. 53/53 tests pass. Build green (5 static routes).
- **2026-05-15** — Sprint A backbone landed. AI module (Gemini client, versioned `parse-stock@v1` prompt, Zod schema), copy module (id-ID), DB layer (admin client + queries), StockService + Server Actions, UI primitives (button/input/textarea/card/label/select), Onboarding variant B, StockFlow (input→parse→confirm→save), DashboardShell placeholder, AppGate redirect. 36/36 tests pass. Build green.
- **2026-05-15** — Phase 0 complete. 5/5 user interviews validated. Pain confirmed (Rp 40K-250K loss/minggu). Sprint A gate cleared. Key product signals captured ke Research findings section.
- **2026-05-15** — Gemini model verify fixed (`--env-file` flag). Pinned models `gemini-2.0-flash` + `gemini-2.0-flash-lite` confirmed live. `.docs/models.json` recorded.
- **2026-05-15** — Foundation scaffold landed (PR #1). Configs, thresholds, feature flags, rules engines (stock/recommendation/promo), 21 unit tests passing, init migration.

### Blocked

_(none — record blocker + date + mitigation here when found)_

### Session checklist (run at start + end of each session)

**Start:**
1. Re-read `CLAUDE.md` § Phase tracking + § Core rules.
2. Skim relevant `.docs/` for the task at hand.
3. Confirm current phase still matches what you're about to build. If not — stop and re-scope.

**End:**
1. Update "Last updated" date.
2. Move completed items from "Now" → "Done log" with one-line outcome.
3. Refresh "Up next" if priorities shifted.
4. Record any new blockers.
5. Run `pnpm typecheck && pnpm lint && pnpm test` before claiming green.

## Definition of done — Phase 1 (Demo MVP)

- [ ] Onboarding < 60 detik
- [ ] Stock input → parse → confirm < 30 detik
- [ ] Belanja Card renders with sensible reasoning
- [ ] Promo draft generates valid Indonesian copy
- [ ] Copy-to-WhatsApp works on Android Chrome
- [ ] Deployed on Vercel production
- [ ] Demo dry-run 5min zero-bug
- [ ] Backup demo video recorded
- [ ] Subuh Mode toggle works
- [ ] Loading/empty/error states designed
- [ ] Tested iPhone SE viewport + Android low-end

**NOT in Phase 1 DoD:** real auth, real BMKG, multi-tenancy, 100% coverage, prod observability. → Phase 2.
