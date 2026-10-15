"use client"

import { motion } from "motion/react"
import type { ComponentProps } from "react"
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion"
import { cn } from "@/lib/utils/cn"

const sizes = {
  sm: { box: "size-6", core: "size-1.5", lead: "size-1.5", trail: "size-1" },
  md: { box: "size-10", core: "size-2.5", lead: "size-2", trail: "size-1.5" },
  lg: { box: "size-16", core: "size-4", lead: "size-3", trail: "size-2" },
}

type OrbitSpinnerProps = Omit<ComponentProps<"span">, "children"> & {
  /** Announced to screen readers. */
  label?: string
  size?: keyof typeof sizes
  /** Milliseconds per revolution. */
  duration?: number
  direction?: "clockwise" | "counterclockwise"
}

/**
 * Two satellites orbiting a core (Motion): a calmer alternative to a spinner.
 * A live status region; with reduced motion the satellites stay still.
 */
export function OrbitSpinner({
  label = "Loading",
  size = "md",
  duration = 1200,
  direction = "clockwise",
  className,
  ...props
}: OrbitSpinnerProps) {
  const reduced = usePrefersReducedMotion()
  const s = sizes[size]

  return (
    <span
      role="status"
      className={cn("relative inline-block shrink-0", s.box, className)}
      {...props}
    >
      <span
        aria-hidden
        className="absolute inset-0 rounded-full border border-dashed border-line-strong"
      />
      <span
        aria-hidden
        className={cn(
          "absolute top-1/2 left-1/2 -translate-1/2 rounded-full bg-accent-strong",
          s.core,
        )}
      />
      <motion.span
        aria-hidden
        data-orbit
        className="absolute inset-0"
        animate={{ rotate: reduced ? 0 : direction === "clockwise" ? 360 : -360 }}
        transition={
          reduced
            ? { duration: 0 }
            : { duration: duration / 1000, ease: "linear", repeat: Infinity }
        }
      >
        <span
          className={cn("absolute top-0 left-1/2 -translate-1/2 rounded-full bg-accent", s.lead)}
        />
        <span
          className={cn(
            "absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rounded-full bg-engine-motion",
            s.trail,
          )}
        />
      </motion.span>
      <span className="sr-only">{label}</span>
    </span>
  )
}
