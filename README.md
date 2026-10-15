# MotionLab

An interactive motion design studio: explore animation presets, tune them in real time, inspect
the implementation and save them for future projects. Built with Next.js, Motion for React,
Anime.js and Supabase.

## Status

| Phase | Scope                                                                        | State   |
| ----- | ---------------------------------------------------------------------------- | ------- |
| 1     | Foundation: tooling, design system, shell, landing, gallery, working presets | ✅ Done |
| 2     | Animation editor: live controls, reset, config-driven replay                 | ✅ Done |
| 3     | Code generation: Motion / Anime.js snippets, copy to clipboard               | ✅ Done |
| 4     | Supabase: Google OAuth, migrations, RLS, personal library CRUD               | ⏳ Next |
| 5     | Favorites, collections, polish, deployment                                   | Planned |

What works today: 13 built-in presets across 10 animation families (both engines), a searchable
and filterable gallery, preset detail pages, a playground where every supported property can be
edited live, and a "How to use" panel with copy-ready code (install command, component or
function, usage example) that matches the preview, light/dark mode with five color themes, and a
component library at `/components`: 16 components (buttons, form controls, alerts, dialog, tabs and
more), each with its own page and a live playground where you change props and copy the matching
code. Reduced motion and responsive layouts are supported
throughout.

**Developer guide:** [docs/components.md](docs/components.md) explains how to use MotionLab's
components (`PreviewStage`, the editor, code generation, adapters) and how to add presets and
animation families.

## Tech stack

Next.js 16.3 (App Router, Cache Components, Turbopack) · React 19 · TypeScript 5 (strict) ·
Tailwind CSS 4 · Motion for React 13 (`motion/react`) · Anime.js 4 · Zod 4 · Lucide ·
Vitest 5 + React Testing Library · Playwright 1.63. Supabase and React Hook Form are added in
later phases, when they are first needed.

### Dependency policy

Every dependency, direct or transitive, must have been published **at least 14 days ago**,
to satisfy registry quarantine. All versions are pinned exactly (`.npmrc` sets `save-exact`).

- Check the whole lockfile: `npm run deps:age` (or `node scripts/check-dependency-age.mjs 21`
  for a stricter window). It exits non-zero and lists any package that is too new.
- When adding or upgrading a package, resolve against a cutoff date so transitive dependencies
  are old enough too, e.g. `npm install <pkg>@<version> --before=2026-09-30`, then run
  `npm run deps:age`.
- `package.json` declares `"packageManager": "npm@…"`. This stops Corepack's Yarn from running
  in this repository; a stray Yarn Plug'n'Play install once replaced `node_modules` here.

## Architecture

```
src/
  app/                     Routes (Server Components by default)
    (public)/              Landing, /explore, /presets/[slug], /playground/[slug],
                           /components (library overview) and /components/[slug]
    not-found.tsx
  proxy.ts                 Returns real 404s for unknown preset and component slugs
  components/
    ui/                    UI kit: Button, Badge, Alert, Card, form fields, Switch, Checkbox,
                           Tabs, Dialog, Progress, Spinner, Skeleton, Kbd, Separator, Container
    layout/                Header, footer, nav, mobile nav, page header
  features/
    animations/
      model/               Field specs → Zod schemas, families, config helpers
      adapters/            motion.ts, anime.ts: the only engine-specific code
      hooks/               useAnimationRun (lifecycle), usePrefersReducedMotion
      preview/             PreviewStage, code-split renderers per family
    presets/               Built-in catalog, categories, filtering, gallery UI
    editor/                Playground editor: controls, config state, debounced preview
    code-generator/        Config → Motion/Anime.js code, highlighting, copy, "How to use" panel
    landing/               Hero demo
    component-library/     Component docs registry, playground controls, live previews, code
                           generation, examples
    theme/                 Light/dark mode + color themes, pre-paint script, header controls
  config/site.ts
tests/
  unit/                    Vitest + RTL (jsdom)
  e2e/                     Playwright (real browser, production build)
```

### Animation configuration model

- **Field specs are the single source of truth.** Each property (duration, easing, stiffness, …)
  is declared once with its label, range, step and default (`model/fields.ts`). Both the Zod
  validator and the editor controls are derived from it, so they cannot drift.
