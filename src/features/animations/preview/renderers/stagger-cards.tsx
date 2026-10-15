"use client"

import { startStaggerCards } from "../../adapters/motion"
import { useAnimationRun } from "../../hooks/use-animation-run"
import type { ConfigFor } from "../../model"
import type { RendererProps } from "../types"

export default function StaggerCardsPreview({
  config,
  autoplay,
  paused,
}: RendererProps<ConfigFor<"stagger-cards">>) {
  const ref = useAnimationRun<HTMLUListElement, ConfigFor<"stagger-cards">>(
    startStaggerCards,
    config,
    { autoplay, paused },
  )
  return (
    <ul ref={ref} className="flex w-48 flex-col gap-1.5">
      {Array.from({ length: config.count }, (_, index) => (
        <li
          key={index}
          data-anim-item
          className="flex h-6 items-center gap-2 rounded-md border border-line-strong bg-surface-overlay px-2"
        >
          <span className="size-2.5 rounded-full bg-accent" />
          <span className="h-1.5 flex-1 rounded-full bg-fg/30" />
        </li>
      ))}
    </ul>
  )
}
