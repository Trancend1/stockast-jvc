# Stockast UI Kit

A comprehensive, scalable-SVG design system for the Stockast warung
intelligence app. Single ink-stamp dialect end-to-end — quiet warmth
with Linear-precise discipline. Cream by day, deep sea by Subuh.

> Stockast = **stock** (inventory) + fore**cast**. A 3am tool for warung
> pedagang. Looks like Linear. Feels like a notebook on the counter.

---

## Quick start

Two entry points at the project root:

| File              | What it is                                                       |
| ----------------- | ---------------------------------------------------------------- |
| `index.html`      | The product walkthrough — every screen in iOS + Android frames.  |
| `ui-kit.html`     | Comprehensive design-system reference — all assets in one page.  |

Open either in a browser — no build step. Babel transpiles inline.

---

## Folder architecture

```
ui-kit/
├── tokens/              CSS variables — color, type, spacing, radii, shadow, motion
├── branding/            Brand heroes, wordmark, ticker, mascot
├── icons/               80+ stroke-icons (nav, action, status, finance, weather)
├── illustrations/       Item glyphs, atmospheric motifs, empty-state illustrations
├── weather/             Six full atmospheric scenes (sunny → stormy → subuh)
├── onboarding/          Ink-stamp decorations for the setup flow
├── components/          UI primitives + tweaks panel + notifications
├── dashboard/           Belanja Card variants + chart components
└── frames/              Device shells (iOS, Android) + design canvas
```

Each folder has its own `README.md` listing the exports and how they're
used. Cross-references are by `window.Sk*` namespace, not ES imports —
the codebase loads everything via `<script type="text/babel">` tags.

---

## At the root (entry-point glue)

| File                                | Role                                             |
| ----------------------------------- | ------------------------------------------------ |
| `index.html` / `app.jsx` / `screens.jsx` | Walkthrough composition.                    |
| `ui-kit.html` / `ui-kit.jsx`        | UI Kit reference composition.                    |
| `.design-canvas.state.json`         | Persisted DesignCanvas state (section titles).   |

---

## Design principles

1. **Quiet warmth** — Linear discipline + warung ink-stamps. Never SaaS-generated.
2. **AI as plumbing** — Thinking dots, never sparkles. Show confidence, not magic.
3. **Bu Yati first** — Indonesian conversational voice. 3am open. Big tap targets.
4. **One ink, one hand** — All marks share a 1.5px stroke. Brick + mint accents only where earned.
5. **Type carries meaning** — Serif italic = warmth/dates. Mono = numbers. Sans = everything else.
6. **Real data, real food** — Stock-market shorthand integrated with food forms.

---

## Adapting to Subuh Mode

Every asset that uses `currentColor` for its body stroke quiets
automatically in Subuh Mode. The few hardcoded brick/mint accents stay
warm — they're identity moments, not surface chrome.

Toggle Subuh on either page by setting `<html data-subuh="on">`. The
walkthrough exposes this via the Tweaks panel.

---

## Built for

Pedagang Indonesia · 2026
