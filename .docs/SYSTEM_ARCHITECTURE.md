# System Architecture — Stockast

**Version:** 1.0
**Scope:** Demo MVP → Private Beta → Production v1
**Principle:** Boring tech for predictable behavior. Exotic only when justified.

---

## 1. Architectural Philosophy

1. **Vertical slice first, abstraction later.** Build the feature end-to-end, refactor when patterns emerge from real code.
2. **Serverless-first.** No server administration until proven necessary.
3. **Postgres for everything.** Until you outgrow it. Most products never do.
4. **Stateless app servers, stateful database.** Standard.
5. **Async by intent, sync by default.** Server Actions for MVP, real queue when there's real concurrency pressure.

---

## 2. Recommended Tech Stack

### Why this stack
- Matches founder's existing expertise (Next.js, TypeScript, Tailwind)
- Maximizes velocity in solo/duo team
- Minimal vendor lock-in (Supabase is portable Postgres, Vercel is Next.js standard)
- Cost-efficient at small scale

### Stack

| Layer | Choice | Reason |
|---|---|---|
| **Frontend Framework** | Next.js 15 (App Router) | Server Components reduce JS shipped to low-end Android; SSR for fast first paint |
| **Language** | TypeScript (strict mode) | Type safety is non-negotiable for AI output handling |
| **Styling** | Tailwind CSS v4 | Fast iteration, no design debt from custom CSS |
| **UI Primitives** | shadcn/ui (selective) | Accessible defaults, copy-paste ownership, no lock-in |
| **State (server)** | TanStack Query | Best-in-class for async data; works with Server Actions |
| **State (client)** | React Context + useState (sparingly) | Avoid Zustand/Redux until needed |
| **Forms** | React Hook Form + Zod | Validation aligned with API schemas |
| **Database** | Supabase Postgres | Managed Postgres with auth + RLS bundled |
| **Auth** | Supabase Auth (phone OTP) | Standard for Indonesian users (no email) |
| **AI** | Gemini API (direct SDK) | `@google/genai`; no Genkit wrapper for MVP. **Default model:** `gemini-2.0-flash` untuk parse + explanation, `gemini-2.0-flash-lite` (atau equivalent latest) untuk high-volume tugas non-kritis. Model name *wajib di-verify* via `https://ai.google.dev/gemini-api/docs/models` di Hari 1 sebelum kode di-write — Gemini model name berubah cepat. |
| **Storage** | Supabase Storage | Untuk warung photos (Phase 3) |
| **Background Jobs** | Server Actions (MVP) → Inngest (Phase 3) | Defer queue infrastructure |
| **Rate Limiting** | Vercel KV + simple counter | Cheap and effective |
| **Deployment** | Vercel | DX optimal untuk Next.js |
| **Domain** | Custom via Cloudflare | Free DNS, anti-DDoS |
| **Error Tracking** | Sentry (free tier, Phase 2) | Defer for MVP |
| **Analytics** | PostHog (free tier, Phase 2) | Defer for MVP |
| **CI/CD** | Vercel auto-deploy + GitHub Actions for tests | Zero config |

### Stack NOT chosen (and why)
- ❌ **Genkit** — extra abstraction, not needed for direct Gemini calls
- ❌ **tRPC** — Server Actions provide similar DX with less complexity
- ❌ **Prisma** — Supabase JS client + generated types is enough
- ❌ **Zustand/Redux** — over-engineered for this app's state needs
- ❌ **Custom Express backend** — Next.js API routes + Server Actions suffice
- ❌ **Docker/K8s** — premature; serverless covers it
- ❌ **Redis** — Vercel KV when needed
- ❌ **Kafka/RabbitMQ** — premature; Inngest later

---

## 3. Frontend Architecture

