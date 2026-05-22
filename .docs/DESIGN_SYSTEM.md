# Design System — Stockast

**Version:** 1.0
**Philosophy:** Warm, local, low-friction. Built for fingers wet with cooking oil and screens dim at 3 AM.

---

## 1. Design Principles

### Core Tenets
1. **One screen, one job.** No multi-step forms on one screen. No nested modals.
2. **Conversational, not corporate.** Sounds like a tetangga, not like enterprise SaaS.
3. **Mobile-only design.** Desktop is incidental. Design at 360px width first.
4. **Slow internet is the default.** Every screen must feel useful within 1 second.
5. **Warmth over efficiency.** A friendly product wins over a clinical one for this audience.
6. **Visible state, not hidden state.** User always knows what's happening (loading, syncing, saved).
7. **Forgiving by default.** Every destructive action has undo. Every error has a way forward.

### Anti-Tenets (what we explicitly reject)
- ❌ "Power user features" that clutter for new users
- ❌ Density-optimization (cramming many actions into a screen)
- ❌ Dashboard-as-default (we are not Linear, Notion, or Stripe)
- ❌ Generic Tailwind look (gray-50, blue-600, indigo gradients)
- ❌ Onboarding tutorials (good products don't need them)

---

## 2. Product Visual Direction

### Mood
**"Warung tetangga yang punya teknologi."**
Hangat, lokal, mudah didekati. Bukan Silicon Valley, bukan banking app, bukan generic startup. Punya **personality** dan **rasa Indonesia**.

### Visual References (not to copy, to absorb)
- **Color palette inspiration:** Tanihub, Sayurbox (warm earthy), Gojek (confident orange)
- **Typography vibe:** Modern Indonesian apps like Mekari, but warmer
- **Illustration:** Simple, hand-feel, like a friendly chalkboard menu — bukan polished 3D
- **Layout rhythm:** Generous whitespace; readable from arm's length

### Visual References (NOT to mimic)
- ❌ Linear / Notion / Vercel aesthetic (too tech-startup)
- ❌ iOS native default (terlalu sistem-feeling)
- ❌ Material Design 3 default (terlalu Google)
- ❌ Glassmorphism / neumorphism (slop-coded)

---

## 3. Typography System

### Font Stack
- **Primary (UI & body):** `Plus Jakarta Sans` — Indonesian-designed, neutral, friendly
- **Serif (editorial accent):** `Newsreader` — italic only, used in Belanja Card editorial header and signature moments
- **Display (Belanja Card, hero):** `Plus Jakarta Sans` (heavier weights 700-800)
- **Monospace (numbers, codes):** `JetBrains Mono` — only where numeric precision matters
- **Fallback stack:** `Plus Jakarta Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`

All three font families are loaded via `next/font/google` (self-hosted, no Google CDN request). CSS variables: `--font-sans`, `--font-serif`, `--font-mono`.

### Why Plus Jakarta Sans (not Inter, not Geist)
- Designed for Indonesian language pairing
- Has personality without sacrificing readability
- Inter terlalu generic-startup
- Geist terlalu tech-bro

### Type Scale (mobile-first, 16px base)
| Token | Size | Line height | Weight | Use case |
|---|---|---|---|---|
| `display-xl` | 36px | 40px | 800 | Belanja Card hero number |
| `display-lg` | 28px | 36px | 700 | Page hero |
| `heading-xl` | 22px | 30px | 700 | Section heading |
| `heading-lg` | 18px | 26px | 600 | Card title |
| `heading-md` | 16px | 24px | 600 | Subhead |
| `body-lg` | 17px | 26px | 400 | Primary body |
| `body` | 16px | 24px | 400 | Default body |
| `body-sm` | 14px | 20px | 400 | Secondary text |
| `caption` | 13px | 18px | 500 | Labels, captions |
| `mono-num` | 16px | 24px | 600 | Tabular numbers |

### Typography Rules
- **Minimum body size:** 16px (no smaller, prevents iOS zoom on focus)
- **Maximum line length:** 60 characters untuk body text
- **Line height:** 1.5x untuk body, 1.2x untuk display
- **Letter spacing:** Default; tighter only for display sizes (-0.02em)
- **No all-caps text** kecuali untuk single-word labels (max 8 chars)
- **No italic** untuk body text (Indonesian text doesn't traditionally use italics for emphasis)

---

## 4. Color System

### Brand Palette

**Primary — Warm Brick Orange**
Mengingatkan pada warna kayu manis, kulit ayam goreng, atau matahari subuh. Hangat, confident, bukan corporate.
- `brand-50:  #FFF5EE`
- `brand-100: #FFE6D2`
- `brand-200: #FFCCA0`
- `brand-300: #FFAE6B`
- `brand-400: #FF8E3C`
- `brand-500: #F26F1B`  ← primary
- `brand-600: #D85710`
- `brand-700: #B04308`
- `brand-800: #843107`
- `brand-900: #5C2208`

**Accent — Daun Mint**
Untuk success, growth, fresh. Tidak terlalu hijau-teknologi.
- `accent-500: #4DA66E`

**Neutral — Warm Cream**
Bukan pure gray. Lebih hangat, less clinical.
- `neutral-50:  #FBF8F4`  ← background default
- `neutral-100: #F5F0E8`
- `neutral-200: #E8DFD0`
- `neutral-300: #D3C5AE`
- `neutral-400: #A89880`
- `neutral-500: #7A6B55`
- `neutral-600: #564A38`
- `neutral-700: #3D3327`
- `neutral-800: #2B241B`
- `neutral-900: #1A1611`  ← text default

**Semantic**
- `success: #4DA66E`
- `warning: #E8A82E`
- `danger:  #D04A3E`
- `info:    #5A8FBF`

### Subuh Mode (Dark Variant)
Dipakai otomatis between 02.00-05.30, or manual toggle. **Bukan pure dark mode** — ini desain untuk mata adaptasi gelap.
- Background: `#242019` (serene warm charcoal, not black)
- Surface: `#2B261F`
- Surface soft: `#3A3228`
- Primary action: `#E99A5D` (soft dawn amber, not blue)
- Text primary: `#FFF8EB` (warm cream, not white)
- Text secondary: `#D4C6AC`
- Reduce blue light: filter to warmer tones
- **No harsh white anywhere**

### Usage Rules
- **Background:** always `neutral-50` or `neutral-100`, never pure `#fff`
- **Text:** always `neutral-900` or `neutral-700`, never pure `#000`
- **Primary action:** `brand-500`, never `blue-600`
- **Hover:** darken 1 step in scale, not opacity change
- **Disabled:** `neutral-300` on `neutral-100`, not "opacity 50%"
- **Contrast minimum:** 4.5:1 for body text, 3:1 for large text (test with axe DevTools)

### Color Anti-Patterns
- ❌ Gradients other than subtle Belanja Card hero
- ❌ Multiple primary colors competing
- ❌ Stripe blue, Linear purple, Vercel black-and-white minimalism
- ❌ Generic "AI gradient" (purple-pink-blue)

---

## 5. Layout / Grid System

### Mobile Grid
- **Container max-width:** 480px (capped for tablet/desktop reading)
- **Page padding:** 20px horizontal, 24px top/bottom
- **Card padding:** 20px
- **Vertical rhythm:** 8px base unit; all spacing multiple of 8

### Layout Templates
1. **Single-column scroll** (default) — most screens
2. **Hero + card stack** (Dashboard, Belanja Card)
3. **Fullscreen task** (Stock input, Onboarding) — minimal nav distraction
4. **Bottom-sheet overlay** (confirmation, edit) — modal alternative

### Z-index Layers
```
0:   base content
10:  sticky headers
20:  bottom navigation
30:  bottom sheets
40:  toasts
50:  modals (avoid)
```

### Safe Areas
- Respect iOS notch (top) dan home indicator (bottom)
- Bottom nav 64px height + safe area padding
- Top bar 56px height

---

## 6. Spacing System

### 8px Base
| Token | Value | Use |
|---|---|---|
| `space-1` | 4px | Tight inline gaps |
| `space-2` | 8px | Default tight |
| `space-3` | 12px | Tight stack |
| `space-4` | 16px | Default stack |
| `space-5` | 20px | Card padding |
| `space-6` | 24px | Section gap |
| `space-8` | 32px | Major section break |
| `space-10` | 40px | Hero spacing |
| `space-12` | 48px | Page-level gap |

### Spacing Rules
- **Group related items** with smaller gaps; separate groups with larger
- **Consistent vertical rhythm** within a page (don't mix arbitrary values)
- **No magic numbers** like 13px or 22px

---

## 7. Component Consistency

### Component Library Strategy
- **Base:** shadcn/ui primitives (Button, Input, Card, Dialog, Sheet)
- **Custom on top:** App-specific composite components (BelanjaCard, StockInputForm, PromoDraftCard)
- **No reinventing:** Use shadcn primitives, extend via composition

### Core Components

#### Button
- Variants: `primary` (brand-500), `secondary` (neutral-100 bg), `ghost` (text-only), `danger`
- Sizes: `lg` (56px h, primary actions), `md` (44px h, default), `sm` (36px h, inline)
- States: default, hover, active, disabled, loading
- **All buttons minimum 44px height** (touch target)
- Icon + label: 8px gap; icon-only: 44x44px minimum

#### Input
- Height: 48px default, 56px for primary stock input
- Border: 1.5px solid `neutral-200`, focus → `brand-500`
- No placeholder-as-label (always show label above)
- Error state: red border + helper text below

#### Card
- Background: `neutral-50` on page, white on `neutral-100` page
- Border: 1px solid `neutral-200` OR soft shadow `0 2px 8px rgba(0,0,0,0.04)`
- Radius: 16px (warm, friendly, not sharp)
- Padding: `space-5` (20px)

#### Bottom Sheet (preferred over Modal)
- Slide up from bottom
- Drag handle at top
- Dismiss on swipe down or backdrop tap
- Max height: 90vh
- Used for: confirmation, edit, picker

### Component Don'ts
- ❌ Floating action button (Material Design feel)
- ❌ Hamburger menu (use bottom nav)
- ❌ Card with shadow + border + bg color (pick one elevation method)
- ❌ Icon-only buttons without aria-label

---

## 8. Interaction Principles

### Touch Targets
- **Minimum 44x44px** untuk all interactive elements
- **48x48px preferred** untuk primary actions
- **8px minimum spacing** antara touch targets

### Feedback Timing
- **0-100ms:** instant feedback (button press visual)
- **100-300ms:** brief loading (no spinner, just state change)
- **300ms-1s:** skeleton state preferred over spinner
- **1s+:** explicit progress indicator + reassurance copy
- **3s+:** offer to background the task

### Microinteraction Rules
- **Purposeful, not decorative.** Each animation serves comprehension.
- **Spring physics > linear easing** untuk natural feel
- **150-300ms duration** untuk most transitions
- **Stagger reveals** untuk lists (40ms increments)
- **Subtle scale** (0.97 → 1.0) untuk button press, not opacity

### Gesture Patterns
- **Pull-to-refresh:** on Dashboard and History
- **Swipe-to-dismiss:** bottom sheets
- **Long-press for context:** edit/delete on list items
- **No swipe-to-delete** on first interaction (too easy to misfire)

---

## 9. Empty / Loading / Error States

### Empty States
Every empty state must have:
1. **Friendly illustration** (simple line art, brand color)
2. **One sentence** explaining the empty state
3. **One CTA** to populate

**Example (Riwayat empty):**
> 🌱
> Belum ada catatan stok minggu ini
> [Catat stok sekarang]

❌ Generic "No data available" forbidden.

### Loading States
- **First load:** Skeleton matching content layout (not spinners)
- **Refresh:** Subtle top progress bar
- **AI processing:** Custom illustration + reassuring copy ("Sedang baca catatan kamu...")
- **Background save:** Inline checkmark, no full-screen blocker

### Error States
Every error must have:
1. **Plain-language explanation** (no error codes visible)
2. **Suggested next action** (Retry, Edit, Skip)
3. **Saved state preserved** (no data loss on error)

**Example:**
> ❌
> Wah, koneksi internet lagi pelan. Catatan kamu udah tersimpan.
> [Coba kirim lagi]

❌ "Error 500: Internal Server Error" forbidden.

### Offline State
- Persistent banner at top: "Lagi offline. Catatan disimpan dulu di HP, nanti dikirim."
- Bottom nav badge on pending sync count
- No blocking modals

---

## 10. Accessibility Standards

### WCAG 2.1 AA Compliance (target)
- Contrast: 4.5:1 body text, 3:1 large text, 3:1 UI elements
- Touch targets: 44x44px minimum
- Focus indicators: visible 2px outline, brand color
- Semantic HTML: proper headings hierarchy, form labels
- Alt text on all meaningful images
- Keyboard navigable (defer Phase 2; mobile-first product but a11y helps everyone)

### Indonesian-Specific Considerations
- **Localized language:** Bahasa Indonesia natural, not formal/translated
- **Reading level:** SMP-SMA level vocabulary
- **No idiomatic English** that won't translate
- **Number formatting:** `Rp 25.000` (period thousands separator, Indonesian convention)
- **Date formatting:** `Senin, 15 Mei 2026` atau short `15 Mei`

### Low-End Device Considerations
- Test on Android 360px width
- Test on 2G/3G throttled connection
- Test with system font scale 200% (visual impairment)
- Bundle size budget: < 200KB initial JS

---

## 11. Mobile-First Guidance

### Viewport Targets
- **Primary:** 360px width (Android low-end)
- **Secondary:** 375px (iPhone SE)
- **Tertiary:** 414px (iPhone Pro)
- **Tablet/desktop:** capped at 480px content width (centered)

### Mobile Patterns
- **Bottom nav** untuk primary navigation (4-5 items max)
- **Sticky top bar** untuk context (warung name, date)
- **Pull-to-refresh** untuk lists
- **Bottom sheets** untuk overlays
- **Full-screen pages** untuk task-heavy flows (input, onboarding)

### Mobile Don'ts
- ❌ Hover-dependent interactions
- ❌ Tooltip-heavy UX (touch can't hover)
- ❌ Multi-column layouts < 768px
- ❌ Tiny tap targets in tables
- ❌ Right-click context menus

### Form Input Specifics
- `inputmode="numeric"` untuk number-only fields
- `inputmode="tel"` untuk phone
- `font-size: 16px` minimum to prevent iOS zoom
- Auto-capitalize off untuk usernames
- Auto-correct off untuk stock notes (may contain food slang)

---

## 12. Animation / Microinteraction Guidance

### Signature Moments (invest here)
1. **Belanja Card reveal:** Numbers count up from 0, items stagger in, weather icon morphs
2. **Stock parse success:** Subtle pulse on parsed items, confidence indicator fade-in
3. **Promo copy success:** Card lifts, checkmark, toast "Tersalin"
4. **Subuh Mode toggle:** Smooth color temperature shift across screen

### Animation Tokens
| Token | Duration | Easing | Use |
|---|---|---|---|
| `instant` | 0ms | — | Button state |
| `fast` | 150ms | ease-out | Hover, focus |
| `base` | 250ms | ease-in-out | Most transitions |
| `slow` | 400ms | spring(0.6, 0.8) | Reveals |
| `dramatic` | 600ms | spring(0.4, 0.7) | Signature moments |

### Animation Don'ts
- ❌ Page transitions between every route (feels gimmicky)
- ❌ Auto-playing animations (battery, distraction)
- ❌ Parallax scroll (overused, slop indicator)
- ❌ Confetti on save (childish, breaks trust)
- ❌ Bouncing logos (we are not children's app)
- ❌ Animated gradients on backgrounds (slop)

### Reduce Motion
- Respect `prefers-reduced-motion`
- Replace springs with fades
- Disable parallax/scale animations

---

## 13. Anti "Template-Looking SaaS" Recommendations

### Defaults That Scream AI Slop
Pattern → Why it's slop → What to do instead

- **Hero with gradient `from-purple-600 to-blue-600`** → SV B2B SaaS cliché → Solid `brand-500` block with hand-drawn illustration overlay
- **Grid of feature cards with same icon style** → Lorem-ipsum aesthetic → Asymmetric layout, real screenshots, real text
- **`shadow-2xl rounded-2xl` everywhere** → Default Tailwind look → Custom soft shadow `0 2px 8px rgba(0,0,0,0.04)` + 16px radius
- **"Powered by AI ✨" badges** → Insecure about being AI → Show AI as invisible utility, not feature
- **Stock photos of smiling office workers** → Universal corporate aesthetic → Real photos of warungs, real pedagang
- **Inter font everywhere** → Tech startup default → Plus Jakarta Sans for personality
- **All caps small label "FEATURES"** → SaaS landing page cliché → Sentence case, conversational
- **Three-column pricing table on landing** → Premature monetization signal → Single CTA, focus on demo

### Premium Product Signals
- Custom illustrations (even if simple)
- Distinctive primary color used confidently
- Generous whitespace
- Thoughtful empty states with personality
- Microinteractions that match the brand mood
- Real product screenshots (not mockups)
- Sound design (subtle haptic-equivalent feedback)
- Loading states that feel like the product, not generic spinners

---

## 14. Premium Product Feel Recommendations

### What Makes Something Feel Premium
1. **Confidence in restraint** — fewer features, more polish
2. **Custom touches that show care** — distinctive illustrations, hand-crafted copy
3. **Microinteractions that delight without distracting**
4. **Typography hierarchy that guides without shouting**
5. **Color used with intention** (1-2 brand colors, neutrals, semantic)
6. **Consistent voice and tone**
7. **Thoughtful negative space**
8. **Accessible by default** (signal of care)
9. **Fast** — perceived speed = perceived quality
10. **Honest** — no fake "AI sparkle" gimmicks

### Stockast-Specific Premium Touches
- **Belanja Card with subtle ink-on-paper texture** suggesting tulisan tangan
- **Numbers that count up** instead of just appearing
- **Subuh Mode** showing care for user's real context
- **Indonesian conversational copy** that feels like a friend writing
- **Save state visualization** showing the data flow (raw → parsed → confirmed)
- **Weather icon that subtly animates** when forecast affects recommendation
- **Skeleton loading that matches content shape** exactly, not generic shimmer

### Sample Voice & Tone Examples

**Onboarding welcome**
- ❌ "Welcome to Stockast! Get started by setting up your account."
- ✅ "Halo! Yuk, kita siapin warung kamu. Cuma 3 langkah."

**Stock confirmed**
- ❌ "Stock log successfully saved."
- ✅ "Catatan tersimpan. Belanja besok lagi diitung..."

**Recommendation card subtitle**
- ❌ "Based on AI analysis of your historical data and weather forecast."
- ✅ "Dari catatan 7 hari + ramalan cuaca BMKG"

**Error state**
- ❌ "An error occurred. Please try again."
- ✅ "Wah, ada yang nyangkut. Catatan kamu aman, coba kirim lagi yuk."

---

## 15. UI Kit Namespace (`src/components/ui-kit/`)

### Overview

The `ui-kit/` namespace is an **additive, parallel component library** that coexists with the prod `ui/` primitives. It provides the full visual system (design tokens, primitives, illustrations, charts, weather scenes, Belanja variants) as production-quality TypeScript components. Existing prod feature components (`BelanjaCard`, `OnboardingForm`, `CuacaCard`, etc.) are **not replaced** — migration is gradual, per sprint.

### Namespace map

| Sub-namespace | What lives here |
|---|---|
| `icons/` | 63 named `Icon*` exports (24×24 SVG, `currentColor`, 1.5px stroke) |
| `glyphs/` | `GlyphLele/Ayam/Tahu/Tempe/Cabai` + `glyphFor(name)` + `categoryFor(name)` helpers |
| `illustrations/motifs.tsx` | `DawnRibbon`, `SignatureSeal`, `TallyStamp`, `NotebookFold`, `CapturedStamp`, `SavedSeal`, `LedgerStripe`, `WarungMark`, `MiniWeather`, `SectionLabel`, `CategoryBar` |
| `illustrations/branding.tsx` | `WelcomeHero`, `TickerBanner`, `ForecastIllust`, `SuccessIllust`, `MarketMascot`, `WordLogo` |
| `illustrations/empty-states.tsx` | `IllustNoData`, `IllustNoHistory`, `IllustOffline`, `IllustError`, `IllustSearch`, `IllustDone`, `EmptyPanel` |
| `weather/` | `SceneCerah/Berawan/Hujan/Petir/Subuh/Berkabut`, `VillageBand`, `WeatherScene` dispatcher, `WEATHER_SCENES` map |
| `charts/` | `Sparkline`, `BarSeries`, `CandleSeries`, `DeltaWidget`, `DonutMini`, `ProgressMeter`, `TallyCounter`, `HeatStrip` |
| `primitives/` | `SkButton`, `SkCard`, `SkPill`, `SkInput`, `SkLabel`, `SkTopBar`, `SkBottomNav`, `SkSheet`, `SkThinking`, `SkCountUp`, `SkSteps`, `SkOverline`, `SkDivider`, `SkWeatherChip` |
| `notifications/` | `Toast`, `Banner`, `InlineAlert`, `PushPreview`, `ActivityDot` |
| `onboarding/` | `OnbDecorNama`, `OnbDecorLokasi`, `OnbDecorMenu` |
| `belanja-variants/` | `BelanjaCardEditorial`, `BelanjaCardWarm`, `BelanjaCardCompact`, `BelanjaCardPasar` |

### Token alias layer (`src/styles/ui-kit-tokens.css`)

UI Kit components use `--sk-*` CSS variables. These are **aliased to prod `--color-*` tokens** — single source of truth stays in `globals.css @theme`. Prod tokens change → UI Kit follows automatically.

```css
:root {
  --sk-bg: var(--color-neutral-50);
  --sk-surface: var(--color-neutral-0);
  --sk-brand: var(--color-brand-500);
  /* ... full alias map in src/styles/ui-kit-tokens.css */
}

html.subuh-mode {
  --sk-bg: #242019;  /* serene warm-charcoal Subuh palette, aligned with prod foundation */
  /* ... */
}
```

### Subuh bridge

Prod Subuh Mode uses `.subuh-mode` class on `<html>`. UI Kit source uses `[data-subuh="on"]` attribute. Bridge: `useSubuhMode` hook and the `subuh-mode.ts` bootstrap script set **both** the class and the `data-subuh` attribute in parallel. All ported CSS uses `.subuh-mode` selector (not the attribute) for alignment with prod.

### Server vs client components

- **Server components** (no `'use client'`): all pure-SVG exports — icons, glyphs, all illustrations, weather scenes. Zero JS added to bundle.
- **Client components** (`'use client'` required): primitives with hooks or event handlers — `SkButton`, `SkInput`, `SkTopBar`, `SkBottomNav`, `SkSheet`, `SkCountUp`, `Toast`, `Banner`, `InlineAlert`, `PushPreview`.

### Internal preview route

`/ui-kit` showcases all exports in a live grid. Gated: only accessible when `FEATURE_UI_KIT_PREVIEW=true` or in non-production. No nav link from `SkBottomNav` — URL-only.

---

## 16. Design QA Checklist

Before shipping any screen, check:

- [ ] Renders correctly at 360px width
- [ ] All touch targets ≥ 44x44px
- [ ] Body text ≥ 16px
- [ ] Contrast ratio ≥ 4.5:1 for body
- [ ] Empty state designed
- [ ] Loading state designed
- [ ] Error state designed
- [ ] Offline state considered
- [ ] Copy reviewed (Indonesian conversational, no English UI terms)
- [ ] Animations respect reduced-motion
- [ ] Tested in Subuh Mode (dark)
- [ ] Tested with system font scale 150%
- [ ] No generic Tailwind defaults visible
- [ ] One signature detail per major screen

---

## 16. What "Done" Looks Like for Design

A pedagang opening Stockast at 03.00, wet hands, dim light, slow internet, **says nothing**, taps once, gets her belanja card, screenshots it, pastes to supplier WhatsApp, and closes the app — **all in under 15 seconds, without thinking**.

That's the design north star.
