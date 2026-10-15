"use client"

import { MotionConfig, motion } from "motion/react"
import { hoverLiftProps } from "../../adapters/motion"
import type { ConfigFor } from "../../model"
import type { RendererProps } from "../types"

export default function HoverLiftPreview({
  config,
  interactive,
}: RendererProps<ConfigFor<"hover-lift">>) {
  return (
    // "user" honours prefers-reduced-motion by disabling transform animations.
    <MotionConfig reducedMotion="user">
      <motion.button
        type="button"
        tabIndex={interactive ? 0 : -1}
        aria-label="Hover lift demo: hover, focus or press to preview"
        className="flex h-24 w-44 cursor-pointer flex-col justify-end rounded-xl border border-line-strong bg-linear-to-br from-surface-overlay to-surface-raised p-3 text-left shadow-panel"
        {...hoverLiftProps(config)}
      >
        <span className="text-sm font-medium text-fg">Hover me</span>
        <span className="text-xs text-fg-subtle">or focus / press</span>
      </motion.button>
    </MotionConfig>
  )
}