### Folder Structure
```
src/
├── app/                          # Next.js App Router
│   ├── (marketing)/              # Public pages (landing, about)
│   ├── (auth)/                   # Auth flows
│   │   └── login/
│   ├── (app)/                    # Authenticated app
│   │   ├── layout.tsx            # App shell, nav
│   │   ├── dashboard/
│   │   ├── stock/
│   │   │   ├── new/              # Stock input flow
│   │   │   └── [id]/             # View/edit stock log
│   │   ├── recommendations/
│   │   │   └── [date]/
│   │   ├── promos/
│   │   ├── history/
│   │   └── settings/
│   ├── api/                      # Route handlers (webhooks, AI proxy)
│   │   ├── ai/
│   │   │   ├── parse-stock/
│   │   │   └── generate-promo/
│   │   └── webhooks/
│   │       └── whatsapp/         # Phase 3
│   ├── actions/                  # Server Actions
│   │   ├── stock.ts
│   │   ├── recommendation.ts
│   │   └── promo.ts
│   └── globals.css
├── components/
│   ├── ui/                       # shadcn primitives (Button, Input, Card)
│   ├── features/                 # Feature-specific (BelanjaCard, StockInputForm)
│   ├── layout/                   # AppShell, BottomNav, TopBar
│   └── shared/                   # EmptyState, LoadingState, ErrorState
├── lib/
│   ├── ai/
│   │   ├── client.ts             # Gemini client setup
│   │   ├── prompts/
│   │   │   ├── stockParse.v1.ts
│   │   │   ├── recommendation.v1.ts
│   │   │   └── promoDraft.v1.ts
│   │   ├── schemas/              # Zod schemas for AI outputs
│   │   └── validators/           # Business rules on AI outputs
│   ├── db/
│   │   ├── supabase.ts           # Client setup
│   │   ├── types.ts              # Generated from Supabase
│   │   └── queries/              # Typed query functions
│   ├── rules/                    # Pure business logic
│   │   ├── recommendation.ts     # Rule engine
│   │   ├── promo.ts              # Promo validator
│   │   └── stock.ts              # Stock calculations
│   ├── weather/
│   │   └── bmkg.ts               # BMKG client + cache
│   └── utils/
├── hooks/                        # Custom React hooks
├── types/                        # Shared TypeScript types
└── config/
    ├── constants.ts
    └── feature-flags.ts
```

### Routing Strategy
- **Server Components by default.** Client Components only when interactivity required.
- **Parallel routes** untuk dashboard layout dengan multiple data sections.
- **Loading.tsx + error.tsx** di setiap route segment penting.
- **Group routes** dengan `(folder)` untuk layout sharing tanpa URL segment.

### State Management Hierarchy
1. **URL state** untuk filters, dates, pagination
2. **Server state** lewat TanStack Query (cache + refetch)
3. **React state** untuk form input, UI toggles
4. **Context** hanya untuk theme/auth status
5. **No global state library** sampai ada pain point

---

## 4. Backend Architecture

### Layers
```
┌─────────────────────────────────┐
│  Client (Next.js Components)    │
└──────────────┬──────────────────┘
               │
       ┌───────┴────────┐
       ▼                ▼
┌──────────────┐  ┌─────────────┐
│ Server       │  │ Route       │
│ Actions      │  │ Handlers    │
│ (mutations)  │  │ (webhooks)  │
└──────┬───────┘  └──────┬──────┘
       │                 │
       └────────┬────────┘
                ▼
┌─────────────────────────────────┐
│  Service Layer (pure functions) │
│  - StockService                 │
│  - RecommendationService        │
│  - PromoService                 │
│  - AIService (Gemini wrapper)   │
│  - WeatherService (BMKG)        │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  Data Layer                     │
│  - Supabase client (RLS)        │
│  - Vercel KV (rate limit, cache)│
└─────────────────────────────────┘
```

### Service Design Principles
- Services adalah **pure TypeScript modules**, bukan class hierarchies
- Each service takes explicit dependencies as parameters (testable)
- No service calls another service directly across boundaries; orchestrate di Server Action layer
- All AI calls go through `AIService` wrapper untuk uniform logging + retry

### Example Pattern
```typescript
// lib/services/stock.ts
export async function parseStockInput(
  raw: string,
  ctx: { outletId: string; menuItems: MenuItem[] }
): Promise<ParsedStockLog> {
  const result = await ai.parse({
    prompt: stockParsePromptV1,
    input: raw,
    context: ctx,
    schema: parsedStockSchema,
  });
  return validateBusiness(result, ctx);
}
```

