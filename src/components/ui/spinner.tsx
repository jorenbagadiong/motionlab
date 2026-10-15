import { LoaderCircle } from "lucide-react"
import type { ComponentProps } from "react"
import { cn } from "@/lib/utils/cn"

const sizes = { sm: "size-4", md: "size-5", lg: "size-8" }

type SpinnerProps = ComponentProps<"span"> & {
  /** Announced to screen readers. */
  label?: string
  size?: keyof typeof sizes
}

/** Loading indicator; a live status region, so its label is announced when it appears. */
export function Spinner({ label = "Loading", size = "md", className, ...props }: SpinnerProps) {
  return (
    <span role="status" className={cn("inline-flex text-accent", className)} {...props}>
      <LoaderCircle aria-hidden className={cn("animate-spin", sizes[size])} />
      <span className="sr-only">{label}</span>
    </span>
  )
}
