import type { ComponentProps, ReactNode } from "react"
import { cn } from "@/lib/utils/cn"

type CheckboxProps = Omit<ComponentProps<"input">, "type"> & {
  label: ReactNode
  description?: ReactNode
}

/** Native checkbox tinted with the accent color, with a clickable label. */
export function Checkbox({ label, description, className, ...props }: CheckboxProps) {
  return (
    <label
      className={cn(
        "inline-flex cursor-pointer items-start gap-3 has-disabled:cursor-not-allowed has-disabled:opacity-50",
        className,
      )}
    >
      <input type="checkbox" className="mt-0.5 size-4 shrink-0 accent-accent-strong" {...props} />
      <span className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-fg">{label}</span>
        {description && <span className="text-sm text-fg-muted">{description}</span>}
      </span>
    </label>
  )
}
