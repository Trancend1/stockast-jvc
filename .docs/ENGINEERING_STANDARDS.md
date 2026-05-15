# Engineering Standards — Stockast

**Version:** 1.0
**Audience:** All contributors (current and future)
**Principle:** Standards exist to enable speed, not slow it down.

---

## 1. Philosophy

1. **Boring code is good code.** We optimize for readers, not writers.
2. **Reversible decisions move fast, irreversible decisions move slow.** Schemas and APIs need review; component refactors don't.
3. **Convention over configuration.** Patterns repeat across the codebase.
4. **Production-realistic, not enterprise-cosplay.** Standards must serve a small team shipping daily.
5. **Document why, not what.** Code shows what. Comments and docs explain why.

---

## 2. Naming Conventions

### TypeScript / JavaScript
| Element | Convention | Example |
|---|---|---|
| Files | kebab-case | `stock-input-form.tsx` |
| Components | PascalCase | `StockInputForm` |
| Hooks | camelCase with `use` prefix | `useStockDraft` |
| Functions | camelCase verb-first | `parseStockInput`, `validateRecommendation` |
| Constants | SCREAMING_SNAKE | `MAX_DRAFT_PER_DAY` |
| Types/Interfaces | PascalCase | `StockLog`, `RecommendationResult` |
| Enums (as union types) | PascalCase type, lowercase values | `'draft' \| 'parsed' \| 'confirmed'` |
| Booleans | `is/has/can/should` prefix | `isLoading`, `hasError`, `canSubmit` |
| Event handlers | `on` or `handle` prefix | `onSubmit`, `handleConfirm` |

### Database (Postgres / Supabase)
| Element | Convention | Example |
|---|---|---|
| Tables | snake_case plural | `stock_logs`, `menu_items` |
| Columns | snake_case | `service_date`, `confirmed_at` |
| Foreign keys | `{table_singular}_id` | `outlet_id`, `user_id` |
| Indexes | `idx_{table}_{cols}` | `idx_stock_logs_outlet_date` |
| RLS policies | descriptive sentence | `"members access own org data"` |
| Migrations | timestamp + description | `20260514120000_add_promo_drafts.sql` |

### Routes & APIs
| Element | Convention | Example |
|---|---|---|
| App routes | kebab-case | `/stock/new`, `/recommendations/[date]` |
| API routes | `/api/{domain}/{resource}/{action}` | `/api/ai/stock/parse` |
| Server Actions | verb-first camelCase | `submitStockDraft`, `confirmStockLog` |

### Environment Variables
- `UPPER_SNAKE_CASE`
- Group by prefix: `GEMINI_*`, `SUPABASE_*`, `BMKG_*`
- Server-only: no `NEXT_PUBLIC_` prefix
- Public (client-accessible): `NEXT_PUBLIC_*` prefix
- Document all required vars in `.env.example`

---

## 3. Folder Structure Standards

See `SYSTEM_ARCHITECTURE.md` Section 3 for full structure. Key rules:

### File Organization
- One default export per file when it's the file's purpose
- Co-locate related: tests next to source (`stock.ts` + `stock.test.ts`)
- Feature folders for composite components (`components/features/belanja-card/`)
- Shared UI primitives separate from feature-specific (`components/ui/` vs `components/features/`)

### Import Order
```typescript
// 1. External
import { useState } from 'react';
import { z } from 'zod';

// 2. Internal absolute (lib, components)
import { parseStockInput } from '@/lib/services/stock';
import { Button } from '@/components/ui/button';

// 3. Internal relative
import { StockPreviewCard } from './stock-preview-card';

// 4. Types
import type { StockLog } from '@/types';
```

### What Doesn't Belong Where
- ❌ Business logic in components → move to `lib/services/`
- ❌ Database queries in components → move to Server Actions or `lib/db/queries/`
- ❌ AI prompts inline in services → move to `lib/ai/prompts/`
- ❌ Validation logic in API handlers → move to `lib/ai/validators/` or services

