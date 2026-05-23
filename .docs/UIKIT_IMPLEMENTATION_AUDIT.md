# UI Kit Implementation Audit

Date: 2026-05-22
Reference:
- `stockast-UI/README.md`
- `stockast-UI/ui-kit.html`
- `stockast-UI/index.html`
- `stockast-UI/ui-kit/*`

## Executive Summary

The UI kit has been ported into the app as a real React implementation under
`src/components/ui-kit/`, and the foundation layer is wired globally through
`src/styles/ui-kit-tokens.css` and `src/styles/ui-kit-utilities.css`.

Current status:
- Foundation tokens are complete against the reference CSS variable set.
- Iconography coverage is complete: 68 reference icons exist in React form.
- Weather, charts, notifications, item glyphs, motifs, brand heroes, empty
  states, and Belanja Card variants exist as reusable React modules.
- Main app screens now depend on UI kit primitives instead of the legacy
  `src/components/ui/*` primitives.

Remaining gaps are mostly integration depth, not missing asset files. The
largest remaining product gap is that the live `BelanjaCard` still uses a
custom layout instead of one of the signature UI kit variants.

## Coverage Matrix

| Area | Reference standard | App implementation | Status |
| --- | --- | --- | --- |
| Foundation | Brand, principles, color, type, spacing/radii/shadow, motion | `ui-kit-tokens.css`, `ui-kit-utilities.css`, `globals.css`, `DESIGN_SYSTEM.md` | Implemented |
| Brand | Wordmark, mascot, ticker, welcome/forecast/success heroes | `illustrations/branding.tsx`, `login/page.tsx` uses `WordLogo` | Implemented, underused |
| Principles | Quiet warmth, AI as plumbing, Bu Yati first, one ink hand | Captured in `stockast-UI/README.md` and app copy conventions | Implemented as guidance |
| Color | Cream day mode and serene warm-charcoal Subuh mode | Global CSS variables plus `data-subuh` and `html.subuh-mode` | Implemented |
| Typography | Sans for UI, serif italic for warmth, mono for numbers | Font variables and utility classes are present | Implemented |
| Spacing, radii, shadow | `--sk-r-*`, `--sk-shadow-*` | Tokens and primitive classes are present | Implemented |
| Motion | `sk-rise`, `sk-fade`, `sk-thinking`, count-up, skeleton shimmer | Utilities and React primitives are present | Implemented |
| Navigation icons | home, note, history, settings, etc. | `icons/sk-icons.tsx`, `SkBottomNav` | Implemented |
| Action icons | arrows, close, plus, edit, copy, share, mic, moon, etc. | `icons/sk-icons.tsx` plus feature use | Implemented |
| Status indicators | check, warn, info, syncing, offline, bell | `icons/sk-icons.tsx`, notification surfaces | Implemented |
| Financial/dashboard icons | trend, chart, donut, target, cash, wallet, percent | `icons/sk-icons.tsx` | Implemented |
| Weather marks | sun, partly cloud, cloud, rain, storm, fog, moon | `icons/sk-icons.tsx`, `SkWeatherChip` | Implemented |
| Item glyphs | lele, ayam, tahu, tempe, cabai | `glyphs/item-glyphs.tsx` | Implemented |
| Atmospheric motifs | DawnRibbon, SignatureSeal, stamps, ledger, weather, section labels | `illustrations/motifs.tsx` | Implemented |
| Weather scenes | cerah, berawan, hujan, petir, subuh, berkabut | `weather/scenes.tsx`; `CuacaCard` now uses `WeatherScene` | Implemented |
| Brand heroes | WelcomeHero, TickerBanner, ForecastIllust, SuccessIllust, MarketMascot, WordLogo | `illustrations/branding.tsx` | Implemented, underused |
| Empty states | no data, no history, offline, error, search, done | `illustrations/empty-states.tsx`; dashboard/riwayat now use `EmptyPanel` | Implemented |
| Buttons | primary, brand, secondary, ghost, sizes | `SkButton` | Implemented |
| Pills/badges | tones, dot variant | `SkPill` | Implemented |
| Inputs | input, textarea, select | `SkInput`, `SkTextarea`, `SkSelect` | Implemented |
| Cards | default, muted, ghost, signature grain | `SkCard` | Implemented |
| Navigation | top bar, bottom nav, task mode | `SkTopBar`, `SkBottomNav`, `AppLayout` | Implemented |
| Lists/data | item rows, chart rows, riwayat cards | Feature screens use UI kit surfaces, but still mix Tailwind layout classes | Partial |
| Charts | sparkline, bars, candles, delta, donut, progress, tally, heat strip | `charts/sk-charts.tsx`; Pola uses `BarSeries` | Implemented, underused |
| Notifications | Toast, Banner, InlineAlert, PushPreview, ActivityDot | `notifications/sk-notify.tsx` | Implemented, not integrated |
| Signature | SignatureSeal, stamped visual dialect | Motifs implemented | Implemented, underused |
| Belanja Card | Editorial, Warm, Compact, Pasar variants | Variants exist; live feature card is custom | Partial |

## Gaps Found

### 1. Live Belanja Card is not the signature UI kit variant

Evidence:
- `src/components/ui-kit/belanja-variants/*` contains the four reference
  variants.
