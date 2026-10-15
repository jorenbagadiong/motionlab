import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from "lucide-react"
import type { ComponentProps, ReactNode } from "react"
import { cn } from "@/lib/utils/cn"

export type AlertTone = "info" | "success" | "warning" | "danger"

const tones: Record<AlertTone, { box: string; icon: string; Icon: typeof Info }> = {
  info: { box: "border-accent/30 bg-accent-soft", icon: "text-accent", Icon: Info },
  success: { box: "border-success/30 bg-success/10", icon: "text-success", Icon: CircleCheck },
  warning: { box: "border-warning/30 bg-warning/10", icon: "text-warning", Icon: TriangleAlert },
  danger: { box: "border-danger/30 bg-danger/10", icon: "text-danger", Icon: CircleAlert },
}

type AlertProps = Omit<ComponentProps<"div">, "title"> & {
  tone?: AlertTone
  title: ReactNode
  /** Shows a close button. */
  onDismiss?: () => void
  dismissLabel?: string
}

/**
 * A message box. It has no live-region role by default, because static
 * content should not be announced on page load. When you insert an alert in
 * response to an action, pass role="alert" (urgent) or role="status".
 */
export function Alert({
  tone = "info",
  title,
  children,
  onDismiss,
  dismissLabel = "Dismiss",
  className,
  ...props
}: AlertProps) {
  const { box, icon, Icon } = tones[tone]
  return (
    <div
      className={cn("flex gap-3 rounded-xl border p-4 text-sm", box, className)}
      data-tone={tone}
      {...props}
    >
      <Icon aria-hidden className={cn("mt-0.5 size-4 shrink-0", icon)} />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="font-medium text-fg">{title}</div>
        {children && <div className="text-fg-muted">{children}</div>}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label={dismissLabel}
          className="-m-1 flex size-6 shrink-0 items-center justify-center rounded-md text-fg-subtle transition-colors hover:bg-surface-overlay hover:text-fg"
        >
          <X aria-hidden className="size-4" />
        </button>
      )}
    </div>
  )
}
