import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import { ComponentPlayground } from "@/features/component-library/components/component-playground"
import { ComponentPreview } from "@/features/component-library/previews"
import { COMPONENT_LIST } from "@/features/component-library/registry"
import { initialValues } from "@/features/component-library/model"

const code = () => screen.getByLabelText("ButtonDemo.tsx code").textContent ?? ""
const preview = () => within(screen.getByTestId("component-preview"))
const props = () => within(screen.getByRole("group", { name: "Props" }))

describe("ComponentPlayground", () => {
  it("updates the preview and the code as props change", async () => {
    const user = userEvent.setup()
    render(<ComponentPlayground slug="button" />)
    expect(preview().getByRole("button", { name: "Save" })).toBeEnabled()
    expect(code()).toContain('<Button variant="primary">Save</Button>')

    await user.click(props().getByRole("radio", { name: "lg" }))
    await user.click(props().getByRole("switch", { name: "Disabled" }))
    const label = props().getByRole("textbox", { name: /Label/ })
    await user.clear(label)
    await user.type(label, "Publish")

    expect(preview().getByRole("button", { name: "Publish" })).toBeDisabled()
    expect(code()).toContain('<Button variant="primary" size="lg" disabled>')
    expect(code()).toContain("Publish")
  })

  it("selects with more than three options use a dropdown", async () => {
    const user = userEvent.setup()
    render(<ComponentPlayground slug="button" />)
    await user.selectOptions(props().getByRole("combobox", { name: /Variant/ }), "danger")
    expect(code()).toContain('variant="danger"')
  })

  it("marks changes and resets to the initial props", async () => {
    const user = userEvent.setup()
    render(<ComponentPlayground slug="button" />)
    const reset = screen.getByRole("button", { name: "Reset" })
    expect(reset).toBeDisabled()

    await user.click(props().getByRole("switch", { name: "Loading" }))
    expect(screen.getByText("Modified")).toBeInTheDocument()
    expect(props().getByRole("switch", { name: "Loading (modified)" })).toBeChecked()
    expect(preview().getByRole("button", { name: "Save" })).toHaveAttribute("aria-busy", "true")

    await user.click(reset)
    expect(screen.queryByText("Modified")).not.toBeInTheDocument()
    expect(preview().getByRole("button", { name: "Save" })).not.toHaveAttribute("aria-busy")
  })

  it("renders user text as text, never as markup", async () => {
    const user = userEvent.setup()
    render(<ComponentPlayground slug="badge" />)
    const label = props().getByRole("textbox", { name: /Label/ })
    await user.clear(label)
    await user.type(label, "<b>x</b>")
    expect(preview().getByText("<b>x</b>")).toBeInTheDocument()
    expect(screen.getByLabelText("BadgeDemo.tsx code").textContent).toContain('{"<b>x</b>"}')
  })
})

describe("ComponentPreview", () => {
  it.each(COMPONENT_LIST)("renders $name with its initial props", (doc) => {
    const { container } = render(
      <ComponentPreview slug={doc.slug as never} values={initialValues(doc.controls)} />,
    )
    expect(container).not.toBeEmptyDOMElement()
  })
})
