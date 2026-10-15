/**
 * Small helpers for printing JSX source. Text from the playground's text
 * controls is user input, so anything JSX would interpret ({ } < > &, and
 * quotes in attributes) is emitted as a JS string expression instead of raw
 * text. Quotes in text are too, which keeps react/no-unescaped-entities happy.
 */

const SAFE_ATTRIBUTE = /^[^"\\{}<>&\n]*$/
const SAFE_TEXT = /^[^{}<>&"'\n]*$/

/** ` name="value"`, ` name={1}`, ` name` (true) or "" (false/undefined). */
export function attr(name: string, value: string | number | boolean | undefined): string {
  if (value === undefined || value === false) return ""
  if (value === true) return ` ${name}`
  if (typeof value === "number") return ` ${name}={${value}}`
  return SAFE_ATTRIBUTE.test(value) ? ` ${name}="${value}"` : ` ${name}={${JSON.stringify(value)}}`
}

/** A JSX child for plain text. Edge whitespace is preserved by using an expression. */
export function text(value: string): string {
  const plain = SAFE_TEXT.test(value) && value.trim() === value
  return plain ? value : `{${JSON.stringify(value)}}`
}

const MAX_LINE = 80

/**
 * Prints an element. `attrs` are outputs of attr(); empty strings are dropped.
 * Children are already-printed JSX lines (each entry may span several lines).
 */
export function element(tag: string, attrs: string[], children: string[] = []): string {
  const props = attrs.filter(Boolean)
  const inline = `<${tag}${props.join("")}`
  const fits = (extra: number) => !inline.includes("\n") && inline.length + extra <= MAX_LINE
  const stacked = `<${tag}\n${props.map((p) => indent(p.trim(), 2)).join("\n")}\n`
  const kids = children.filter(Boolean)

  if (kids.length === 0) return fits(3) ? `${inline} />` : `${stacked}/>`

  const open = fits(1) ? `${inline}>` : `${stacked}>`
  const single = kids.length === 1 && !kids[0]!.includes("\n")
  if (single && !open.includes("\n")) {
    const line = `${open}${kids[0]}</${tag}>`
    if (line.length <= MAX_LINE) return line
  }
  return `${open}\n${kids.map((kid) => indent(kid, 2)).join("\n")}\n</${tag}>`
}

export function indent(code: string, spaces: number): string {
  const pad = " ".repeat(spaces)
  return code
    .split("\n")
    .map((line) => (line ? pad + line : line))
    .join("\n")
}

interface ModuleOptions {
  /** e.g. [["lucide-react", ["Save"]], ["@/components/ui/button", ["Button"]]] */
  imports: [source: string, names: string[]][]
  /** Exported component name. */
  name: string
  /** JSX returned by the component. */
  jsx: string
  /** Statements before `return`, e.g. a useState line. */
  setup?: string[]
}

/** A complete, copy-ready module. Adds "use client" when the component uses hooks. */
export function moduleCode({ imports, name, jsx, setup = [] }: ModuleOptions): string {
  const client = setup.some((line) => /\buse[A-Z]\w*\(/.test(line))
  const importLines = imports
    .filter(([, names]) => names.length > 0)
    .map(([source, names]) => {
      const sorted = [...new Set(names)].sort()
      const line = `import { ${sorted.join(", ")} } from "${source}"`
      if (line.length <= MAX_LINE) return line
      return `import {\n${sorted.map((n) => `  ${n},`).join("\n")}\n} from "${source}"`
    })
  const body = [
    ...setup.map((line) => `  ${line}`),
    ...(setup.length ? [""] : []),
    jsx.includes("\n") ? `  return (\n${indent(jsx, 4)}\n  )` : `  return ${jsx}`,
  ]
  return [
    ...(client ? ['"use client"', ""] : []),
    ...importLines,
    "",
    `export function ${name}() {`,
    ...body,
    "}",
    "",
  ].join("\n")
}

/** ` name={expression}` for code (handlers, arrays); `expression` is trusted source. */
export function expr(name: string, expression: string): string {
  return ` ${name}={${expression}}`
}
