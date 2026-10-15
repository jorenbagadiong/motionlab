import type { FieldSpec, NumberField, NumberUnit } from "./fields"

const UNIT_SUFFIX: Record<NumberUnit, string> = { ms: " ms", px: " px", deg: "°", x: "×" }

export function formatNumber(value: number, unit?: NumberUnit): string {
  return `${value}${unit ? UNIT_SUFFIX[unit] : ""}`
}

export function formatFieldValue(field: FieldSpec, value: unknown): string {
  if (field.kind === "select") {
    return field.options.find((option) => option.value === value)?.label ?? String(value)
  }
  return formatNumber(Number(value), field.unit)
}

export function formatFieldRange(field: FieldSpec): string {
  if (field.kind === "select") return field.options.map((option) => option.label).join(", ")
  return `${formatNumber(field.min, field.unit)} – ${formatNumber(field.max, field.unit)}`
}

function stepDecimals(step: number): number {
  return step.toString().split(".")[1]?.length ?? 0
}

/** Rounds to the field's step precision, removing floating-point noise from sliders. */
export function roundToStep(field: NumberField, value: number): number {
  return Number(value.toFixed(stepDecimals(field.step)))
}
