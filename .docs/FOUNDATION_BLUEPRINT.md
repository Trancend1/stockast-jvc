# Foundation Blueprint — Stockast

**Version:** 1.0
**Date:** 2026-05-15
**Status:** Pre-bootstrap. Synthesized from PRD, SYSTEM_ARCHITECTURE, DESIGN_SYSTEM, ENGINEERING_STANDARDS, EXECUTION_BLUEPRINT, FEATURE_PRIORITY_MATRIX, AI_SLOP_PREVENTION, BRAND_DIRECTION, FUTURE_ROADMAP, LAUNCH_CHECKLIST.
**Purpose:** Single executable foundation reference. Every section traces back to a docs decision.

---

## 0. Reading order

This document is the **build manual**. Read it once top-to-bottom before writing any code. Sections 1-4 are architecture (slow, irreversible). Sections 5-7 are operations (medium-reversible). Sections 8-9 are coding rhythm (fast). Section 10 is execution. Section 11 is the risk register you re-read weekly.

The docs in `.docs/` remain the **source of truth for "why"**. This blueprint is the source of truth for **"how to start"**.

---

## 1. Starter Codebase Architecture

### 1.1 Architectural shape (one sentence)

A **single Next.js 15 App Router monolith** deployed on Vercel, talking to **one Supabase project** (Postgres + Auth + Storage + RLS), with **Gemini API direct SDK** as the only external AI dependency, **Server Actions as the primary mutation interface**, and **pure-function rule engines** for any decision the AI is not allowed to make alone.

Why this shape (per `SYSTEM_ARCHITECTURE.md §1`):
- Vertical slice first, abstraction later.
- Serverless-first; no server admin until proven necessary.
- Postgres for everything until you outgrow it.
- Stateless app, stateful DB.
- Async by intent, sync by default.

### 1.2 Layer diagram (the only diagram you need)

