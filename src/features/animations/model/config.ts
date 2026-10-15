import type { FieldMap } from "./fields"
import { fieldDefaults } from "./fields"
import {
  type AnimationConfig,
  AnimationConfigSchema,
  type ConfigFor,
  FAMILIES,
  type FamilyId,
} from "./families"

export function getFamily<F extends FamilyId>(id: F): (typeof FAMILIES)[F] {
  return FAMILIES[id]
}

export function isFamilyId(value: unknown): value is FamilyId {
  return typeof value === "string" && Object.hasOwn(FAMILIES, value)
}

/** Fields of a family, typed loosely for generic UI (tables, controls). */
export function familyFields(id: FamilyId): FieldMap {
  return FAMILIES[id].fields
}

export function defaultConfig<F extends FamilyId>(id: F): ConfigFor<F> {
  const family = FAMILIES[id]
  return {
    family: family.id,
    engine: family.engine,
    ...fieldDefaults(family.fields),
  } as ConfigFor<F>
}

export type ParseResult =
  { success: true; config: AnimationConfig } | { success: false; error: string }

/**
 * Validates untrusted configuration data (saved presets, URL state, forms).
 * Missing properties fall back to the family defaults; unknown properties,
 * out-of-range values and mismatched engines are rejected. Configurations are
 * plain data and are never evaluated as code.
 */
export function parseConfig(input: unknown): ParseResult {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return { success: false, error: "Configuration must be an object" }
  }
  const family = (input as { family?: unknown }).family
  if (!isFamilyId(family)) {
    return { success: false, error: "Unknown animation family" }
  }
  const result = AnimationConfigSchema.safeParse({ ...defaultConfig(family), ...input })
  if (!result.success) {
    const issue = result.error.issues[0]
    const path = issue?.path.join(".")
    return { success: false, error: path ? `${path}: ${issue.message}` : "Invalid configuration" }
  }
  return { success: true, config: result.data }
}

/** Whether the configured animation repeats indefinitely. */
export function isLooping(config: AnimationConfig): boolean {
  const family = FAMILIES[config.family]
  if (family.playback === "infinite") return true
  return "repeat" in config && config.repeat !== "none"
}

export function supportsPlaybackControls(config: AnimationConfig): boolean {
  return FAMILIES[config.family].playback !== "gesture"
}
