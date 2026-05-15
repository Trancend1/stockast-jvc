# AI Slop Prevention — Stockast

**Version:** 1.0
**Purpose:** Internal guardrails to prevent the product from looking, feeling, or sounding generated.

---

## 1. What Is "AI Slop"?

**AI Slop** is the aesthetic and structural signature of products generated quickly with AI assistance, recognizable by:
- Generic visual defaults that look like every other generated app
- Surface-level features that don't connect to real user needs
- Over-engineered architecture for problems that don't exist yet
- Voice & tone that sounds like a translation of corporate marketing
- "Powered by AI ✨" branding that signals insecurity, not value
- Bloated feature sets that try to impress instead of focus

AI Slop is dangerous because it **passes a quick review but fails real use**. Judges, investors, and users can spot it within 5 seconds, even if they can't articulate why.

---

## 2. What Makes Products Feel AI-Generated

### Visual Tells
- Purple-to-pink-to-blue gradients
- `rounded-2xl shadow-2xl` on every card
- Inter font on everything
- Lucide icons used identically across all features
- Stock illustration sets (DrawKit, undraw.co) without modification
- Hero with rotating "wave" of icons
- Generic dashboard with 4 metric cards in 2x2 grid
- Three-column pricing table on landing
- "✨" emoji to signify AI features

### Copy Tells
- "Welcome to [product name]!"
- "Powered by AI"
- "Revolutionize your workflow"
- "Unlock the power of..."
- "Get started in seconds"
- "AI-powered insights"
- Excessive em-dashes mid-sentence
- Bullet-listed feature blurbs that all sound the same
- Translated formal language ("Silakan masukkan data") instead of conversational

### Structural Tells
- Settings page with 30 toggles
- Notification preferences before user has done anything
- Empty states with "No data yet. Start by..."
- 5-step onboarding that explains the obvious
- Feature flag UI exposed to end users
- Generic "Help" with FAQ that nobody reads

### Architectural Tells
- 50-file project structure on day 1
- Abstract factory patterns for things called once
- "Service" layer that wraps a single function call
- Premature Redux/Zustand for 3 pieces of state
- Microservices for a 100-user product
- Custom logger before standard logger fails
- Custom validation framework when Zod exists

---

## 3. Generic SaaS Mistakes (And Stockast Alternatives)

### ❌ Mistake: Dashboard as Home Page
4-card metrics grid: Revenue, Orders, Customers, Conversion.
**Stockast does:** Home = today's Belanja Card. Single focus.

### ❌ Mistake: "All my activity" Feed
Twitter-style feed of every action.
**Stockast does:** 7-day history as simple list, no algorithmic feed.

### ❌ Mistake: Premature Pricing Page
Three tiers, "most popular" badge.
**Stockast does:** No pricing page until WTP validated. Free for beta.

### ❌ Mistake: "Get Started" CTA Everywhere
Every screen has a Get Started button.
**Stockast does:** Action depends on context. Catat stok / Lihat besok / Buat promo.

### ❌ Mistake: Feature Bloat Hidden in Settings
Hide complexity in advanced settings.
**Stockast does:** If a feature isn't worth a screen, it isn't worth building.

### ❌ Mistake: AI as a Feature ("Try our AI assistant!")
**Stockast does:** AI is invisible plumbing. Users see: catatan → kartu belanja. They don't see "AI did this."

### ❌ Mistake: Generic Empty States
"No data available."
**Stockast does:** "Belum ada catatan stok minggu ini" + warm illustration + clear next action.

---

## 4. Weak UX Patterns to Avoid

### Multi-Step Wizards for Simple Tasks
- ❌ 5-step wizard untuk add menu item
- ✅ Single text area, AI parses

### Modal-on-Modal
- ❌ Edit dialog opens confirmation dialog opens error dialog
- ✅ Bottom sheet that updates inline

### Required Fields That Aren't
- ❌ "Email is required" untuk pedagang yang pakai WhatsApp
- ✅ Only ask what's truly needed; defer optional fields

### Tooltips for Critical Info
- ❌ Hover tooltip explaining important detail
- ✅ Inline copy that doesn't require interaction (touch can't hover)

### Confirmation Spam
- ❌ "Are you sure?" untuk semua action
- ✅ Undo toast untuk reversible actions; confirm only for destructive

### Vanity Animations
- ❌ Page transition slide every navigation
- ✅ Animation only at signature moments (Belanja Card reveal)

### Forced Account Creation Before Value
- ❌ Sign up first, then see product
- ✅ Sample data preloaded; sign up only when persisting real data needed

### Hidden Affordances
- ❌ Long-press to discover edit mode
- ✅ Visible affordances; long-press as enhancement, not primary

### Information Overload
- ❌ "Here's everything we know about your stock"
- ✅ One screen, one decision

### Notification Permission on First Load
- ❌ Browser pops "Allow notifications?" before user did anything
- ✅ Ask permission contextually, after user opted to receive reminder

---

## 5. Common Overengineering Mistakes

