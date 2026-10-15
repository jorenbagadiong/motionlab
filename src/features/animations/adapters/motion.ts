import { animate, stagger } from "motion/react"
import type { Direction, RepeatMode } from "../model/common-fields"
import type { ConfigFor } from "../model/families"
import { type PlaybackControls, queryTarget, queryTargets } from "../playback"

/**
 * Motion for React adapter. Pure functions that map typed configs to Motion
 * keyframes and transitions. The keyframe/transition builders are exported so
 * code generation can reuse exactly what the preview runs.
 */

const seconds = (ms: number) => ms / 1000

interface Controls {
  play(): void
  pause(): void
  stop(): void
}

function wrap(controls: Controls): PlaybackControls {
  let disposed = false
  return {
    play: () => !disposed && controls.play(),
    pause: () => !disposed && controls.pause(),
    dispose: () => {
      if (disposed) return
      disposed = true
      controls.stop()
    },
  }
}

/** Starting offset for an element that travels *towards* `direction`. */
export function offsetFor(direction: Direction, distance: number): { x: number; y: number } {
  switch (direction) {
    case "up":
      return { x: 0, y: distance }
    case "down":
      return { x: 0, y: -distance }
    case "left":
      return { x: distance, y: 0 }
    case "right":
      return { x: -distance, y: 0 }
  }
}

export function motionRepeat(mode: RepeatMode) {
  switch (mode) {
    case "none":
      return {}
    case "loop":
      return { repeat: Infinity, repeatType: "loop" as const }
    case "alternate":
      return { repeat: Infinity, repeatType: "reverse" as const }
  }
}

// --- fade-slide -------------------------------------------------------------

export function fadeSlideKeyframes(c: ConfigFor<"fade-slide">) {
  const { x, y } = offsetFor(c.direction, c.distance)
  return { opacity: [0, 1], x: [x, 0], y: [y, 0] }
}

export function fadeSlideTransition(c: ConfigFor<"fade-slide">) {
  return {
    duration: seconds(c.duration),
    delay: seconds(c.delay),
    ease: c.ease,
    ...motionRepeat(c.repeat),
  }
}

export function startFadeSlide(root: Element, c: ConfigFor<"fade-slide">): PlaybackControls {
  const target = queryTarget(root, "[data-anim-target]")
  return wrap(animate(target, fadeSlideKeyframes(c), fadeSlideTransition(c)))
}

// --- spring-pop -------------------------------------------------------------

export function springPopKeyframes(c: ConfigFor<"spring-pop">) {
  return { scale: [c.fromScale, 1], rotate: [c.fromRotation, 0] }
}

export function springPopTransition(c: ConfigFor<"spring-pop">) {
  return {
    type: "spring" as const,
    stiffness: c.stiffness,
    damping: c.damping,
    mass: c.mass,
    delay: seconds(c.delay),
  }
}

export function startSpringPop(root: Element, c: ConfigFor<"spring-pop">): PlaybackControls {
  const target = queryTarget(root, "[data-anim-target]")
  return wrap(animate(target, springPopKeyframes(c), springPopTransition(c)))
}

// --- stagger-cards ----------------------------------------------------------

export function staggerCardsKeyframes(c: ConfigFor<"stagger-cards">) {
  const { x, y } = offsetFor(c.direction, c.distance)
  return { opacity: [0, 1], x: [x, 0], y: [y, 0] }
}

export function startStaggerCards(root: Element, c: ConfigFor<"stagger-cards">): PlaybackControls {
  const cards = queryTargets(root, "[data-anim-item]")
  return wrap(
    animate(cards, staggerCardsKeyframes(c), {
      duration: seconds(c.duration),
      ease: c.ease,
      delay: stagger(seconds(c.stagger), { startDelay: seconds(c.delay) }),
    }),
  )
}

// --- page-transition --------------------------------------------------------

export function pageTransitionKeyframes(c: ConfigFor<"page-transition">) {
  const { x, y } = offsetFor(c.direction, c.distance)
  return {
    exit: { opacity: [1, 0], x: [0, -x], y: [0, -y] },
    enter: { opacity: [0, 1], x: [x, 0], y: [y, 0] },
  }
}

export function startPageTransition(
  root: Element,
  c: ConfigFor<"page-transition">,
): PlaybackControls {
  const outgoing = queryTarget(root, "[data-anim-page='outgoing']")
  const incoming = queryTarget(root, "[data-anim-page='incoming']")
  const { exit, enter } = pageTransitionKeyframes(c)
  const options = { duration: seconds(c.duration), ease: c.ease }
  return wrap(
    animate([
      [outgoing, exit, options],
      [incoming, enter, options],
    ]),
  )
}

// --- hover-lift (gesture, declarative) --------------------------------------

export function hoverLiftProps(c: ConfigFor<"hover-lift">) {
  const hover = { y: -c.lift, scale: c.scale, rotate: c.rotation }
  return {
    whileHover: hover,
    whileFocus: hover,
    whileTap: { y: -c.lift / 2, scale: Number((c.scale * 0.97).toFixed(3)), rotate: c.rotation },
    transition: { type: "spring" as const, stiffness: c.stiffness, damping: c.damping },
  }
}