### Recommendation Engine — Concrete Formula (v1, rule-based)

Rule engine = pure function. AI hanya menulis *penjelasan* (reasoning), tidak menentukan angka.

```
besok[item] = round( base[item] * weather_factor * weekday_factor )

dengan:
  base[item]            = rolling avg sold per day (last 7 days, exclude outlier > 2σ)
  weather_factor        = 1.00  (default / unknown)
                          0.85  (hujan deras tomorrow)
                          0.95  (mendung / hujan ringan)
                          1.05  (cerah + libur lokal)
  weekday_factor        = avg(sold[same_weekday] / base) clipped to [0.85, 1.15]
  
  hard guardrail:       besok[item] dalam [0.80*base, 1.20*base]
                        — max ±20% change kecuali ada justification eksplisit
  cold-start (< 3 days data): besok[item] = base[item], confidenceLabel = 'Data baru, hati-hati'
```

**Confidence labels (plain Indonesian, no %):**
- `'Pola jelas'` — ≥ 7 days data, stddev/mean < 0.30
- `'Data baru, hati-hati'` — < 3 days data, atau stddev/mean ≥ 0.30
- `'Tidak yakin'` — < 1 day data (cold start)

Formula di-store di `lib/rules/recommendation.ts`, semua thresholds di `lib/config/thresholds.ts` (no magic numbers in code).

---

## 5. API Structure

### Server Actions (primary, MVP)
Use for mutations driven by user interaction.

```typescript
// app/actions/stock.ts
'use server';

export async function submitStockDraft(formData: FormData) {
  const user = await requireAuth();
  const input = parseFormData(formData);
  const result = await stockService.parse(input, { outletId: user.outletId });
  revalidatePath('/stock');
  return result;
}
```

### Route Handlers (when needed)
- Webhooks (WhatsApp, Supabase Auth)
- Cron jobs (Vercel Cron untuk recommendation pre-compute)
- AI proxy endpoint if needed for streaming responses

### API Conventions
- **Endpoint naming:** `/api/{domain}/{resource}/{action}` (e.g., `/api/ai/stock/parse`)
- **HTTP methods:** POST untuk all AI calls (idempotent via idempotency key, not GET)
- **Response shape:**
  ```typescript
  // Success
  { data: T, error: null }
  // Error
  { data: null, error: { code: string, message: string, details?: any } }
  ```
- **Status codes:** Standard. 200 success, 400 client error, 401 unauth, 429 rate limit, 500 server error.
- **Versioning:** Inline in path when breaking change (`/api/v2/...`). MVP no versioning needed.

### Idempotency
- Mutating endpoints accept `X-Idempotency-Key` header
- Server stores key + result for 24h
- Re-submission within window returns cached result

---

## 6. Database Design Direction

### Core Tables (MVP)
```sql
-- Identity
users                  (id, phone, created_at, ...)
organizations          (id, name, owner_id, created_at)
outlets                (id, organization_id, name, location_label, adm4_code, ...)
memberships            (user_id, organization_id, role)

-- Menu
menu_items             (id, outlet_id, name, unit, normalized_name, created_at)

-- Stock
stock_log_drafts       (id, outlet_id, raw_input, service_date, created_at, status)
stock_logs             (id, outlet_id, service_date, items_json, confirmed_at, source_draft_id)

-- Recommendations
recommendations        (id, outlet_id, service_date, items_json, reasoning, confidence_label, audit_json)

-- Promos
promo_drafts           (id, outlet_id, service_date, message, status, created_at)

-- Weather
weather_snapshots      (id, adm4_code, forecast_date, payload_json, fetched_at)

-- Auditing
ai_audit_logs          (id, entity_type, entity_id, prompt_version, model, raw_response, latency_ms, created_at)
```