```
┌───────────────────────────────────────────────────────────┐
│  Browser (Bu Yati's Android, Chrome PWA)                  │
└───────────────┬───────────────────────────────────────────┘
                │  HTTPS · httpOnly cookie session
┌───────────────▼───────────────────────────────────────────┐
│  Vercel Edge (Next.js 15 App Router)                      │
│  ┌─────────────────────────┐  ┌────────────────────────┐  │
│  │ Server Components       │  │ Route Handlers         │  │
│  │ (read-mostly UI)        │  │ (webhooks, AI proxy)   │  │
│  └─────────────────────────┘  └────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ Server Actions (primary mutation interface)         │  │
│  └─────────────────────────────────────────────────────┘  │
└───────────────┬───────────────────────────────────────────┘
                │  service-layer function call (pure TS)
┌───────────────▼───────────────────────────────────────────┐
│  Service layer (`lib/services/*`)                         │
│  StockService · RecommendationService · PromoService      │
│  AIService (Gemini wrapper) · WeatherService (BMKG)       │
└────┬──────────────┬─────────────────────────┬─────────────┘
     │              │                         │
┌────▼─────┐  ┌─────▼────────┐         ┌──────▼──────┐
│ Supabase │  │  Gemini API  │         │  BMKG API   │
│ Postgres │  │  (REST/SDK)  │         │  (cache)    │
│  + Auth  │  └──────────────┘         └─────────────┘
│  + RLS   │
│  + Stor. │
└──────────┘
                ┌──────────────────────────────────────┐
                │ Vercel KV (rate-limit, cache, idem.) │
                └──────────────────────────────────────┘
```

### 1.3 Boundary rules (do not violate)

| Boundary | Rule | Why |
|---|---|---|
| Components → DB | Forbidden direct. Go through Server Actions or `lib/db/queries/`. | Defense-in-depth, RLS clarity, testability. |
| Components → AI | Forbidden direct. Go through `lib/services/*` which calls `AIService`. | Uniform retry, logging, audit, schema validation. |
| Services → Services | Forbidden cross-service calls. Orchestrate at Server Action level. | Prevents hidden coupling, keeps services pure-function-testable. |
| AI → Decision | Forbidden. AI explains, rule engine decides. | Trust foundation (`SYSTEM_ARCHITECTURE.md §4`). |
| Client → Secrets | Forbidden. Server-only env vars never in `NEXT_PUBLIC_*`. | Security baseline. |

### 1.4 The four "kinds" of code (and where each lives)

1. **Presentation** — React components in `src/components/` and `src/app/`. No business logic, no DB calls.
2. **Orchestration** — Server Actions in `src/app/actions/`. Auth check → input validation → service call → cache invalidation. No business logic itself.
3. **Domain logic** — `src/lib/services/*` and `src/lib/rules/*`. Pure TS functions. Testable without mocks (or with one explicit mock per external dep).
4. **Infrastructure** — `src/lib/db/`, `src/lib/ai/`, `src/lib/weather/`, `src/lib/kv/`. Thin wrappers, no domain knowledge.

When you don't know where to put something, ask: "if I needed to test this without a database, would it be possible?" If yes → domain. If no → infrastructure.

---

## 2. Folder Structure (as-built, Sprint E+UI Kit complete)

> **Note:** This reflects the actual current state of the codebase (Sprint E + UI Kit integration done). Items marked `[Sprint F+]` are planned but not yet built. Items marked `[Phase 3]` are deferred.

```
stockast/
├── .docs/                              # All product/strategy/engineering docs
├── public/
│   ├── icons/                          # PWA app icons (SVG, any + maskable)
│   ├── manifest.webmanifest            # PWA manifest (brand colors, standalone)
│   └── sw.js                           # Custom service worker (shell precache + offline fallback)
├── supabase/
│   ├── migrations/                     # Forward-only SQL migrations (5 files)
│   ├── seed.sql                        # Bu Yati Pecel Lele Salatiga sample data
│   └── config.toml
├── src/
│   ├── app/                            # Next.js App Router (flat routes, no route groups yet)
│   │   ├── actions/                    # Server Actions (all mutations live here)
│   │   │   ├── stock.ts                # parseAndSaveStockDraft, confirmStockDraft
│   │   │   ├── recommendation.ts       # getBelanjaCard, ensureDemoSeed
│   │   │   ├── promo.ts                # getPromosForToday, markPromoCopied
│   │   │   ├── pola-mingguan.ts        # getPolaMingguanData
│   │   │   ├── riwayat.ts              # getRiwayat7d
│   │   │   └── onboarding.ts           # applyOnboardingProfile
│   │   ├── dashboard/page.tsx          # Today's Belanja Card + Pola Mingguan + Cuaca
│   │   ├── catat/page.tsx              # Stock input flow
│   │   ├── riwayat/page.tsx            # 7-day history
│   │   ├── onboarding/page.tsx         # 3-step onboarding scroll
│   │   ├── ui-kit/page.tsx             # Internal UI preview (FEATURE_UI_KIT_PREVIEW gate)
│   │   ├── globals.css                 # Tailwind @theme + all --color-* tokens
│   │   ├── layout.tsx                  # Root: fonts (PJS + Newsreader + JetBrains Mono), SubuhModeProvider, css imports
│   │   └── page.tsx                    # Redirect to /dashboard or /onboarding
│   ├── components/
│   │   ├── ui/                         # shadcn-style prod primitives (button, card, input, label, select, textarea, skeleton, illustration)
│   │   ├── features/                   # Prod feature components — NOT modified during UI Kit integration
│   │   │   ├── app-gate/AppGate.tsx    # Redirect guard (onboarding vs dashboard)
│   │   │   ├── belanja/                # BelanjaCard, BelanjaCardSkeleton, PromoCardList
│   │   │   ├── cuaca/CuacaCard.tsx     # Weather card (mock via FEATURE_MOCK_WEATHER)
│   │   │   ├── dashboard/DashboardShell.tsx
│   │   │   ├── onboarding/OnboardingForm.tsx
│   │   │   ├── pola-mingguan/PolaMingguanCard.tsx
│   │   │   ├── riwayat/RiwayatList.tsx
│   │   │   ├── stock/StockFlow.tsx, VoiceInputButton.tsx
│   │   │   └── subuh/SubuhModeProvider.tsx, SubuhToggle.tsx
│   │   ├── pwa/RegisterServiceWorker.tsx  # SW registration (prod-only)
│   │   └── ui-kit/                     # UI Kit namespace — additive, no prod components modified
│   │       ├── index.ts                # Top-level barrel (export * from all sub-domains)
│   │       ├── icons/                  # 63 named Icon* exports (server component, zero JS)
│   │       ├── glyphs/                 # GlyphLele/Ayam/Tahu/Tempe/Cabai + glyphFor/categoryFor
│   │       ├── illustrations/          # motifs.tsx, branding.tsx, empty-states.tsx
│   │       ├── weather/                # 6 WeatherScene components + WEATHER_SCENES map
│   │       ├── charts/                 # Sparkline, BarSeries, CandleSeries, DeltaWidget, DonutMini, ProgressMeter, TallyCounter, HeatStrip
│   │       ├── primitives/             # SkButton, SkCard, SkPill, SkInput, SkLabel, SkTopBar, SkBottomNav, SkSheet, SkThinking, SkCountUp, SkSteps, SkTypography, SkWeatherChip
│   │       ├── notifications/          # Toast, Banner, InlineAlert, PushPreview, ActivityDot
│   │       ├── onboarding/             # OnbDecorNama, OnbDecorLokasi, OnbDecorMenu
│   │       └── belanja-variants/       # BelanjaCardEditorial, Warm, Compact, Pasar + shared data
│   ├── styles/                         # UI Kit CSS (imported in layout.tsx after globals.css)
│   │   ├── ui-kit-tokens.css           # --sk-* alias layer mapping to prod --color-* tokens
│   │   └── ui-kit-utilities.css        # .sk-screen, .sk-btn, .sk-card, keyframes (sk-rise/fade/pulse/thinking)
│   ├── hooks/
│   │   ├── use-subuh-mode.ts           # Auto dark 02:00-05:30 Jakarta + manual override; sets .subuh-mode class AND data-subuh attribute
│   │   └── use-online-status.ts        # Online/offline detection for draft queue
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── client.ts               # Gemini client singleton (server-only)
│   │   │   ├── generate.ts             # Typed generate wrapper with retry
│   │   │   ├── schemas.ts              # Zod schemas for all AI responses
│   │   │   └── prompts/                # parse-stock-v1, explain-recommendation-v1, promo-draft-v1
│   │   ├── db/
│   │   │   ├── admin.ts                # Service role client (Phase 1 only; Sprint F replaces with session auth)
│   │   │   ├── errors.ts               # MissingTableError + typed error classes
│   │   │   ├── types.ts                # Hand-rolled until `pnpm db:types` in Sprint F
│   │   │   └── queries/                # stock-logs, recommendations, promos, menu-items, outlets, demo-seed, ai-audit
│   │   ├── services/                   # Pure-function domain layer
│   │   │   ├── StockService.ts
│   │   │   ├── RecommendationService.ts
│   │   │   ├── PromoService.ts
│   │   │   ├── demo-seed.ts            # buildDemoSeedDays + ensureDemoSeed (idempotent)
│   │   │   ├── onboarding-profile.ts   # normalizeOnboardingInput + applyOnboardingProfile
│   │   │   ├── pola-mingguan.ts        # computePolaMingguan (pure function, no I/O)
│   │   │   ├── promo-detection.ts      # promoRatioCheck pure rule
│   │   │   ├── stock-mapping.ts        # mapParsedToStockLog
│   │   │   └── recommendation-mapping.ts
│   │   ├── rules/                      # Pure business logic, no I/O
│   │   │   ├── recommendation.ts
│   │   │   ├── promo.ts
│   │   │   └── stock.ts
│   │   ├── auth/
│   │   │   └── demo-context.ts         # getDemoContext (Phase 1 single-tenant; Sprint F replaces)
│   │   ├── offline/
│   │   │   └── draft-queue.ts          # Raw IDB draft queue (no deps) + useOnlineStatus
│   │   ├── copy/                       # Centralized Indonesian copy strings
│   │   │   ├── belanja.ts, common.ts, cuaca.ts, onboarding.ts, pola-mingguan.ts, riwayat.ts, stock.ts
│   │   ├── config/
│   │   │   ├── env.ts                  # Zod-validated env at boot; exports `env` + `flags`
│   │   │   ├── thresholds.ts           # All magic numbers live here (THRESHOLDS.*)
│   │   │   └── locations.ts            # Indonesian location config (adm4 codes)
│   │   ├── subuh.ts                    # SUBUH_DATA_ATTR constant + bootstrap inline script
│   │   ├── subuh-mode.ts               # Pure time-gate logic (isSubuhTime, getSubuhWindow)
│   │   ├── cuaca-mock.ts               # getMockWeather() — FNV-1a hash cycling 3 states
│   │   ├── onboarding-state.ts         # localStorage helpers for onboarding progress
│   │   └── utils.ts                    # cn(), WEEKDAY_LABELS_ID, todayIsoUtc/tomorrowIsoUtc/weekdayFromServiceDate
│   └── types/
│       ├── domain.ts                   # StockLog, Recommendation, Promo, WeatherCategory, etc.
│       └── action-result.ts            # ActionResult<T>, ok(), fail()
├── tests/
│   └── unit/
│       ├── ai/                         # prompt-builders, schemas
│       ├── lib/                        # cuaca-mock, db-errors, subuh-mode, subuh
│       ├── rules/                      # promo, recommendation
│       └── services/                   # demo-seed, onboarding-profile, pola-mingguan, promo-detection, recommendation-mapping, stock-mapping
├── scripts/
│   └── verify-gemini-model.ts          # Gemini model name check + .docs/models.json write
├── stockast-UI/                        # Source design reference (standalone Babel-inline JSX) — untracked
├── .env.example                        # Documented env contract
├── eslint.config.mjs
├── next.config.ts                      # typedRoutes, Permissions-Policy (microphone conditional)
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── tsconfig.json                       # strict + noUncheckedIndexedAccess
└── vitest.config.ts
```

### Planned but not yet built

- `src/lib/kv/` — Vercel KV REST-backed rate-limit + future idempotency (Sprint G)
- `src/lib/logger/` — structured PII-safe logger (Sprint H)
- `(auth)/` route group — Supabase phone OTP (Sprint F)
- `src/middleware.ts` — session check + redirect (Sprint F)
- `tests/integration/` — RLS multi-tenant tests (Sprint F)
- `tests/e2e/` — Playwright magic-moment flow (Sprint J)

### What is intentionally absent

- No `src/components/AIModelRouter/`
- No `apps/` or `packages/` monorepo split
- No `Dockerfile` or `k8s/`
- No `prisma/` (Supabase types are enough)
- No `i18n/` (Indonesian-first, not multi-locale)
- No `redux/` or `store/`
- No `graphql/`

---

## 3. Tech Stack — Final Recommendation

Locked per `SYSTEM_ARCHITECTURE.md §2`. Below is the **exact version range** to install on Day 1.

| Layer | Choice | Version | Install command (pnpm) | Notes |
|---|---|---|---|---|
| Runtime | Node | 22 LTS | `.nvmrc` → `22` | Vercel default 24 also works; pin to 22 for predictability. |
| Package manager | pnpm | 9.x | `corepack enable && corepack prepare pnpm@latest --activate` | Lockfile reproducibility + disk savings. |
| Framework | Next.js | 15.x | `pnpm create next-app@latest stockast --ts --tailwind --eslint --app --src-dir --import-alias "@/*"` | App Router only. |
| Language | TypeScript | 5.x | bundled with create-next-app | `strict: true`, `noUncheckedIndexedAccess: true`. |
| Styling | Tailwind | v4 | bundled | CSS-first config; use `@theme` directive for tokens. |
| UI primitives | shadcn/ui | latest | `pnpm dlx shadcn@latest init` then add `button card input textarea sheet dialog skeleton toast` | Copy-paste; no runtime dep. |
| Server state | React `useState` + Server Actions | — | built-in | TanStack Query evaluated and removed — Server Actions cover all mutations; no client caching layer needed in Phase 1. |
| Forms | Manual `useState` + Zod | — | built-in | React Hook Form + `@hookform/resolvers` evaluated and removed — onboarding form is simple enough that manual state is cleaner. Zod used for AI response validation. |
| DB / Auth | Supabase | latest | `pnpm add @supabase/supabase-js @supabase/ssr` | `@supabase/ssr` for App Router cookie handling. |
| AI | Google GenAI SDK | latest | `pnpm add @google/genai` | **Verify model name first** via `scripts/verify-gemini-model.ts`. |
| KV | REST env contract (Sprint G) | `KV_REST_API_URL`, `KV_REST_API_TOKEN` | No SDK dependency; use `src/lib/kv/*` adapter | Rate limit contract ready; cache/idempotency can reuse adapter. |
| Date utils | built-in | — | — | date-fns + date-fns-tz evaluated and removed — only UTC helpers needed; `utils.ts` covers all cases with vanilla JS. |
| Test | Vitest + Testing Library | latest | `pnpm add -D vitest @testing-library/react @testing-library/jest-dom jsdom` | Co-locate `*.test.ts`. |
| Lint | ESLint flat + typescript-eslint | latest | bundled with create-next-app + `pnpm add -D @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-tailwindcss` | Custom rules in §8. |
| Format | Prettier + plugin-tailwindcss | latest | `pnpm add -D prettier prettier-plugin-tailwindcss` | Format on save. |
| Git hooks | Lefthook | latest | `pnpm add -D lefthook && pnpm lefthook install` | Lighter than husky+lint-staged. |

**Explicitly NOT installing** (per `SYSTEM_ARCHITECTURE.md §2` "stack not chosen"):
- ❌ Prisma · ❌ tRPC · ❌ Genkit · ❌ Zustand · ❌ Redux · ❌ Express · ❌ Docker · ❌ Redis (use Vercel KV) · ❌ Inngest (defer to Phase 3) · ❌ Sentry (defer to Phase 2)

### Day-0 gate: Gemini model name verification

Before any AI code is written, run `scripts/verify-gemini-model.ts` against `https://ai.google.dev/gemini-api/docs/models`. Pin the resolved IDs into `.docs/models.json`. If `gemini-2.0-flash` or `gemini-2.0-flash-lite` are renamed/deprecated, update `lib/config/thresholds.ts` `AI_MODEL` constants. **Do not** hardcode model strings elsewhere in the codebase.

---

## 4. Database & API Pattern

### 4.1 Tables (initial migration `0001_init.sql`)

Schema is condensed from `SYSTEM_ARCHITECTURE.md §6` with explicit columns:

```sql
-- ── Identity ─────────────────────────────────────────────────────
create table users (
  id uuid primary key default gen_random_uuid(),
  phone text unique,                            -- nullable for demo single-tenant
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null references users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table outlets (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  location_label text not null,                 -- "Salatiga, Jawa Tengah"
  adm4_code text,                               -- BMKG code, nullable for demo
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table memberships (
  user_id uuid not null references users(id) on delete cascade,
  organization_id uuid not null references organizations(id) on delete cascade,
  role text not null check (role in ('owner','staff')),
  created_at timestamptz not null default now(),
  primary key (user_id, organization_id)
);

-- ── Menu ─────────────────────────────────────────────────────────
create table menu_items (
  id uuid primary key default gen_random_uuid(),
  outlet_id uuid not null references outlets(id) on delete cascade,
  name text not null,
  normalized_name text not null,                -- lowercase, for AI match
  unit text not null default 'porsi',
  created_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (outlet_id, normalized_name)
);

-- ── Stock ────────────────────────────────────────────────────────
create table stock_log_drafts (
  id uuid primary key default gen_random_uuid(),
  outlet_id uuid not null references outlets(id) on delete cascade,
  raw_input text not null,
  service_date date not null,
  status text not null check (status in ('pending','parsed','confirmed','rejected')),
  parsed_payload jsonb,                         -- AI parse result before confirm
  idempotency_key text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table stock_logs (
  id uuid primary key default gen_random_uuid(),
  outlet_id uuid not null references outlets(id) on delete cascade,
  service_date date not null,
  items jsonb not null,                         -- [{menu_item_id, sold, leftover, unit}]
  source_draft_id uuid references stock_log_drafts(id),
  confirmed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (outlet_id, service_date)              -- one log per outlet per date
);

-- ── Recommendations ──────────────────────────────────────────────
create table recommendations (
  id uuid primary key default gen_random_uuid(),
  outlet_id uuid not null references outlets(id) on delete cascade,
  service_date date not null,                   -- the date being shopped FOR
  items jsonb not null,                         -- [{menu_item_id, suggested, base, factor_weather, factor_weekday}]
  reasoning text not null,                      -- Gemini-generated Indonesian explanation
  confidence_label text not null check (confidence_label in ('Pola jelas','Data baru, hati-hati','Tidak yakin')),
  audit jsonb not null,                         -- {prompt_version, model, latency_ms, weather_snapshot_id}
  created_at timestamptz not null default now(),
  unique (outlet_id, service_date)
);

-- ── Promos ───────────────────────────────────────────────────────
create table promo_drafts (
  id uuid primary key default gen_random_uuid(),
  outlet_id uuid not null references outlets(id) on delete cascade,
  service_date date not null,
  message text not null,
  discount_percent int check (discount_percent between 0 and 15),  -- hard cap
  status text not null check (status in ('draft','copied','dismissed')),
  created_at timestamptz not null default now()
);

-- ── Weather (BMKG cache) ─────────────────────────────────────────
create table weather_snapshots (
  id uuid primary key default gen_random_uuid(),
  adm4_code text not null,
  forecast_date date not null,
  payload jsonb not null,
  fetched_at timestamptz not null default now(),
  unique (adm4_code, forecast_date)
);

-- ── Audit (AI calls) ─────────────────────────────────────────────
create table ai_audit_logs (
  id uuid primary key default gen_random_uuid(),
  outlet_id uuid references outlets(id) on delete set null,
  entity_type text not null,                    -- 'stock_parse' | 'recommendation_explain' | 'promo_draft'
  entity_id uuid,
  prompt_version text not null,
  model text not null,
  raw_input_hash text not null,                 -- sha256(raw_input) — never store raw
  raw_response jsonb,
  latency_ms int,
  cost_usd numeric(10,6),
  created_at timestamptz not null default now()
);

-- ── Indexes ──────────────────────────────────────────────────────
create index idx_stock_logs_outlet_date on stock_logs(outlet_id, service_date desc);
create index idx_recommendations_outlet_date on recommendations(outlet_id, service_date desc);
create index idx_weather_adm4_date on weather_snapshots(adm4_code, forecast_date);
create index idx_drafts_outlet_status on stock_log_drafts(outlet_id, status, created_at desc);
create index idx_audit_entity on ai_audit_logs(entity_type, entity_id);
create index idx_memberships_user on memberships(user_id);

-- ── RLS ──────────────────────────────────────────────────────────
alter table organizations enable row level security;
alter table outlets enable row level security;
alter table memberships enable row level security;
alter table menu_items enable row level security;
alter table stock_log_drafts enable row level security;
alter table stock_logs enable row level security;
alter table recommendations enable row level security;
alter table promo_drafts enable row level security;
alter table ai_audit_logs enable row level security;

-- Helper view: which orgs current user belongs to
create or replace function auth_user_orgs() returns setof uuid
language sql stable
as $$
  select organization_id from memberships where user_id = auth.uid();
$$;

-- Generic "outlet belongs to user's org" policy template applied per table:
create policy "members read outlet data"
  on outlets for select using (organization_id in (select auth_user_orgs()));
create policy "owner writes outlet data"
  on outlets for all using (
    organization_id in (
      select organization_id from memberships
      where user_id = auth.uid() and role = 'owner'
    )
  );

-- (repeat the same pattern for stock_log_drafts, stock_logs, recommendations,
--  promo_drafts, menu_items, ai_audit_logs — all gated by outlet_id → org → membership)
```

**Migration discipline:**
- Forward-only.
- `DROP COLUMN` requires 2-phase: mark unused PR → wait one full release cycle → remove.
- `ALTER TYPE`/`RENAME` reviewed twice. Big renames split into two migrations.
- Local first via `supabase db reset`, then `supabase db push` to remote during off-peak (after 22:00 WIB per `ENGINEERING_STANDARDS.md §13`).

### 4.2 API pattern — Server Actions as primary, Route Handlers for the rest

| Use case | Pattern | Example path |
|---|---|---|
| User clicks a button to mutate state | **Server Action** | `src/app/actions/stock.ts → submitStockDraft` |
| Streaming response (AI parse with progress) | **Route Handler** + `ReadableStream` | `src/app/api/ai/stock/parse/route.ts` |
| External webhook (WhatsApp, Supabase Auth) | **Route Handler** with signature verify | `src/app/api/webhooks/whatsapp/route.ts` |
| Scheduled job | **Route Handler** with `Authorization: Bearer $CRON_SECRET` | `src/app/api/cron/recompute-recommendations/route.ts` |
| Page render | **Server Component** | `src/app/(app)/dashboard/page.tsx` |
| Client-side cache invalidation | `revalidatePath` / `revalidateTag` inside the Server Action | — |

### 4.3 Response shape (consistent everywhere)

```typescript
// src/types/action-result.ts
export type ActionResult<T> =
  | { data: T; error: null }
  | { data: null; error: ActionError };

export type ActionError = {
  code:
    | 'AUTH_REQUIRED'
    | 'AUTH_FORBIDDEN'
    | 'INPUT_INVALID'
    | 'QUOTA_EXCEEDED'
    | 'AI_PARSE_FAILED'
    | 'AI_VALIDATION_FAILED'
    | 'WEATHER_FETCH_FAILED'
    | 'CONFLICT_STATE'
    | 'NOT_FOUND'
    | 'INTERNAL';
  message: string;          // Indonesian, user-facing
  details?: Record<string, unknown>;
};
```

Server Actions **never throw to the client** — catch + map to `ActionResult` (per `ENGINEERING_STANDARDS.md §5`).

### 4.4 Server Action canonical template

```typescript
// src/app/actions/stock.ts
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { requireOutletAccess } from '@/lib/auth/require-outlet';
import { stockService } from '@/lib/services/stock-service';
import { handleActionError } from '@/lib/utils/handle-action-error';
import { rateLimit } from '@/lib/kv/rate-limit';
import { withIdempotency } from '@/lib/kv/idempotency';
import type { ActionResult } from '@/types/action-result';
import type { StockDraft } from '@/types/domain';

const SubmitStockDraftInput = z.object({
  outletId: z.string().uuid(),
  rawNote: z.string().min(1).max(2000),
  serviceDate: z.string().date(),
  idempotencyKey: z.string().uuid(),
});

export async function submitStockDraft(
  raw: z.input<typeof SubmitStockDraftInput>,
): Promise<ActionResult<StockDraft>> {
  try {
    const input = SubmitStockDraftInput.parse(raw);
    const ctx = await requireOutletAccess(input.outletId);
    await rateLimit({ key: `stock:${ctx.user.id}`, limit: 30, windowSec: 86400 });

    const draft = await withIdempotency(input.idempotencyKey, () =>
      stockService.createDraft({
        outletId: input.outletId,
        rawNote: input.rawNote,
        serviceDate: input.serviceDate,
        menuItems: ctx.menuItems,
      }),
    );

    revalidatePath('/stock');
    revalidatePath('/dashboard');
    return { data: draft, error: null };
  } catch (err) {
    return handleActionError(err);
  }
}
```

### 4.5 Recommendation rule engine (locked formula, copy verbatim from `SYSTEM_ARCHITECTURE.md §4`)

```typescript
// src/lib/rules/recommendation.ts
import { THRESHOLDS } from '@/lib/config/thresholds';

export type WeatherCategory = 'unknown' | 'hujan_deras' | 'mendung' | 'cerah_libur';

export type RecommendItem = {
  menuItemId: string;
  base: number;              // rolling avg sold per day, last 7d, outliers excluded
  weatherFactor: number;
  weekdayFactor: number;
  suggested: number;
  confidenceLabel: 'Pola jelas' | 'Data baru, hati-hati' | 'Tidak yakin';
};

export function recommend(input: {
  history: Array<{ date: string; sold: number }>;
  weekday: number;
  weather: WeatherCategory;
}): Omit<RecommendItem, 'menuItemId'> {
  const base = rollingAverage(input.history);
  const weatherFactor = THRESHOLDS.WEATHER_FACTOR[input.weather];
  const weekdayFactor = clamp(
    weekdayRatio(input.history, input.weekday),
    THRESHOLDS.WEEKDAY_FACTOR_MIN,
    THRESHOLDS.WEEKDAY_FACTOR_MAX,
  );
  const raw = base * weatherFactor * weekdayFactor;
  const suggested = Math.round(
    clamp(raw, base * THRESHOLDS.GUARDRAIL_MIN, base * THRESHOLDS.GUARDRAIL_MAX),
  );
  return { base, weatherFactor, weekdayFactor, suggested, confidenceLabel: labelFor(input.history) };
}

// All magic numbers live in thresholds.ts only. NEVER inline.
```

```typescript
// src/lib/config/thresholds.ts
export const THRESHOLDS = {
  WEATHER_FACTOR: {
    unknown: 1.0,
    hujan_deras: 0.85,
    mendung: 0.95,
    cerah_libur: 1.05,
  },
  WEEKDAY_FACTOR_MIN: 0.85,
  WEEKDAY_FACTOR_MAX: 1.15,
  GUARDRAIL_MIN: 0.8,
  GUARDRAIL_MAX: 1.2,
  COLD_START_DAYS: 3,
  PATTERN_CLEAR_STDDEV_RATIO: 0.3,
  AI_MODEL: {
    PARSE: 'gemini-2.0-flash',         // verify Day 1
    EXPLAIN: 'gemini-2.0-flash',
    BULK: 'gemini-2.0-flash-lite',
  },
  PROMO_DISCOUNT_CAP_PERCENT: 15,
  PROMO_FREQUENCY_PER_DAY: 1,
  RATE_LIMIT: {
    AI_PER_USER_PER_DAY: 30,
    OTP_PER_PHONE_PER_15MIN: 3,
    REQ_PER_IP_PER_MIN: 100,
  },
  COST_CEILING_IDR_PER_USER_MONTH: 5000,
} as const;
```

---

## 5. Auth & Security Baseline

### 5.1 Auth flow (per `SYSTEM_ARCHITECTURE.md §7` + `ENGINEERING_STANDARDS.md §7`)

```
Demo MVP (Phase 1):
  Single hardcoded user_id via env DEMO_USER_ID + DEMO_OUTLET_ID
  No auth UI, no OTP, no cookie session
  Toggle via FEATURE_FLAGS.AUTH_REQUIRED = false

Private Beta (Phase 2):
  Phone number input
   → Supabase Auth signInWithOtp (Twilio Indonesia provider)
   → User enters 6-digit OTP
   → Supabase issues JWT (1h) + refresh token (60d)
   → @supabase/ssr writes httpOnly · SameSite=Lax · Secure cookie
   → Middleware (src/middleware.ts) validates session on every (app)/* route
   → Auto-refresh on the server before render
```

### 5.2 Defense in depth (three layers required)

```typescript
// Layer 1 — middleware: session must exist
// src/middleware.ts
export async function middleware(req: NextRequest) {
  const { supabase, response } = createServerClient(req);
  const { data: { session } } = await supabase.auth.getSession();
  if (!session && req.nextUrl.pathname.startsWith('/(app)')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  return response;
}

// Layer 2 — Server Action / Route Handler: role + resource check
export async function requireOutletAccess(outletId: string) {
  const user = await requireAuth();
  const membership = await db.from('memberships').select('role').match({
    user_id: user.id,
    organization_id: (await getOutletOrg(outletId)),
  }).single();
  if (membership.error || !membership.data) throw new ForbiddenError();
  return { user, role: membership.data.role };
}

// Layer 3 — Postgres RLS: row-level enforcement (already in 0001_init.sql)
```

### 5.3 Secrets contract

| Variable | Where | Server-only? | Rotate |
|---|---|---|---|
| `GEMINI_API_KEY` | Vercel env + `.env.local` | Yes | Quarterly |
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel env (production only) | Yes | On incident |
| `BMKG_API_KEY` (if required) | Vercel env | Yes | Quarterly |
| `CRON_SECRET` | Vercel env | Yes | On personnel change |
| `KV_REST_API_TOKEN` | Vercel env auto-provisioned | Yes | Auto |
| `NEXT_PUBLIC_SUPABASE_URL` | `.env.example` | No (client OK) | Stable |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `.env.example` | No (client OK, RLS-gated) | Stable |
| `DEMO_USER_ID`, `DEMO_OUTLET_ID` | `.env.local`, Phase 1 only | Yes | Removed Phase 2 |

Validation: `src/lib/config/env.ts` Zod-parses `process.env` at boot. Boot fails if a required var is missing.

### 5.4 Rate-limit + idempotency

- Rate limit: fixed-window counter in Vercel KV REST per `(scope, hashed identity, window bucket)`, with in-memory fallback for local/test. Limits in `THRESHOLDS.RATE_LIMIT`.
- Idempotency: every Server Action that creates a row accepts a `idempotencyKey: string` (UUIDv4). KV stores `{ result }` keyed by the UUID for 24h.

### 5.5 PII discipline (per UU PDP §15 of SYSTEM_ARCHITECTURE)

Never log: phone numbers, raw stock notes, full prompts together with user input. Log: entity IDs, prompt versions, hashes (`sha256(raw_input)`), durations. UU PDP compliance items (export, delete, retention) are Phase 2 — but log hygiene is **Day 1**.

### 5.6 Input/output validation pipeline (the only one)

```
Untrusted input  →  Zod schema  →  Service layer  →  Business rule check  →  DB write
                                                             ↓
                                                       Audit log write
```

This applies to **both user input and AI output**. AI is an untrusted source until validated.

---

## 6. CI/CD Setup

### 6.1 GitHub Actions (`.github/workflows/ci.yml`)

```yaml
name: CI
on:
  pull_request:
  push:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  verify:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm typecheck         # tsc --noEmit
      - run: pnpm lint              # eslint .
      - run: pnpm test              # vitest run
      - run: pnpm build             # next build (catches RSC + env errors)
      - run: pnpm audit --prod --audit-level=high
```

### 6.2 Vercel deploy pipeline

- `main` branch → auto-deploy to `stockast.com` (production).
- Every PR → auto-deploy `stockast-pr-<n>.vercel.app` (preview).
- Build command auto-detected (Next.js).
- Output: standalone (default for Vercel).
- Roll back: 1-click in Vercel dashboard. Re-test the demo flow before declaring resolved.

### 6.3 Supabase migrations in CI

Add a **separate job** that runs only on `main` push (not preview), guarded by an environment named "production":

```yaml
  migrate:
    needs: verify
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      - uses: supabase/setup-cli@v1
        with: { version: latest }
      - run: supabase db push --linked
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
          SUPABASE_DB_PASSWORD: ${{ secrets.SUPABASE_DB_PASSWORD }}
```

Until Phase 3 staging exists, this is acceptable risk because every migration must already be **locally tested** via `supabase db reset` per `ENGINEERING_STANDARDS.md §13`.

### 6.4 Pre-commit hooks (`lefthook.yml`)

```yaml
pre-commit:
  parallel: true
  commands:
    typecheck:
      run: pnpm typecheck
    lint:
      glob: "src/**/*.{ts,tsx}"
      run: pnpm eslint {staged_files}
    format:
      glob: "src/**/*.{ts,tsx,css,md}"
      run: pnpm prettier --write {staged_files}
      stage_fixed: true
