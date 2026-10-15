"use client"

import { Monitor, Moon, Sun } from "lucide-react"
import { useId, useSyncExternalStore } from "react"
import { cn } from "@/lib/utils/cn"
import { applyTheme, readTheme, subscribeToTheme, type Theme } from "./theme"

const OPTIONS: { value: Theme; label: string; Icon: typeof Sun }[] = [
  { value: "system", label: "System", Icon: Monitor },
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
]

const getServerTheme = (): Theme => "system"

/** System / Light / Dark switch built from native radio inputs (arrow keys work). */
export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeToTheme, readTheme, getServerTheme)
  const name = useId()

  return (
    <fieldset className="flex items-center rounded-lg border border-line bg-surface p-0.5">
      <legend className="sr-only">Theme</legend>
      {OPTIONS.map(({ value, label, Icon }) => {
        const checked = theme === value
        return (
          <label
            key={value}
            title={label}
            className={cn(
              "flex size-7 cursor-pointer items-center justify-center rounded-md transition-colors has-focus-visible:outline-2 has-focus-visible:outline-offset-1 has-focus-visible:outline-accent",
              checked ? "bg-surface-overlay text-fg" : "text-fg-subtle hover:text-fg",
            )}
          >
            <input
              type="radio"
              name={name}
              value={value}
              checked={checked}
              onChange={() => applyTheme(value)}
              className="sr-only"
            />
            <Icon aria-hidden className="size-4" />
            <span className="sr-only">{label}</span>
          </label>
        )
      })}
    </fieldset>
  )
}