### Design Principles
- **`organization_id` + `outlet_id` on every owned row** untuk RLS clarity
- **`service_date`** (DATE, not timestamp) untuk daily aggregation natural
- **JSON columns for complex nested data** (items, audit context) — Postgres JSONB performant
- **Soft delete via `deleted_at` column** untuk recovery
- **`created_at`/`updated_at` on every table**

### Indexes (Critical)
```sql
CREATE INDEX idx_stock_logs_outlet_date ON stock_logs(outlet_id, service_date);
CREATE INDEX idx_recommendations_outlet_date ON recommendations(outlet_id, service_date);
CREATE INDEX idx_weather_adm4_date ON weather_snapshots(adm4_code, forecast_date);
CREATE INDEX idx_audit_entity ON ai_audit_logs(entity_type, entity_id);
CREATE INDEX idx_drafts_outlet_status ON stock_log_drafts(outlet_id, status, created_at DESC);
```

### Schema Evolution
- Migrations via Supabase CLI
- Forward-only migrations preferred
- Never `DROP COLUMN` in production without 2-phase deprecation (mark unused → wait → remove)
- JSONB columns absorb shape changes without migration

---

## 7. Authentication & Session Flow

### Authentication
- **MVP/Demo:** No auth, single hardcoded sample user. Toggle via env var.
- **Private Beta:** Supabase Auth phone OTP
- **Production:** Phone OTP + optional Google sign-in for Mas Adit persona

### Flow
```
Phone number input
  → Supabase sends OTP via Twilio (atau provider lain)
  → User enters OTP
  → Supabase issues JWT (1 hour) + refresh token (60 days)
  → Stored in httpOnly cookie
  → Server-side validation on every request via Supabase middleware
```

### Session Strategy
- **Cookie-based** (httpOnly, SameSite=Lax, Secure)
- **Auto-refresh** via Supabase client SDK
- **No localStorage for tokens** (XSS surface)

### Authorization (RLS)
Every table with user data has RLS policies:
```sql
CREATE POLICY "members access own org data"
  ON stock_logs FOR ALL
  USING (
    organization_id IN (
      SELECT organization_id FROM memberships WHERE user_id = auth.uid()
    )
  );
```

Role check in Server Action:
```typescript
async function requireRole(role: 'owner' | 'staff') {
  const user = await getUser();
  if (!user.membership.roles.includes(role)) throw new ForbiddenError();
  return user;
}
```

---

## 8. State Management

### Client State Tree
- **Auth state:** React Context, set once at app load
- **Server data:** TanStack Query (with `revalidatePath` from Server Actions invalidating cache)
- **Form state:** React Hook Form (local)
- **UI state:** Local useState (toggle, expand, etc.)

### Anti-Patterns
- ❌ Global state store untuk server data (use TanStack Query)
- ❌ Prop drilling > 3 levels (lift to context or refactor component)
- ❌ Manual cache invalidation (let Server Actions + revalidatePath handle it)

---

## 9. Caching Strategy

### Layers
1. **Browser cache** untuk static assets (handled by Next.js)
2. **Service Worker cache** untuk PWA app shell (Phase 2)
3. **Server-side cache** via `unstable_cache` untuk expensive computations (weather, recommendations)
4. **Database cache** via materialized views (Phase 4 if needed)
5. **AI response cache** via Vercel KV (key: hash of input + prompt version)

### Specific Caches
| Resource | TTL | Invalidation |
|---|---|---|
| Weather (BMKG) | 6 hours per adm4_code | Time-based |
| Recommendation page data | Until next confirm | On stock log confirm |
| AI parse result (same input) | 1 hour | Time-based |
| User membership | Per request | On role change |

---

## 10. Queue / Background Jobs

### MVP: Server Actions + setTimeout
Tidak ada queue. Logic berjalan sync di Server Action atau di setelahnya via fire-and-forget.

### Phase 2: Vercel Cron
Scheduled jobs simple:
- Pre-compute recommendations setiap malam jam 22.00 untuk outlets aktif
- Cleanup expired drafts setiap hari

### Phase 3: Inngest atau Trigger.dev
Real queue saat ada:
- Multiple async steps (parse → validate → compute → notify)
- Retry logic kompleks
- Concurrency control needed
- > 1K active users

