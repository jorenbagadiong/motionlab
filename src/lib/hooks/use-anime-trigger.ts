"use client"

import { type RefObject, useEffectEvent, useLayoutEffect } from "react"
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion"

export type AnimeTrigger = "mount" | "inView"

/** Anything Anime.js returns from animate/createTimeline: revert() restores inline styles. */
export interface Revertible {
  revert(): unknown
}

interface TriggerOptions<T extends Element> {
  /** Plays on mount, or the first time the element scrolls into view. */
  trigger?: AnimeTrigger
  /** With trigger="inView": play again every time the element re-enters the viewport. */
  replay?: boolean
  /** Puts the element in its "before" state. Called right before each play. */
  prepare?: (element: T) => Revertible | void
  /** Starts the animation; the result is reverted on cleanup and before replays. */
  play: (element: T) => Revertible
  /** Values that restart the animation when they change (e.g. the text). */
  key: string
}

/**
 * Runs an Anime.js animation on a ref. With reduced motion nothing runs, so the
 * element keeps its rendered (final) state. A layout effect applies the "before"
 * state ahead of paint, so there is no flash of the final state.
 */
export function useAnimeTrigger<T extends Element>(
  ref: RefObject<T | null>,
  { trigger = "mount", replay = false, prepare, play, key }: TriggerOptions<T>,
) {
  const reduced = usePrefersReducedMotion()
  const onPrepare = useEffectEvent((element: T) => prepare?.(element))
  const onPlay = useEffectEvent((element: T) => play(element))

  useLayoutEffect(() => {
    const element = ref.current
    if (!element || reduced) return
    let animation: Revertible | undefined
    let prepared: Revertible | void
    const reset = () => {
      animation?.revert()
      animation = undefined
      prepared = onPrepare(element)
    }
    const cleanup = () => {
      animation?.revert()
      prepared?.revert()
    }
    const run = () => {
      reset()
      animation = onPlay(element)
    }

    if (trigger === "mount" || typeof IntersectionObserver === "undefined") {
      run()
      return cleanup
    }

    reset()
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          run()
          if (!replay) observer.disconnect()
        } else if (replay && animation) {
          reset()
        }
      },
      { threshold: 0.25 },
    )
    observer.observe(element)
    return () => {
      observer.disconnect()
      cleanup()
    }
  }, [ref, reduced, trigger, replay, key])
}
