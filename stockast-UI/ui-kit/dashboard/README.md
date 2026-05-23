# dashboard/

The signature surface (Belanja Card) and the data-viz components that
power the dashboard.

## Files

### `belanja.jsx` — `window.BelanjaCard*`

The Belanja Card is Stockast's signature moment — Bu Yati opens this
once at 03:00 and decides her belanja from it.

| Variant                  | Direction                                                  |
| ------------------------ | ---------------------------------------------------------- |
| `BelanjaCardEditorial`   | Default · DawnRibbon hero + glyph rows + SignatureSeal     |
| `BelanjaCardWarm`        | Larger serif moment + dashed rules + italic margin quote   |
| `BelanjaCardCompact`     | Table-row density · for power users                        |
| `BelanjaCardPasar`       | Pushed identity · category groups + 44px glyphs + receipt feel |

Also exports `BELANJA_ITEMS` — the canonical demo dataset (Lele, Ayam,
Tahu, Tempe, Cabai rawit).

Every variant accepts `{ items, day, date, weather, subuh, animate }`.

### `charts.jsx` — `window.SkCharts`

| Component       | What it draws                                          |
| --------------- | ------------------------------------------------------ |
| `Sparkline`     | Smooth line + gradient area · trend: up/down/flat      |
| `BarSeries`     | Vertical bars (the dashboard's Pola Mingguan)          |
| `CandleSeries`  | Warung-dialect candlesticks: pagi/puncak/lengang/sore  |
| `DeltaWidget`   | "Ticker tile" — big number + arrow + inline sparkline  |
| `DonutMini`     | Small category donut with optional legend              |
| `ProgressMeter` | Horizontal goal bar · tones: brand/success/warn/danger |
| `TallyCounter`  | Large mono number + label + delta line                 |
| `HeatStrip`     | 28-cell "is it busy?" intensity strip                  |

All chart components render pure SVG, use `currentColor` plus the
brand + semantic tokens, and adapt to Subuh Mode automatically.

## Load order

```html
<script type="text/babel" src="ui-kit/dashboard/charts.jsx"></script>
<script type="text/babel" src="ui-kit/dashboard/belanja.jsx"></script>
```

`belanja.jsx` depends on `SkIcons`, `SkGlyphs`, and `Sk*` UI primitives
being loaded.

## Why the warung-candlestick dialect?

Each candle represents one day in warung-shorthand:

- **open** = pagi (morning start)
- **high** = puncak (peak hour)
- **low**  = lengang (slow point)
- **close**= sore (closing tally)

This translates stock-market literacy into something Bu Yati already
knows from running the warung.
