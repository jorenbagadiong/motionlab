"use client"

import { type AnimationConfig, familyFields } from "@/features/animations/model"
import type { FieldValue } from "../editor-state"
import { NumberControl } from "./number-control"
import { SelectControl } from "./select-control"

interface ConfigControlsProps {
  config: AnimationConfig
  changed: readonly string[]
  onChange: (key: string, value: FieldValue) => void
}

/** Renders a control for each property the config's family supports, and nothing else. */
export function ConfigControls({ config, changed, onChange }: ConfigControlsProps) {
  const values = config as unknown as Record<string, FieldValue>
  return (
    <div className="flex flex-col gap-5">
      {Object.entries(familyFields(config.family)).map(([key, field]) =>
        field.kind === "number" ? (
          <NumberControl
            key={key}
            name={key}
            field={field}
            value={Number(values[key])}
            modified={changed.includes(key)}
            onChange={(value) => onChange(key, value)}
          />
        ) : (
          <SelectControl
            key={key}
            name={key}
            field={field}
            value={String(values[key])}
            modified={changed.includes(key)}
            onChange={(value) => onChange(key, value)}
          />
        ),
      )}
    </div>
  )
}
