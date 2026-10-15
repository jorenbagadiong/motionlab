# Text components and Carousel

Date: 2026-10-16. Status: building (the user chose to skip the separate spec/plan reviews).

## Engine rule

Anime.js animates SVG and text. Motion animates component blocks (layout, drag, slides,
indicators).

## Visual direction: technical / dev-tool

Geist Mono labels with tabular numbers, a dotted-grid surface (`bg-dots`), bracket controls
(`[ ← ]`), segmented progress (`▮▮▮▯▯`), status labels like `slide 03/05`. Only existing theme
tokens (accent, line, fg, surface), so light/dark and the accent picker apply. Not a copy of
shadcn/ui or shadcnui-blocks.

## Text components (Anime.js), category "Typography"

Shared rules: the final text is always in the accessible name (animated glyphs are
`aria-hidden`), reduced motion shows the final state with no tween, `trigger="mount" | "inView"`
with optional `replay`, animations are reverted on unmount.

| Component       | Behavior                                                                                           |
| --------------- | -------------------------------------------------------------------------------------------------- |
| `TextReveal`    | Split by char / word / line (`\n`); effects slide, blur, rotate, terminal (stepped + caret).       |
| `NumberTicker`  | Odometer digit columns roll from the previous value; Intl formatting, decimals, min digits.        |
| `TextScramble`  | `scramble` decodes from glyphs, `type` types with a caret; `words` cycles a list.                  |
| `TextHighlight` | SVG mark drawn with `createDrawable`: underline, squiggle, box (brackets), circle, strike, marker. |

## Carousel (Motion blocks + Anime.js text/SVG)

Composable parts: `Carousel`, `CarouselContent`, `CarouselItem`, `CarouselPrevious`,
`CarouselNext`, `CarouselStatus`, `CarouselProgress`, `CarouselPagination`, `CarouselThumbs`,
`CarouselPlayToggle`, `useCarousel`.

- Motion: draggable track with velocity-projected spring snapping; `align` start/center;
  fractional `slidesPerView`; `effect` fade/scale bound to the drag position; pagination and
  thumbs indicators via `layoutId`; segmented progress driven by a shared autoplay motion value.
- Anime.js: SVG arrows draw on hover; `CarouselStatus` digits roll via `NumberTicker`.
- A11y: region + `aria-roledescription="carousel"`, slides are labelled groups, off-screen
  slides are `inert`, arrow keys navigate, a polite live region announces slides (off while
  autoplaying), autoplay pauses on hover/focus and has a play/pause control, reduced motion
  jumps instead of animating and disables autoplay.
- Loop wraps at the ends (rewinds; no clones).

Examples (11): default, multiple, vertical, status, status-2, pagination, footer, progress,
thumbs, opacity, scale.

## Library integration and tests

Registry entries with playground controls, code generators, props tables and a11y notes;
previews in `previews.tsx`; example files covered by the drift test. Unit tests for the
components; the existing e2e suite renders every component page.
