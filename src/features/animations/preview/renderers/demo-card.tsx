import type { ComponentProps } from "react"
import { cn } from "@/lib/utils/cn"

/** Neutral placeholder content used as the subject of several demos. */
export function DemoCard({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex w-44 items-center gap-3 rounded-xl border border-line-strong bg-surface-overlay p-3 shadow-panel",
        className,
      )}
      {...props}
    >
      <span className="size-8 shrink-0 rounded-lg bg-accent-strong" />
      <span className="flex flex-1 flex-col gap-1.5">
        <span className="h-2 w-4/5 rounded-full bg-fg/70" />
        <span className="h-2 w-1/2 rounded-full bg-fg/25" />
      </span>
    </div>
  )
}
