"use client"

import { startBouncingDots } from "../../adapters/motion"
import { useAnimationRun } from "../../hooks/use-animation-run"
import type { ConfigFor } from "../../model"
import type { RendererProps } from "../types"

export default function BouncingDotsPreview({
  config,
  autoplay,
  paused,
}: RendererProps<ConfigFor<"bouncing-dots">>) {
  const ref = useAnimationRun<HTMLDivElement, ConfigFor<"bouncing-dots">>(
    startBouncingDots,
    config,
    { autoplay, paused },
  )
  return (
    <div ref={ref} aria-hidden className="flex h-16 items-end gap-2.5 pb-2">
      {Array.from({ length: config.count }, (_, index) => (
        <span key={index} data-anim-item className="size-3.5 rounded-full bg-accent" />
      ))}
    </div>
  )
}
