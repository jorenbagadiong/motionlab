import type { ComponentProps } from "react"
import { cn } from "@/lib/utils/cn"

/** A keyboard key, e.g. <Kbd>Esc</Kbd>. */
export function Kbd({ className, ...props }: ComponentProps<"kbd">) {
  return (
    <kbd
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded border border-b-2 border-line-strong bg-surface-raised px-1 font-mono text-[11px] font-medium text-fg-muted",
        className,
      )}
      {...props}
    />
  )
}
