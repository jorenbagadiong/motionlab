"use client"

import { X } from "lucide-react"
import { type MouseEvent, type ReactNode, useEffect, useId, useRef } from "react"
import { cn } from "@/lib/utils/cn"

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: ReactNode
  description?: ReactNode
  children?: ReactNode
  /** Actions row, e.g. Cancel / Confirm buttons. */
  footer?: ReactNode
  className?: string
}

/**
 * Modal dialog on the native <dialog> element: the browser traps focus, makes
 * the page behind it inert, closes on Escape and returns focus to the button
 * that opened it. A click on the backdrop also closes it.
 */
export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className,
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    else if (!open && dialog.open) dialog.close()
  }, [open])

  function handleClick(event: MouseEvent<HTMLDialogElement>) {
    // The dialog box fills the element, so a click on the element itself is the backdrop.
    if (event.target === event.currentTarget) onOpenChange(false)
  }

  return (
    // Escape is handled natively; the click handler only adds backdrop dismissal.
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onClose={() => onOpenChange(false)}
      onClick={handleClick}
      className={cn(
        "m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-line bg-surface p-0 text-fg shadow-panel backdrop:bg-black/60 backdrop:backdrop-blur-sm",
        className,
      )}
    >
      <div className="flex flex-col gap-4 p-5">
        <div className="flex items-start gap-3">
          <div className="flex flex-1 flex-col gap-1.5">
            <h2 id={titleId} className="text-lg font-semibold">
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="text-sm text-fg-muted">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close"
            className="-m-1 flex size-8 shrink-0 items-center justify-center rounded-lg text-fg-subtle transition-colors hover:bg-surface-raised hover:text-fg"
          >
            <X aria-hidden className="size-4" />
          </button>
        </div>
        {children}
      </div>
      {footer && (
        <div className="flex flex-wrap justify-end gap-2 border-t border-line px-5 py-3">
          {footer}
        </div>
      )}
    </dialog>
  )
}
