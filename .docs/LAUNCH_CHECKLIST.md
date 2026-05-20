# Launch Checklist — Stockast

**Version:** 1.0
**Audience:** Founder + dev team prior to each launch milestone
**Scope:** Demo MVP launch + Private Beta launch + Production v1 launch

---

## 1. How to Use This Checklist

Three sections, applied at different milestones:

| Milestone | Apply Sections |
|---|---|
| **Sprint F (Auth + Multi-tenancy)** | Sections 3 (Auth/Multi-tenancy), 4 (perf), 11 (general checks) |
| **Sprint G (Real Integrations)** | Sections 2 (QA additions), 3 (Rate Limit, Webhook), 4 (AI/DB perf) |
| **Sprint H (Observability)** | Section 7 (analytics), 8 (monitoring), 9 (backup) |
| **Sprint I (Beta Onboarding)** | Section 11 Private Beta Specific + 12 First Week monitoring |
| **Sprint J — JVC Submission (DEFERRED until after Sprint I gate)** | Sections 2, 3, 4 (comprehensive) + Phase 1.5+2 additions |
| **Production v1 (200+ users)** | All sections, comprehensive |

**Note (2026-05-20):** Strategy pivot — old Phase 2 hardening (auth + RLS + BMKG + observability + Beta onboarding) pulled forward into pre-submission target. Submission Prep (Sprint J) gated on Sprint I exit (5 pedagang D7 + retention/accuracy pass). Lihat `EXECUTION_BLUEPRINT.md §2 Phase 1.5+2`.

**Note (2026-05-16, historical):** Demo MVP launch milestone digabung ke **Phase 1.5 — JVC Submission Sprint**. Now extends to Phase 1.5+2 per 2026-05-20 pivot.

Mark items `✅` (done), `🟡` (in progress), `⏸` (deferred with reason), `❌` (blocker).
Items marked `⏸` require justification + revisit date.

---

## 2. QA Checklist

### Functional Testing
- [ ] Onboarding flow completes in < 60s
- [ ] Stock input + AI parse + confirm flow works end-to-end
- [ ] Recommendation generation produces sensible output
- [ ] Promo draft generates + copy-to-WhatsApp works
- [ ] 7-day history displays correctly
- [ ] All CTAs lead where users expect
- [ ] Form validations work (empty, too long, invalid)
- [ ] Multi-tap rapid input doesn't double-submit (idempotency)
- [ ] Back navigation preserves state where appropriate
- [ ] Subuh Mode toggle works + persists

### Phase 1.5+2 — Pre-Submission Additions

**Sprint D-E (DONE):**
- [x] Pola Mingguan card renders bar chart × 7 hari + auto-insight
- [x] Pre-seeded sample data shows immediately after onboarding (no cold start)
- [x] Cuaca mock card visible on Dashboard
- [x] Offline PWA: shell cached + manifest installable
- [x] Offline PWA: draft input queues to IndexedDB, restore banner shows on reconnect
- [x] Voice input behind `FEATURE_VOICE_INPUT` flag (default OFF); button renders only when flag on
- [x] Loading skeletons (BelanjaCardSkeleton + ParseLoadingCard) replace spinner
- [x] Error recovery: retry button + auto-retry once on AI_PARSE_FAILED

**Sprint F (Auth + Multi-tenancy) — NEXT:**
- [ ] Phone OTP auth flow works end-to-end (Indonesia provider verified)
- [ ] RLS policies enforced on all tables (cross-tenant attempt denied)
- [ ] DEMO_OUTLET_ID removed from Server Actions; session-driven outlet resolution
- [ ] Middleware session check + Server Action role guards

**Sprint G (Real Integrations):**
- [ ] BMKG real API integrated + per-adm4 cache (6h TTL)
- [ ] `FEATURE_MOCK_WEATHER=false` path tested live
- [ ] Rate limiting active (AI per user/day, OTP per phone/15min, IP/min)
- [ ] Audit log writes for recommendation + promo generation

**Sprint H (Observability):**
- [ ] Sentry capturing server + client errors
- [ ] PostHog events firing for full analytics taxonomy
- [ ] Recommendation accuracy spot-check tool runs against random log