---

## 4. API Standards

### Server Actions (Primary Pattern)
```typescript
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { requireAuth } from '@/lib/auth';

const InputSchema = z.object({
  rawNote: z.string().min(1).max(2000),
  serviceDate: z.string().date(),
});

export async function submitStockDraft(
  input: z.infer<typeof InputSchema>
): Promise<ActionResult<StockDraft>> {
  try {
    const user = await requireAuth();
    const validated = InputSchema.parse(input);
    
    const draft = await stockService.createDraft(validated, {
      outletId: user.outletId,
    });
    
    revalidatePath('/stock');
    return { data: draft, error: null };
  } catch (err) {
    return handleActionError(err);
  }
}
```

### Response Shape (Consistent)
```typescript
type ActionResult<T> =
  | { data: T; error: null }
  | { data: null; error: { code: string; message: string } };
```

### HTTP API Standards (Route Handlers)
- Use HTTP methods semantically (`POST` for mutations, `GET` for reads)
- Status codes: 200, 201, 400, 401, 403, 404, 409, 422, 429, 500
- All endpoints accept and return JSON unless otherwise specified
- Idempotency key header (`X-Idempotency-Key`) supported on mutations
- Always validate input with Zod
- Always validate auth + RLS scope

### API Versioning
- MVP: no versioning, evolve schema additively
- When breaking change required: `/api/v2/...` path prefix
- Deprecation: 2-week notice in response headers (`Sunset: ...`)

---

## 5. Error Handling Standards

### Error Categories
1. **User errors** — invalid input, unauth, forbidden. Return 4xx, plain message.
2. **System errors** — DB down, AI API timeout. Return 5xx, generic message + log.
3. **Business logic errors** — quota exceeded, state conflict. Return 409/422 + actionable message.

### Error Code Convention
```typescript
type ErrorCode =
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
```

### Error Handling in Components
```typescript
// Server Action returns ActionResult, component handles both branches
const handleSubmit = async () => {
  const result = await submitStockDraft(input);
  if (result.error) {
    showErrorToast(result.error.message);
    return;
  }
  router.push(`/stock/${result.data.id}/confirm`);
};
```

### Don'ts
- ❌ `throw` from Server Actions to client (returns 500 + crashes flow)
- ❌ Show raw error messages to users
- ❌ Swallow errors silently
- ❌ Log full error stacks in production console (use Sentry)

### Custom Error Classes (Server-Side)
```typescript
export class QuotaExceededError extends Error {
  code = 'QUOTA_EXCEEDED' as const;
  constructor(public limit: number, public window: string) {
    super(`Quota exceeded: ${limit}/${window}`);
  }
}
```

---

## 6. Logging Strategy

### Log Levels
- `error` — System malfunctions requiring investigation
- `warn` — Unexpected but handled (AI parse fallback used, cache miss)
- `info` — Business events (stock confirmed, recommendation generated)
- `debug` — Development only; never in production logs

### What to Log
- Business events with entity IDs (not content)
- AI calls: prompt version, model, latency, success/fail
- Errors with stack trace + request ID
- External API failures (BMKG, Gemini)

### What NOT to Log
- Phone numbers (PII)
- Raw stock notes (user-personal context)
- Full AI prompt + user input together (privacy)
- Passwords / tokens / API keys

### Format
```typescript
logger.info('stock.draft.created', {
  draftId,
  outletId,
  inputLength: input.length,
});
```

### Production
- MVP: Vercel function logs
- Phase 2+: Sentry for errors, structured logs to Vercel/Logflare

---

## 7. Security Standards

### Authentication
- Server-side session validation on every protected route/action
- Cookie-based session, never localStorage for tokens
- Phone OTP rate limit: 3 attempts / 15 min / phone

