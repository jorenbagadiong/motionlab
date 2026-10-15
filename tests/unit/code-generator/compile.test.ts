// @vitest-environment node
import fs from "node:fs"
import path from "node:path"
import ts from "typescript"
import { describe, expect, it } from "vitest"
import {
  type AnimationConfig,
  defaultConfig,
  familyFields,
  type FamilyId,
  FAMILIES,
} from "@/features/animations/model"
import { generateCode } from "@/features/code-generator/generate"
import { BUILT_IN_PRESETS } from "@/features/presets/catalog"

/**
 * Type-checks generated snippets against the installed `motion` and `animejs`
 * type definitions, so a snippet using a wrong API or invalid syntax fails.
 * Files go under node_modules/.cache so module resolution finds the packages.
 */
const OUT_DIR = path.resolve("node_modules/.cache/motionlab-codegen")

/** Every option of every select field, so each code path is compiled once. */
function variants(): { name: string; config: AnimationConfig }[] {
  const result: { name: string; config: AnimationConfig }[] = []
  for (const family of Object.keys(FAMILIES) as FamilyId[]) {
    for (const [key, field] of Object.entries(familyFields(family))) {
      if (field.kind !== "select") continue
      for (const option of field.options) {
        const config = { ...defaultConfig(family), [key]: option.value } as AnimationConfig
        result.push({ name: `${family} ${key} ${option.value}`, config })
      }
    }
  }
  return result
}

function compile(files: string[]): string[] {
  const program = ts.createProgram(files, {
    strict: true,
    noEmit: true,
    skipLibCheck: true,
    allowJs: true,
    checkJs: true,
    jsx: ts.JsxEmit.ReactJSX,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    target: ts.ScriptTarget.ES2022,
    lib: ["lib.es2022.d.ts", "lib.dom.d.ts", "lib.dom.iterable.d.ts"],
    types: [],
  })
  return ts.getPreEmitDiagnostics(program).map((d) => {
    const where = d.file ? `${path.basename(d.file.fileName)}: ` : ""
    return where + ts.flattenDiagnosticMessageText(d.messageText, "\n")
  })
}

describe("generated code compiles", () => {
  it("type-checks for every preset and every option", () => {
    fs.rmSync(OUT_DIR, { recursive: true, force: true })
    fs.mkdirSync(OUT_DIR, { recursive: true })

    const cases = [
      ...BUILT_IN_PRESETS.map((p) => ({ name: p.name, config: p.config })),
      ...variants(),
    ]
    const files = cases.map(({ name, config }, index) => {
      const generated = generateCode(config, name)
      const file = path.join(OUT_DIR, `case-${index}-${generated.filename}`)
      fs.writeFileSync(file, generated.code)
      return file
    })

    expect(compile(files)).toEqual([])
  }, 60_000)
})