### Architecture
- Service layer wrapping a single Supabase query
- Custom event bus when React state suffices
- GraphQL when REST/Server Actions work
- Microservices for a monolith problem
- Custom database when Postgres works
- Custom CDN when Vercel covers it

### State Management
- Redux for form state
- Zustand for what TanStack Query handles
- Global atom store for theme toggle
- State machines (XState) for linear flows

### Build Tools
- Custom Webpack config when Next.js defaults work
- Monorepo with single app
- Custom CLI for project setup
- Custom code generation when generated types suffice

### Testing
- 100% coverage as a goal (instead of risk-based)
- Snapshot tests for everything
- E2E tests before unit tests
- Custom test framework when Vitest exists

### Backend
- Background queue for synchronous task
- Event sourcing for CRUD app
- Hexagonal architecture for 5-table product
- Domain-driven design ceremony for solo founder

### Deployment
- Kubernetes for low-traffic app
- Multi-region before single-region proven
- Blue-green deployments before stable monthly releases
- Auto-scaling rules without traffic to scale

**Anti-overengineering rule:** Build for current scale + 10x. Anything beyond that is procrastination disguised as engineering.

---

## 6. Design Decisions to Avoid

### Color
- ❌ More than 2 brand colors competing
- ❌ Default Tailwind blue-600 as primary
- ❌ Pure white background `#FFFFFF`
- ❌ Pure black text `#000000`
- ❌ "Glassmorphism" frosted glass effect
- ❌ Generic "AI gradient" purple-pink-blue

### Typography
- ❌ Inter as default (too generic)
- ❌ More than 2 font families
- ❌ All-caps for body text
- ❌ Centered body paragraphs > 1 line
- ❌ Italic for emphasis in body

### Layout
- ❌ Sidebar navigation in mobile-first product
- ❌ Hamburger menu when bottom nav fits
- ❌ Multi-column dashboard on mobile
- ❌ Floating action button (Material Design feel)

### Iconography
- ❌ Lucide icons identical to 1000 other apps
- ❌ Custom icon for every button
- ❌ Emoji in primary navigation
- ❌ Icons without labels (accessibility + clarity)

### Imagery
- ❌ Stock illustrations from popular libraries unmodified
- ❌ Smiling office-worker photos
- ❌ Abstract gradient backgrounds
- ❌ 3D rendered "AI" robots

### Motion
- ❌ Page transitions between every route
- ❌ Auto-playing background animations
- ❌ Scrolling parallax
- ❌ Confetti on save

### Voice
- ❌ Formal Indonesian ("Silakan", "Mohon")
- ❌ English UI strings ("Loading...", "Save")
- ❌ Marketing speak ("Revolutionary")
- ❌ Patronizing tone ("Smart choice!")

---

## 7. Bad Interaction Patterns

### Optimistic UI Without Confirmation
- ❌ Save instantly, no visual confirmation user can trust
- ✅ Save + visible state change (item appears as "saved")

### Blocking Modals for Non-Critical Choices
- ❌ "Did you mean to save this?" before every save
- ✅ Save + undo toast for 5 seconds

### Form Submission Without Validation Feedback
- ❌ Submit → error → no clue what's wrong
- ✅ Inline validation as user types or on blur

### Infinite Scroll with No End Indicator
- ❌ User doesn't know if they've seen everything
- ✅ "Itu semua minggu ini" footer or pagination

### Pull-to-Refresh Required for Updated Data
- ❌ User must know to pull down
- ✅ Auto-refresh on focus + manual pull as enhancement

### Loading States Without Reassurance
- ❌ Spinner spinning silently for 5 seconds
- ✅ Progress indicator + reassuring copy ("Sebentar, lagi baca catatan kamu...")

### Errors Without Recovery Path
- ❌ "Something went wrong. Please try again."
- ✅ "Wah, koneksi pelan. Catatan kamu aman, coba lagi yuk." [Retry button] [Edit] [Skip]

---

## 8. Technical Shortcuts That Create Future Debt

### Skipping Type Safety
- ❌ `any` types because TypeScript is "slowing me down"
- ✅ Use proper types; if forced to use `any`, comment why and TODO

### Stringly-Typed APIs
- ❌ `status: string` accepting any value
- ✅ `status: 'draft' | 'parsed' | 'confirmed'` enum

### Hardcoded Strings Throughout Code
- ❌ User-facing text scattered in components
- ✅ Centralize in `lib/copy/` files for easy edits and future i18n

### No Schema Validation on AI Output
- ❌ Trust Gemini's JSON, JSON.parse and use
- ✅ Zod validate. AI is untrusted input until validated.

### Magic Numbers
- ❌ `if (confidence > 0.7) ...` scattered
- ✅ Named constants in `lib/config/thresholds.ts`

### Direct DB Calls from Components
- ❌ Supabase client in component
- ✅ Server Actions or service layer; clear data flow

### Skipping Error Boundaries
- ❌ One unhandled error crashes entire app
- ✅ Error boundaries at route segment level

### Inline AI Prompts in Code
- ❌ `prompt = "Analyze this..."` inline string
- ✅ Versioned prompt files (`lib/ai/prompts/stockParse.v1.ts`)

