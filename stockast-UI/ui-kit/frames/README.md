# frames/

Device shells + design-canvas scaffolding. Composition only — these
contain no Stockast-specific design; they're the stage.

## Files

| File                | Provides                                           |
| ------------------- | -------------------------------------------------- |
| `ios-frame.jsx`     | `<IOSDevice>` — iPhone bezel + status bar + Dynamic Island |
| `android-frame.jsx` | `<AndroidDevice>` — Android bezel + system bars     |
| `design-canvas.jsx` | `<DesignCanvas>`, `<DCSection>`, `<DCArtboard>` — the pan/zoom grid that holds every screen, with focus-mode + drag-reorder |

## Load order

```html
<script type="text/babel" src="ui-kit/frames/design-canvas.jsx"></script>
<script type="text/babel" src="ui-kit/frames/ios-frame.jsx"></script>
<script type="text/babel" src="ui-kit/frames/android-frame.jsx"></script>
```

These are loaded by the walkthrough (`index.html`) only. The UI Kit
page (`ui-kit.html`) doesn't render device frames — it shows components
directly.

## Why frames here?

They're shipped components of the kit, not app code. Anyone consuming
the UI Kit downstream gets the device bezels for free.
