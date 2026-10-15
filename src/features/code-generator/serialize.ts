/**
 * Serializes plain config values into readable JavaScript source. Only data
 * types used by animation configs are supported; `raw` marks code fragments
 * (such as `stagger(...)` calls) that must be emitted verbatim.
 */

class RawCode {
  constructor(readonly code: string) {}
}

export function raw(code: string): RawCode {
  return new RawCode(code)
}

export type CodeValue =
  | number
  | string
  | boolean
  | RawCode
  | readonly CodeValue[]
  // Undefined properties are omitted, matching JSON.stringify and object spread semantics.
  | { readonly [key: string]: CodeValue | undefined }

const IDENTIFIER = /^[A-Za-z_$][\w$]*$/
const INLINE_LIMIT = 64

function formatNumber(value: number): string {
  if (value === Infinity) return "Infinity"
  if (value === -Infinity) return "-Infinity"
  if (!Number.isFinite(value)) throw new Error(`Cannot serialize ${value}`)
  // Normalizes -0 to 0 and strips float noise such as 0.30000000000000004.
  return String(Number(value.toPrecision(12)))
}

function formatKey(key: string): string {
  return IDENTIFIER.test(key) ? key : JSON.stringify(key)
}

/** Serializes `value`; nested lines are indented relative to `indent` spaces. */
export function toCode(value: CodeValue, indent = 0): string {
  if (value instanceof RawCode) return value.code
  if (typeof value === "number") return formatNumber(value)
  if (typeof value === "string") return JSON.stringify(value)
  if (typeof value === "boolean") return String(value)
  if (Array.isArray(value)) return `[${value.map((item) => toCode(item, indent)).join(", ")}]`

  const entries = Object.entries(value as { [key: string]: CodeValue | undefined }).filter(
    (entry): entry is [string, CodeValue] => entry[1] !== undefined,
  )
  if (entries.length === 0) return "{}"
  const inline = `{ ${entries.map(([k, v]) => `${formatKey(k)}: ${toCode(v, indent)}`).join(", ")} }`
  if (inline.length <= INLINE_LIMIT && !inline.includes("\n")) return inline

  const pad = " ".repeat(indent + 2)
  const lines = entries.map(([k, v]) => `${pad}${formatKey(k)}: ${toCode(v, indent + 2)},`)
  return `{\n${lines.join("\n")}\n${" ".repeat(indent)}}`
}

/** Converts "Character Rise" → "CharacterRise" (component) or "characterRise" (function). */
export function toIdentifier(name: string, style: "pascal" | "camel"): string {
  const words = name.match(/[A-Za-z0-9]+/g) ?? ["Animation"]
  const pascal = words.map((w) => w[0]!.toUpperCase() + w.slice(1).toLowerCase()).join("")
  const safe = /^[0-9]/.test(pascal) ? `Animation${pascal}` : pascal
  return style === "pascal" ? safe : safe[0]!.toLowerCase() + safe.slice(1)
}

export function toFileName(name: string): string {
  return (name.match(/[A-Za-z0-9]+/g) ?? ["animation"]).join("-").toLowerCase()
}
