# Stockast

> Asisten belanja harian buat pedagang makanan kecil Indonesia.
> Catat singkat, belanja tepat.

Stockast adalah produk decision-support harian — bukan POS, bukan ERP, bukan inventory app. 30 detik catat stok kemarin, 3 detik baca rekomendasi belanja besok.

---

## Quickstart

```bash
# 1. install
corepack enable && corepack prepare pnpm@latest --activate
pnpm install

# 2. configure env
cp .env.example .env.local
# isi NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
#     SUPABASE_SERVICE_ROLE_KEY, GEMINI_API_KEY (lihat .env.example)

# 3. verify Gemini model names exist on Google's API
pnpm verify-gemini

# 4. database (Docker required)
pnpm db:start            # supabase start
pnpm db:reset            # apply migrations + seed Bu Yati sample
pnpm db:types            # generate src/lib/db/types.ts
pnpm seed:dimsum         # optional: seed Warung Dimsum Pak Budi + OTP phone

# 5. dev
pnpm dev                 # http://localhost:3000
```

Default Dimsum login phone is `+6281234567000`; override with `SEED_DIMSUM_PHONE`.
If the Supabase SMS provider is disabled, this seed phone can continue with demo code `123456`;
override it with `SEED_DIMSUM_OTP`.
The fallback signs in through a synthetic seed email, overrideable with `SEED_DIMSUM_EMAIL`.

---

## What's where

```
.github/workflows/    # CI: typecheck + lint + test + build + audit
src/
├── app/              # Next.js App Router (RSC, Server Actions, Route Handlers)
├── components/       # ui/ (shadcn primitives), features/, layout/, shared/
├── lib/
│   ├── ai/           # Gemini client, versioned prompts, Zod schemas
│   ├── db/           # Supabase clients (server, browser, admin)
│   ├── services/     # Pure-function domain layer
│   ├── rules/        # Recommendation, promo, stock — no I/O
│   ├── auth/         # requireAuth, requireOutletAccess
│   ├── kv/           # Vercel KV: rate limit, idempotency, cache
│   ├── config/       # env (Zod-validated), thresholds (magic numbers), flags
│   ├── copy/         # Centralized Indonesian copy strings
│   └── utils/
├── hooks/
├── providers/
└── types/
supabase/
├── migrations/       # Forward-only SQL
└── seed.sql          # Bu Yati — Pecel Lele Salatiga (Phase 1 demo)
scripts/
└── verify-gemini-model.ts
tests/
└── unit/rules/       # Recommendation + promo rule tests (Vitest)
```

Full architecture: [.docs/FOUNDATION_BLUEPRINT.md](.docs/FOUNDATION_BLUEPRINT.md)
Full standards: [.docs/ENGINEERING_STANDARDS.md](.docs/ENGINEERING_STANDARDS.md)

---

## Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Next.js dev server with Turbopack |
| `pnpm build` | Production build (CI verifies this) |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` | ESLint flat config |
| `pnpm format` | Prettier write |
| `pnpm test` | Vitest run (rules + services) |
| `pnpm test:watch` | Vitest watch |
| `pnpm verify-gemini` | Day-1 model verification |
| `pnpm db:start` | `supabase start` (Docker) |
| `pnpm db:reset` | Drop + recreate local DB + seed |
| `pnpm db:push` | Push migrations to linked Supabase project |
| `pnpm db:types` | Generate `src/lib/db/types.ts` |

---


## Standards (the irreducible subset)

- **Types**: `strict: true`, `noUncheckedIndexedAccess: true`. No `any` without justification.
- **Server Actions never throw to client** — they return `ActionResult<T>`.
- **AI output is untrusted** — Zod-validate every response before persistence.
- **Magic numbers**: live in `src/lib/config/thresholds.ts` only.
- **UI strings**: centralize in `src/lib/copy/*` (Indonesian conversational, never formal/translated).
- **Defense in depth**: middleware session check + Server Action role check + Postgres RLS.
- **PII never logged**: phone numbers, raw stock notes, full prompts.
- **Commits**: Conventional Commits with scopes `auth · stock · recommendation · promo · ai · ui · db · infra · docs`.

Full set: [.docs/ENGINEERING_STANDARDS.md](.docs/ENGINEERING_STANDARDS.md).

Anti-slop discipline: [.docs/AI_SLOP_PREVENTION.md](.docs/AI_SLOP_PREVENTION.md).