**Sprint I (Beta Onboarding):**
- [ ] 5 pedagang nyata onboarded
- [ ] Daily WhatsApp check-in completed week 1
- [ ] 5/5 active D7
- [ ] Retention week 1 > 60%
- [ ] Spot-check pass on recommendation accuracy

**Sprint J (Submission — DEFERRED):**
- [ ] Demo dry-run < 90s to magic moment (5 consecutive runs zero-bug)
- [ ] Backup demo video 60s recorded
- [ ] Vercel production deploy live + custom domain (optional) responding
- [ ] README polish with beta cohort testimonials
- [ ] Voice flag decision (ON if dry-run lurus 5x)

### Cross-Device Testing
- [ ] iPhone SE (375px) — Safari iOS
- [ ] iPhone Pro (414px) — Safari iOS
- [ ] Android 360px width — Chrome Android
- [ ] Android mid-range (Galaxy A series equivalent)
- [ ] Tablet (iPad portrait) — capped layout looks correct
- [ ] Desktop (1280px) — capped layout, not stretched

### Network Conditions
- [ ] Works on 4G simulation
- [ ] Works on 3G simulation (slow but functional)
- [ ] Offline state shows banner + saves drafts (Phase 2+)
- [ ] Recovery from network restoration

### Edge Cases
- [ ] Empty data state on first use shows helpful illustration + CTA
- [ ] Very long stock note (1000+ chars) handled
- [ ] Special characters in stock note don't break parse
- [ ] Multi-line input preserved
- [ ] User submits stock for today twice (replace vs new)
- [ ] User edits confirmed log (audit trail)
- [ ] System time edge cases (midnight, timezone)
- [ ] BMKG API failure shows graceful degradation
- [ ] Gemini API timeout shows retry option

### Stock Parse Accuracy
- [ ] 10 test utterances run; ≥ 80% parse correctly
- [ ] Ambiguous input triggers clarification, not silent failure
- [ ] AI invented items flagged as unmatched
- [ ] Numerical edge cases (zero, decimal, "habis") parse correctly

### Recommendation Sanity
- [ ] Recommendation never exceeds 20% change without data justification
- [ ] Cold start (< 3 days data) shows conservative recommendation
- [ ] Reasoning text explains the recommendation in plain Indonesian
- [ ] Weather data shows when used; cache stale label when applicable

### Promo Validation
- [ ] Discount cap (15%) enforced
- [ ] Frequency cap (1 per outlet per day) enforced
- [ ] Generated copy doesn't make false claims
- [ ] Copy button copies the right content

---

## 3. Security Audit Checklist

### Authentication & Authorization
- [ ] All protected routes server-side validated
- [ ] All Server Actions check auth before logic
- [ ] RLS enabled on every table with user data
- [ ] RLS policies tested with cross-tenant attempt
- [ ] Roles (owner/staff) enforced correctly
- [ ] Session cookie httpOnly + SameSite=Lax + Secure
- [ ] Logout invalidates session server-side

### Input Validation
- [ ] All user inputs validated with Zod
- [ ] All AI outputs validated with Zod
- [ ] All webhook payloads validated
- [ ] Length limits enforced
- [ ] Numeric ranges enforced
- [ ] Enum values whitelisted

### Secrets Management
- [ ] No secrets in client bundle (verified via build inspection)
- [ ] No secrets in git history (verified via gitleaks scan)
- [ ] All env vars documented in `.env.example`
- [ ] Production env vars set in Vercel
- [ ] API keys not in error messages or logs

### Data Protection
- [ ] HTTPS enforced (Vercel default)
- [ ] HSTS header present
- [ ] No PII in logs (phone, raw stock notes)
- [ ] AI raw logs redacted before storage
- [ ] Database backups encrypted at rest (Supabase default)
- [ ] Data export available for user request

### Rate Limiting
- [ ] AI endpoints rate limited (30/day/user)
- [ ] Auth endpoints rate limited (3 OTP/15min/phone)
- [ ] General API limited (100/min/IP)
- [ ] Rate limit responses return 429 with retry-after

### Dependency Security
- [ ] `npm audit` shows no high/critical
- [ ] No abandoned packages (last commit > 1 year)
- [ ] Dependabot or Renovate enabled