- `src/components/features/belanja/BelanjaCard.tsx` still builds a bespoke
  card with item rows and Tailwind classes.

Risk:
- The most important product moment can drift away from the UI kit dialect.
- Glyphs, DawnRibbon, SignatureSeal, TallyStamp, and mono-number treatments are
  not consistently visible in production flow.

Implementation-ready direction:
- Add an adapter from `BelanjaCardData` to `BelanjaItem`.
- Extend `BelanjaCardEditorial` to accept `summary`, `confidenceLabel`,
  `onCopy`, and `copyLabel`.
- Replace feature `BelanjaCard` internals with the editorial variant first.
- Keep Compact/Warm/Pasar available behind a presentation prop or experiment
  flag later.

### 2. Notification surfaces exist but are not wired into app states

Evidence:
- `src/components/ui-kit/notifications/sk-notify.tsx` implements Toast, Banner,
  InlineAlert, PushPreview, and ActivityDot.
- Feature screens still use inline paragraphs for errors/offline/cached states.

Risk:
- Error and sync messaging can look inconsistent between dashboard, catat,
  riwayat, and promo flows.

Implementation-ready direction:
- Use `InlineAlert` for form validation and parse/save errors.
- Use `Banner` for offline queued drafts and cached recommendation refresh.
- Use `Toast` only for transient copy-to-clipboard success.

### 3. Brand hero assets are implemented but only lightly used

Evidence:
- `WelcomeHero`, `TickerBanner`, `ForecastIllust`, `SuccessIllust`,
  `MarketMascot`, and `WordLogo` are available.
- Login currently uses `WordLogo`; onboarding/dashboard do not yet use the
  larger hero vocabulary.

Risk:
- The brand system exists but does not yet shape first-run experience strongly.

Implementation-ready direction:
- Use `WelcomeHero` on login or first onboarding panel.
- Use `MarketMascot` as compact app identity in the top-level loading gate.
- Use `SuccessIllust` after onboarding completion or saved stock confirmation.

### 4. Data-viz breadth is implemented but not exercised

Evidence:
- Eight chart primitives exist.
- Only `BarSeries` is currently used in `PolaMingguanCard`.

Risk:
- Unused components can drift untested.

Implementation-ready direction:
- Add a small dashboard data strip using `DeltaWidget`, `HeatStrip`, and
  `ProgressMeter`.
- Add `/ui-kit` visual QA assertions for every chart component.

### 5. Product walkthrough reference is not mirrored as an app route

Evidence:
- `stockast-UI/index.html` is the product walkthrough in iOS/Android frames.
- The Next app has `/ui-kit`, but no equivalent walkthrough route.

Risk:
- Designers and implementers must compare the static reference and app screens
  manually.

Implementation-ready direction:
- Add a dev-only `/ui-kit/walkthrough` route that renders the same app states
  using production components and seed fixtures.
- Keep the static `stockast-UI/index.html` as source reference, not runtime app
  code.

## Changes Applied In This Audit

- Added `SkTextarea`, `SkSelect`, and `SkSkeleton` primitives.
- Exported the new primitives through `src/components/ui-kit/primitives`.
- Extended `SkCard` to accept normal div attributes such as `aria-busy`.
- Added UI kit CSS coverage for disabled/focus/invalid form states, select
  chevrons, textarea sizing, and skeleton shimmer.
- Migrated onboarding and stock input screens from legacy `Textarea`/`Select`
  to UI kit primitives.
- Migrated Belanja skeleton, promo cards, weather card, Subuh toggle, and voice
  input button away from legacy primitives.
- Migrated dashboard and riwayat empty/error states to UI kit `EmptyPanel`
  illustrations.

## Verification

Commands run:

- `rtk corepack pnpm typecheck`
- `rtk corepack pnpm lint`
- `rtk corepack pnpm test`
- `rtk corepack pnpm build`
- Playwright screenshots:
  - `output/playwright/ui-kit-dev-390.png`
  - `output/playwright/login-prod-390.png`
  - `output/playwright/onboarding-prod-390.png`
  - `output/playwright/catat-prod-390.png`
- Responsive audit script:
  - `scripts/ui-responsive-audit.fn.js`
  - routes: `/login`, `/onboarding`, `/dashboard`, `/catat`, `/riwayat`,
    `/ui-kit`
  - widths: 390px, 430px
  - state injection: `stockast.onboarding.v1` and `stockast.subuh.override`

Result:

- TypeScript passes after the UI kit migration.
- Lint passes with one pre-existing warning in `.remember/tmp/last-ndc.ts`.
- Vitest passes: 16 files, 109 tests.
- Production build passes.
- Production login/onboarding/catat screenshots render without visible UI kit
  regressions at 390px width.
- `/ui-kit` is production-hidden unless `FEATURE_UI_KIT_PREVIEW=true`; the UI
  kit screenshot was captured from the dev server.
- The final production responsive audit passes for all 12 route/width
  combinations with no horizontal document overflow and no escaped elements.
- Screenshots for the final pass are in `output/playwright/responsive/`.

Recommended next verification:

- Re-run `scripts/ui-responsive-audit.fn.js` whenever core UI kit layout,
  navigation, or dashboard surfaces change.
