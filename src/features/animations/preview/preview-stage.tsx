"use client"

import { Hand, Pause, Play, RotateCcw } from "lucide-react"
import { type PointerEvent, useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils/cn"
import { usePrefersReducedMotion } from "../hooks/use-prefers-reduced-motion"
import { type AnimationConfig, isLooping, supportsPlaybackControls } from "../model"
import { AnimationRenderer } from "./registry"

export interface PreviewStageProps {
  config: AnimationConfig
  /** Accessible name of the animation, used in control labels. */
  label: string
  /**
   * `mount`: play when shown (stage views). `hover`: rest until hovered or
   * replayed (gallery cards, so many cards don't animate at once).
   */
  trigger?: "mount" | "hover"
  variant?: "card" | "stage"
  /** Shorter stage on small screens, e.g. when pinned above editor controls. */
  compact?: boolean
  className?: string
}

interface RunState {
  id: number
  /** Whether the current run was explicitly requested by the user. */
  requested: boolean
}

export function PreviewStage({
  config,
  label,
  trigger = "mount",
  variant = "stage",
  compact = false,
  className,
}: PreviewStageProps) {
  const reducedMotion = usePrefersReducedMotion()
  const [run, setRun] = useState<RunState>({ id: trigger === "mount" ? 1 : 0, requested: false })
  // Pause applies to the config it was set on; editing the config resumes playback.
  const signature = JSON.stringify(config)
  const [pausedFor, setPausedFor] = useState<string | null>(null)
  const paused = pausedFor === signature

  const playable = supportsPlaybackControls(config)
  // With reduced motion, only explicitly requested runs play.
  const active = run.id > 0 && (!reducedMotion || run.requested)

  function replay(requested: boolean) {
    setRun((current) => ({ id: current.id + 1, requested }))
    setPausedFor(null)
  }

  function rest() {
    setRun({ id: 0, requested: false })
    setPausedFor(null)
  }

  function handlePointerEnter(event: PointerEvent) {
    if (trigger === "hover" && playable && !reducedMotion && event.pointerType === "mouse") {
      replay(false)
    }
  }

  function handlePointerLeave(event: PointerEvent) {
    // Looping card previews stop when the pointer leaves to save work.
    if (
      trigger === "hover" &&
      event.pointerType === "mouse" &&
      isLooping(config) &&
      !run.requested
    ) {
      rest()
    }
  }

  const isCard = variant === "card"

  return (
    <div className={cn("flex flex-col", className)}>
      <div
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        className={cn(
          "relative flex items-center justify-center overflow-hidden bg-grid",
          isCard
            ? "h-44 rounded-t-xl"
            : cn(
                "rounded-xl border border-line",
                compact ? "min-h-44 sm:min-h-56 lg:min-h-96" : "min-h-72 sm:min-h-96",
              ),
        )}
      >
        <AnimationRenderer
          // Remounting per run *and* per config restarts the animation from fresh markup.
          key={`${active ? `run-${run.id}` : "rest"}:${signature}`}
          config={config}
          autoplay={active}
          paused={paused}
          interactive={!isCard}
        />

        {isCard && playable && (
          <Button
            size="icon-sm"
            variant="ghost"
            className="absolute top-2 right-2 bg-canvas/60 backdrop-blur"
            aria-label={`Replay ${label} preview`}
            onClick={() => replay(true)}
          >
            <RotateCcw />
          </Button>
        )}
      </div>

      {!isCard && (
        <div className="flex flex-wrap items-center gap-2 pt-3">
          {playable ? (
            <>
              <Button size="sm" onClick={() => replay(true)}>
                {active ? <RotateCcw aria-hidden /> : <Play aria-hidden />}
                {active ? "Replay" : "Play"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                disabled={!active}
                aria-pressed={paused}
                onClick={() => setPausedFor(paused ? null : signature)}
              >
                {paused ? <Play aria-hidden /> : <Pause aria-hidden />}
                {paused ? "Resume" : "Pause"}
              </Button>
              {reducedMotion && !active && (
                <p className="text-xs text-fg-subtle">
                  Reduced motion is on, so previews play only when you press Play.
                </p>
              )}
            </>
          ) : (
            <p className="flex items-center gap-2 text-sm text-fg-muted">
              <Hand aria-hidden className="size-4" />
              Interactive: hover, focus or press the element to preview.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
