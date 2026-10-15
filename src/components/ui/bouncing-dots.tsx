"use client"

import { motion } from "motion/react"
import type { ComponentProps } from "react"
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion"
import { cn } from "@/lib/utils/cn"

const sizes = { sm: "size-1.5", md: "size-2.5", lg: "size-3.5" }

type BouncingDotsProps = Omit<ComponentProps<"span">, "children"> & {
  /** Announced to screen readers. */
  label?: string
  size?: keyof typeof sizes
  /** Number of dots, 3–6. */
  count?: number
  /** Bounce height in px. */
  height?: number
  /** Milliseconds for one bounce up. */
  duration?: number
  /** Milliseconds between dots. */
  stagger?: number
}

/**
 * A loading indicator with a staggered bounce (Motion). Like Spinner, it is a
 * live status region, so its label is announced when it appears. With reduced
 * motion the dots stay still.
 */
export function BouncingDots({
  label = "Loading",
  size = "md",
  count = 3,
  height = 8,
  duration = 450,
  stagger: gap = 120,
  className,
  ...props
}: BouncingDotsProps) {
  const reduced = usePrefersReducedMotion()
  const dots = Math.min(6, Math.max(3, Math.round(count)))

  return (
    <span
      role="status"
      className={cn("inline-flex items-end gap-1 text-accent", className)}
      style={{ paddingTop: height }}
      {...props}
    >
      {Array.from({ length: dots }, (_, i) => (
        <motion.span
          key={i}
          data-dot
          aria-hidden
          className={cn("rounded-full bg-current", sizes[size])}
          // Animating back to rest (not removing `animate`) also stops a running bounce
          // when reduced motion is switched on.
          animate={reduced ? { y: 0 } : { y: [0, -height] }}
          transition={
            reduced
              ? { duration: 0 }
              : {
                  duration: duration / 1000,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: (i * gap) / 1000,
                }
          }
        />
      ))}
      <span className="sr-only">{label}</span>
    </span>
  )
}