### Authorization (Defense in Depth)
- **Layer 1:** Middleware checks session exists
- **Layer 2:** Server Action verifies role and resource access
- **Layer 3:** RLS enforces row-level access at DB

```typescript
// Layer 2 example
async function requireOutletAccess(outletId: string) {
  const user = await requireAuth();
  const membership = await db.memberships.find({
    userId: user.id,
    outletId,
  });
  if (!membership) throw new ForbiddenError();
  return { user, membership };
}
```

### Input Validation
- Zod schemas for every external input (user input, AI output, webhook payload)
- Length limits on all string fields
- Numeric range checks on quantities
- Whitelist enums, never accept arbitrary strings

### AI Output Validation Pipeline
```typescript
async function parseStockSafely(raw: string, ctx) {
  // 1. Call Gemini
  const response = await gemini.generate({ prompt, input: raw });
  
  // 2. Parse JSON
  const json = JSON.parse(response.text);
  
  // 3. Zod schema validation
  const parsed = StockParseSchema.parse(json);
  
  // 4. Business validation (menu match, bounds)
  const validated = validateStockBusiness(parsed, ctx);
  
  // 5. Store audit log
  await auditLog.write({ raw, response: json, validation: validated });
  
  return validated;
}
```

### Secrets Management
- All API keys in env vars
- Never committed to git
- Rotation quarterly
- Server-only: `GEMINI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- Client-accessible: `NEXT_PUBLIC_SUPABASE_ANON_KEY` only

### Dependency Security
- `npm audit` runs in CI, fails on `high` or `critical`
- Dependabot or Renovate enabled
- Lock file committed
- Avoid abandoned packages

### Headers (Vercel handles most)
- HTTPS enforced
- HSTS enabled
- X-Frame-Options: DENY
- CSP: configured for app domains only

---

## 8. Performance Standards

### Bundle Size Budgets
- Initial JS (homepage): < 200 KB gzipped
- Per-route JS: < 100 KB gzipped additional
- Total page weight: < 500 KB

### Runtime Performance Targets
- LCP (Largest Contentful Paint): < 2.5s on 4G
- INP (Interaction to Next Paint): < 200ms
- CLS (Cumulative Layout Shift): < 0.1
- Time to magic moment: < 90s (first time), < 10s (returning)

### Database Performance
- Query response < 100ms for indexed lookups
- Use indexes for all `WHERE` clauses on production tables
- Avoid N+1 queries (batch with single query)
- Monitor slow query log weekly

### AI Call Budget
- Max latency per call: 5 seconds (timeout)
- Max retries: 2
- Cache identical input within 1 hour
- Cost target: < Rp 50 per active user per day

### Image Optimization
- Use Next.js `<Image>` component
- WebP format with JPG fallback
- Lazy load below the fold
- Responsive `sizes` attribute

### Code Performance
- Server Components by default (smaller client bundle)
- `'use client'` only when interactivity required
- React `Suspense` for streaming where applicable
- Avoid unnecessary re-renders (memo when measured)

---

## 9. Code Review Checklist

Every PR must pass:

### Functionality
- [ ] Does the change do what the PR description says?
- [ ] Are edge cases handled? (empty input, network failure, race conditions)
- [ ] Are happy path + 1 failure case tested?

### Code Quality
- [ ] Names are clear and follow conventions
- [ ] No commented-out code
- [ ] No `TODO` without owner + date
- [ ] No `console.log` left behind
- [ ] No `any` types without comment

### Architecture
- [ ] Business logic in services, not components
- [ ] Database access through proper layer
- [ ] No premature abstraction
- [ ] No duplication (DRY where it makes sense)

### Security
- [ ] Auth checks present
- [ ] Input validated with Zod
- [ ] No PII in logs
- [ ] No secrets in code

### Performance
- [ ] No unnecessary client-side JS
- [ ] Database queries indexed
- [ ] No new bundle bloat

### UX
- [ ] Loading state designed
- [ ] Error state designed
- [ ] Empty state designed
- [ ] Mobile viewport tested

### Testing
- [ ] Critical paths covered
- [ ] Tests are deterministic
- [ ] Tests don't hit external services

---

## 10. Testing Strategy

### What to Test (Risk-Based)
**High priority:**
- Stock parse business validation (Zod + menu match + bounds)
- Recommendation rule engine (pure functions, easy to test)
- Promo validator (diskon cap, frequency)
- RLS policies (test multi-tenant access)
- Idempotency on mutations

**Medium priority:**
- Server Actions happy paths
- Critical UI flows (E2E)
- Auth flows

**Lower priority (defer):**
- Snapshot tests
- Coverage targets
- Visual regression

### Tooling
- **Unit tests:** Vitest
- **Component tests:** Vitest + Testing Library (sparingly)
- **E2E (Phase 2):** Playwright on 2-3 critical flows
- **Database tests (Phase 2):** Supabase test client

### Test Structure
```typescript
describe('parseStockInput', () => {
  it('extracts items from natural Indonesian input', async () => {
    const result = await parseStockInput(
      'lele sisa 5 dari 30 ekor, ayam habis',
      { outletId: 'test', menuItems: mockMenu }
    );
    expect(result.items).toHaveLength(2);
    expect(result.items[0].normalizedName).toBe('lele');
  });

  it('rejects items not in menu dictionary', async () => {
    // ...
  });
});
```

### Test Anti-Patterns
- ❌ Tests that hit real Gemini API (mock it)
- ❌ Tests dependent on test execution order
- ❌ Tests that share mutable state
- ❌ "Coverage" pursuit without risk awareness
- ❌ Snapshot tests of changing UI

---

## 11. Git Workflow

### Branch Strategy
- `main` — production-ready, always deployable
- `feature/{ticket}-{slug}` — feature work (e.g., `feature/STK-12-belanja-card`)
- `fix/{ticket}-{slug}` — bug fixes
- `chore/{slug}` — non-functional changes

### Branch Lifetime
- Max 3 days
- Small PRs (< 400 lines diff preferred)
- Long-lived branches = merge conflicts + reviewer fatigue

### PR Workflow
1. Branch from `main`
2. Push commits with clear messages
3. Open PR with template (description, changes, test plan)
4. Self-review before requesting review
5. Get 1 approval (when team > 1)
6. CI green
7. Squash merge to `main`
8. Delete branch

---

## 12. Commit Messages (Conventional Commits)

### Format
```
{type}({scope}): {subject}

