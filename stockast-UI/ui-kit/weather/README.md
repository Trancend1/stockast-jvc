# weather/

Full atmospheric scene illustrations. Six panoramic SVG landscapes
used as full-bleed banners above the Belanja Card or dashboard hero.

## Exports — `window.SkWeather`

| Component         | Mood                                          |
| ----------------- | --------------------------------------------- |
| `SceneCerah`      | Clear sunny morning · warm orange + clouds    |
| `SceneBerawan`    | Cloud cover · muted cream                     |
| `SceneHujan`      | Rain · diagonal blue streaks + puddles        |
| `ScenePetir`      | Storm · dark sky + lightning bolt + heavy rain |
| `SceneSubuh`      | Deep-sea night · crescent moon + stars + one warm warung window |
| `SceneBerkabut`   | Fog · faded village + horizontal mist bands   |

Each component accepts `{ width, height }`. The shared `Scene` wrapper
uses `preserveAspectRatio="xMidYMid slice"` so the scene fills any
banner aspect cleanly.

### Helper

```js
const Cmp = SkWeather.WEATHER_SCENES["hujan"];
// Recognizes: cerah / sun / sunny · berawan / cloud / cloudy ·
//             hujan / rain / rainy · petir / storm / stormy ·
//             subuh / night · berkabut / fog / foggy
```

Plus `WeatherScene({ kind, width, height, style })` — convenience
wrapper that just renders the matching scene.

## Load

```html
<script type="text/babel" src="ui-kit/weather/weather.jsx"></script>
```

## Anchor

All scenes share the `VillageBand` — a single ink line + small rooftop
silhouettes — so the location reads consistently across weather. The
"warung-with-the-warm-window" appears on every daytime scene as a
center landmark and lights up gold in Subuh.
