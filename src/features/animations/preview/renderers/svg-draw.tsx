"use client"

import { startSvgDraw } from "../../adapters/anime"
import { useAnimationRun } from "../../hooks/use-animation-run"
import type { ConfigFor } from "../../model"
import type { RendererProps } from "../types"

export default function SvgDrawPreview({
  config,
  autoplay,
  paused,
}: RendererProps<ConfigFor<"svg-draw">>) {
  const ref = useAnimationRun<SVGSVGElement, ConfigFor<"svg-draw">>(startSvgDraw, config, {
    autoplay,
    paused,
  })
  return (
    <svg
      ref={ref}
      viewBox="0 0 120 96"
      aria-hidden
      className="h-28 w-36 fill-none stroke-accent"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect data-anim-path x="6" y="6" width="108" height="84" rx="14" />
      <path data-anim-path d="M22 66 L44 40 L62 56 L76 44 L98 66" />
      <circle data-anim-path cx="86" cy="26" r="8" />
    </svg>
  )
}
