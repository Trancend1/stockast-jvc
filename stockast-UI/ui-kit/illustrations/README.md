# illustrations/

The ink-stamp visual vocabulary that ties the whole app together:
per-item glyphs, atmospheric motifs, signature seals, and full
illustrated empty states.

## Files

### `glyphs.jsx` — `window.SkGlyphs`

| Item glyphs        | Atmospheric motifs                                |
| ------------------ | ------------------------------------------------- |
| `GlyphLele`        | `DawnRibbon` — sun + rooftop horizon banner       |
| `GlyphAyam`        | `SignatureSeal` — "Disusun Stockast" footer mark  |
| `GlyphTahu`        | `CapturedStamp` — "AI tangkap" parse-confirm mark |
| `GlyphTempe`       | `SavedSeal` — circular Tersimpan ✓ pill           |
| `GlyphCabai`       | `TallyStamp` — count tile for card hero           |
|                    | `CategoryBar` — soft section divider              |
| Helper             | `LedgerStripe` — open-book Riwayat header         |
| `glyphFor(name)`   | `WarungMark` — small warung facade illustration   |
| `categoryFor(name)`| `NotebookFold` — folded-corner Catat header       |
|                    | `MiniWeather` — ink sun/cloud/rain glyph          |
|                    | `SectionLabel` — serif italic group divider       |

All glyphs use `currentColor` for the body stroke — they quiet under
Subuh Mode while keeping a single brick or mint accent each.

### `empty-states.jsx` — `window.SkEmpty`

| Illustration       | Tone                                                |
| ------------------ | --------------------------------------------------- |
| `IllustNoData`     | Blank notebook + pen — "belum ada catatan"          |
| `IllustNoHistory`  | Hourglass + sun — "minggu pertama, sabar dulu"      |
| `IllustOffline`    | Unplugged cord + sparks — "internet putus"          |
| `IllustError`      | Tipped pot + ink spill — "ada yang ngambek"         |
| `IllustSearch`     | Magnifier over empty grid — "nggak ada yang cocok"  |
| `IllustDone`       | Stamped check seal — "udah beres semua"             |

Plus `EmptyPanel({ illust, title, body, cta })` — the standard wrapper
that lays out an illustration + serif italic title + body + one CTA.

## Load

```html
<script type="text/babel" src="ui-kit/illustrations/glyphs.jsx"></script>
<script type="text/babel" src="ui-kit/illustrations/empty-states.jsx"></script>
```

## Add a new illustration

Match the existing ink dialect:
- 1.5px stroke
- Cream fill where the form needs body (`#F4ECD9`)
- One brick (`#F26F1B`) or mint (`#4DA66E`) accent per piece
- Hand-stamp feel: slight tilts, dashed circles, dotted underlines
- Never gradient-heavy. Never 3D. Never isometric.