{body}

{footer}
```

### Types
- `feat:` New feature
- `fix:` Bug fix
- `refactor:` Code change without behavior change
- `perf:` Performance improvement
- `docs:` Documentation only
- `style:` Formatting, missing semicolons, etc.
- `test:` Adding tests
- `chore:` Build, deps, config
- `revert:` Revert previous commit

### Scope (optional)
- `auth`, `stock`, `recommendation`, `promo`, `ai`, `ui`, `db`

### Examples
- `feat(stock): add AI parse confirmation flow`
- `fix(promo): prevent double-submit on copy button`
- `refactor(ai): extract prompt to versioned file`
- `chore(deps): bump @google/genai to 0.x.y`

### Body Guidelines
- Wrap at 72 chars
- Explain why, not what (code shows what)
- Reference issue/ticket: `Refs: STK-12`

### Breaking Changes
```
feat(api)!: change recommendation response shape

BREAKING CHANGE: `recommendations[].confidence` removed; use `recommendations[].confidenceLabel` instead.
```

---

## 13. CI/CD Standards

### CI Pipeline (GitHub Actions)
On every PR:
1. Install dependencies (cached)
2. TypeScript check (`tsc --noEmit`)
3. Lint (`eslint .`)
4. Unit tests (`vitest run`)
5. Build verification (`next build`)
6. `npm audit` (fail on high/critical)

CI must pass before merge. No exceptions.

### CD Pipeline (Vercel)
- Push to `main` → auto-deploy to production
- PR open → auto-deploy preview
- Rollback: 1-click in Vercel dashboard

### Database Migrations
- Stored in `supabase/migrations/`
- Run via Supabase CLI: `supabase db push`
- Test locally first: `supabase db reset` against local
- Production migration during off-peak (after 22.00 WIB)
- Always reversible OR forward-only with rollback plan

### Feature Flags
- Use environment variables for kill switches
- Use `lib/config/feature-flags.ts` for runtime checks
- New features default OFF in production
- Gradual rollout: 10% → 50% → 100%

---

## 14. Documentation Standards

### What to Document
- **README.md** — Project overview, setup, deploy instructions
- **`/docs`** — Architecture decisions, runbooks, contributor guide
- **Inline comments** — Only for "why", not "what"
- **JSDoc on public APIs** — Service functions, exported types
- **Migration notes** — In PR description for breaking changes

### What NOT to Over-Document
- Self-evident code (good naming > comments)
- Implementation details that change frequently
- Tutorials better delivered as code/examples

### Architecture Decision Records (ADRs)
For significant decisions (stack choice, schema change, big refactor):

`docs/adr/0001-use-supabase-not-firebase.md`:
```markdown
# ADR-0001: Use Supabase instead of Firebase

