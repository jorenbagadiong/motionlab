"use client"

import { startTextReveal } from "../../adapters/anime"
import { useAnimationRun } from "../../hooks/use-animation-run"
import type { ConfigFor } from "../../model"
import type { RendererProps } from "../types"

const TEXT = "Motion"

export default function TextRevealPreview({
  config,
  autoplay,
  paused,
}: RendererProps<ConfigFor<"text-reveal">>) {
  const ref = useAnimationRun<HTMLParagraphElement, ConfigFor<"text-reveal">>(
    startTextReveal,
    config,
    { autoplay, paused },
  )
  return (
    <p ref={ref} className="text-5xl font-semibold tracking-tight text-fg">
      <span className="sr-only">{TEXT}</span>
      <span aria-hidden className="inline-flex">
        {Array.from(TEXT).map((char, index) => (
          <span key={index} data-anim-char className="inline-block">
            {char}
          </span>
        ))}
      </span>
    </p>
  )
}
