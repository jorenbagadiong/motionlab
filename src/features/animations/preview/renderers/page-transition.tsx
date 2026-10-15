"use client"

import { startPageTransition } from "../../adapters/motion"
import { useAnimationRun } from "../../hooks/use-animation-run"
import type { ConfigFor } from "../../model"
import type { RendererProps } from "../types"

function FakePage({ title, accent }: { title: string; accent: boolean }) {
  return (
    <div className="flex h-full flex-col gap-2 p-3">
      <span className="text-[11px] font-medium text-fg-muted">{title}</span>
      <span
        className={accent ? "h-10 rounded-md bg-accent-strong/80" : "h-10 rounded-md bg-fg/15"}
      />
      <span className="h-1.5 w-3/4 rounded-full bg-fg/30" />
      <span className="h-1.5 w-1/2 rounded-full bg-fg/20" />
    </div>
  )
}

export default function PageTransitionPreview({
  config,
  autoplay,
  paused,
}: RendererProps<ConfigFor<"page-transition">>) {
  const ref = useAnimationRun<HTMLDivElement, ConfigFor<"page-transition">>(
    startPageTransition,
    config,
    { autoplay, paused },
  )
  return (
    <div
      ref={ref}
      aria-hidden
      className="relative h-32 w-48 overflow-hidden rounded-xl border border-line-strong bg-surface-overlay shadow-panel"
    >
      {/* Resting frame: the incoming page is shown, the outgoing page is hidden. */}
      <div data-anim-page="outgoing" className="absolute inset-0 opacity-0">
        <FakePage title="/home" accent={false} />
      </div>
      <div data-anim-page="incoming" className="absolute inset-0">
        <FakePage title="/details" accent />
      </div>
    </div>
  )
}
