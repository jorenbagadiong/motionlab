import { numberField, selectField } from "./fields"

/**
 * Reusable field factories. Durations and delays are stored in milliseconds
 * for every engine; adapters convert to seconds where Motion expects them.
 *
 * Easing names are engine-specific on purpose: the two libraries do not share
 * identical curves, and generated code must match the preview exactly.
 */

export const MOTION_EASINGS = [
  { value: "linear", label: "Linear" },
  { value: "easeIn", label: "Ease in" },
  { value: "easeOut", label: "Ease out" },
  { value: "easeInOut", label: "Ease in-out" },
  { value: "circOut", label: "Circ out" },
  { value: "backOut", label: "Back out" },
  { value: "anticipate", label: "Anticipate" },
] as const

export const ANIME_EASINGS = [
  { value: "linear", label: "Linear" },
  { value: "inOutSine", label: "In-out sine" },
  { value: "inOutQuad", label: "In-out quad" },
  { value: "outQuad", label: "Out quad" },
  { value: "outCubic", label: "Out cubic" },
  { value: "outExpo", label: "Out expo" },
  { value: "outBack", label: "Out back" },
  { value: "outElastic", label: "Out elastic" },
  { value: "outBounce", label: "Out bounce" },
] as const

export type MotionEasing = (typeof MOTION_EASINGS)[number]["value"]
export type AnimeEasing = (typeof ANIME_EASINGS)[number]["value"]

export const duration = (defaultMs: number, max = 3000) =>
  numberField({ label: "Duration", min: 100, max, step: 50, default: defaultMs, unit: "ms" })

export const delay = (defaultMs = 0) =>
  numberField({ label: "Delay", min: 0, max: 2000, step: 50, default: defaultMs, unit: "ms" })

export const stagger = (defaultMs: number, max = 400) =>
  numberField({
    label: "Stagger",
    description: "Delay between each element",
    min: 0,
    max,
    step: 10,
    default: defaultMs,
    unit: "ms",
  })

export const distance = (defaultPx: number, max = 200) =>
  numberField({ label: "Distance", min: 0, max, step: 1, default: defaultPx, unit: "px" })

export const motionEase = (defaultEase: MotionEasing) =>
  selectField({ label: "Easing", options: MOTION_EASINGS, default: defaultEase })

export const animeEase = (defaultEase: AnimeEasing) =>
  selectField({ label: "Easing", options: ANIME_EASINGS, default: defaultEase })

export const DIRECTIONS = [
  { value: "up", label: "Up" },
  { value: "down", label: "Down" },
  { value: "left", label: "Left" },
  { value: "right", label: "Right" },
] as const

export type Direction = (typeof DIRECTIONS)[number]["value"]

/** Direction an element travels *towards*; the offset is where it starts. */
export const direction = (defaultDirection: Direction) =>
  selectField({ label: "Direction", options: DIRECTIONS, default: defaultDirection })

export const REPEAT_MODES = [
  { value: "none", label: "Play once" },
  { value: "loop", label: "Loop" },
  { value: "alternate", label: "Ping-pong" },
] as const

export type RepeatMode = (typeof REPEAT_MODES)[number]["value"]

export const repeat = (defaultMode: RepeatMode = "none") =>
  selectField({ label: "Repeat", options: REPEAT_MODES, default: defaultMode })

export const stiffness = (defaultValue: number) =>
  numberField({ label: "Stiffness", min: 20, max: 1000, step: 10, default: defaultValue })

export const damping = (defaultValue: number) =>
  numberField({ label: "Damping", min: 1, max: 80, step: 1, default: defaultValue })

export const count = (label: string, defaultValue: number, min: number, max: number) =>
  numberField({ label, min, max, step: 1, default: defaultValue, integer: true })
