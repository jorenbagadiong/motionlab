// @vitest-environment node
import { describe, expect, it } from "vitest"
import { attr, element, moduleCode, text } from "@/features/component-library/jsx"

describe("attr", () => {
  it("prints strings, numbers and booleans", () => {
    expect(attr("variant", "primary")).toBe(' variant="primary"')
    expect(attr("rows", 6)).toBe(" rows={6}")
    expect(attr("disabled", true)).toBe(" disabled")
    expect(attr("disabled", false)).toBe("")
    expect(attr("title", undefined)).toBe("")
  })

  it("uses a string expression for anything JSX would interpret", () => {
    expect(attr("title", 'Say "hi"')).toBe(' title={"Say \\"hi\\""}')
    expect(attr("title", "{oops}")).toBe(' title={"{oops}"}')
    expect(attr("title", "a & b")).toBe(' title={"a & b"}')
  })
})

describe("text", () => {
  it("keeps plain text and escapes the rest", () => {
    expect(text("Save")).toBe("Save")
    expect(text("<script>")).toBe('{"<script>"}')
    expect(text("can't")).toBe(`{"can't"}`)
    expect(text(" padded ")).toBe('{" padded "}')
  })
})

describe("element", () => {
  it("self-closes without children and inlines short content", () => {
    expect(element("Badge", [attr("tone", "accent")])).toBe('<Badge tone="accent" />')
    expect(element("Badge", [], ["New"])).toBe("<Badge>New</Badge>")
  })

  it("stacks long attribute lists and multiple children", () => {
    const long = element("Alert", [attr("title", "x".repeat(60)), attr("tone", "danger")])
    expect(long).toBe(`<Alert\n  title="${"x".repeat(60)}"\n  tone="danger"\n/>`)
    expect(element("div", [], ["<a />", "<b />"])).toBe("<div>\n  <a />\n  <b />\n</div>")
  })
})

describe("moduleCode", () => {
  it('adds "use client" only when hooks are used, and sorts imports', () => {
    const server = moduleCode({ imports: [["x", ["B", "A"]]], name: "Demo", jsx: "<A />" })
    expect(server).toBe('import { A, B } from "x"\n\nexport function Demo() {\n  return <A />\n}\n')
    const client = moduleCode({
      imports: [["react", ["useState"]]],
      name: "Demo",
      setup: ["const [a] = useState(0)"],
      jsx: "<p>{a}</p>",
    })
    expect(client.startsWith('"use client"\n\n')).toBe(true)
  })
})

describe("long imports", () => {
  it("wrap one name per line", () => {
    const names = [
      "Card",
      "CardContent",
      "CardDescription",
      "CardFooter",
      "CardHeader",
      "CardTitle",
    ]
    const code = moduleCode({
      imports: [["@/components/ui/card", names]],
      name: "D",
      jsx: "<Card />",
    })
    expect(code).toContain(`import {\n  Card,\n  CardContent,`)
    expect(code).toContain(`  CardTitle,\n} from "@/components/ui/card"`)
  })
})
