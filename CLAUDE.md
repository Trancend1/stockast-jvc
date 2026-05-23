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
13. **UI Kit is the only layout authority.** Page shells compose `src/components/ui-kit/*` primitives + variants. Feature components never inline raw Tailwind for new visual concepts — extend the kit instead. Tokens edited in `stockast-UI/ui-kit/tokens/tokens.css` + `src/styles/ui-kit-utilities.css` only.

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
| Phase | 1.6 — Demo Readiness (JVC Submission MVP) |
| Active sprint | Sprint G: Demo Readiness |
| Status | Polish + dry-run + deploy (no new feature build) |
| Branch | `feat/ui-kit` |
| Magic moment | Working end-to-end on demo seed; ready for judging dry-run |
| Deployment | Production deploy queued; goes live once Sprint G exit criteria met |
| Last updated | 2026-05-23: scope refocused to JVC submission MVP only |

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
| Sprint G | Active | Demo Readiness | Polish + dry-runs + production deploy + backup video + submission package |

Post-submission directions (private beta, monetization, scale) live in `.docs/FUTURE_ROADMAP.md` and are not part of current execution scope.

### Active Sprint G — Demo Readiness

**Goal:** ship submission. No new feature work. Polish, dry-run, deploy.

**Build scope (in priority order):**
1. Onboarding flow polish — sub-60s time-to-magic-moment confirmed on real device.
2. UI consistency sweep — all routes match `src/components/ui-kit/*` primitives; mojibake guard holds.
3. 3× demo dry-run with stopwatch (target <90s to Belanja Card; 0 visible bugs across 5 consecutive runs).
4. Real-device test — 1 iPhone, 1 low-end Android Chrome.
5. Vercel production deploy (+ optional custom domain).
6. 60s backup demo video recorded against production URL.
7. README polish for judges (tagline + 30-sec flow + demo link + screenshots).
8. Voice flag decision: flip ON only if 5/5 dry-runs lurus, else stay OFF.

**Explicitly out of scope:**
- Real BMKG API integration (mock weather kept as-built).
- Sentry / PostHog / third-party observability wiring.
- 5-merchant beta cohort + D7 retention gate.
- Multi-staff role, WhatsApp Cloud API, monetization, referrals.
- Any scaling work.

**Implementation guardrails:**
- Keep Dashboard, Catat, Riwayat, Login, Onboarding, Pola Mingguan, and `/ui-kit` aligned to `src/components/ui-kit/*`.
- Preserve `ActionResult<T>` returns; Server Actions do not throw to the client.
- Keep PII out of logs, prompts, rate-limit keys, and audit records.
- If BMKG `adm4_code` mapping is missing/null, fall back to mock weather state, not a broken UI.
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
| 2026-05-23 | Scope refocus: collapsed Sprint G/H/I/J → single Sprint G Demo Readiness; deleted Phase 3/4 from execution doc; synced `.docs/` + `CLAUDE.md`; added UI Kit layout-authority rule | docs only, no code change |
| 2026-05-22 | Sprint G readiness hardening (under prior scope): KV/rate-limit contract, OTP + AI rate limits, audit events, UI Kit notifications, mojibake guard, env/docs updates, patched dependency overrides | typecheck; lint 0 errors; test 115/115; build; prod audit clean; responsive audit 12/12 |
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

## Definition of done — Submission MVP

- [ ] Onboarding < 60 detik on real low-end Android
- [ ] Stock input → parse → confirm < 30 detik
- [ ] Belanja Card renders with sensible reasoning
- [ ] Promo draft generates valid Indonesian copy
- [ ] Copy-to-WhatsApp works on Android Chrome
- [ ] Deployed on Vercel production (custom domain optional)
- [ ] Demo dry-run 5 menit zero-bug, 5× berturut-turut
- [ ] Backup demo video recorded against production URL
- [ ] Subuh Mode toggle works
- [ ] Loading/empty/error states verified across all routes
- [ ] Tested iPhone SE viewport + 1 low-end Android device
- [ ] README polish: tagline + 30-sec flow + demo link + screenshots
- [ ] Voice flag decision recorded (default OFF unless 5/5 lurus)

**NOT in MVP DoD:** real BMKG, observability stack, beta cohort, monetization, scaling. → `.docs/FUTURE_ROADMAP.md`.
