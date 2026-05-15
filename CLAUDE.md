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

- **Phase:** 1 — Demo MVP (Sprint B)
- **Sprint:** Sprint B — Magic Layer (DONE on branch `feat/sprint-b-magic-layer`)
- **Magic moment ready?** Yes — Belanja Card renders, WhatsApp copy works
- **Next milestone:** M3 — Demo MVP deployed on Vercel
- **Last updated:** 2026-05-16 (Sprint B magic layer landed)

### Research findings (baked into rules)

From 5 interviews (`.docs/research/`). Key signals for Sprint A:

- **Input pattern confirmed:** short chat-style text — "lele sisa 2 kg, ayam habis" — persis magic moment
- **Rules MUST go down:** Pak Asep "kalau aplikasi bilang beli banyak tapi uangnya nggak ada" → recommendation wajib bisa KURANGI, bukan selalu naikkan
- **Day-of-week matters:** Jumat/weekend +15-30% volume (Bu Maya, Bu Sari confirm) → day context di rules engine
- **Modal constraint is real:** recommendation harus respect budget harian pedagang kecil
- **Weather validated:** 3/5 sebut cuaca sebagai faktor → BMKG hardcode for demo justified
- **WTP signal:** Rp 10K-50K/bulan disebut organik; conditional on proof → freemium Phase 3 valid

### Now (in-flight this session)

_(kosong — Sprint A complete)_

### Sprint A — Backbone (DONE)

All scope items landed:

1. ✅ Onboarding 3-layar (variant B single-page scroll, state local in `localStorage`)
2. ✅ Stock input textarea + Gemini `parseStockNote` via Server Action
3. ✅ AI parse confirm card (editable items, weather mention, confidence badges)
4. ✅ Save to Supabase via service-role admin client (single-tenant DEMO_OUTLET_ID)

### Up next — Sprint B
Catatan untuk Sprint B:

- RecommendationService belum dibangun — Belanja Card di Dashboard masih placeholder
- Service-role admin client bypass RLS (Phase 1 only); Phase 2 ganti pakai cookie session
- server-only package belum di-install — tidak masalah karena Next.js handle import-nya di build, dan test sengaja pakai pure mapping module yang tidak import server-only
- Untuk test runtime end-to-end: butuh pnpm db:start (Docker required), pnpm db:reset untuk seed Bu Yati

1. Wire rules engine (`src/lib/rules/recommendation.ts`) → `RecommendationService` → real Belanja Card render on `/dashboard`.
2. Gemini explanation layer (`src/lib/ai/prompts/explain-v1.ts`) — reasoning per item.
3. Promo draft generator + copy-to-WhatsApp button (use `clampDiscount` from `src/lib/rules/promo.ts`).
4. Riwayat 7 hari list page.
5. End-to-end smoke test: type "lele sisa 5 dari 30..." → 3s → Belanja Card visible.

### Up next — Sprint C

1. End-to-end smoke test against local Supabase (Docker) — verify magic moment < 30s.
2. Empty/loading/error states polish — Stockflow already done, polish /dashboard + /riwayat copy + illustration.
3. Subuh Mode toggle (CSS class `html.subuh-mode` + time-based auto-activate hook 02:00-05:30 Asia/Jakarta).
4. 1 signature animation (Belanja Card reveal — spring scale + stagger items).
5. Demo dry-run 5min zero-bug + Vercel production deploy.
6. Backup demo video recording.

### Done log (append-only, newest first)

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