commit-msg:
  commands:
    conventional:
      run: pnpm commitlint --edit {1}
```

---

## 7. Environment Strategy

### 7.1 Three environments only (defer staging until Phase 3)

| Env | URL | DB | When |
|---|---|---|---|
| Local | `http://localhost:3000` | `supabase start` (CLI, Docker-based) | Dev only |
| Preview | `*.vercel.app` per PR | **Shared with production** (Phase 1) → dedicated Supabase preview branch (Phase 3+) | PR review, demo dry runs |
| Production | `stockast.com` | Supabase production project | Live demo + real users |

**Risk note:** Preview sharing production DB until Phase 3 means a buggy PR can mutate prod rows. Mitigations:
- All PR work happens against `DEMO_OUTLET_ID` until Phase 2.
- RLS is on **from migration 0001**, so cross-tenant writes physically can't happen once Phase 2 auth lands.
- Phase 3: switch to Supabase preview branches (`SYSTEM_ARCHITECTURE.md §13`).

### 7.2 `.env.example` (contract)

```bash
# ── Public (client-accessible) ──
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ── Server-only ──
SUPABASE_SERVICE_ROLE_KEY=
GEMINI_API_KEY=
BMKG_API_BASE_URL=https://api.bmkg.go.id/publik/prakiraan-cuaca
# BMKG_API_KEY=                       # only if BMKG requires one for your endpoint

KV_REST_API_URL=
KV_REST_API_TOKEN=

# ── Phase 1 demo only (remove Phase 2) ──
DEMO_USER_ID=
DEMO_OUTLET_ID=
FEATURE_AUTH_REQUIRED=false
FEATURE_MOCK_WEATHER=true             # Phase 1 demo killer mitigation

# ── Operations ──
CRON_SECRET=
SENTRY_DSN=                           # Phase 2+
POSTHOG_KEY=                          # Phase 2+
NODE_ENV=development
```