### CSRF / XSS / Injection
- [ ] React's default escaping in use
- [ ] No `dangerouslySetInnerHTML` (lint-blocked)
- [ ] All DB queries parameterized (Supabase client safe by default)
- [ ] CORS configured restrictively

### Webhook Security (Phase 3+ for WhatsApp)
- [ ] Webhook signatures verified
- [ ] Webhook idempotency enforced
- [ ] Webhook source IP verified where possible

### Penetration Testing
- [ ] Manual test: attempt to access another tenant's data
- [ ] Manual test: attempt to bypass auth on Server Action
- [ ] Manual test: SQL injection via input fields
- [ ] (Production v1+) Engage external security review

---

## 4. Performance Checklist

### Web Vitals
- [ ] LCP < 2.5s on 4G simulation
- [ ] INP < 200ms
- [ ] CLS < 0.1
- [ ] FCP < 1.8s on 4G

### Bundle Size
- [ ] Initial JS < 200 KB gzipped (Vercel Analytics or `next build` output)
- [ ] Per-route JS additional < 100 KB
- [ ] No unexpectedly large dependencies (check `npm run analyze`)
- [ ] Tree-shaking working (no unused exports bundled)

### Image Optimization
- [ ] All images use Next.js `<Image>`
- [ ] WebP delivered where supported
- [ ] Responsive `sizes` attribute set
- [ ] No images larger than display size

### Loading Performance
- [ ] Skeleton states for slow-loading content
- [ ] Suspense boundaries at appropriate levels
- [ ] No unnecessary client-side data fetching
- [ ] Server Components used where possible

### Database Performance
- [ ] All queries use indexes (verify via `EXPLAIN`)
- [ ] No N+1 queries
- [ ] Slow query log reviewed (Supabase dashboard)
- [ ] Connection pooling configured (Supabase Pro+)

### AI Performance
- [ ] All AI calls have timeout (5s)
- [ ] All AI calls have retry logic (max 2)
- [ ] Cache for identical inputs (1h TTL)
- [ ] Cost per active user / day tracked

### Real Device Testing
- [ ] Tested on actual low-end Android device (not just emulator)
- [ ] Tested on actual 3G/4G in Indonesia
- [ ] Tested in actual subuh lighting condition

---

## 5. Accessibility Checklist

### WCAG 2.1 AA Compliance
- [ ] Contrast ≥ 4.5:1 for body text
- [ ] Contrast ≥ 3:1 for large text + UI components
- [ ] Touch targets ≥ 44x44px
- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible
- [ ] Logical tab order

### Semantic HTML
- [ ] Headings hierarchical (H1 → H2 → H3, no skipping)
- [ ] Form inputs have labels (no placeholder-as-label)
- [ ] Buttons are `<button>`, links are `<a>`
- [ ] ARIA labels on icon-only buttons
- [ ] Alt text on meaningful images
- [ ] `aria-live` regions for dynamic updates

### Screen Reader Testing
- [ ] VoiceOver (iOS) test on main flows
- [ ] TalkBack (Android) test on main flows
- [ ] Error messages announced
- [ ] Loading state announced

### Reduced Motion
- [ ] `prefers-reduced-motion` respected
- [ ] Critical animations have non-animated alternatives

### Indonesian Language
- [ ] All UI strings in Bahasa Indonesia (conversational)
- [ ] No English UI labels mixed in (except brand name)
- [ ] Date/number formatting Indonesian convention (`Rp 25.000`, `15 Mei 2026`)

### Vision Accessibility
- [ ] Tested with system font scale 150%, 200%
- [ ] Tested in browser zoom 200%
- [ ] No information conveyed by color alone

---

## 6. SEO Checklist

### Essentials (Production Landing Page)
- [ ] `<title>` per route, descriptive, < 60 chars
- [ ] Meta description per route, < 160 chars
- [ ] Open Graph image + tags for social sharing
- [ ] Canonical URLs set
- [ ] `robots.txt` configured
- [ ] `sitemap.xml` generated

### Technical SEO
- [ ] No broken links
- [ ] Pages indexable (except auth-protected)
- [ ] Mobile-friendly (Google Mobile-Friendly test)
- [ ] Structured data where applicable (organization, product)

