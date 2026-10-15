import {
  type AnimationConfig,
  familyFields,
  type FieldSpec,
  fieldSchema,
  formatNumber,
  parseConfig,
  type ParseResult,
} from "@/features/animations/model"

export type FieldValue = number | string

/**
 * Returns the config with one property changed, validated as a whole. The
 * family and engine are never editable, so a field update can't switch them.
 */
export function updateConfigField(
  config: AnimationConfig,
  key: string,
  value: FieldValue,
): ParseResult {
  if (key === "family" || key === "engine" || !Object.hasOwn(familyFields(config.family), key)) {
    return { success: false, error: `"${key}" is not a property of this animation` }
  }
  return parseConfig({ ...config, [key]: value })
}

/** Keys whose values differ between two configs of the same family. */
export function changedFields(config: AnimationConfig, base: AnimationConfig): string[] {
  const current = config as unknown as Record<string, unknown>
  const original = base as unknown as Record<string, unknown>
  return Object.keys(familyFields(config.family)).filter((key) => current[key] !== original[key])
}

/** Validates one raw input value for a field; returns a user-facing error or null. */
export function validateFieldInput(field: FieldSpec, value: unknown): string | null {
  if (fieldSchema(field).safeParse(value).success) return null
  if (field.kind === "select") return "Choose one of the listed options"
  const range = `${formatNumber(field.min, field.unit)} and ${formatNumber(field.max, field.unit)}`
  return field.integer ? `Enter a whole number between ${range}` : `Enter a value between ${range}`
}