### 7.3 Env validation at boot

```typescript
// src/lib/config/env.ts
import { z } from 'zod';

const Env = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(20),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20),
  GEMINI_API_KEY: z.string().min(10),
  KV_REST_API_URL: z.string().url().optional(),
  KV_REST_API_TOKEN: z.string().optional(),
  DEMO_USER_ID: z.string().uuid().optional(),
  DEMO_OUTLET_ID: z.string().uuid().optional(),
  FEATURE_AUTH_REQUIRED: z.enum(['true','false']).default('false'),
  FEATURE_MOCK_WEATHER: z.enum(['true','false']).default('true'),
  CRON_SECRET: z.string().min(16).optional(),
  NODE_ENV: z.enum(['development','test','production']).default('development'),
});

export const env = Env.parse(process.env);
```

### 7.4 Feature flags (env-driven, not DB-driven)

Until Phase 3 there is no need for a feature-flag service. Toggle via `FEATURE_*` env vars + `src/lib/config/feature-flags.ts` `as const` object. Major launches get a kill switch (e.g., `FEATURE_PROMO_GENERATION=false` disables the endpoint at runtime).

---

## 8. Coding Standards (the irreducible subset)

Full standards in `ENGINEERING_STANDARDS.md`. Below is the **minimum a contributor must internalize on day 1**.

