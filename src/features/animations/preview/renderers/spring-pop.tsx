"use client"

import { Sparkles } from "lucide-react"
import { startSpringPop } from "../../adapters/motion"
import { useAnimationRun } from "../../hooks/use-animation-run"
import type { ConfigFor } from "../../model"
import type { RendererProps } from "../types"

export default function SpringPopPreview({
  config,
  autoplay,
  paused,
}: RendererProps<ConfigFor<"spring-pop">>) {
  const ref = useAnimationRun<HTMLDivElement, ConfigFor<"spring-pop">>(startSpringPop, config, {
    autoplay,
    paused,
  })
  return (
    <div ref={ref}>
      <div
        data-anim-target
        className="flex size-20 items-center justify-center rounded-2xl bg-accent-strong text-white shadow-glow"
      >
        <Sparkles aria-hidden className="size-8" />
      </div>
    </div>
  )
}
