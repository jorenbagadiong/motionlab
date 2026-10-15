import {
  type AnimationConfig,
  type ConfigFor,
  defaultConfig,
  type FamilyId,
} from "@/features/animations/model"
import type { CategoryId } from "./categories"

export interface BuiltInPreset {
  slug: string
  name: string
  description: string
  category: CategoryId
  tags: readonly string[]
  featured?: boolean
  config: AnimationConfig
}

function preset<F extends FamilyId>(
  family: F,
  meta: Omit<BuiltInPreset, "config">,
  overrides: Partial<Omit<ConfigFor<F>, "family" | "engine">> = {},
): BuiltInPreset {
  return { ...meta, config: { ...defaultConfig(family), ...overrides } }
}

/**
 * Built-in demo presets. These are static, typed data that every visitor can
 * use without signing in; `tests/unit/catalog.test.ts` validates each one
 * against the runtime schema.
 */
export const BUILT_IN_PRESETS: readonly BuiltInPreset[] = [
  preset("fade-slide", {
    slug: "fade-up",
    name: "Fade Up",
    description: "The workhorse entrance: content rises gently into place as it fades in.",
    category: "fade-slide",
    tags: ["entrance", "opacity", "subtle"],
    featured: true,
  }),
  preset(
    "fade-slide",
    {
      slug: "slide-in-left",
      name: "Slide In",
      description: "A confident horizontal entrance for panels, toasts and side content.",
      category: "fade-slide",
      tags: ["entrance", "horizontal", "panel"],
    },
    { direction: "right", distance: 80, duration: 500, ease: "circOut" },
  ),
  preset("spring-pop", {
    slug: "spring-pop",
    name: "Spring Pop",
    description: "A physics-based scale-in with a lively overshoot. Great for badges and modals.",
    category: "scale-spring",
    tags: ["spring", "physics", "scale"],
    featured: true,
  }),
  preset(
    "spring-pop",
    {
      slug: "twist-in",
      name: "Twist In",
      description: "Scales and unwinds from a rotation with a loose, bouncy spring.",
      category: "scale-spring",
      tags: ["spring", "rotation", "playful"],
    },
    { fromScale: 0.3, fromRotation: -45, damping: 9, stiffness: 220 },
  ),
  preset("stagger-cards", {
    slug: "staggered-cards",
    name: "Staggered Cards",
    description: "Cards cascade into view one after another, guiding the eye through a list.",
    category: "stagger",
    tags: ["list", "grid", "cascade"],
    featured: true,
  }),
  preset("hover-lift", {
    slug: "hover-lift",
    name: "Hover Lift",
    description: "A springy lift-and-scale on hover, focus and press for interactive surfaces.",
    category: "hover",
    tags: ["gesture", "spring", "card"],
  }),
  preset("page-transition", {
    slug: "page-slide",
    name: "Page Slide",
    description: "The outgoing page slides away while the next one slides in behind it.",
    category: "page",
    tags: ["route", "navigation", "sequence"],
  }),
  preset("text-reveal", {
    slug: "character-rise",
    name: "Character Rise",
    description: "Each letter rises into place in sequence for punchy, editorial headlines.",
    category: "text",
    tags: ["headline", "split text", "stagger"],
    featured: true,
  }),
  preset(
    "text-reveal",
    {
      slug: "letter-tumble",
      name: "Letter Tumble",
      description: "Letters drop in from a tilt with an elastic settle.",
      category: "text",
      tags: ["headline", "rotation", "elastic"],
    },
    { distance: 24, fromRotation: 45, stagger: 60, duration: 1200, ease: "outElastic" },
  ),
  preset("svg-draw", {
    slug: "line-draw",
    name: "Line Draw",
    description: "SVG strokes draw themselves on, then retract, like a pen tracing an icon.",
    category: "svg",
    tags: ["stroke", "icon", "illustration"],
    featured: true,
  }),
  preset("bouncing-dots", {
    slug: "bouncing-dots",
    name: "Bouncing Dots",
    description: "A compact, friendly loading indicator with a staggered bounce.",
    category: "loader",
    tags: ["loading", "indicator", "loop"],
    featured: true,
  }),
  preset("progress-bar", {
    slug: "progress-fill",
    name: "Progress Fill",
    description: "A smooth, transform-based progress bar that avoids layout work.",
    category: "loader",
    tags: ["progress", "bar", "loop"],
  }),
  preset("orbit-spinner", {
    slug: "orbit-spinner",
    name: "Orbit Spinner",
    description: "Satellites orbit a center point. A calm alternative to the classic spinner.",
    category: "loader",
    tags: ["loading", "rotation", "loop"],
  }),
]

const BY_SLUG = new Map(BUILT_IN_PRESETS.map((p) => [p.slug, p]))

export function getBuiltInPreset(slug: string): BuiltInPreset | undefined {
  return BY_SLUG.get(slug)
}

export { DEFAULT_PRESET_SLUG } from "./constants"
