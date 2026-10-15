"use client"

import { useId } from "react"
import { SelectInput, TextInput } from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"
import { FieldHeader } from "@/features/editor/components/field-header"
import { cn } from "@/lib/utils/cn"
import type { Control, Controls, ControlValue } from "../model"

interface ControlProps<C extends Control> {
  name: string
  control: C
  value: ControlValue
  modified: boolean
  onChange: (value: ControlValue) => void
}

/** Up to three options: a segmented radio group. More: a native select. */
function SelectControl({
  name,
  control,
  value,
  modified,
  onChange,
}: ControlProps<Extract<Control, { kind: "select" }>>) {
  const id = useId()
  if (control.options.length > 3) {
    return (
      <div className="flex flex-col gap-2">
        <FieldHeader htmlFor={id} label={control.label} name={name} modified={modified} />
        <SelectInput
          id={id}
          value={String(value)}
          onChange={(event) => onChange(event.target.value)}
          className="h-9"
        >
          {control.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </SelectInput>
      </div>
    )
  }
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="contents">
        <span className="flex items-baseline justify-between gap-2">
          <span className="text-sm font-medium text-fg">
            {control.label}
            {modified && (
              <>
                {" "}
                <span aria-hidden className="ml-0.5 inline-block size-1.5 rounded-full bg-accent" />
                <span className="sr-only">(modified)</span>
              </>
            )}
          </span>
          <code className="font-mono text-xs text-fg-subtle">{name}</code>
        </span>
      </legend>
      <div className="grid auto-cols-fr grid-flow-col gap-1 rounded-lg border border-line bg-canvas p-1">
        {control.options.map((option) => {
          const checked = value === option
          return (
            <label
              key={option}
              className={cn(
                "cursor-pointer rounded-md px-2 py-1 text-center text-sm transition-colors has-focus-visible:outline-2 has-focus-visible:outline-accent",
                checked ? "bg-surface-overlay font-medium text-fg" : "text-fg-muted hover:text-fg",
              )}
            >
              <input
                type="radio"
                name={id}
                value={option}
                checked={checked}
                onChange={() => onChange(option)}
                className="sr-only"
              />
              {option}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

function TextControl({
  name,
  control,
  value,
  modified,
  onChange,
}: ControlProps<Extract<Control, { kind: "text" }>>) {
  const id = useId()
  return (
    <div className="flex flex-col gap-2">
      <FieldHeader htmlFor={id} label={control.label} name={name} modified={modified} />
      <TextInput
        id={id}
        value={String(value)}
        maxLength={control.maxLength}
        onChange={(event) => onChange(event.target.value)}
        className="h-9"
      />
    </div>
  )
}

function NumberControl({
  name,
  control,
  value,
  modified,
  onChange,
}: ControlProps<Extract<Control, { kind: "number" }>>) {
  const id = useId()
  return (
    <div className="flex flex-col gap-2">
      <FieldHeader htmlFor={id} label={control.label} name={name} modified={modified} />
      <div className="flex items-center gap-3">
        <input
          id={id}
          type="range"
          min={control.min}
          max={control.max}
          step={control.step}
          value={Number(value)}
          onChange={(event) => onChange(Number(event.target.value))}
          className="h-1.5 flex-1 cursor-pointer accent-accent-strong"
        />
        <output htmlFor={id} className="w-8 text-right font-mono text-sm text-fg">
          {value}
        </output>
      </div>
    </div>
  )
}

function BooleanControl({
  name,
  control,
  value,
  modified,
  onChange,
}: ControlProps<Extract<Control, { kind: "boolean" }>>) {
  return (
    <div className="flex items-center justify-between gap-2">
      <Switch
        label={
          <>
            {control.label}
            {modified && (
              // The space is its own text node; inside the hidden span it would be dropped.
              <>
                {" "}
                <span className="sr-only">(modified)</span>
              </>
            )}
          </>
        }
        checked={Boolean(value)}
        onChange={(event) => onChange(event.target.checked)}
      />
      <code className="font-mono text-xs text-fg-subtle">{name}</code>
    </div>
  )
}

interface PropControlsProps {
  controls: Controls
  values: Record<string, ControlValue>
  changed: string[]
  onChange: (name: string, value: ControlValue) => void
}

export function PropControls({ controls, values, changed, onChange }: PropControlsProps) {
  return (
    <div className="flex flex-col gap-5">
      {Object.entries(controls).map(([name, control]) => {
        const props = {
          name,
          value: values[name]!,
          modified: changed.includes(name),
          onChange: (value: ControlValue) => onChange(name, value),
        }
        switch (control.kind) {
          case "select":
            return <SelectControl key={name} control={control} {...props} />
          case "text":
            return <TextControl key={name} control={control} {...props} />
          case "number":
            return <NumberControl key={name} control={control} {...props} />
          case "boolean":
            return <BooleanControl key={name} control={control} {...props} />
        }
      })}
    </div>
  )
}
