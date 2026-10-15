import type { ComponentProps } from "react"
import { cn } from "@/lib/utils/cn"

type ProgressProps = Omit<ComponentProps<"div">, "role"> & {
  /** 0–100. Leave undefined for an indeterminate bar. */
  value?: number
  /** Accessible name, e.g. "Upload progress". */
  label: string
}

export function Progress({ value, label, className, ...props }: ProgressProps) {
  const clamped = value === undefined ? undefined : Math.min(100, Math.max(0, value))
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
      className={cn("h-2 w-full overflow-hidden rounded-full bg-surface-overlay", className)}
      {...props}
    >
      <div
        className={cn(
          "h-full rounded-full bg-accent-strong transition-[width] duration-300",
          clamped === undefined && "w-1/3 animate-pulse",
        )}
        style={clamped === undefined ? undefined : { width: `${clamped}%` }}
      />
    </div>
  )
}
