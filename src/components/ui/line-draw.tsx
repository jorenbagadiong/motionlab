"use client"

import { animate, createDrawable, stagger } from "animejs"
import { type ComponentProps, useRef } from "react"
import { type AnimeTrigger, useAnimeTrigger } from "@/lib/hooks/use-anime-trigger"
import { cn } from "@/lib/utils/cn"

const SHAPES = "path, line, polyline, polygon, circle, ellipse, rect"

type LineDrawProps = Omit<ComponentProps<"svg">, "ref"> & {
  /** Accessible name. Without it the drawing is decorative (aria-hidden). */
  label?: string
  /** Milliseconds to draw one shape. */
  duration?: number
  /** Milliseconds between shapes. */
  stagger?: number
  delay?: number
  /** `alternate` draws on, then retracts, forever; `loop` redraws forever. */
  repeat?: "none" | "loop" | "alternate"
  trigger?: AnimeTrigger
  replay?: boolean
}

/**
 * An SVG whose strokes draw themselves on (Anime.js `createDrawable`). Put any
 * shapes inside; each one draws in turn. Without JavaScript, or with reduced
 * motion, the drawing is simply shown.
 */
export function LineDraw({
  label,
  duration = 1600,
  stagger: gap = 150,
  delay = 0,
  repeat = "none",
  trigger = "mount",
  replay = false,
  className,
  children,
  ...props
}: LineDrawProps) {
  const ref = useRef<SVGSVGElement>(null)

  useAnimeTrigger(ref, {
    trigger,
    replay,
    key: `${duration}|${gap}|${delay}|${repeat}`,
    prepare: (svg) =>
      animate(createDrawable(svg.querySelectorAll(SHAPES)), { draw: "0 0", duration: 0 }),
    play: (svg) =>
      animate(createDrawable(svg.querySelectorAll(SHAPES)), {
        draw: ["0 0", "0 1"],
        duration,
        ease: "inOutSine",
        delay: stagger(gap, { start: delay }),
        loop: repeat !== "none",
        alternate: repeat === "alternate",
      }),
  })

  return (
    <svg
      ref={ref}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("text-accent", className)}
      {...props}
    >
      {children}
    </svg>
  )
}
