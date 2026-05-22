# tokens/

Single source of truth for visual tokens. CSS custom properties only.

## Exports

`tokens.css` — defines:

| Group         | Variables                                                          |
| ------------- | ------------------------------------------------------------------ |
| Surfaces      | `--sk-bg`, `--sk-surface`, `--sk-surface-2`, `--sk-surface-3`      |
| Ink           | `--sk-text`, `--sk-text-2`, `--sk-text-3`, `--sk-text-disabled`    |
| Lines         | `--sk-line`, `--sk-line-strong`, `--sk-line-active`                |
| Brand         | `--sk-brand`, `--sk-brand-press`, `--sk-brand-soft`, `--sk-brand-ink` |
| Semantic      | `--sk-success`, `--sk-warn`, `--sk-danger` (+ `-soft` variants)    |
| Radii         | `--sk-r-card`, `--sk-r-btn`, `--sk-r-input`, `--sk-r-chip`, `--sk-r-pill` |
| Shadows       | `--sk-shadow-sm`, `--sk-shadow-card`, `--sk-shadow-lift`           |
| Type families | `--sk-font`, `--sk-font-serif`, `--sk-font-mono`                   |
| Motion        | `--sk-ease`, `--sk-ease-spring`                                    |
| Paper         | `--sk-grain` (0–0.12)                                              |

Also ships:
- **Subuh Mode override** — `[data-subuh="on"]` block remaps every
  variable to the deep-sea palette plus glass-blur surfaces.
- **Reset + base utility classes** — `.sk-screen`, `.sk-grain`,
  `.sk-btn`, `.sk-input`, `.sk-card`, `.sk-pill`, `.sk-topbar`,
  `.sk-nav`, `.sk-display`, `.sk-mono`, `.sk-overline`, `.sk-caption`,
  `.sk-eyebrow`, `.sk-item`, animation keyframes (`sk-rise`, `sk-fade`,
  `sk-pulse`).

## Consume

```html
<link rel="stylesheet" href="ui-kit/tokens/tokens.css" />
```

Always loaded before any `<script type="text/babel">`.
