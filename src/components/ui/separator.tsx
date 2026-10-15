import type { ComponentProps } from "react"
import { cn } from "@/lib/utils/cn"

type SeparatorProps = ComponentProps<"div"> & {
  orientation?: "horizontal" | "vertical"
  /** Purely visual by default; set false when it separates meaningful sections. */
  decorative?: boolean
}

export function Separator({
  orientation = "horizontal",
  decorative = true,
  className,
  ...props
}: SeparatorProps) {
  return (
    <div
      role={decorative ? "none" : "separator"}
      aria-orientation={decorative || orientation === "horizontal" ? undefined : orientation}
      className={cn(
        "shrink-0 bg-line",
        orientation === "horizontal" ? "h-px w-full" : "w-px self-stretch",
        className,
      )}
      {...props}
    />
  )
}
