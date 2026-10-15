import type { ComponentProps, ReactNode } from "react"
import { cn } from "@/lib/utils/cn"

type SwitchProps = Omit<ComponentProps<"input">, "type" | "role"> & {
  label: ReactNode
  description?: ReactNode
}

/**
 * On/off toggle. A native checkbox with role="switch", so it works with forms,
 * the Space key and screen readers; `checked`/`onChange` as usual.
 */
export function Switch({ label, description, className, ...props }: SwitchProps) {
  return (
    <label
      className={cn(
        "inline-flex cursor-pointer items-start gap-3 has-disabled:cursor-not-allowed has-disabled:opacity-50",
        className,
      )}
    >
      <input type="checkbox" role="switch" className="peer sr-only" {...props} />
      <span
        aria-hidden
        className="relative mt-0.5 h-5 w-9 shrink-0 rounded-full bg-fg-subtle/70 transition-colors peer-checked:bg-accent-strong peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent after:absolute after:top-0.5 after:left-0.5 after:size-4 after:rounded-full after:bg-white after:shadow-sm after:transition-transform peer-checked:after:translate-x-4"
      />
      <span className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-fg">{label}</span>
        {description && <span className="text-sm text-fg-muted">{description}</span>}
      </span>
    </label>
  )
}
