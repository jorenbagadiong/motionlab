"use client"

import { Check, Palette } from "lucide-react"
import { type KeyboardEvent, useEffect, useId, useRef, useState, useSyncExternalStore } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils/cn"
import {
  ACCENTS,
  type Accent,
  applyAccent,
  DEFAULT_ACCENT,
  readAccent,
  subscribeToAccent,
} from "./theme"

const getServerAccent = (): Accent => DEFAULT_ACCENT

/**
 * Color theme picker: a button that opens a small panel of accent swatches
 * (native radios, so arrow keys work). The panel stays open while choosing so
 * the page previews each color; Escape or a click outside closes it.
 */
export function AccentPicker() {
  const accent = useSyncExternalStore(subscribeToAccent, readAccent, getServerAccent)
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const panelId = useId()
  const name = useId()

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("pointerdown", onPointerDown)
    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [open])

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape" && open) {
      setOpen(false)
      toggleRef.current?.focus()
    }
  }

  return (
    <div ref={rootRef} className="relative" onKeyDown={handleKeyDown}>
      <Button
        ref={toggleRef}
        variant="ghost"
        size="icon"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label="Color theme"
        title="Color theme"
        onClick={() => setOpen(!open)}
      >
        <Palette className="text-accent" />
      </Button>
      <div
        id={panelId}
        hidden={!open}
        className="absolute top-full right-0 z-50 mt-2 w-44 rounded-xl border border-line bg-surface p-1.5 shadow-panel"
      >
        <fieldset>
          <legend className="px-2 pt-1 pb-1.5 text-xs font-medium text-fg-subtle">
            Color theme
          </legend>
          {ACCENTS.map(({ value, label, swatch }) => {
            const checked = accent === value
            return (
              <label
                key={value}
                className={cn(
                  "flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors has-focus-visible:outline-2 has-focus-visible:outline-accent",
                  checked
                    ? "bg-surface-overlay text-fg"
                    : "text-fg-muted hover:bg-surface-raised hover:text-fg",
                )}
              >
                <input
                  type="radio"
                  name={name}
                  value={value}
                  checked={checked}
                  onChange={() => applyAccent(value)}
                  className="sr-only"
                />
                <span
                  aria-hidden
                  className="flex size-4 items-center justify-center rounded-full ring-1 ring-line-strong ring-inset"
                  style={{ backgroundColor: swatch }}
                >
                  {checked && <Check className="size-3 text-white" strokeWidth={3} />}
                </span>
                {label}
              </label>
            )
          })}
        </fieldset>
      </div>
    </div>
  )
}