### Job Idempotency Rule
Setiap job harus aman di-retry:
- Check existence sebelum create
- Use upsert daripada insert
- Idempotency key dari (entity_id + job_type + scheduled_at)

---

## 11. File Storage

- **MVP:** None needed
- **Phase 2:** Supabase Storage untuk warung profile photo (optional)
- **Phase 3:** Receipt image upload untuk supplier integration

### Conventions
- Bucket per content type (`warung-photos`, `receipts`)
- File naming: `{org_id}/{outlet_id}/{uuid}.{ext}`
- RLS: same as database
- CDN: Supabase Storage built-in
- Image optimization: Next.js `<Image>` component handles delivery

---

## 12. CI/CD

### Vercel Auto-Deploy
- **Production branch:** `main` → auto-deploy to `stockast.com`
- **Preview branches:** Every PR → auto-deploy preview URL
- **Rollback:** One-click in Vercel dashboard

### GitHub Actions (PR checks)
```yaml
- TypeScript check (tsc --noEmit)
- ESLint
- Unit tests (Vitest)
- Build verification
```

### Deployment Promotion
- No staging env until Phase 3 (preview deploys suffice)
- Phase 3: separate Supabase project for staging
- Phase 4: Blue-green deployment via Vercel aliases

### Migration Strategy
- Supabase migrations checked into repo (`supabase/migrations/`)
- Run via CI before deploy: `supabase db push`
- Manual review required untuk DROP/ALTER statements

---

## 13. Deployment Strategy

### Environments
| Env | URL | Database | Purpose |
|---|---|---|---|
| Local | `localhost:3000` | Supabase local CLI | Dev |
| Preview | `*.vercel.app` | Supabase preview (Phase 3+) | PR review |
| Production | `stockast.com` | Supabase production | Live |

### Configuration
- **Env vars** via Vercel dashboard (never commit `.env`)
- **Feature flags** via environment + simple `lib/config/feature-flags.ts`
- **Secrets rotation:** Quarterly review, immediate rotation on incident

### Deployment Checklist (per release)
- [ ] CI green
- [ ] Database migration tested locally
- [ ] Backward-compatible API
- [ ] Feature flag default off untuk big features
- [ ] Rollback plan documented
- [ ] Demo flow re-tested

---

## 14. Monitoring & Logging

### MVP
- `console.error` + Vercel function logs
- Manual periodic check

### Private Beta
- **Sentry** (free tier): error tracking + perf monitoring
- **Vercel Analytics:** Web Vitals
- **PostHog** (free tier): product analytics + session replay
- **Supabase Dashboard:** DB metrics

### Production
- Add **Better Stack** atau **Uptime Robot** untuk uptime monitoring
- Custom dashboard untuk:
  - AI cost per day
  - AI parse accuracy rate
  - Recommendation engagement
  - Active users by cohort

### Log Levels
- `error`: Things that broke and need investigation
- `warn`: Degraded behavior or unexpected state
- `info`: Major business events (user signup, stock log confirmed)
- `debug`: Off in production

### What NOT to Log
- Phone numbers (PII)
- Raw stock notes (may contain personal context)
- AI prompt + user input together (privacy risk)

---

## 15. Security Best Practices

### Authentication
- Server-side session validation on every request
- Phone OTP rate limited (3 attempts per 15 min per phone)
- No password storage (OTP only)

### Authorization
- RLS enabled di semua tables dengan user data
- Role check di Server Action layer (defense in depth)
- API keys server-only (`process.env.GEMINI_API_KEY`)

### Input Validation
- Zod schema validation untuk semua user input
- Zod schema validation untuk semua AI output sebelum DB write
- Length limits + sanitization untuk text fields

### Secrets
- Never in client bundle
- Never in git (env files in .gitignore)
- Rotation quarterly + on personnel change

### Data Protection
- Transit: HTTPS only (Vercel/Cloudflare default)
- Rest: Supabase encrypts at rest by default
- PII: Phone numbers stored, but not in logs

