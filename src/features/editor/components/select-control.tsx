"use client"

import { useId } from "react"
import { SelectInput } from "@/components/ui/field"
import type { SelectField } from "@/features/animations/model"
import { FieldHeader } from "./field-header"

interface SelectControlProps {
  name: string
  field: SelectField
  value: string
  modified: boolean
  onChange: (value: string) => void
}

export function SelectControl({ name, field, value, modified, onChange }: SelectControlProps) {
  const id = useId()
  return (
    <div className="flex flex-col gap-2">
      <FieldHeader htmlFor={id} label={field.label} name={name} modified={modified} />
      <SelectInput
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-9"
      >
        {field.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </SelectInput>
    </div>
  )
}