### 8.1 Naming (cheat sheet)

| Element | Rule | Example |
|---|---|---|
| Files | kebab-case | `stock-input-form.tsx` |
| Components | PascalCase | `StockInputForm` |
| Hooks | `use*` camelCase | `useStockDraft` |
| Functions | verb-first camelCase | `parseStockInput` |
| Constants | SCREAMING_SNAKE | `MAX_DRAFT_PER_DAY` |
| DB tables | snake_case plural | `stock_logs` |
| FK columns | `{singular}_id` | `outlet_id` |
| Routes | kebab-case | `/recommendations/[date]` |
| Server Actions | verb-first | `submitStockDraft` |
| Env vars | `UPPER_SNAKE_CASE` grouped | `GEMINI_API_KEY`, `SUPABASE_*` |
| Booleans | `is/has/can/should` prefix | `isLoading`, `hasError` |

### 8.2 TypeScript

- `strict: true`, `noUncheckedIndexedAccess: true`.
- `type` over `interface` unless extending external lib.
- Discriminated unions for state: `type Stock = { kind: 'draft' } \| { kind: 'parsed' } \| { kind: 'confirmed' }`.
- **No `any`** without an inline comment explaining why + a `TODO(owner, date)`.

### 8.3 React

- Server Components by default. `'use client'` only when state/effect/event-handler needed.
- One default export per file when it is the file's purpose.
- Hooks at the top of the component, no conditional hooks.
- No prop drilling > 3 levels — lift to context or refactor.
- No Redux/Zustand for server data — `TanStack Query` handles cache + revalidate.