## Status
Accepted (2026-05-14)

## Context
Need backend with auth + database + RLS.

## Decision
Supabase. Postgres familiarity, RLS, open-source escape hatch.

## Consequences
- ✅ Standard SQL skills transfer
- ✅ RLS strong primitives
- ❌ Less mature ecosystem than Firebase
- ❌ Self-hosted requires DevOps if we leave Supabase Cloud
```

ADR cadence: 1 per significant decision. Aim for 5-15 total in product lifetime, not 100.

### Runbooks
For ops scenarios:
- `docs/runbooks/database-migration.md`
- `docs/runbooks/incident-response.md`
- `docs/runbooks/ai-cost-spike.md`

Each runbook: short, scannable, actionable steps.

---

## 15. Code Style

### Formatting
- Prettier (auto-format on save)
- 2-space indent
- 100 char line limit (soft)
- Single quotes for strings
- Trailing commas

### TypeScript
- `strict: true` in `tsconfig.json`
- `noUncheckedIndexedAccess: true`
- Prefer `type` over `interface` (more flexible)
- Discriminated unions for state
- Inferred return types where obvious; explicit where helpful

### React
- Function components only (no class)
- Hooks at top of component
- Server Components by default
- `'use client'` directive only when needed
- Lift state to nearest common ancestor; no Redux for local state

### Naming Anti-Patterns
- ❌ `data`, `info`, `obj`, `item` (too generic)
- ❌ `handleClick` for everything (use `handleConfirmStock`, `handleCopyPromo`)
- ❌ `temp`, `tmp` (every "temp" lives forever)
- ❌ Hungarian notation (`strName`, `iCount`)

---

## 16. Definition of Production-Ready Code

A piece of code is production-ready when:

- [ ] Tests pass
- [ ] Types are sound (no `any` without justification)
- [ ] Auth + authorization checked
- [ ] Input validated
- [ ] Errors handled with user-facing recovery
- [ ] Loading + empty + error states designed
- [ ] No secrets in code
- [ ] No PII in logs
- [ ] Indexes added for new queries
- [ ] Idempotent if it mutates
- [ ] Reviewed by another human
- [ ] Documented if it's a public API

---

## 17. Standards Maintenance

These standards are not law. They are scaffolding.

- Revisit after every 3 months
- Update when a standard fights productivity > helps
- Add new standards when patterns emerge
- Remove standards no one follows
- Standards apply to new code; legacy upgraded opportunistically

Standards exist to enable the team. When they don't, they change.
