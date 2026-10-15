// @vitest-environment node
import fs from "node:fs"
import path from "node:path"
import ts from "typescript"
import { describe, expect, it } from "vitest"
import { type ControlValue, initialValues } from "@/features/component-library/model"
import { COMPONENT_LIST } from "@/features/component-library/registry"

/**
 * Type-checks the playground's generated code against the real components,
 * for the initial values, every select option, every boolean flipped, number
 * extremes, and text full of characters JSX would otherwise misread.
 */
const OUT_DIR = path.resolve("node_modules/.cache/motionlab-component-code")
const TRICKY = `Say "hi" & {x} <b> it's`

function variants() {
  const cases: { name: string; code: string }[] = []
  for (const doc of COMPONENT_LIST) {
    const base = initialValues(doc.controls)
    const add = (label: string, values: Record<string, ControlValue>) =>
      cases.push({ name: `${doc.slug}-${label}`, code: doc.code(values) })
    add("initial", base)
    for (const [key, control] of Object.entries(doc.controls)) {
      if (control.kind === "select") {
        for (const option of control.options) add(`${key}-${option}`, { ...base, [key]: option })
      } else if (control.kind === "boolean") {
        add(`${key}-flipped`, { ...base, [key]: !control.initial })
      } else if (control.kind === "number") {
        add(`${key}-min`, { ...base, [key]: control.min })
        add(`${key}-max`, { ...base, [key]: control.max })
      } else {
        add(`${key}-tricky`, { ...base, [key]: TRICKY })
        add(`${key}-empty`, { ...base, [key]: "" })
      }
    }
  }
  return cases
}

function compile(files: string[]): string[] {
  const program = ts.createProgram(files, {
    strict: true,
    noEmit: true,
    skipLibCheck: true,
    jsx: ts.JsxEmit.ReactJSX,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    target: ts.ScriptTarget.ES2022,
    lib: ["lib.es2022.d.ts", "lib.dom.d.ts", "lib.dom.iterable.d.ts"],
    paths: { "@/*": [path.resolve("src/*")] },
    types: [],
  })
  return ts
    .getPreEmitDiagnostics(program)
    .filter((d) => d.file?.fileName.startsWith(OUT_DIR))
    .map((d) => {
      const where = d.file ? `${path.basename(d.file.fileName)}: ` : ""
      return where + ts.flattenDiagnosticMessageText(d.messageText, "\n")
    })
}

describe("generated component code", () => {
  it("type-checks for every control value", () => {
    fs.rmSync(OUT_DIR, { recursive: true, force: true })
    fs.mkdirSync(OUT_DIR, { recursive: true })
    const files = variants().map(({ name, code }) => {
      const file = path.join(OUT_DIR, `${name.replace(/[^\w-]/g, "_")}.tsx`)
      fs.writeFileSync(file, code)
      return file
    })
    expect(files.length).toBeGreaterThan(50)
    expect(compile(files)).toEqual([])
  }, 120_000)

  it("keeps tricky text intact as a string", () => {
    const button = COMPONENT_LIST.find((d) => d.slug === "button")!
    const code = button.code({ ...initialValues(button.controls), label: TRICKY })
    expect(code).toContain(`{${JSON.stringify(TRICKY)}}`)
  })
})