### 8.4 Forbidden constructs (lint-enforced)

| Forbidden | Reason | Replacement |
|---|---|---|
| `console.log` in committed code | Noise + PII leak | `logger.info` |
| `dangerouslySetInnerHTML` | XSS surface | none |
| `any` without justification | Type erosion | `unknown` + narrow |
| Direct Supabase calls in components | Boundary violation | Server Action + `lib/db/queries/` |
| Inline AI prompts | Versioning impossible | `lib/ai/prompts/*.v1.ts` |
| Magic numbers in business logic | Audit impossible | `lib/config/thresholds.ts` |
| Inline English UI strings | Brand violation | `lib/copy/*` |
| `throw` from Server Actions to client | 500 + crash | `ActionResult` return |

### 8.5 Import order (Prettier-enforced)

```ts
// 1. External
import { useState } from 'react';
import { z } from 'zod';

// 2. Internal absolute
import { parseStockInput } from '@/lib/services/stock-service';
import { Button } from '@/components/ui/button';

// 3. Internal relative
import { StockPreviewCard } from './stock-preview-card';

// 4. Types
import type { StockLog } from '@/types/domain';
```

### 8.6 Commit messages (Conventional Commits)

```
feat(stock): add AI parse confirmation flow
fix(promo): prevent double-submit on copy button
refactor(ai): extract prompt to versioned file
chore(deps): bump @google/genai to 0.x.y
feat(api)!: change recommendation response shape       <-- breaking
```

Scopes: `auth`, `stock`, `recommendation`, `promo`, `ai`, `ui`, `db`, `infra`.

### 8.7 Definition of "production-ready" (per `ENGINEERING_STANDARDS.md §16`)

A diff is production-ready iff all of:

- [ ] Tests pass.
- [ ] Types sound (no unjustified `any`).
- [ ] Auth + authorization checked at Server Action layer.
- [ ] Input validated by Zod (user input **and** AI output).
- [ ] User-facing errors have recovery path (`ActionResult`).
- [ ] Loading + empty + error states designed.
- [ ] No secrets in code, no PII in logs.
- [ ] Indexes added for any new query predicate.
- [ ] Idempotent if it mutates.
- [ ] Anti-slop checklist (`AI_SLOP_PREVENTION.md §12`) reviewed.

---

## 9. Initial Bootstrap Implementation (file-by-file build order)

This is the **exact sequence** I propose to write. Each step ends in a runnable state.

### Step 0 — pre-flight (humans only)

1. Create Supabase project (free tier). Note URL + anon key + service role key.
2. Create Google AI Studio key for Gemini.
3. Verify Gemini model availability via `https://ai.google.dev/gemini-api/docs/models`. Write the resolved IDs into `.docs/models.json`.
4. Reserve `stockast.com` (or staging subdomain) — defer to Phase 1 final day if budget-sensitive.
5. Install: `node 22`, `corepack enable && corepack prepare pnpm@latest --activate`, `supabase` CLI.

### Step 1 — scaffold (5 min)

```bash
pnpm create next-app@latest stockast \
  --typescript --tailwind --eslint --app --src-dir --turbo \
  --import-alias "@/*" --use-pnpm
cd stockast
pnpm dlx shadcn@latest init -d
pnpm dlx shadcn@latest add button card input textarea sheet dialog skeleton toast
pnpm add @supabase/supabase-js @supabase/ssr @google/genai zod
pnpm add -D vitest @testing-library/react @testing-library/jest-dom jsdom \
            prettier prettier-plugin-tailwindcss \
            eslint-plugin-tailwindcss lefthook \
            @commitlint/cli @commitlint/config-conventional \
            supabase
```

### Step 2 — config files

Files to create (each is short — full contents will land in code, not this doc):
1. `.nvmrc` → `22`
2. `tsconfig.json` → strict + `noUncheckedIndexedAccess` + `@/*` path
3. `next.config.ts` → strict mode, images allowed origins
4. `tailwind.config.ts` → tokens from `DESIGN_SYSTEM.md §3-6`
5. `src/app/globals.css` → CSS variables (`--brand-500`, `--neutral-50`, etc.) + Plus Jakarta Sans
6. `eslint.config.mjs` → flat config + forbidden-constructs rules
7. `.prettierrc` → single quote, trailing comma, plugin-tailwindcss
8. `vitest.config.ts` → jsdom env, alias resolution
9. `lefthook.yml` → see §6.4
10. `commitlint.config.cjs` → `@commitlint/config-conventional`
11. `.env.example` → see §7.2
12. `.gitignore` → standard + `.env*` + `.vercel`
13. `README.md` → setup + run + deploy + demo runbook

### Step 3 — design tokens (the anti-slop foundation)

`src/app/globals.css`:

```css
@import 'tailwindcss';

@theme {
  --font-sans: 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;

  --color-brand-50:  #FFF5EE;
  --color-brand-100: #FFE6D2;
  --color-brand-200: #FFCCA0;
  --color-brand-300: #FFAE6B;
  --color-brand-400: #FF8E3C;
  --color-brand-500: #F26F1B;
  --color-brand-600: #D85710;
  --color-brand-700: #B04308;
  --color-brand-800: #843107;
  --color-brand-900: #5C2208;

  --color-accent-500: #4DA66E;

  --color-neutral-50:  #FBF8F4;
  --color-neutral-100: #F5F0E8;
  --color-neutral-200: #E8DFD0;
  --color-neutral-300: #D3C5AE;
  --color-neutral-400: #A89880;
  --color-neutral-500: #7A6B55;
  --color-neutral-600: #564A38;
  --color-neutral-700: #3D3327;
  --color-neutral-800: #2B241B;
  --color-neutral-900: #1A1611;

  --color-success: #4DA66E;
  --color-warning: #E8A82E;
  --color-danger:  #D04A3E;
  --color-info:    #5A8FBF;
  --color-subuh-page: #242019;
  --color-subuh-surface: #2B261F;
  --color-subuh-surface-soft: #3A3228;

  --radius-card: 16px;
  --shadow-card: 0 2px 8px rgba(0, 0, 0, 0.04);
}

@media (prefers-color-scheme: dark), (max-width: 0) { /* subuh-mode applied via class */ }

html.subuh-mode {
  --color-neutral-50: #2B261F;
  --color-neutral-100: #242019;
  --color-neutral-200: #3A3228;
  --color-neutral-700: #E8DCC4;
  --color-neutral-900: #FFF8EB;
  --color-brand-500: #E99A5D;
  --color-brand-600: #D88245;

  background: var(--color-subuh-page);
  color: var(--color-neutral-900);
}

body {
  font-family: var(--font-sans);
  background: var(--color-neutral-50);
  color: var(--color-neutral-900);
  -webkit-font-smoothing: antialiased;
}
```

### Step 4 — data layer (slow, irreversible — get right first)

1. `supabase init`, `supabase start` (local stack).
2. Write `supabase/migrations/0001_init.sql` (verbatim §4.1).
3. `supabase db reset` to apply locally.
4. `supabase gen types typescript --local > src/lib/db/types.ts`.
5. Write `src/lib/db/server-client.ts`, `browser-client.ts`, `admin-client.ts`.
6. Write `supabase/seed.sql` with **Bu Yati Pecel Lele Salatiga** sample (7 days of stock_logs + menu items + outlet + organization + a demo user matching `DEMO_USER_ID`).

### Step 5 — domain core (high test value)

1. `src/lib/config/thresholds.ts` (verbatim §4.5).
2. `src/lib/rules/recommendation.ts` + `tests/unit/rules/recommendation.test.ts` (15+ cases: cold-start, weather variants, weekday clipping, guardrails).
3. `src/lib/rules/promo.ts` + tests (discount cap, frequency cap).
4. `src/lib/rules/stock.ts` (rolling average with 2σ outlier exclusion) + tests.
5. `src/types/domain.ts`, `src/types/action-result.ts`.

### Step 6 — AI layer

1. `src/lib/ai/client.ts` (Gemini SDK singleton, server-only).
2. `src/lib/ai/schemas/stock-parse.ts` (Zod).
3. `src/lib/ai/prompts/stock-parse.v1.ts` (versioned prompt with menu dictionary injection + few-shot Indonesian casual).
4. `src/lib/ai/validators/stock-business.ts` (menu-name match + numeric bounds).
5. `src/lib/services/ai-service.ts` (retry × 2, timeout 5s, cache by `sha256(rawInput + promptVersion)`, audit-log write).
6. `src/lib/services/stock-service.ts` (composes parse → validate → audit → return draft).
7. `scripts/verify-gemini-model.ts` — Day-1 model name verification script.

### Step 7 — App shell + onboarding (the first thing user sees)

1. `src/app/layout.tsx` (Plus Jakarta Sans, providers).
2. `src/app/(app)/layout.tsx` (top bar + bottom nav).
3. `src/app/(app)/onboarding/page.tsx` (3 screens: warung name → dropdown location → menu utama).
4. `src/app/actions/onboarding.ts` (create org + outlet + menu items + seed sample).
5. Indonesian copy in `src/lib/copy/onboarding.ts`.

### Step 8 — stock input → parse → confirm (the magic moment)

1. `src/app/(app)/stock/new/page.tsx` (textarea + submit).
2. `src/components/features/stock-input-form/` (RHF + Zod + idempotency key).
3. `src/app/actions/stock.ts` (verbatim §4.4 template).
4. Confirmation card with inline edit, "Ya, simpan" CTA.
5. `revalidatePath('/dashboard')` triggers next step.

### Step 9 — Belanja Card (signature)

1. `src/app/(app)/dashboard/page.tsx` (Server Component reading latest recommendation).
2. `src/components/features/belanja-card/` — number count-up + item stagger + weather morph (use `@react-spring/web` only if framer-motion bundle too large; default to CSS keyframes).
3. `src/app/actions/recommendation.ts` (`generateRecommendation`).
4. `src/lib/services/recommendation-service.ts` (orchestrates: read 7-day history → call rule engine → call AI explainer → write `recommendations` row).
5. `src/lib/ai/prompts/recommendation-explain.v1.ts`.

### Step 10 — promo + copy-to-WhatsApp (closing demo wow)

1. `src/components/features/promo-draft-card/` (uses `navigator.clipboard.writeText`).
2. `src/app/actions/promo.ts` (generates draft via Gemini + validates with `lib/rules/promo.ts`).
3. `src/lib/ai/prompts/promo-draft.v1.ts`.
4. Toast: "Tersalin! Tinggal paste ke WhatsApp." per `BRAND_DIRECTION.md §3`.

### Step 11 — empty / loading / error / Subuh

1. `src/app/(app)/history/page.tsx` + `loading.tsx` + empty state (`BRAND_DIRECTION.md §3`).
2. `src/app/error.tsx` (root error boundary with Indonesian copy).
3. `src/hooks/use-subuh-mode.ts` (auto-toggle 02:00-05:30 `Asia/Jakarta`).
4. Toggle button in settings.

### Step 12 — deploy + demo dry run

1. `vercel link` + `vercel env add` for each prod var.
2. Deploy preview from PR; verify on real Android 360px device.
3. Three consecutive zero-bug demo runs against production URL.
4. Record 60-90s backup video; store in `.docs/demo-backup.mp4`.
5. Print demo script.

---

## 10. MVP Execution Roadmap

Distilled from `EXECUTION_BLUEPRINT.md §2-3`. Day-by-day, not week-by-week, because the demo deadline is binary.

| Day | Sprint | Output | Done = demoable |
|---|---|---|---|
| **D1** | Phase 0 | User interview #1-2 booked; Gemini model verified; repo scaffolded (Step 1-2). | Local `pnpm dev` shows blank Next.js page. |
| **D2** | Phase 0 | User interview #1-2 conducted; pain validated OR research re-pivot; tokens applied (Step 3). | Brand color visible on a stub home page. |
| **D3** | Phase 0 | Data layer + types + seed (Step 4). | `supabase db reset` succeeds; `select * from stock_logs` returns Bu Yati sample. |
| **D4** | Sprint A | Domain rules + tests (Step 5). AI layer + parse prompt v1 (Step 6 part). | `pnpm test` green. |
| **D5** | Sprint A | App shell + onboarding (Step 7). Stock input form scaffold. | New user can complete 3-screen onboarding. |
| **D6** | Sprint A | Stock input → parse → confirm wired (Step 8). | Bu Yati can type "lele sisa 5..." → see parsed card → save. |
| **D7** | Sprint B | Recommendation engine + Belanja Card data + Gemini explainer (Step 9 part). | Dashboard renders Belanja Card with real numbers + reasoning. |
| **D8** | Sprint B | Belanja Card signature animation. Promo + copy-to-WA (Step 10). | Count-up animation runs; promo draft copies to clipboard. |
| **D9** | Sprint C | Empty/loading/error states. Subuh Mode (Step 11). History list. | Every screen renders gracefully under no-data + offline simulation. |
| **D10** | Sprint C | Vercel deploy + three demo dry runs + backup video + demo script (Step 12). | Production URL works on a real Android. Backup video saved. |
| **D11+** | Phase 2 | Sprint D-G (auth, RLS migration from hardcoded, BMKG, rate limit, offline PWA, monitoring, beta onboarding). | See `EXECUTION_BLUEPRINT.md §2 Phase 2`. |

