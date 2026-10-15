"use client"

import { useLayoutEffect, useRef } from "react"
import type { PlaybackControls, StartAnimation } from "../playback"

interface RunOptions {
  /** Start the animation on mount. When false the element stays in its resting state. */
  autoplay: boolean
  paused: boolean
}

/**
 * Binds an adapter to a DOM subtree. The owning preview remounts this subtree
 * for every run (via `key`), so each run starts from fresh markup and the
 * previous engine instance is always disposed first.
 *
 * A layout effect is used so the first keyframe is applied before paint,
 * which prevents a one-frame flash of the resting state.
 */
export function useAnimationRun<Root extends Element, Config>(
  start: StartAnimation<Root, Config>,
  config: Config,
  { autoplay, paused }: RunOptions,
) {
  const rootRef = useRef<Root>(null)
  const controlsRef = useRef<PlaybackControls | null>(null)
  const pausedRef = useRef(paused)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!autoplay || !root) return
    const controls = start(root, config)
    controlsRef.current = controls
    if (pausedRef.current) controls.pause()
    return () => {
      controls.dispose()
      controlsRef.current = null
    }
  }, [start, config, autoplay])

  useLayoutEffect(() => {
    pausedRef.current = paused
    if (paused) controlsRef.current?.pause()
    else controlsRef.current?.play()
  }, [paused])

  return rootRef
}
