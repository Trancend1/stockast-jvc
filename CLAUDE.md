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

Next.js 15 App Router · React 19 · TS strict · Tailwind v4 · shadcn primitives · Supabase (Postgres + Auth + RLS + Storage) · Gemini direct SDK (`@google/genai`) · Vercel KV REST env (rate-limit contract in `src/lib/kv`, no SDK dependency) · Vitest · pnpm 9 · Node 22.

Removed (evaluated + unused): `@tanstack/react-query`, `react-hook-form`, `@hookform/resolvers`, `date-fns`, `date-fns-tz`, `@vercel/kv`.

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

## Phase Tracking

> Update this section only when phase, sprint, blocker, or verification status changes. Keep it scannable; put long strategy in `.docs/`.

### Snapshot

| Field | Current |
|---|---|
| Phase | 1.5+2 Pre-Submission Hardening |
| Active sprint | Sprint G: Real Integrations |
| Status | Ready to start development |
| Branch | `feat/ui-kit` |
| Magic moment | Ready in demo seed mode: onboarding -> dashboard -> Cuaca + Pola Mingguan + Belanja Card |
| Deployment | HELD until Sprint I beta gate + Sprint J dry-run pass |
| Last updated | 2026-05-22: Sprint G readiness hardening complete; 115/115 tests; dependency audit clean |

### Roadmap

| Sprint | Status | Scope | Exit signal |
|---|---:|---|---|
| Phase 0 | Done | Research + foundation | 5 interviews validated; pain confirmed |
| Sprint A | Done | Backbone | Onboarding, stock parse, confirm, Supabase save |
| Sprint B | Done | Magic Layer | Belanja Card, promo draft, riwayat |
| Sprint C | Done | Polish | Subuh mode, animation, empty/loading/error states |
| Sprint D | Done | Wow Layer | Pola Mingguan, demo seed, mock cuaca |
| Sprint E | Done | Reliability | PWA shell, offline draft queue, skeletons, retry, voice flag |
| Sprint F | Done | Auth + Multi-tenancy + UI Kit | OTP auth, RLS, middleware, UI Kit migration |
| Sprint G | Next | Real Integrations | BMKG real API, weather cache, rate limit, audit log |
| Sprint H | Later | Observability | Sentry, PostHog, accuracy spot-checks, structured logs |
| Sprint I | Later | Beta Onboarding | 5 real merchants active D7; retention week 1 > 60% |
| Sprint J | Deferred | Submission Prep | 3 dry-runs, backup video, mobile real device test, README polish |

### Active Sprint G

**Goal:** replace mock-only integration paths with real, guarded infrastructure while preserving the current mobile/UI baseline.

**Build scope:**
- BMKG real API client with per-`adm4_code` cache, 6h TTL.
- `FEATURE_MOCK_WEATHER=false` path from mock weather to real weather.
- Rate limiting per user/phone/IP using `THRESHOLDS.RATE_LIMIT`.
- Audit writes for `recommendation_generated` and `promo_generated`.

**Readiness baseline already cleared:**
- KV contract exists in `src/lib/kv/rate-limit.ts`: REST env, no SDK dependency, hashed identities, fixed windows, memory fallback, tests.
- `src/lib/config/locations.ts` is the current BMKG `adm4_code` mapping source; onboarding persists `location_label` + `adm4_code`.
- Audit table/RLS exists in `supabase/migrations/0001_init.sql`; AI audit writes are best-effort.
- Responsive audit passed for `/login`, `/onboarding`, `/dashboard`, `/catat`, `/riwayat`, `/ui-kit` at 390px and 430px with seeded localStorage.
- Dependency audit passed: `pnpm audit --prod --audit-level=moderate`.

**Implementation guardrails:**
- Keep Dashboard, Catat, Riwayat, Login, Onboarding, and `/ui-kit` aligned to `src/components/ui-kit/*`.
- Preserve `ActionResult<T>` returns; Server Actions do not throw to the client.
- Keep PII out of logs, prompts, rate-limit keys, and audit records.
- If BMKG mapping is missing/null, fall back to mock or unavailable weather state, not a broken UI.
- Re-run mobile audit after touching topbar, bottom nav, weather card, dashboard cards, ticker/banner SVG, or `/ui-kit`.

