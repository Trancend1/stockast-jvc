# onboarding/

Ink-stamp decorations for the three-step warung setup flow.

## Exports — `window.OnbDecor`

| Decor       | Used on step  | Content                                        |
| ----------- | ------------- | ---------------------------------------------- |
| `nama`      | 01 · Nama     | Hanging nameplate + steam curls + brick tag    |
| `lokasi`    | 02 · Lokasi   | Soft sun + horizon + rooftop village + map pin |
| `menu`      | 03 · Menu     | Plate top-down with lele/tahu/gorengan shapes  |

Each is ~220×110 SVG, designed to sit as a small mark above the step
heading.

## Always-warm

Unlike everything else in the kit, these decorations **do not respond
to Subuh Mode**. They're identity moments tied to the user introducing
their warung — they always render in the day palette
(ink + brick + mint + cream).

## Load

```html
<script type="text/babel" src="ui-kit/onboarding/onboarding.jsx"></script>
```

## Add a new step

If you add a fourth onboarding step (e.g. "Jam buka"), create the decor
in the same dialect:
- 2px stroke, rounded caps
- Slight hand-tilt for warmth
- One brick accent + one mint dot for life
- Abstract / iconographic — never a literal scene
- ~220×110 viewBox
