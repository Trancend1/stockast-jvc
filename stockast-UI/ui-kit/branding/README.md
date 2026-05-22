# branding/

Brand-level illustrations: heroes, wordmarks, mascots, ticker tape.
All SVG, all scalable.

## Exports — `window.SkWelcomes`

| Component         | Use                                                          |
| ----------------- | ------------------------------------------------------------ |
| `WelcomeHero`     | Landing splash. Warung awning + candlesticks + ticker tape + Bu Yati silhouette + sparkline growing out of a food tray. |
| `TickerBanner`    | Running stock-style strip with item codes + deltas. Decorative. |
| `ForecastIllust`  | Empty-state hero: candles rising into a dotted "future" + magnifying glass. |
| `SuccessIllust`   | Stamped seal with check + confetti. Use on milestone moments. |
| `MarketMascot`    | Compact 80×80 logo companion: a tray with a sparkline rising. |
| `WordLogo`        | "stockast" wordmark with a sparkline crossing the dot of the `k`. Pass `dark` for dark backgrounds. |

## Load

```html
<script type="text/babel" src="ui-kit/branding/welcomes.jsx"></script>
```

Stockast = "stock" (inventory) + "fore**cast**". These illustrations
marry warung ink-stamps with stock-market shorthand. Don't mix in
generic Silicon Valley illustration tropes (3D blobs, isometric people,
abstract gradients) — it breaks the dialect.
