import { z } from "zod"
import * as f from "./common-fields"
import { type FieldMap, fieldsShape, numberField, selectField } from "./fields"

/**
 * `testedMajor` is the major version generated code targets; a unit test keeps
 * it in sync with package.json.
 */
export const ENGINES = {
  motion: { id: "motion", label: "Motion", packageName: "motion", testedMajor: 13 },
  anime: { id: "anime", label: "Anime.js", packageName: "animejs", testedMajor: 4 },
} as const

export type EngineId = keyof typeof ENGINES

/**
 * How a family plays back:
 * - `timeline`: a finite animation that can be replayed (and may loop via config).
 * - `infinite`: always loops, e.g. loaders.
 * - `gesture`: driven by hover/focus/press rather than a timeline.
 */
export type PlaybackKind = "timeline" | "infinite" | "gesture"

function defineFamily<
  const Id extends string,
  const Engine extends EngineId,
  const Fields extends FieldMap,
>(def: { id: Id; engine: Engine; label: string; playback: PlaybackKind; fields: Fields }) {
  const schema = z.strictObject({
    family: z.literal(def.id),
    engine: z.literal(def.engine),
    ...fieldsShape(def.fields),
  })
  return { ...def, schema }
}

// ---------------------------------------------------------------------------
// Motion for React families
// ---------------------------------------------------------------------------

export const fadeSlide = defineFamily({
  id: "fade-slide",
  engine: "motion",
  label: "Fade & slide",
  playback: "timeline",
  fields: {
    duration: f.duration(600),
    delay: f.delay(),
    ease: f.motionEase("easeOut"),
    direction: f.direction("up"),
    distance: f.distance(24),
    repeat: f.repeat(),
  },
})

export const springPop = defineFamily({
  id: "spring-pop",
  engine: "motion",
  label: "Spring pop",
  playback: "timeline",
  fields: {
    fromScale: numberField({
      label: "Initial scale",
      min: 0,
      max: 2,
      step: 0.05,
      default: 0.6,
      unit: "x",
    }),
    fromRotation: numberField({
      label: "Initial rotation",
      min: -180,
      max: 180,
      step: 5,
      default: 0,
      unit: "deg",
    }),
    stiffness: f.stiffness(300),
    damping: f.damping(14),
    mass: numberField({ label: "Mass", min: 0.1, max: 5, step: 0.1, default: 1 }),
    delay: f.delay(),
  },
})

export const staggerCards = defineFamily({
  id: "stagger-cards",
  engine: "motion",
  label: "Staggered cards",
  playback: "timeline",
  fields: {
    duration: f.duration(500),
    delay: f.delay(),
    stagger: f.stagger(80),
    ease: f.motionEase("easeOut"),
    direction: f.direction("up"),
    distance: f.distance(32, 120),
    count: f.count("Cards", 4, 2, 6),
  },
})

export const hoverLift = defineFamily({
  id: "hover-lift",
  engine: "motion",
  label: "Hover lift",
  playback: "gesture",
  fields: {
    lift: numberField({ label: "Lift", min: 0, max: 40, step: 1, default: 8, unit: "px" }),
    scale: numberField({
      label: "Hover scale",
      min: 0.8,
      max: 1.3,
      step: 0.01,
      default: 1.04,
      unit: "x",
    }),
    rotation: numberField({
      label: "Hover rotation",
      min: -15,
      max: 15,
      step: 1,
      default: 0,
      unit: "deg",
    }),
    stiffness: f.stiffness(400),
    damping: f.damping(22),
  },
})

export const pageTransition = defineFamily({
  id: "page-transition",
  engine: "motion",
  label: "Page transition",
  playback: "timeline",
  fields: {
    duration: f.duration(450, 2000),
    ease: f.motionEase("easeInOut"),
    direction: f.direction("left"),
    distance: f.distance(64),
  },
})

// ---------------------------------------------------------------------------
// Anime.js families
// ---------------------------------------------------------------------------

export const textReveal = defineFamily({
  id: "text-reveal",
  engine: "anime",
  label: "Text reveal",
  playback: "timeline",
  fields: {
    duration: f.duration(800),
    delay: f.delay(),
    stagger: f.stagger(40, 200),
    ease: f.animeEase("outExpo"),
    distance: f.distance(40, 120),
    fromRotation: numberField({
      label: "Initial rotation",
      min: -90,
      max: 90,
      step: 5,
      default: 0,
      unit: "deg",
    }),
    repeat: f.repeat(),
  },
})

export const svgDraw = defineFamily({
  id: "svg-draw",
  engine: "anime",
  label: "SVG line draw",
  playback: "timeline",
  fields: {
    duration: f.duration(1600, 5000),
    delay: f.delay(),
    stagger: f.stagger(150, 600),
    ease: f.animeEase("inOutSine"),
    repeat: f.repeat("alternate"),
  },
})

export const bouncingDots = defineFamily({
  id: "bouncing-dots",
  engine: "anime",
  label: "Bouncing dots",
  playback: "infinite",
  fields: {
    duration: f.duration(450, 1500),
    stagger: f.stagger(120, 300),
    height: numberField({
      label: "Bounce height",
      min: 4,
      max: 40,
      step: 1,
      default: 14,
      unit: "px",
    }),
    ease: f.animeEase("inOutSine"),
    count: f.count("Dots", 3, 3, 6),
  },
})

export const progressBar = defineFamily({
  id: "progress-bar",
  engine: "anime",
  label: "Progress bar",
  playback: "timeline",
  fields: {
    duration: f.duration(1800, 5000),
    delay: f.delay(),
    ease: f.animeEase("inOutQuad"),
    repeat: f.repeat("loop"),
  },
})

export const orbitSpinner = defineFamily({
  id: "orbit-spinner",
  engine: "anime",
  label: "Orbit spinner",
  playback: "infinite",
  fields: {
    duration: numberField({
      label: "Revolution time",
      min: 300,
      max: 5000,
      step: 50,
      default: 1200,
      unit: "ms",
    }),
    ease: f.animeEase("linear"),
    spin: selectField({
      label: "Spin direction",
      options: [
        { value: "clockwise", label: "Clockwise" },
        { value: "counterclockwise", label: "Counter-clockwise" },
      ],
      default: "clockwise",
    }),
  },
})

// ---------------------------------------------------------------------------
// Registry and unified schema
// ---------------------------------------------------------------------------

export const FAMILIES = {
  [fadeSlide.id]: fadeSlide,
  [springPop.id]: springPop,
  [staggerCards.id]: staggerCards,
  [hoverLift.id]: hoverLift,
  [pageTransition.id]: pageTransition,
  [textReveal.id]: textReveal,
  [svgDraw.id]: svgDraw,
  [bouncingDots.id]: bouncingDots,
  [progressBar.id]: progressBar,
  [orbitSpinner.id]: orbitSpinner,
} as const

export type FamilyId = keyof typeof FAMILIES

export const AnimationConfigSchema = z.discriminatedUnion("family", [
  fadeSlide.schema,
  springPop.schema,
  staggerCards.schema,
  hoverLift.schema,
  pageTransition.schema,
  textReveal.schema,
  svgDraw.schema,
  bouncingDots.schema,
  progressBar.schema,
  orbitSpinner.schema,
])

export type AnimationConfig = z.infer<typeof AnimationConfigSchema>

export type ConfigFor<F extends FamilyId> = Extract<AnimationConfig, { family: F }>
