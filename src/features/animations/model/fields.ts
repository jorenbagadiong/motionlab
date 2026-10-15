import { z } from "zod"

/**
 * Field specs describe one configurable animation property: its label, valid
 * range and default. Each spec is the single source of truth for both the Zod
 * validator and the editor control, so the two can never drift apart.
 */

export type NumberUnit = "ms" | "px" | "deg" | "x"

export interface NumberField {
  kind: "number"
  label: string
  description?: string
  min: number
  max: number
  step: number
  default: number
  unit?: NumberUnit
  integer?: boolean
}

export interface SelectOption<T extends string> {
  value: T
  label: string
}

export interface SelectField<T extends string = string> {
  kind: "select"
  label: string
  description?: string
  options: readonly SelectOption<T>[]
  default: T
}

export type FieldSpec = NumberField | SelectField

export type FieldMap = Record<string, FieldSpec>

export type FieldValue<F extends FieldSpec> = F extends SelectField<infer T> ? T : number

export type FieldValues<M extends FieldMap> = { -readonly [K in keyof M]: FieldValue<M[K]> }

export function numberField(spec: Omit<NumberField, "kind">): NumberField {
  if (spec.min > spec.max) throw new Error(`Invalid range for "${spec.label}"`)
  if (spec.default < spec.min || spec.default > spec.max) {
    throw new Error(`Default for "${spec.label}" is outside its range`)
  }
  return { kind: "number", ...spec }
}

export function selectField<const T extends string>(
  spec: Omit<SelectField<T>, "kind">,
): SelectField<T> {
  if (!spec.options.some((option) => option.value === spec.default)) {
    throw new Error(`Default for "${spec.label}" is not one of its options`)
  }
  return { kind: "select", ...spec }
}

type ZodFor<F extends FieldSpec> = z.ZodType<FieldValue<F>>

export function fieldSchema<F extends FieldSpec>(field: F): ZodFor<F> {
  if (field.kind === "select") {
    const values = field.options.map((option) => option.value) as [string, ...string[]]
    return z.enum(values) as unknown as ZodFor<F>
  }
  let schema = z.number().min(field.min).max(field.max)
  if (field.integer) schema = schema.int()
  return schema as unknown as ZodFor<F>
}

export function fieldsShape<M extends FieldMap>(fields: M): { [K in keyof M]: ZodFor<M[K]> } {
  const entries = Object.entries(fields).map(([key, field]) => [key, fieldSchema(field)])
  return Object.fromEntries(entries) as { [K in keyof M]: ZodFor<M[K]> }
}

export function fieldDefaults<M extends FieldMap>(fields: M): FieldValues<M> {
  const entries = Object.entries(fields).map(([key, field]) => [key, field.default])
  return Object.fromEntries(entries) as FieldValues<M>
}
