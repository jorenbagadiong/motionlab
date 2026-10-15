"use client"

import { animate, createDrawable, stagger, utils } from "animejs"
import { type ReactNode, useRef } from "react"
import { type AnimeTrigger, useAnimeTrigger } from "@/lib/hooks/use-anime-trigger"
import { cn } from "@/lib/utils/cn"

export type TextHighlightVariant = "underline" | "squiggle" | "box" | "circle" | "strike" | "marker"

interface TextHighlightProps {
  children?: ReactNode
  variant?: TextHighlightVariant
  /** Milliseconds to draw the mark. */
  duration?: number
  delay?: number
  trigger?: AnimeTrigger
  replay?: boolean
  className?: string
}

interface Mark {
  viewBox: string
  paths: string[]
  /** Where the SVG sits relative to the text (an SVG needs explicit width and height). */
  className: string
}

const MARKS: Record<Exclude<TextHighlightVariant, "marker">, Mark> = {
  underline: {
    viewBox: "0 0 100 10",
    paths: ["M2 6 Q 50 2 98 6"],
    className: "left-0 -bottom-[0.2em] h-[0.4em] w-full",
  },
  squiggle: {
    viewBox: "0 0 100 10",
    paths: ["M1 5 Q 7 1 13 5 T 25 5 T 37 5 T 49 5 T 61 5 T 73 5 T 85 5 T 99 5"],
    className: "left-0 -bottom-[0.25em] h-[0.4em] w-full",
  },
  strike: {
    viewBox: "0 0 100 10",
    paths: ["M1 6 L 99 4"],
    className: "top-[calc(50%-0.2em)] left-0 h-[0.4em] w-full",
  },
  box: {
    viewBox: "0 0 100 40",
    paths: ["M14 2 L2 2 L2 38 L14 38", "M86 2 L98 2 L98 38 L86 38"],
    className: "-top-[0.1em] -left-[0.3em] h-[calc(100%+0.2em)] w-[calc(100%+0.6em)]",
  },
  circle: {
    viewBox: "0 0 100 40",
    paths: ["M54 3 C 86 2 98 12 98 21 C 98 31 80 38 50 38 C 19 38 2 30 2 20 C 2 10 20 3 46 5"],
    className: "-top-[0.25em] -left-[0.4em] h-[calc(100%+0.5em)] w-[calc(100%+0.8em)]",
  },
}

/**
 * Draws a mark around or under some text (Anime.js `createDrawable`). Without
 * JavaScript, or with reduced motion, the mark is simply shown.
 */
export function TextHighlight({
  children,
  variant = "underline",
  duration = 800,
  delay = 200,
  trigger = "inView",
  replay = false,
  className,
}: TextHighlightProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const mark = variant === "marker" ? undefined : MARKS[variant]

  useAnimeTrigger(ref, {
    trigger,
    replay,
    key: `${variant}|${duration}|${delay}`,
    prepare: (root) => {
      if (!mark) return utils.set(root.querySelector("[data-marker]")!, { scaleX: 0 })
      return animate(createDrawable(root.querySelectorAll("[data-mark]")), {
        draw: "0 0",
        duration: 0,
      })
    },
    play: (root) => {
      if (!mark) {
        return animate(root.querySelector("[data-marker]")!, {
          scaleX: [0, 1],
          duration,
          delay,
          ease: "outExpo",
        })
      }
      return animate(createDrawable(root.querySelectorAll("[data-mark]")), {
        draw: ["0 0", "0 1"],
        duration,
        delay: stagger(duration * 0.6, { start: delay }),
        ease: "inOutQuad",
      })
    },
  })

  return (
    <span ref={ref} className={cn("relative isolate inline-block whitespace-nowrap", className)}>
      {variant === "marker" && (
        <span
          data-marker
          aria-hidden
          className="absolute inset-x-[-0.15em] inset-y-[0.1em] -z-10 origin-left rounded-sm bg-accent-soft"
        />
      )}
      <span className="relative">{children}</span>
      {mark && (
        <svg
          aria-hidden
          viewBox={mark.viewBox}
          preserveAspectRatio="none"
          fill="none"
          className={cn(
            "pointer-events-none absolute overflow-visible text-accent",
            mark.className,
          )}
        >
          {mark.paths.map((d) => (
            <path
              key={d}
              data-mark
              d={d}
              stroke="currentColor"
              strokeWidth={variant === "box" || variant === "circle" ? 2.5 : 3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </svg>
      )}
    </span>
  )
}