- **Families** (`model/families.ts`) bind one engine to only the properties that apply,
  e.g. `spring-pop` exposes stiffness/damping/mass, `svg-draw` exposes stagger/repeat. All
  families form a `z.discriminatedUnion("family", …)`; `ConfigFor<"fade-slide">` is fully typed.
- **Configs are data, never code.** `parseConfig` validates untrusted input with strict objects
  (unknown keys rejected), bounded numbers and enumerated easings, and fills missing values
  from defaults. Easings are engine-specific so generated code can match the preview exactly.
- **Durations are milliseconds everywhere.** The Motion adapter converts to seconds.

### Engine adapters and lifecycle

UI components never call Motion or Anime.js directly. Each adapter function takes a DOM root
and a typed config and returns a common `PlaybackControls` (`play`, `pause`, `dispose`).
`useAnimationRun` starts the adapter in a layout effect and always disposes it on unmount or
config change. `PreviewStage` remounts the renderer per run (via `key`), so every replay starts
from fresh markup. Renderers are code-split with `next/dynamic`, so a page only downloads the
engine its presets use.

### Editor

`features/editor` holds the playground editor. `ConfigControls` renders one control per field of
the preset's family: a slider plus a number input for numeric fields, a select for options.
Every edit goes through `updateConfigField` → `parseConfig`, so the editor can never hold an
invalid config, and `family` and `engine` can't be changed. Typed values apply on Enter or blur
(Escape discards them); out-of-range input shows an inline error and is never applied. The
preview restarts 200 ms after the last change, so dragging a slider doesn't restart it on every
tick. Changing the config also clears Pause, so the new animation is visible.

### Code generation

`features/code-generator` turns a config into copy-ready code. Generators reuse the adapter
builders the preview runs (`fadeSlideKeyframes`, `textRevealParams`, …), so code and preview
can't drift apart. Motion presets become React components using `motion.*` props or variants;
Anime.js presets become functions that take a root element and return the animation, so callers
control cleanup with `revert()`. A unit test type-checks the output for every preset and every
option against the installed `motion` and `animejs` types. Highlighting uses a small tokenizer
rendered as React text nodes (no HTML injection, no extra dependency). Copy falls back to a
legacy method on plain HTTP, where the Clipboard API is unavailable.

### Light and dark mode

The header toggle offers **System**, **Light** and **Dark**. System follows the device setting live,
in pure CSS; an explicit choice is saved in `localStorage` and applied as `data-theme` on `<html>`.
A tiny inline script in `<head>` applies the saved choice before first paint, so there's no flash
of the wrong theme. Colors are CSS variables in `src/app/globals.css` that Tailwind utilities
reference, so components need no theme-specific classes. Every text color meets WCAG AA (4.5:1)
on every surface in both themes, and `tests/unit/theme/tokens.test.ts` keeps the two light-palette
blocks in sync.

### Color themes

The palette button in the header picks an accent color: **Violet** (default), **Blue**, **Emerald**,
**Rose** or **Amber**. It works with either mode, is saved in `localStorage` and is applied as
`data-accent` on `<html>` by the same pre-paint script. Each palette in `globals.css` defines four
values (accent text on dark, accent text on light, and a solid fill plus hover behind white text);
tints, selection and glow are mixed from them with `color-mix()`. Buttons, badges, focus rings, sliders
and the animation previews all use these tokens, so everything follows the chosen color.

To add a color theme, add a `:root[data-accent="…"]` block to `globals.css` and an entry to `ACCENTS`
in `src/features/theme/theme.ts`. `tests/unit/theme/tokens.test.ts` fails if the two lists differ or
if any accent misses WCAG AA contrast in either mode.

### Component library

`src/components/ui/` holds the shared components, all styled with the theme tokens so they follow
light/dark mode and the color theme. `/components` is a documentation site for them: an overview
with live thumbnails, a sidebar grouped by category, and a page per component with:

- **Playground:** controls for the component's props (selects, switches, text, sliders), a live
  preview and the matching code, ready to copy. Reset returns to the defaults.
