import fs from "node:fs"
import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { EXAMPLE_COMPONENTS } from "@/features/component-library/components/example-demo"
import { EXAMPLE_SNIPPETS } from "@/features/component-library/examples"
import { COMPONENT_LIST } from "@/features/component-library/registry"

describe("component examples", () => {
  it("has unique ids, each with a live component, and no orphans", () => {
    const ids = EXAMPLE_SNIPPETS.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(Object.keys(EXAMPLE_COMPONENTS).sort()).toEqual([...ids].sort())
  })

  it("shows every example on at least one component page", () => {
    const used = new Set(COMPONENT_LIST.flatMap((doc) => doc.examples))
    for (const { id } of EXAMPLE_SNIPPETS) expect(used.has(id), id).toBe(true)
  })

  // The examples are real, type-checked source files; the page shows their code.
  it.each(EXAMPLE_SNIPPETS)("shows exactly the code of examples/$id.tsx", ({ id, code }) => {
    expect(code).toBe(fs.readFileSync(`src/features/component-library/examples/${id}.tsx`, "utf8"))
  })

  it.each(EXAMPLE_SNIPPETS)("renders the $title example", ({ id }) => {
    const Example = EXAMPLE_COMPONENTS[id]!
    const { container } = render(<Example />)
    expect(container).not.toBeEmptyDOMElement()
  })
})
