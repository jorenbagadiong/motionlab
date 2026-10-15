"use client"

import { startProgressBar } from "../../adapters/motion"
import { useAnimationRun } from "../../hooks/use-animation-run"
import type { ConfigFor } from "../../model"
import type { RendererProps } from "../types"

export default function ProgressBarPreview({
  config,
  autoplay,
  paused,
}: RendererProps<ConfigFor<"progress-bar">>) {
  const ref = useAnimationRun<HTMLDivElement, ConfigFor<"progress-bar">>(startProgressBar, config, {
    autoplay,
    paused,
  })
  return (
    <div ref={ref} aria-hidden className="flex w-52 flex-col gap-2">
      <div className="flex justify-between text-xs text-fg-muted">
        <span>Uploading assets</span>
        <span className="font-mono text-fg-subtle">motion.zip</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-surface-overlay">
        <div
          data-anim-target
          className="h-full origin-left rounded-full bg-linear-to-r from-accent-strong to-accent"
        />
      </div>
    </div>
  )
}