### Research Signals

| Signal | Product rule |
|---|---|
| Short chat-style input is natural | Keep stock input conversational, e.g. "lele sisa 2 kg, ayam habis" |
| Bad advice can hurt cashflow | Recommendation must be allowed to reduce purchase, not only increase |
| Friday/weekend matters | Rules must include day context |
| Daily cash is constrained | Recommendations must respect small-merchant budget reality |
| Weather affects demand | BMKG integration is relevant, but fallback must be safe |
| WTP exists only after proof | Freemium remains valid after real merchant validation |

### Now

_(empty - Sprint G can start from the readiness baseline above)_

### Blockers

_(none)_

### Verification Gate

Before marking any Sprint G slice complete, run:

```bash
pnpm typecheck
pnpm lint
pnpm test
FEATURE_UI_KIT_PREVIEW=true pnpm build
pnpm audit --prod --audit-level=moderate
```

For UI-impacting work, also run `scripts/ui-responsive-audit.fn.js` through Playwright CLI at 390px and 430px with:

- `stockast.onboarding.v1`
- `stockast.subuh.override=off`

### Phase Log

| Date | Entry | Verification |
|---|---|---|
| 2026-05-22 | Sprint G readiness hardening: KV/rate-limit contract, OTP + AI rate limits, audit events, UI Kit notifications, mojibake guard, env/docs updates, patched dependency overrides | typecheck; lint 0 errors; test 115/115; build; prod audit clean; responsive audit 12/12 |
| 2026-05-22 | Sprint F complete: phone OTP, RLS tenant isolation, session-scoped Server Actions, middleware, UI Kit migration | 109/109 tests; 10 routes build clean |
| 2026-05-20 | Codebase cleanup: removed dead feature flag abstraction and unused deps; docs synced to as-built architecture | 104/104 tests |
| 2026-05-20 | UI Kit foundation landed under `src/components/ui-kit/*`; `/ui-kit` gated by `FEATURE_UI_KIT_PREVIEW` | 104/104 tests; build green |
| 2026-05-20 | Strategy pivot: Phase 2 hardening pulled into pre-submission track; Sprint J deferred until beta gate | docs updated |
| 2026-05-20 | Sprint E reliability: PWA, offline drafts, skeletons, retry, voice flag | 104/104 tests; build green |
| 2026-05-20 | Sprint D audit pipeline: onboarding persistence, graceful DB degrade, Subuh FOUC fix, autoseed flag | 104/104 tests |
| 2026-05-16 | Sprint D Wow Layer: Pola Mingguan, demo seed, mock cuaca | 82/82 tests; build green |
| 2026-05-16 | Phase 1.5 strategy locked: voice, Pola Mingguan, offline PWA, seed data, cuaca mock pulled forward | docs updated |
| 2026-05-16 | Sprint C polish: Subuh mode, Belanja animation, designed empty/loading/error states | 65/65 tests; build green |
| 2026-05-16 | Sprint B Magic Layer: RecommendationService, PromoService, Belanja Card, PromoCardList, Riwayat | 53/53 tests; build green |
| 2026-05-15 | Sprint A Backbone: AI parse, copy module, DB layer, StockService, onboarding, StockFlow, dashboard shell | 36/36 tests; build green |
| 2026-05-15 | Phase 0 research complete | 5/5 interviews validated |
| 2026-05-15 | Gemini model verify fixed and `.docs/models.json` recorded | model check passed |
| 2026-05-15 | Foundation scaffold landed | 21 unit tests |

### Session Checklist

**Start:** read Snapshot + Active Sprint G, skim relevant `.docs/`, confirm task matches current sprint.

**End:** update Snapshot/Now/Blockers if changed, append Phase Log only for durable milestones, run the relevant Verification Gate before claiming green.

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