### Content (Production+)
- [ ] Landing page targets relevant Indonesian keywords
- [ ] Blog or content section for SEO long-tail (Phase 4)
- [ ] Internal linking strategy
- [ ] Page load speed optimized (Lighthouse > 90)

### App-Specific (Less Important for App Routes)
- [ ] App routes can be `noindex` (these are post-auth)
- [ ] Focus SEO efforts on public marketing pages

---

## 7. Analytics Setup

### Tracking Plan
- [ ] Event taxonomy documented (`docs/analytics-events.md`)
- [ ] Events implemented:
  - `app_opened`
  - `onboarding_started`
  - `onboarding_completed`
  - `stock_draft_submitted`
  - `stock_log_confirmed`
  - `recommendation_viewed`
  - `promo_generated`
  - `promo_copied`
  - `subuh_mode_toggled`
- [ ] User properties: `outlet_id`, `signup_date`, `cohort`
- [ ] No PII in event properties

### Tooling
- [ ] PostHog (free tier) installed (Phase 2+)
- [ ] Vercel Analytics (Web Vitals) installed
- [ ] Session replay enabled (PostHog) with PII masking

### Dashboards
- [ ] Activation funnel: signup → onboarding → first stock log → first recommendation viewed
- [ ] Retention cohort: D1, D7, D28
- [ ] Feature usage: % users using promo, % opening recommendation
- [ ] Daily/weekly active users

### Privacy
- [ ] Cookie/tracking notice for users (per Indonesian regulations)
- [ ] Analytics opt-out option (Phase 3+)
- [ ] No PII in third-party analytics

---

## 8. Monitoring Setup

### Error Tracking
- [ ] Sentry (or equivalent) configured for production (Phase 2+)
- [ ] Source maps uploaded
- [ ] Slack or email alert for new error patterns
- [ ] Error severity classified (sev 1-4)

### Uptime Monitoring
- [ ] UptimeRobot or Better Stack pinging main routes (Phase 3+)
- [ ] Alert on > 1 min downtime
- [ ] Status page (Phase 3+)

### Application Metrics
- [ ] AI cost per day tracked
- [ ] AI call success rate tracked
- [ ] Recommendation engagement rate tracked
- [ ] Active user count tracked
- [ ] BMKG fetch success rate tracked

### Database Monitoring
- [ ] Supabase dashboard metrics reviewed weekly
- [ ] Slow query log reviewed
- [ ] DB size growth tracked
- [ ] Connection count monitored

### Alerts (Production v1+)
- [ ] AI cost spike (2x daily average)
- [ ] Error rate spike (5x baseline)
- [ ] BMKG failure rate > 10%
- [ ] DB connection saturation > 80%

---

## 9. Backup Strategy

### Database Backups
- [ ] Supabase daily auto-backup verified (Pro plan: 7 days retention)
- [ ] Quarterly backup restoration test
- [ ] Critical schema documented separately

### Code Backups
- [ ] GitHub primary
- [ ] Local clone on founder's machine
- [ ] (Phase 3+) Secondary remote mirror

### Configuration Backups
- [ ] Vercel environment variables documented
- [ ] Third-party service configs documented
- [ ] Domain registration auto-renewed

### User Data Export
- [ ] User can request data export (manual in Phase 2, automated Phase 3)
- [ ] Export format documented (JSON)
- [ ] Export delivery within 30 days of request

---

## 10. Rollback Plan

### Code Rollback
- [ ] Vercel deployment history maintained
- [ ] 1-click rollback to previous deployment tested
- [ ] Rollback procedure documented in runbook

### Database Rollback
- [ ] Migrations reviewed for reversibility
- [ ] Down migrations written for breaking changes
- [ ] Backup restore procedure documented
- [ ] Forward-only migrations have rollback alternative

### Feature Rollback
- [ ] Feature flags for major launches
- [ ] Kill switch for AI calls (in case of cost spike or accuracy issue)
- [ ] Kill switch for promo generation (in case of bad output pattern)

### Communication Plan
- [ ] Incident response playbook
- [ ] User communication template for outages
- [ ] Support channel ready (email or WhatsApp)

---

## 11. Production Readiness Verification

### Demo MVP Specific
- [ ] Demo flow runs 5 times consecutively without bug
- [ ] Demo backup video recorded (60-90s)
- [ ] Demo script printed/saved
- [ ] Demo device fully charged + backup
- [ ] Demo deployed on production URL (not localhost)
- [ ] Custom domain configured + SSL active

