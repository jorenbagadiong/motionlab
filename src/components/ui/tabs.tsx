"use client"

import { type KeyboardEvent, type ReactNode, useId, useRef, useState } from "react"
import { cn } from "@/lib/utils/cn"

export interface TabItem {
  id: string
  label: ReactNode
  content: ReactNode
}

interface TabsProps {
  items: TabItem[]
  /** Accessible name for the tab list. */
  label: string
  defaultValue?: string
  /** Controlled mode: pass both. */
  value?: string
  onValueChange?: (id: string) => void
  className?: string
}

/**
 * WAI-ARIA tabs: arrow keys move between tabs (and select them), Home/End jump
 * to the ends, and only the selected tab is in the Tab order.
 */
export function Tabs({ items, label, defaultValue, value, onValueChange, className }: TabsProps) {
  const [internal, setInternal] = useState(defaultValue ?? items[0]?.id)
  const selected = value ?? internal
  const baseId = useId()
  const tabRefs = useRef(new Map<string, HTMLButtonElement>())

  function select(id: string) {
    if (value === undefined) setInternal(id)
    onValueChange?.(id)
  }

  function handleKeyDown(event: KeyboardEvent) {
    const index = items.findIndex((item) => item.id === selected)
    const next = {
      ArrowRight: (index + 1) % items.length,
      ArrowLeft: (index - 1 + items.length) % items.length,
      Home: 0,
      End: items.length - 1,
    }[event.key]
    if (next === undefined) return
    event.preventDefault()
    const id = items[next]!.id
    select(id)
    tabRefs.current.get(id)?.focus()
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={handleKeyDown}
        className="flex w-fit max-w-full gap-1 overflow-x-auto rounded-lg border border-line bg-surface p-1"
      >
        {items.map((item) => {
          const active = item.id === selected
          return (
            <button
              key={item.id}
              ref={(node) => {
                if (node) tabRefs.current.set(item.id, node)
                else tabRefs.current.delete(item.id)
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${item.id}`}
              aria-selected={active}
              aria-controls={`${baseId}-panel-${item.id}`}
              tabIndex={active ? 0 : -1}
              onClick={() => select(item.id)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
                active ? "bg-surface-overlay text-fg" : "text-fg-muted hover:text-fg",
              )}
            >
              {item.label}
            </button>
          )
        })}
      </div>
      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={`${baseId}-panel-${item.id}`}
          aria-labelledby={`${baseId}-tab-${item.id}`}
          hidden={item.id !== selected}
          tabIndex={0}
          className="rounded-lg"
        >
          {item.content}
        </div>
      ))}
    </div>
  )
}