- **Examples:** composed usage, each with Preview and Code tabs.
- **Props** table and **Accessibility** notes.

Each component is described as data in `src/features/component-library/registry.ts`: its controls
(typed so select options stay literal unions), props, notes and a pure `code()` function that prints
the usage module. `previews.tsx` renders the same markup live. Typed text is escaped, so input like
`<b>` or quotes shows up as text and never breaks the generated code.

Tests keep the pieces honest: `compile.test.ts` type-checks the generated code against the real
components for every select option, flipped boolean, number extreme and tricky text (over 100
cases); `registry.test.ts` checks every component has a preview, valid controls and exports that
really exist; and `examples.test.tsx` fails if an example's displayed code drifts from its file.

Interactive pieces build on native elements where possible: `Dialog` uses `<dialog>` (focus trap,
Escape, focus return), `Switch` is a checkbox with `role="switch"`, and `Tabs` follows the WAI-ARIA
tabs pattern with arrow-key navigation.

### Accessibility and motion preferences

With `prefers-reduced-motion`, previews never autoplay; they play only when the user presses
**Play**, and hover demos disable transform animation. Gallery cards stay at rest until hovered
(mouse) or replayed, and looping cards stop when the pointer leaves. Native radios power the
category filter (arrow-key navigation), and there is a skip link, visible focus rings and
labelled controls throughout.

## Getting started

Requirements: Node.js ≥ 22.12, npm.

```bash
npm install
cp .env.example .env.local   # optional for Phase 1
npm run dev                  # http://localhost:3000
```

### Opening the app from another device

`npm run dev` already listens on your network address (e.g. `http://192.168.x.x:3000`).
`next.config.ts` allows `192.168.*.*` in `allowedDevOrigins`. Without that entry the dev server
blocks its scripts for other hostnames, so the page renders but buttons don't respond. To share a
faster, production-like version, run `npm run build && npm run start` instead; it needs no extra
configuration.

### Environment variables

See [`.env.example`](.env.example). Nothing is required for Phase 1. Supabase variables are
documented there and become required in Phase 4.

## Scripts

| Command             | Purpose                                      |
| ------------------- | -------------------------------------------- |
| `npm run dev`       | Development server                           |
| `npm run build`     | Production build                             |
| `npm run lint`      | ESLint (Next core-web-vitals + TypeScript)   |
| `npm run typecheck` | Generate route types and run `tsc --noEmit`  |
| `npm run format`    | Prettier (with Tailwind class sorting)       |
| `npm test`          | Unit and component tests (Vitest)            |
| `npm run test:e2e`  | End-to-end tests (Playwright)                |
| `npm run check`     | Lint, typecheck, format check and unit tests |
| `npm run deps:age`  | Verify every locked package is ≥ 14 days old |

## Testing

**Unit and component tests** (`tests/unit`) cover config validation, ranges and defaults, catalog
integrity, filtering and sorting, adapter mappings, animation lifecycle cleanup, playback
controls, reduced motion, gallery interactions and the mobile menu. Animation engines are
replaced with deterministic fakes; no assertion depends on animation timing.

**End-to-end tests** (`tests/e2e`) run against a production build on desktop and mobile
viewports. They verify that every preset actually animates in a real browser without runtime
errors, plus navigation, gallery search and filters, keyboard access, reduced motion, 404s and
horizontal overflow.

```bash
npx playwright install chromium   # once
npm run test:e2e
```

Playwright's bundled browsers do not support macOS 12. There, use an installed Chrome instead:

```bash
E2E_BROWSER_CHANNEL=chrome npm run test:e2e
```

## Deployment

Vercel deployment and Supabase setup (OAuth redirect URLs, migrations, RLS verification) are
documented as part of Phases 4–5. Phase 1 builds as a fully static and partially prerendered app
with no required environment variables.

## Known issues

- `npm audit` reports a high-severity advisory in `braces`, pulled in only by
  `eslint-config-next` → `fast-glob` (dev-time lint tooling, never shipped to the browser).
  The suggested `npm audit fix --force` would downgrade `eslint-config-next` to v14, so it has
  not been applied. Revisit when `eslint-config-next` updates its dependency.
