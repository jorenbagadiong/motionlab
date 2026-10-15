"use client"

import { startOrbitSpinner } from "../../adapters/motion"
import { useAnimationRun } from "../../hooks/use-animation-run"
import type { ConfigFor } from "../../model"
import type { RendererProps } from "../types"

export default function OrbitSpinnerPreview({
  config,
  autoplay,
  paused,
}: RendererProps<ConfigFor<"orbit-spinner">>) {
  const ref = useAnimationRun<HTMLDivElement, ConfigFor<"orbit-spinner">>(
    startOrbitSpinner,
    config,
    { autoplay, paused },
  )
  return (
    <div ref={ref} aria-hidden className="relative size-20">
      <span className="absolute inset-0 rounded-full border border-dashed border-line-strong" />
      <span className="absolute top-1/2 left-1/2 size-5 -translate-1/2 rounded-full bg-accent-strong shadow-glow" />
      <div data-anim-target className="absolute inset-0">
        <span className="absolute top-0 left-1/2 size-3 -translate-1/2 rounded-full bg-accent" />
        <span className="absolute bottom-0 left-1/2 size-2 -translate-x-1/2 translate-y-1/2 rounded-full bg-engine-motion" />
      </div>
    </div>
  )
}