### UU PDP Compliance (UU 27/2022 — Indonesia Personal Data Protection)
Berlaku Oktober 2024. Wajib **sebelum onboard real user (Phase 2)**:
- **Lawful basis:** Consent eksplisit saat sign-up (checkbox + link kebijakan privasi)
- **Right to access:** User bisa minta export data via WhatsApp support (manual Phase 2, automated Phase 3)
- **Right to delete:** Hard-delete dalam 30 hari setelah request (override soft-delete)
- **Right to rectify:** User bisa edit warung name, location, menu kapan saja
- **Data retention:** Stock logs disimpan max 24 bulan default (configurable per user)
- **Breach notification:** 72 jam window ke Kementerian Kominfo + user terdampak
- **Data processor agreement:** Verify Supabase, Vercel, Google (Gemini), BMKG sebagai sub-processor terdaftar
- **PIC privasi:** Founder bertindak sebagai PIC sampai Phase 3 (team grows)

Privacy policy + ToS halaman wajib di Phase 2 launch. Boilerplate Indonesia available via PrivacyTerms.io atau Pasal-pasal UU PDP direct.

### Rate Limiting
- Per-user (auth required) and per-IP (auth optional)
- AI endpoints: 30 calls per day per user
- Auth endpoints: 5 OTP per hour per phone
- General: 100 req/min per IP

### Audit Trail
- All admin actions logged
- All AI calls logged with prompt version
- Logs retained 30 days minimum

### CSRF / XSS
- SameSite cookies
- httpOnly cookies for sessions
- React escapes output by default
- `dangerouslySetInnerHTML` forbidden by lint rule

### Dependency Security
- `npm audit` in CI
- Renovate atau Dependabot enabled
- Lock file committed

---

## 16. Scalability Considerations

### Horizontal Scaling
- App: Vercel auto-scales serverless
- DB: Supabase scales connections; Pro plan adds connection pooling
- Cache: Vercel KV scales transparently

### Vertical Limits to Monitor
- DB connections (pool size)
- Function execution time (Vercel limits: 10s Hobby, 60s Pro)
- AI rate limits (Gemini quotas)
- Storage size

### Bottleneck Predictions (by stage)
- **100 users:** Likely none
- **1K users:** AI cost, DB connection count
- **10K users:** Weather fetch optimization, recommendation batch compute
- **100K users:** Re-architect (event-driven, dedicated queue, read replicas)

### Scale Triggers
| Metric | Threshold | Action |
|---|---|---|
| AI cost/user/month | > Rp 5K | Optimize prompts, increase caching |
| DB CPU sustained | > 70% | Upgrade plan / add replica |
| Function timeout rate | > 1% | Move to background job |
| Weather fetch failure | > 5% | Add fallback provider |

### Premature Scaling Anti-Patterns (avoid)
- ❌ Microservices before monolith strains
- ❌ Read replicas before query patterns proven
- ❌ Custom CDN before standard CDN insufficient
- ❌ Event sourcing untuk data yang tidak butuh audit kompleks

---

## 17. Disaster Recovery

### Backups
- Supabase: automatic daily backup (Pro plan: 7 days retention)
- Code: GitHub
- Config: Vercel + documented in repo

### Recovery Targets (Production v1)
- **RTO** (Recovery Time Objective): 4 hours
- **RPO** (Recovery Point Objective): 24 hours (acceptable data loss)

### Incident Playbook
1. Detect (monitoring alert or user report)
2. Triage (severity 1-4)
3. Mitigate (rollback, feature flag off, scale up)
4. Resolve
5. Post-mortem within 5 days for sev 1-2

---

## 18. Summary: What This Architecture Optimizes For

**For:**
- Solo/duo founder velocity
- Sub-100ms latency on Indonesian 4G
- AI cost under control
- Reversible decisions
- Real production reliability

**Not for:**
- 100K concurrent users (defer)
- Multi-region distribution (defer)
- Microservice architecture (avoid forever if possible)
- Custom infrastructure (avoid forever if possible)

When the product is successful enough to outgrow this stack, re-evaluation will be **easier than maintaining a complex stack you didn't need**.
