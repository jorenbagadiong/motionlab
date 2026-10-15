import { animate, createDrawable, type JSAnimation, stagger } from "animejs"
import type { RepeatMode } from "../model/common-fields"
import type { ConfigFor } from "../model/families"
import { type PlaybackControls, queryTargets } from "../playback"

/**
 * Anime.js (v4) adapter. Durations are already in milliseconds, which is what
 * Anime.js expects. Parameter builders are exported for code generation.
 */

function wrap(animation: JSAnimation): PlaybackControls {
  let disposed = false
  return {
    play: () => {
      if (!disposed) animation.play()
    },
    pause: () => {
      if (!disposed) animation.pause()
    },
    dispose: () => {
      if (disposed) return
      disposed = true
      // `revert` cancels the animation and restores the original inline styles.
      animation.revert()
    },
  }
}

export function animeRepeat(mode: RepeatMode): { loop: boolean; alternate: boolean } {
  return { loop: mode !== "none", alternate: mode === "alternate" }
}

// --- text-reveal ------------------------------------------------------------

export function textRevealParams(c: ConfigFor<"text-reveal">) {
  return {
    translateY: [c.distance, 0],
    rotate: [c.fromRotation, 0],
    opacity: [0, 1],
    duration: c.duration,
    ease: c.ease,
    ...animeRepeat(c.repeat),
  }
}

export function startTextReveal(root: Element, c: ConfigFor<"text-reveal">): PlaybackControls {
  const chars = queryTargets(root, "[data-anim-char]")
  return wrap(
    animate(chars, { ...textRevealParams(c), delay: stagger(c.stagger, { start: c.delay }) }),
  )
}

// --- svg-draw ---------------------------------------------------------------

export function svgDrawParams(c: ConfigFor<"svg-draw">) {
  return {
    draw: ["0 0", "0 1"],
    duration: c.duration,
    ease: c.ease,
    ...animeRepeat(c.repeat),
  }
}

export function startSvgDraw(root: Element, c: ConfigFor<"svg-draw">): PlaybackControls {
  const paths = queryTargets<SVGGeometryElement>(root, "[data-anim-path]")
  return wrap(
    animate(createDrawable(paths), {
      ...svgDrawParams(c),
      delay: stagger(c.stagger, { start: c.delay }),
    }),
  )
}
