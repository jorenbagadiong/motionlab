import type { ComponentProps } from "react"
import { cn } from "@/lib/utils/cn"

/** Placeholder shape while content loads. Hidden from screen readers; announce loading elsewhere. */
export function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      aria-hidden
      className={cn("animate-pulse rounded-md bg-surface-overlay", className)}
      {...props}
    />
  )
}
