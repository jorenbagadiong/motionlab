"use client"

import { useId, useState } from "react"
import { type NumberField, formatNumber, roundToStep } from "@/features/animations/model"
import { cn } from "@/lib/utils/cn"
import { validateFieldInput } from "../editor-state"
import { FieldHeader } from "./field-header"

interface NumberControlProps {
  name: string
  field: NumberField
  value: number
  modified: boolean
  onChange: (value: number) => void
}

export function NumberControl({ name, field, value, modified, onChange }: NumberControlProps) {
  const sliderId = useId()
  const errorId = useId()
  const hintId = useId()
  // While typing, the input shows the raw draft. It is applied on Enter or blur
  // only if valid; otherwise the input reverts to the current value.
  const [draft, setDraft] = useState<string | null>(null)
  const error =
    draft === null ? null : validateFieldInput(field, draft === "" ? NaN : Number(draft))

  function commit() {
    if (draft !== null && error === null) onChange(roundToStep(field, Number(draft)))
    setDraft(null)
  }

  return (
    <div className="flex flex-col gap-2">
      <FieldHeader htmlFor={sliderId} label={field.label} name={name} modified={modified} />
      <div className="flex items-center gap-3">
        <input
          id={sliderId}
          type="range"
          min={field.min}
          max={field.max}
          step={field.step}
          value={value}
          aria-valuetext={formatNumber(value, field.unit)}
          aria-describedby={field.description ? hintId : undefined}
          onChange={(event) => {
            setDraft(null)
            onChange(roundToStep(field, Number(event.target.value)))
          }}
          className="h-1.5 flex-1 cursor-pointer accent-accent-strong"
        />
        <div className="relative w-24 shrink-0">
          <input
            type="number"
            inputMode="decimal"
            min={field.min}
            max={field.max}
            step={field.step}
            value={draft ?? String(value)}
            aria-label={`${field.label} value${field.unit ? ` (${field.unit})` : ""}`}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            onChange={(event) => setDraft(event.target.value)}
            onBlur={commit}
            onKeyDown={(event) => {
              if (event.key === "Enter") commit()
              if (event.key === "Escape") setDraft(null)
            }}
            className={cn(
              "h-8 w-full [appearance:textfield] rounded-md border bg-surface px-2 font-mono text-sm text-fg focus-visible:ring-2 focus-visible:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
              error
                ? "border-danger focus-visible:ring-danger/40"
                : "border-line focus-visible:border-accent focus-visible:ring-accent/40",
              field.unit && "pr-8",
            )}
          />
          {field.unit && (
            <span
              aria-hidden
              className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-xs text-fg-subtle"
            >
              {field.unit === "x" ? "×" : field.unit === "deg" ? "°" : field.unit}
            </span>
          )}
        </div>
      </div>
      {field.description && (
        <p id={hintId} className="text-xs text-fg-subtle">
          {field.description}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