### No Idempotency on Mutations
- ❌ Double-submit creates duplicate records
- ✅ Idempotency key on every mutation that retries

### Logging User PII
- ❌ `console.log(userPhone)` for debug
- ✅ Redact PII; use IDs in logs

### Skipping RLS, Relying on App Layer
- ❌ "Auth check in API handler is enough"
- ✅ Defense in depth: RLS + auth check + Zod validation

---

## 9. What Makes Products Feel Premium and Intentional

### Restraint
The product does **fewer things, better**. A premium product knows what it isn't.

### Distinctive Identity
You can recognize the product from a screenshot without seeing the logo. Color, typography, voice, layout all reinforce identity.

### Microinteractions That Reward
Subtle animations at moments that matter, signaling "this product knows what's important here."

### Consistent Voice
Every piece of copy sounds like it came from the same human. No "Welcome aboard! 🚀" next to "Action failed (Error code: 500)".

### Thoughtful Empty States
Empty state is a designed moment, not a placeholder.

### Real Performance
Sub-second response to interactions. Skeleton states match content. No "loading..." that lasts 3 seconds.

### Honest Communication
No fake "AI thinking" delays. No marketing language inside product. No fake social proof.

### Hand-Crafted Feel
Custom illustrations (even simple). Custom icons where standard icons would feel generic. Bespoke component design where library defaults would feel templated.

### Accessibility as Care
A product that works for everyone signals respect.

### Speed as Quality
A snappy product feels expensive, even if cheaper to build.

---

## 10. How to Create Memorable User Experience

### Find the One Moment
What's the single moment users will remember and tell friends about? Build the entire product to deliver that moment perfectly.

**For Stockast:** It's the Belanja Card. Everything serves that moment.

### Be Wrong Specifically, Not Right Generically
Pick a strong opinion about your audience and design for them specifically. Right for Bu Yati > generically usable.

### Surprise With Care, Not Tricks
Subuh Mode that auto-activates at 02.00 = care for user context.
Confetti on save = trick.

### Make the Default Path Beautiful
Don't hide the polished UX behind "Pro mode". Make the main flow the most polished flow.

### Voice With Personality
Indonesian conversational, not English formal. "Wah" instead of "Oops". "Yuk" instead of "Let's".

### Visual Detail Where It Matters
The Belanja Card deserves typography care. The settings page does not.

### Sound + Haptic + Visual at Key Moments
Subtle haptic on confirm save. Subtle sound on promo copy. Multi-sensory feedback at critical moments.

### Solve a Real Problem Memorably
"Tahu stok sebelum subuh" is memorable.
"AI-powered inventory management" is forgettable.

---

## 11. Product Differentiation Strategy

### Don't Compete on Features
There will always be a bigger app with more features. Compete on **specificity**.

### Compete on:
1. **Deep persona fit** — Bu Yati first, all others second
2. **Local cultural fluency** — Indonesian warung culture in the bones, not the surface
3. **Trust-building defaults** — confirmation, audit, conservative AI
4. **Distinctive aesthetic** — warm, local, not Silicon Valley
5. **One memorable signature** — Belanja Card

### Don't Compete on:
1. ❌ Feature count
2. ❌ AI sophistication
3. ❌ Number of integrations
4. ❌ Multi-language at launch
5. ❌ Cross-platform native apps

### Stockast's Defensible Moat
- **Distribution:** Network of pedagang in Salatiga first, then radial expansion
- **Brand:** Indonesian warung-feel that English-trained competitors can't fake
- **Data:** Real Indonesian stock patterns over time
- **Trust:** Conservative recommendations that don't hurt margin

A competitor with 10x funding can copy features but can't copy taste, trust, or community.

---

## 12. Anti-Slop Checklist (Per Sprint)

Before shipping a feature, ask:

- [ ] Would this make sense to Bu Yati without explanation?
- [ ] Does this look distinctly Stockast, or could it be any SaaS?
- [ ] Is the copy conversational Indonesian, not translated formal?
- [ ] Does the empty state have personality?
- [ ] Does the error state give a clear next action?
- [ ] Is the animation purposeful or decorative?
- [ ] Is the architecture sized for current need + 10x, not 1000x?
- [ ] If I removed this feature, would users notice?
- [ ] Is there a "premium" detail I can add that costs < 1 hour?
- [ ] Did I avoid every cliché in this document?

If you answer "no" to anything, address it before shipping.

---

## 13. The Slop Smell Test

Open the product fresh. Ask:

1. **"Does this feel like something a real team built, or generated?"**
2. **"Would Bu Yati feel respected using this, or talked down to?"**
3. **"If I removed the logo, could you tell this was Stockast?"**
4. **"Does anything here feel like default behavior I didn't intentionally choose?"**

If any answer is unsatisfying, the slop signal is there. Find it and fix it.

---

## 14. Worth Quoting

> "A product is not what you ship. It's what users remember the next morning."
>
> Stockast's job is to be the product that 50 pedagang remember the morning after using it, and 1 of them tells a friend at the pasar.

Build for that.
