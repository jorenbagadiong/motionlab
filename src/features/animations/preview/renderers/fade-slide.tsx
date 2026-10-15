"use client"

import { startFadeSlide } from "../../adapters/motion"
import { useAnimationRun } from "../../hooks/use-animation-run"
import type { ConfigFor } from "../../model"
import type { RendererProps } from "../types"
import { DemoCard } from "./demo-card"

export default function FadeSlidePreview({
  config,
  autoplay,
  paused,
}: RendererProps<ConfigFor<"fade-slide">>) {
  const ref = useAnimationRun<HTMLDivElement, ConfigFor<"fade-slide">>(startFadeSlide, config, {
    autoplay,
    paused,
  })
  return (
    <div ref={ref}>
      <DemoCard data-anim-target />
    </div>
  )
}