### Daily rhythm (per `EXECUTION_BLUEPRINT.md §8`)

- Morning: hard problems (data, AI, rules).
- Afternoon: UI + polish.
- Evening: real-device test + demo script update + retro line.

### Hard gates (don't proceed past until met)

- **D2 gate:** ≥ 2 interviews completed OR explicit founder decision to proceed without (logged).
- **D6 gate:** Magic moment works end-to-end on a real device (even if ugly).
- **D9 gate:** Five demo dry runs zero-bug with a non-developer at the controls (per `EXECUTION_BLUEPRINT.md §2 Phase 1 milestone gate`).

---

## 11. Technical Risk & Scalability Register

A consolidated risk register cross-referencing PRD §12, ARCH §16, and EXEC §9. **This section is re-read at every weekly retro.**

### 11.1 Top 5 risks (mitigations baked into the architecture)

| # | Risk | Likelihood | Impact | Mitigation in this blueprint |
|---|---|---|---|---|
| R1 | **Gemini Indonesian-casual parse < 85% accuracy** | Med | Catastrophic (trust collapse) | Strict Zod schema + menu dictionary match in `lib/ai/validators/stock-business.ts`; **always show confirm card before save**; fallback prompt "Bisa diketik ulang?". Test cadence: 10-15 utterances D1 informal → 30 utterances pre-demo (≥85% pass) → 100 utterances golden set Phase 3. |
| R2 | **Demo day Gemini / Supabase outage** | Low | Catastrophic | Pre-recorded 60-90s backup video. `FEATURE_MOCK_WEATHER`-style toggle that swaps Gemini calls for canned response. Demo from production URL, not localhost. 3 dry runs T-24h. |
| R3 | **BMKG unreliability** | Med | Degraded rec only | 24h cache grace in `weather_snapshots`. Demo phase = hardcoded weather (`FEATURE_MOCK_WEATHER=true`). Real BMKG = Phase 2. |
| R4 | **AI cost spiral > Rp 5K/user/month** | Med | Business-killing | Rate limit from Day 1 (30 calls/user/day). Cache identical inputs 1h. Use `gemini-2.0-flash-lite` for bulk. Daily cost dashboard from Phase 2. Kill-switch flag `FEATURE_AI_PARSE_ENABLED`. |
| R5 | **Pedagang abandons onboarding** | High | Adoption failure | < 60s onboarding budget. Sample data pre-loaded. Hands-on activation for first 10 users Phase 2. |

### 11.2 Architecture-level scalability warnings (per ARCH §16)

| Stage | Users | Predicted bottleneck | Pre-emptive action |
|---|---|---|---|
| MVP | 1 (founder) | None | — |
| Beta | 10-50 | OTP SMS cost (Twilio Indonesia Rp 300-500/SMS) | Negotiate provider; consider WhatsApp OTP later. |
| Production | 200-1K | AI cost; DB connection count (Hobby has 60 cap) | Upgrade Supabase Pro for pgBouncer; aggressive AI cache; monitor cost/user weekly. |
| Scale | 1K-10K | Weather fetch concurrency; recommendation batch compute | Vercel Cron pre-compute at 22:00 WIB; edge-cache weather per `adm4_code`. |
| Hyperscale | 10K+ | Single-region latency; queue needs | Re-architect (Inngest queue, read replicas, multi-region) — **with data, not assumption**. |

### 11.3 Anti-pattern guardrails (we will not do these)

- ❌ Build queue infra in Phase 1 (Server Actions cover sync; Vercel Cron covers scheduled).
- ❌ Multi-region before single-region proves PMF.
- ❌ Custom CDN before standard CDN insufficient.
- ❌ Event sourcing for CRUD app.
- ❌ Microservices before the monolith strains.
- ❌ Premature observability stack (Sentry/PostHog deferred to Phase 2).
- ❌ Custom design system from scratch (shadcn + Tailwind extension is the design system).

### 11.4 Reversibility ladder (what to invest review time in)

| Decision | Reversibility | Review time |
|---|---|---|
| Data schema (table shape, FK, RLS policy) | **Irreversible-ish** (migrations are forward-only) | 1-pager + 1 outside opinion (per EXEC §7). |
| API response shape (Server Action / Route Handler contract) | Reversible only within 1 release | 30-min discussion. |
| Component refactor / file move | Trivially reversible | Just ship. |
| AI prompt change | Reversible (versioned file) | Just ship + audit log captures both versions. |
| Threshold tuning (`lib/config/thresholds.ts`) | Trivially reversible | Just ship. |
| Tech stack swap (e.g., dropping Supabase) | **Catastrophically irreversible** at scale | Never below 1000-user signal. |

### 11.5 When to revisit this blueprint

- After any milestone gate (M1-M9 in EXEC §4).
- When a risk above changes likelihood/impact tier.
- Quarterly review per `FUTURE_ROADMAP.md §10`.
- After the first 5 real-user interviews — copy + scope assumptions may need to shift.

---

## 12. What to do next (the only checklist that matters now)

1. **Confirm Gemini model availability** (run `scripts/verify-gemini-model.ts`, write `.docs/models.json`). Block all AI code until this passes.
2. **Book user interviews #1-2** (parallelizable with scaffold).
3. **Execute Step 1 scaffold** of §9.
4. **Write the data migration** (Step 4) — this is the irreversible decision; get it right before any UI.
5. **Write the rule engine + tests** (Step 5) — the trust foundation.
6. **Wire the magic moment** (Steps 7-9) — Bu Yati's first 30 seconds.
7. **Deploy + dry-run × 3** before claiming demo-ready.

Everything else in `EXECUTION_BLUEPRINT.md` Phase 2-4 is real but **not Day-1 concern**.

---

## 13. Appendix — How this blueprint maps to the source docs

| Section here | Source of truth |
|---|---|
| §1 Architecture shape | `SYSTEM_ARCHITECTURE.md §1, §2, §4` |
| §2 Folder structure | `SYSTEM_ARCHITECTURE.md §3` + `ENGINEERING_STANDARDS.md §3` |
| §3 Tech stack | `SYSTEM_ARCHITECTURE.md §2` |
| §4 DB + API | `SYSTEM_ARCHITECTURE.md §5, §6` + `ENGINEERING_STANDARDS.md §4` |
| §5 Auth + security | `SYSTEM_ARCHITECTURE.md §7, §15` + `ENGINEERING_STANDARDS.md §7` |
| §6 CI/CD | `SYSTEM_ARCHITECTURE.md §12` + `ENGINEERING_STANDARDS.md §13` |
| §7 Environments | `SYSTEM_ARCHITECTURE.md §13` |
| §8 Coding standards | `ENGINEERING_STANDARDS.md §2, §5, §8, §12, §15, §16` |
| §9 Bootstrap order | `EXECUTION_BLUEPRINT.md §8` + `FEATURE_PRIORITY_MATRIX.md §2` |
| §10 MVP roadmap | `EXECUTION_BLUEPRINT.md §2, §6, §12` |
| §11 Risk register | `PRD.md §12` + `SYSTEM_ARCHITECTURE.md §16` + `EXECUTION_BLUEPRINT.md §9-10` |
| Anti-slop guardrails (throughout) | `AI_SLOP_PREVENTION.md`, `BRAND_DIRECTION.md`, `DESIGN_SYSTEM.md` |

This blueprint **does not replace** those docs. It **executes** them.