### Private Beta Specific
- [ ] Onboarding flow tested with non-developer
- [ ] Support channel ready (WhatsApp group)
- [ ] Feedback mechanism in-app
- [ ] Beta user list (10-15 pedagang) confirmed
- [ ] Hands-on activation plan for first 5 users

### Production v1 Specific
- [ ] Public landing page live
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] Help docs available
- [ ] Pricing decision made (or "free" clearly communicated)
- [ ] Customer support workflow defined

### General Checks
- [ ] All `console.log` removed from production code
- [ ] All `TODO`/`FIXME` with timelines documented in issues
- [ ] All deferred items have revisit dates
- [ ] CI pipeline green
- [ ] No `any` types in critical paths
- [ ] All env vars present in production

---

## 12. Post-Launch Monitoring Checklist

### First 24 Hours
- [ ] Watch error rate hourly
- [ ] Watch AI cost
- [ ] Watch active user count
- [ ] Respond to support requests within 4 hours
- [ ] Check for critical bugs

### First Week
- [ ] Daily check of metrics dashboard
- [ ] Daily check of error tracking
- [ ] User interviews with first 5 active users
- [ ] Triage and fix top 3 bugs
- [ ] Adjust onboarding based on funnel data

### First Month
- [ ] Weekly metrics review
- [ ] D7 retention measured + reviewed
- [ ] AI cost per user measured
- [ ] Feature usage measured
- [ ] User testimonials collected (for Phase 3 marketing)
- [ ] Roadmap adjusted based on data

### Ongoing
- [ ] Weekly retro (what worked, what to change)
- [ ] Monthly cohort retention review
- [ ] Quarterly architectural review
- [ ] Quarterly security audit
- [ ] Annual dependency audit

---

## 13. Launch Day Runbook (Demo MVP)

### Demo Day Specifics (fill before T-7 day)
| Item | Value |
|---|---|
| Event | #JuaraVibeCoding |
| Tanggal | _TBD — confirm from event organizer_ |
| Venue | _TBD_ |
| Slot waktu presentasi | _TBD — durasi alokasi_ |
| Jumlah judge | _TBD_ |
| Profile judge | _TBD — apakah teknikal? produk? bisnis?_ |
| Network venue | _TBD — confirm Wi-Fi quality / setup backup hotspot_ |
| Format presentasi | _TBD — live demo? slide + demo? Q&A?_ |
| Dress code | _TBD_ |
| Submission deadline | _TBD — apakah ada video submission sebelum live?_ |

**Action:** Founder confirm semua field di atas T-14 day (2 minggu sebelum event). Tidak diisi = risiko tinggi.

**T-24h**
- Run full demo flow 3 times
- Charge demo device + spare
- Test internet at venue or set up backup hotspot
- Print demo script

**T-2h**
- Open production URL on demo device, verify working
- Open backup video on second device
- Verify Vercel deployment status: green
- Check Gemini API status

**T-30m**
- Final dry run with stopwatch
- Mental rehearsal of opening line
- Check phone is on Do Not Disturb except for demo

**During demo**
- Confidence over perfection
- If something fails, switch to backup video
- Capture judge reactions (notes after)

**T+24h**
- Post-mortem: what worked, what didn't
- Adjust for any future demos
- Public link sharing if approved

---

## 14. Deferred Items Register

Track items marked `⏸` here with justification + revisit date:

| Item | Reason Deferred | Revisit Date |
|---|---|---|
| (Example) Real BMKG integration | Demo killer risk, mock for now | Phase 2 (post-event) |
| (Example) Multi-staff role | Single persona focus | Phase 3 |

---

## 15. Final Pre-Launch Sanity Check

Before any launch, founder reviews:

1. **"Am I confident this won't embarrass me?"**
2. **"Can a non-developer use this without help?"**
3. **"If a judge/user shares this with their boss, would I be proud?"**
4. **"Do I have a recovery plan if X breaks?"**

If any answer is "no", **wait**. Better to delay 24 hours than to launch broken.

The launch isn't the goal. **The next 30 days of use** is the goal. Launch with that in mind.
