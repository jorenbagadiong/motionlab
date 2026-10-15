import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useState } from "react"
import { beforeAll, describe, expect, it, vi } from "vitest"
import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { Tabs } from "@/components/ui/tabs"

describe("Button", () => {
  it("is busy and disabled while loading", async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()
    render(
      <Button loading onClick={onClick}>
        Save
      </Button>,
    )
    const button = screen.getByRole("button", { name: "Save" })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute("aria-busy", "true")
    await user.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })

  it("defaults to type=button so it never submits a form by accident", () => {
    render(<Button variant="danger">Delete</Button>)
    expect(screen.getByRole("button", { name: "Delete" })).toHaveAttribute("type", "button")
  })
})

describe("Alert", () => {
  it("is not a live region unless asked", () => {
    render(<Alert title="Saved">Done.</Alert>)
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
    expect(screen.queryByRole("status")).not.toBeInTheDocument()
    expect(screen.getByText("Saved")).toBeInTheDocument()
  })

  it("can be announced and dismissed", async () => {
    const onDismiss = vi.fn()
    const user = userEvent.setup()
    render(<Alert tone="danger" role="alert" title="Couldn't save" onDismiss={onDismiss} />)
    expect(screen.getByRole("alert")).toHaveAttribute("data-tone", "danger")
    await user.click(screen.getByRole("button", { name: "Dismiss" }))
    expect(onDismiss).toHaveBeenCalledOnce()
  })
})

describe("Switch and Checkbox", () => {
  it("switch toggles with click and Space and exposes its state", async () => {
    const user = userEvent.setup()
    render(<Switch label="Loop" description="Repeat forever" />)
    const toggle = screen.getByRole("switch", { name: /Loop/ })
    expect(toggle).not.toBeChecked()
    await user.click(screen.getByText("Loop"))
    expect(toggle).toBeChecked()
    await user.keyboard(" ")
    expect(toggle).not.toBeChecked()
  })

  it("checkbox is labelled by its text", async () => {
    const user = userEvent.setup()
    render(<Checkbox label="Favorite" />)
    await user.click(screen.getByText("Favorite"))
    expect(screen.getByRole("checkbox", { name: "Favorite" })).toBeChecked()
  })
})

describe("Tabs", () => {
  const items = [
    { id: "a", label: "Alpha", content: "Panel A" },
    { id: "b", label: "Beta", content: "Panel B" },
    { id: "c", label: "Gamma", content: "Panel C" },
  ]

  it("shows only the selected panel, linked to its tab", async () => {
    const user = userEvent.setup()
    render(<Tabs label="Greek" items={items} />)
    expect(screen.getByRole("tablist", { name: "Greek" })).toBeInTheDocument()
    expect(screen.getByRole("tabpanel", { name: "Alpha" })).toHaveTextContent("Panel A")
    expect(screen.queryByText("Panel B")).not.toBeVisible()

    await user.click(screen.getByRole("tab", { name: "Beta" }))
    expect(screen.getByRole("tab", { name: "Beta" })).toHaveAttribute("aria-selected", "true")
    expect(screen.getByRole("tabpanel", { name: "Beta" })).toHaveTextContent("Panel B")
  })

  it("supports arrow keys, Home and End with a single tab stop", async () => {
    const user = userEvent.setup()
    render(<Tabs label="Greek" items={items} />)
    await user.tab()
    expect(screen.getByRole("tab", { name: "Alpha" })).toHaveFocus()
    await user.keyboard("{ArrowLeft}")
    expect(screen.getByRole("tab", { name: "Gamma" })).toHaveFocus()
    expect(screen.getByRole("tab", { name: "Gamma" })).toHaveAttribute("aria-selected", "true")
    await user.keyboard("{Home}")
    expect(screen.getByRole("tab", { name: "Alpha" })).toHaveFocus()
    await user.keyboard("{End}{ArrowRight}")
    expect(screen.getByRole("tab", { name: "Alpha" })).toHaveFocus()
    expect(screen.getAllByRole("tab").filter((tab) => tab.tabIndex === 0)).toHaveLength(1)
  })

  it("can be controlled", async () => {
    const onValueChange = vi.fn()
    const user = userEvent.setup()
    render(<Tabs label="Greek" items={items} value="b" onValueChange={onValueChange} />)
    await user.click(screen.getByRole("tab", { name: "Gamma" }))
    expect(onValueChange).toHaveBeenCalledWith("c")
    // The parent didn't update `value`, so Beta stays selected.
    expect(screen.getByRole("tab", { name: "Beta" })).toHaveAttribute("aria-selected", "true")
  })
})

describe("Dialog", () => {
  // jsdom lacks the modal API; the real behavior is covered in tests/e2e/components.spec.ts.
  beforeAll(() => {
    HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
      this.setAttribute("open", "")
    }
    HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
      this.removeAttribute("open")
      this.dispatchEvent(new Event("close"))
    }
  })

  function Example() {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open</Button>
        <Dialog
          open={open}
          onOpenChange={setOpen}
          title="Delete preset?"
          description="This can't be undone."
          footer={<Button onClick={() => setOpen(false)}>Cancel</Button>}
        />
      </>
    )
  }

  it("opens as a named, described dialog and closes from its buttons", async () => {
    const user = userEvent.setup()
    render(<Example />)
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Open" }))
    const dialog = screen.getByRole("dialog", { name: "Delete preset?" })
    expect(dialog).toHaveAccessibleDescription("This can't be undone.")

    await user.click(screen.getByRole("button", { name: "Close" }))
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Open" }))
    await user.click(screen.getByRole("button", { name: "Cancel" }))
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("closes on a backdrop click but not on a click inside", async () => {
    const user = userEvent.setup()
    render(<Example />)
    await user.click(screen.getByRole("button", { name: "Open" }))
    await user.click(screen.getByText("This can't be undone."))
    const dialog = screen.getByRole("dialog")
    await user.click(dialog)
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })
})

describe("Progress, Spinner and Separator", () => {
  it("reports clamped progress", () => {
    render(<Progress label="Upload" value={140} />)
    expect(screen.getByRole("progressbar", { name: "Upload" })).toHaveAttribute(
      "aria-valuenow",
      "100",
    )
  })

  it("omits the value when indeterminate", () => {
    render(<Progress label="Loading" />)
    expect(screen.getByRole("progressbar")).not.toHaveAttribute("aria-valuenow")
  })

  it("spinner is a labelled status", () => {
    render(<Spinner label="Loading presets" />)
    expect(screen.getByRole("status")).toHaveTextContent("Loading presets")
  })

  it("separator is decorative unless it separates content", () => {
    const { rerender } = render(<Separator />)
    expect(screen.queryByRole("separator")).not.toBeInTheDocument()
    rerender(<Separator decorative={false} orientation="vertical" />)
    expect(screen.getByRole("separator")).toHaveAttribute("aria-orientation", "vertical")
  })
})
