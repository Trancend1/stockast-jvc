# components/

UI primitives, notification surfaces, and the Tweaks-panel host.

## Files

### `ui.jsx` — `window.Sk*`

The base component vocabulary. Maps 1:1 to shadcn primitives in
production.

| Export        | shadcn equivalent | Notes                                  |
| ------------- | ----------------- | -------------------------------------- |
| `SkButton`    | `<Button>`        | variants: primary, brand, secondary, ghost · sizes: lg, md, sm |
| `SkCard`      | `<Card>`          | tones: default, muted, ghost · `signature` adds paper grain    |
| `SkPill`      | `<Badge>`         | tones: success, warn, danger, brand · `dot` variant            |
| `SkInput`     | `<Input>`         | 48px height, focus ring matches ink    |
| `SkLabel`     | `<Label>`         | with optional hint                     |
| `SkTopBar`    | sticky header     | modes: default (warung+date) / task (back+title) |
| `SkBottomNav` | nav bar           | 4 items: home/catat/riwayat/setelan    |
| `SkSheet`     | `<Sheet>`         | bottom-up, dismissible, scrim          |
| `SkApp`       | layout shell      | top + content + bottom scaffold        |
| `SkSteps`     | step indicator    | dot row with growing pill on current   |
| `SkEmpty`     | calm empty state  | no clip art — used inline              |
| `SkThinking`  | "thinking" dots   | 3-dot pulse, our single AI motion mark |
| `SkCountUp`   | animated number   | ease-out cubic                         |
| `SkWeatherChip` | weather pill    | small icon + time + label              |
| `SkOverline`, `SkDivider` | typography helpers |                            |

### `notifications.jsx` — `window.SkNotify`

| Component       | Use                                            |
| --------------- | ---------------------------------------------- |
| `Toast`         | Transient floating message · kinds: info, success, warn, danger, brand |
| `Banner`        | Persistent inline notice with action            |
| `InlineAlert`   | In-card alert, dashed border tone-tinted        |
| `PushPreview`   | Lock-screen-style mockup with backdrop blur     |
| `ActivityDot`   | Numeric badge for icon buttons                  |

### `tweaks-panel.jsx`

Host UI for the editor's Tweaks toggle. Provides:
`TweaksPanel`, `useTweaks`, `TweakSection`, `TweakSlider`,
`TweakToggle`, `TweakRadio`, `TweakSelect`, `TweakText`,
`TweakNumber`, `TweakColor`, `TweakButton`.

## Load

```html
<script type="text/babel" src="ui-kit/components/ui.jsx"></script>
<script type="text/babel" src="ui-kit/components/notifications.jsx"></script>
<script type="text/babel" src="ui-kit/components/tweaks-panel.jsx"></script>
```

`ui.jsx` depends on `icons.jsx` being loaded first.
