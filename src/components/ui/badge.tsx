import type { ComponentProps } from "react"
import { cn } from "@/lib/utils/cn"

type Tone = "neutral" | "accent" | "success" | "warning" | "danger" | "motion" | "anime"

const tones: Record<Tone, string> = {
  neutral: "border-line bg-surface-raised text-fg-muted",
  accent: "border-accent/30 bg-accent-soft text-accent",
  success: "border-success/30 bg-success/10 text-success",
  warning: "border-warning/30 bg-warning/10 text-warning",
  danger: "border-danger/30 bg-danger/10 text-danger",
  motion: "border-engine-motion/30 bg-engine-motion/10 text-engine-motion",
  anime: "border-engine-anime/30 bg-engine-anime/10 text-engine-anime",
}

type BadgeProps = ComponentProps<"span"> & { tone?: Tone }

export function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
      {...props}
    />
  )
}
