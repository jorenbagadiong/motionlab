# Using MotionLab's components

A guide to the building blocks in this codebase: how to show an animation, edit it, generate code
for it, and extend the catalog. Paths use the `@/` alias for `src/`.

- [Show an animation: `PreviewStage`](#show-an-animation-previewstage)
- [Work with configs](#work-with-configs)
- [Edit a config: `useConfigEditor` and `ConfigControls`](#edit-a-config-useconfigeditor-and-configcontrols)
- [Generate code: `generateCode` and `CodePanel`](#generate-code-generatecode-and-codepanel)
- [Run an adapter directly: `useAnimationRun`](#run-an-adapter-directly-useanimationrun)
- [Add a preset](#add-a-preset)
- [Add an animation family](#add-an-animation-family)
- [UI primitives](#ui-primitives)

## Show an animation: `PreviewStage`

`PreviewStage` renders any animation config with playback controls. It picks the right renderer for
the config's family, code-splits the engine, handles replay and pause, and respects
reduced-motion preferences. It's a client component; Server Components can render it directly.

```tsx
import { PreviewStage } from "@/features/animations/preview/preview-stage"
import { getBuiltInPreset } from "@/features/presets/catalog"

export function FadeUpDemo() {
  const preset = getBuiltInPreset("fade-up")
  if (!preset) return null
  return <PreviewStage config={preset.config} label={preset.name} />
}
```

| Prop        | Type                 | Default   | Description                                                                                         |
| ----------- | -------------------- | --------- | --------------------------------------------------------------------------------------------------- |
| `config`    | `AnimationConfig`    | required  | What to play. Changing it restarts the animation and clears Pause.                                  |
| `label`     | `string`             | required  | Accessible name used in control labels, e.g. "Replay Fade Up preview".                              |
| `trigger`   | `"mount" \| "hover"` | `"mount"` | `mount` plays when shown. `hover` rests until a mouse hovers or Replay is pressed (used for cards). |
| `variant`   | `"stage" \| "card"`  | `"stage"` | `stage` shows Replay and Pause below; `card` shows a compact replay button over the preview.        |
| `compact`   | `boolean`            | `false`   | Shorter stage on small screens, for layouts where the preview is pinned above other content.        |
| `className` | `string`             | none      | Classes for the outer wrapper.                                                                      |

Behavior to know:

- **Reduced motion:** when the user prefers reduced motion, nothing autoplays; the animation runs
  only when they press Play.
- **Gesture families** (`hover-lift`) have no timeline, so no Replay or Pause; a hint tells the user
  to hover, focus or press the element.
- **Looping cards** (`trigger="hover"`) stop when the pointer leaves, so a grid of cards doesn't run
  many animations at once.

## Work with configs

An `AnimationConfig` is plain, typed data, never code. Each one names its `family` (which also fixes
its `engine`) plus that family's properties. Durations and delays are always milliseconds.

```ts
import { defaultConfig, parseConfig, type ConfigFor } from "@/features/animations/model"

// Defaults for a family, fully typed:
const spring: ConfigFor<"spring-pop"> = defaultConfig("spring-pop")
const bouncy = { ...spring, damping: 8 }

// Validate untrusted input (saved data, URLs, forms). Missing properties fall back to defaults;
// unknown properties, out-of-range values and invalid options are rejected.
const result = parseConfig({ family: "fade-slide", duration: 900 })
if (!result.success) {
  console.error(result.error) // e.g. "duration: Too big: expected number to be <=3000"
} else if (result.config.family === "fade-slide") {
  // `config` is a union of every family; check `family` to access its properties.
  console.log(result.config.duration) // 900
}
```

Other helpers in `@/features/animations/model`:

| Helper                             | Returns                                                 |
| ---------------------------------- | ------------------------------------------------------- |
| `familyFields(family)`             | The field specs (label, range, step, default, options). |
| `isLooping(config)`                | Whether the animation repeats forever.                  |
| `supportsPlaybackControls(config)` | `false` for gesture families.                           |
| `formatFieldValue(field, value)`   | Display text such as `"600 ms"` or `"Ease out"`.        |
| `formatFieldRange(field)`          | Display text such as `"100 ms – 3000 ms"`.              |

## Edit a config: `useConfigEditor` and `ConfigControls`

`useConfigEditor` holds an editable copy of a config. Every update is validated, so the config it
returns is always valid, and `family`/`engine` can never be changed. `ConfigControls` renders one
control per supported property: a slider plus number input for numbers, a select for options.

```tsx
"use client"

import { Button } from "@/components/ui/button"
import { defaultConfig } from "@/features/animations/model"
import { PreviewStage } from "@/features/animations/preview/preview-stage"
import { ConfigControls } from "@/features/editor/components/config-controls"
import { useConfigEditor } from "@/features/editor/use-config-editor"

export function SpringEditor() {
  const { config, setField, reset, changed } = useConfigEditor(defaultConfig("spring-pop"))
  return (
    <div>
      <PreviewStage config={config} label="Spring Pop" />
      <ConfigControls config={config} changed={changed} onChange={setField} />
      <Button onClick={reset} disabled={changed.length === 0}>
        Reset
      </Button>
    </div>
  )
}
```

`changed` lists the property keys that differ from the initial config; `ConfigControls` uses it to
mark modified fields. The playground also wraps the preview's config in `useDebouncedValue(config,
200)` so dragging a slider doesn't restart the animation on every tick.

## Generate code: `generateCode` and `CodePanel`

`generateCode(config, name)` returns copy-ready code for a config. It reuses the adapter functions
the preview runs, so the code always matches the preview. Motion presets produce a React
component (`.tsx`); Anime.js presets produce a function that takes a root element (`.js`).

```ts
import { defaultConfig } from "@/features/animations/model"
import { generateCode } from "@/features/code-generator/generate"

const out = generateCode(defaultConfig("fade-slide"), "Fade Up")
out.install // "npm install motion@13"
out.filename // "fade-up.tsx"
out.code // export function FadeUp({ children }) { … }
out.usage // <FadeUp><Card /></FadeUp>
out.notes // tips, e.g. about reduced motion
```

`CodePanel` shows that output as the "How to use" steps, with syntax highlighting and Copy buttons.
Pass `editable` where the config can change, so the intro text says the code updates live.

```tsx
import { defaultConfig } from "@/features/animations/model"
import { CodePanel } from "@/features/code-generator/components/code-panel"

export function FadeUpDocs() {
  return <CodePanel config={defaultConfig("fade-slide")} name="Fade Up" />
}
```

Copy uses the Clipboard API, and falls back to a legacy copy on plain HTTP (for example a dev
server opened via a LAN address), where the Clipboard API isn't available.

`tests/unit/code-generator/compile.test.ts` type-checks generated code for every preset and every
option against the installed `motion` and `animejs` types, so an invalid snippet fails the tests.

## Run an adapter directly: `useAnimationRun`

Adapters are plain functions that take a DOM root and a config and return
`PlaybackControls` (`play`, `pause`, `dispose`). They are the only code that calls Motion or
Anime.js. `useAnimationRun` binds one to an element and always disposes it on unmount or when the
config changes.

```tsx
"use client"

import { startTextReveal } from "@/features/animations/adapters/anime"
import { useAnimationRun } from "@/features/animations/hooks/use-animation-run"
import { defaultConfig } from "@/features/animations/model"

const config = defaultConfig("text-reveal")

export function Headline() {
  const ref = useAnimationRun<HTMLHeadingElement, typeof config>(startTextReveal, config, {
    autoplay: true,
    paused: false,
  })
  return (
    <h1 ref={ref}>
      {Array.from("Hello").map((char, i) => (
        <span key={i} data-anim-char style={{ display: "inline-block" }}>
          {char}
        </span>
      ))}
    </h1>
  )
}
```

Each adapter looks for `data-anim-*` attributes inside the root (`data-anim-target`,
`data-anim-item`, `data-anim-char`, `data-anim-path`, `data-anim-page`); see the matching renderer
in `src/features/animations/preview/renderers/` for the markup each one expects. Pass a stable
`config` (module-level, state, or memoized), because a new object restarts the animation.

## Add a preset

A preset is data, so adding one is a single entry in `BUILT_IN_PRESETS`
(`src/features/presets/catalog.ts`), built with the file's `preset()` helper. Overrides are
type-checked against the family:

```ts
preset(
  "fade-slide",
  {
    slug: "drop-in",
    name: "Drop In",
    description: "Content falls gently into place from above.",
    category: "fade-slide",
    tags: ["entrance", "vertical"],
  },
  { direction: "down", distance: 40, ease: "backOut" },
),
```

It then appears in the gallery, gets `/presets/drop-in` and `/playground/drop-in` pages, and gets
generated code. `tests/unit/presets/catalog.test.ts` validates the config and checks that the
slug is unique and URL-safe.

## Add an animation family

A family is a new kind of animation with its own properties. TypeScript points out each missing
piece:

1. **Define it** in `src/features/animations/model/families.ts` with `defineFamily({ id, engine,
label, playback, fields })`, reusing field factories from `common-fields.ts` where possible.
   Add it to `FAMILIES` and to `AnimationConfigSchema`.
2. **Adapter:** in `src/features/animations/adapters/motion.ts` or `anime.ts`, add exported
   builders for its keyframes/parameters and a `start<Family>(root, config)` function returning
   `PlaybackControls`. Keep all engine calls here.
3. **Renderer:** add `src/features/animations/preview/renderers/<family>.tsx` (resting markup
   showing the final frame, plus `useAnimationRun`), then register it in `preview/registry.tsx`.
   The registry type requires an entry for every family.
4. **Code generator:** add a generator in `src/features/code-generator/motion.ts` or `anime.ts`
   that uses the same builders, and a `case` in `generate.ts`. The switch must handle every family
   to compile.
5. **Preset:** add at least one preset to the catalog. The catalog test requires every family to
   have one.
6. **Tests:** the existing suites then cover the family automatically: config validation, generated
   code compiling for every option, and a browser test that the preset animates without errors.
   Add adapter tests for any non-trivial mapping.

## UI primitives

Shared components in `src/components/ui/` keep pages consistent. See them live, with copyable
code, at `/components`.

| Component                                                                          | Use                                                                                                                                                                                                |
| ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Button`, `ButtonLink`                                                             | `variant`: `primary`, `secondary`, `outline`, `ghost`, `danger`; `size`: `sm`, `md`, `lg`, `icon-sm`, `icon`; `loading` shows a spinner and disables the button                                    |
| `Badge`                                                                            | `tone`: `neutral`, `accent`, `success`, `warning`, `danger`, `motion`, `anime`                                                                                                                     |
| `Alert`                                                                            | `tone`: `info`, `success`, `warning`, `danger`; `title`, body as children, optional `onDismiss`. No live region by default: pass `role="alert"` or `role="status"` when it appears after an action |
| `Card` + `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` | Grouped content on a raised surface; `CardTitle` takes `as` for the heading level                                                                                                                  |
| `Label`, `TextInput`, `Textarea`, `SelectInput`                                    | Native form fields with consistent focus and hover states                                                                                                                                          |
| `Checkbox`, `Switch`                                                               | Native checkboxes with `label` and optional `description`; `Switch` has `role="switch"`                                                                                                            |
| `Tabs`                                                                             | `items: { id, label, content }[]` and an accessible `label`; uncontrolled (`defaultValue`) or controlled (`value` + `onValueChange`)                                                               |
| `Dialog`                                                                           | Modal on native `<dialog>`: `open`, `onOpenChange`, `title`, `description`, `footer`                                                                                                               |
| `Progress`                                                                         | `value` 0–100 (omit for indeterminate) and a required `label`                                                                                                                                      |
| `Spinner`                                                                          | Loading status with a screen-reader `label`                                                                                                                                                        |
| `Skeleton`                                                                         | Placeholder shape; hidden from screen readers                                                                                                                                                      |
| `Kbd`, `Separator`                                                                 | Keyboard key; divider (`orientation`, `decorative`)                                                                                                                                                |
| `Container`                                                                        | Page-width wrapper with responsive side padding                                                                                                                                                    |
| `ThemeToggle` (`@/features/theme/theme-toggle`)                                    | System / Light / Dark switch; already in the site header                                                                                                                                           |
| `AccentPicker` (`@/features/theme/accent-picker`)                                  | Color theme (accent) picker; already in the site header                                                                                                                                            |

### Adding a component to the library

1. Build it in `src/components/ui/` using the theme tokens (`bg-surface`, `text-fg`, `accent`…).
2. Describe it in `src/features/component-library/registry.ts` with `defineComponent({...})`: slug,
   name, category, `importPath` and `exports`, playground `controls`, a `code(values)` function
   (use the helpers in `jsx.ts`: `element`, `attr`, `text`, `expr`, `moduleCode`), the `props` table
   and `a11y` notes. Add it to `COMPONENT_DOCS`.
3. Add its live preview to `PREVIEWS` in `previews.tsx`, rendering the same markup `code()` prints.
   TypeScript requires an entry for every slug, with the right value types.
4. Optionally add an example: a file in `examples/<id>.tsx`, an entry in `EXAMPLE_COMPONENTS`
   (`components/example-demo.tsx`) and in `EXAMPLE_SNIPPETS` (`examples.ts`) whose `code` is the
   file's exact contents, then list the id in the doc's `examples`.

The page, sidebar entry, overview card, Previous/Next links and 404 handling follow automatically,
and the unit tests compile its generated code for every control value.

For text that only screen readers should hear, put spaces outside the `sr-only` element, as in
`Customize <span className="sr-only">{name}</span>`. A space at the edge of a visually hidden
span is dropped from accessible names, which merges words ("CustomizeFade Up").
