import { describe, expect, it } from "vitest"
import { getExample } from "@/features/component-library/examples"
import { initialValues } from "@/features/component-library/model"
import { PREVIEW_SLUGS } from "@/features/component-library/previews"
import {
  COMPONENT_DOCS,
  COMPONENT_LIST,
  componentsByCategory,
  getComponentDoc,
} from "@/features/component-library/registry"

describe("component registry", () => {
  it("uses each doc's key as its slug, with unique names", () => {
    for (const [key, doc] of Object.entries(COMPONENT_DOCS)) expect(doc.slug).toBe(key)
    const names = COMPONENT_LIST.map((doc) => doc.name)
    expect(new Set(names).size).toBe(names.length)
  })

  it("has a live preview for every component", () => {
    expect([...PREVIEW_SLUGS].sort()).toEqual(Object.keys(COMPONENT_DOCS).sort())
  })

  it("lists components in sidebar order (grouped by category)", () => {
    expect(COMPONENT_LIST.map((d) => d.slug)).toEqual(
      componentsByCategory().flatMap((group) => group.docs.map((d) => d.slug)),
    )
  })

  it("finds docs by slug and rejects unknown or inherited keys", () => {
    expect(getComponentDoc("button")?.name).toBe("Button")
    expect(getComponentDoc("nope")).toBeUndefined()
    expect(getComponentDoc("toString")).toBeUndefined()
  })

  describe.each(COMPONENT_LIST)("$name", (doc) => {
    it("has valid initial control values", () => {
      for (const [name, control] of Object.entries(doc.controls)) {
        if (control.kind === "select") expect(control.options, name).toContain(control.initial)
        if (control.kind === "number") {
          expect(control.initial, name).toBeGreaterThanOrEqual(control.min)
          expect(control.initial, name).toBeLessThanOrEqual(control.max)
        }
        if (control.kind === "text" && control.maxLength) {
          expect(control.initial.length, name).toBeLessThanOrEqual(control.maxLength)
        }
      }
    })

    it("documents props and accessibility, and its examples exist", () => {
      expect(doc.props.length).toBeGreaterThan(0)
      expect(doc.a11y.length).toBeGreaterThan(0)
      for (const id of doc.examples) expect(getExample(id), id).toBeDefined()
    })

    it("lists names its module really exports", async () => {
      const exported = (await import(/* @vite-ignore */ doc.importPath)) as Record<string, unknown>
      for (const name of doc.exports) expect(typeof exported[name], name).toBe("function")
    })

    it("generates code importing from its module", () => {
      expect(doc.code(initialValues(doc.controls))).toContain(`from "${doc.importPath}"`)
    })
  })
})
