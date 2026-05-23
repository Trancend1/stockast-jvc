# icons/

The full Stockast icon set. Single-stroke style — 1.5px, rounded caps,
24×24 viewBox, `currentColor` fill. Always paired with a label.

## Export — `window.SkIcons`

All icons accept `{ size, stroke }`. Sized via `size`, defaults to 18px.

### Navigation set
`home` · `note` · `history` · `settings` · `shop` · `calendar` ·
`clock` · `hamburger` · `dots` · `search` · `filter` · `sort`

### Action set
`arrowR` · `arrowL` · `chevronR` · `chevronD` · `plus` · `close` ·
`check` · `edit` · `trash` · `copy` · `share` · `link` · `download` ·
`refresh` · `undo` · `eye` · `eyeOff` · `lock` · `unlock` · `pin` ·
`star` · `heart` · `mic` · `moon`

### Status indicators
`checkCircle` · `closeCircle` · `warnTriangle` · `info` · `spark` ·
`syncing` · `offline` · `bell` · `bellOff`

### Financial / dashboard
`trendUp` · `trendDown` · `trendFlat` · `chartLine` · `chartBar` ·
`chartCandle` · `donut` · `target` · `cash` · `wallet` · `percent` ·
`receipt` · `ticker` · `bag` · `package` · `whatsapp`

### Weather marks (compact)
`sun` · `partlyCloud` · `cloud` · `rain` · `storm` · `fog` · `moon` ·
`star_small`

> Full atmospheric scenes live in `ui-kit/weather/` — these are the
> inline marks, scenes are the full-bleed banners.

## Load

```html
<script type="text/babel" src="ui-kit/icons/icons.jsx"></script>
```

## Add a new icon

1. Open `icons.jsx`.
2. Add an entry to the `SkIcons` object following the existing pattern.
3. Use a 24×24 viewBox, 1.5px stroke equivalents.
4. No fills unless the design genuinely calls for one (`whatsapp`,
   `dots`, etc.). Prefer outline + currentColor.
