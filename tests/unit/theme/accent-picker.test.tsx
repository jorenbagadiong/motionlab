import { act, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it } from "vitest"
import { AccentPicker } from "@/features/theme/accent-picker"
import { ACCENT_STORAGE_KEY, ACCENTS } from "@/features/theme/theme"

const root = document.documentElement

beforeEach(() => {
  localStorage.clear()
  delete root.dataset.accent
})

describe("AccentPicker", () => {
  it("starts closed, with the default accent selected", async () => {
    const user = userEvent.setup()
    render(<AccentPicker />)
    const toggle = screen.getByRole("button", { name: "Color theme" })
    expect(toggle).toHaveAttribute("aria-expanded", "false")
    expect(screen.queryByRole("group", { name: "Color theme" })).not.toBeInTheDocument()

    await user.click(toggle)
    expect(toggle).toHaveAttribute("aria-expanded", "true")
    const radios = screen.getAllByRole("radio")
    expect(radios.map((r) => r.closest("label")?.textContent)).toEqual(ACCENTS.map((a) => a.label))
    expect(screen.getByRole("radio", { name: "Violet" })).toBeChecked()
    expect(root.dataset.accent).toBeUndefined()
  })

  it("applies and remembers a color, staying open to compare", async () => {
    const user = userEvent.setup()
    render(<AccentPicker />)
    await user.click(screen.getByRole("button", { name: "Color theme" }))
    await user.click(screen.getByRole("radio", { name: "Rose" }))
    expect(root.dataset.accent).toBe("rose")
    expect(localStorage.getItem(ACCENT_STORAGE_KEY)).toBe("rose")
    expect(screen.getByRole("radio", { name: "Rose" })).toBeChecked()

    await user.keyboard("{ArrowDown}")
    expect(root.dataset.accent).toBe("amber")
    expect(screen.getByRole("group", { name: "Color theme" })).toBeVisible()
  })

  it("returning to the default clears the stored choice", async () => {
    localStorage.setItem(ACCENT_STORAGE_KEY, "blue")
    root.dataset.accent = "blue"
    const user = userEvent.setup()
    render(<AccentPicker />)
    await user.click(screen.getByRole("button", { name: "Color theme" }))
    await user.click(screen.getByRole("radio", { name: "Violet" }))
    expect(root.dataset.accent).toBeUndefined()
    expect(localStorage.getItem(ACCENT_STORAGE_KEY)).toBeNull()
  })

  it("closes on Escape (returning focus) and on a click outside", async () => {
    const user = userEvent.setup()
    render(
      <>
        <AccentPicker />
        <p>Outside</p>
      </>,
    )
    const toggle = screen.getByRole("button", { name: "Color theme" })
    await user.click(toggle)
    await user.click(screen.getByRole("radio", { name: "Blue" }))
    await user.keyboard("{Escape}")
    expect(toggle).toHaveAttribute("aria-expanded", "false")
    expect(toggle).toHaveFocus()

    await user.click(toggle)
    await user.click(screen.getByText("Outside"))
    expect(toggle).toHaveAttribute("aria-expanded", "false")
  })

  it("follows changes made in another tab", () => {
    render(<AccentPicker />)
    act(() => {
      localStorage.setItem(ACCENT_STORAGE_KEY, "emerald")
      window.dispatchEvent(new StorageEvent("storage", { key: ACCENT_STORAGE_KEY }))
    })
    expect(root.dataset.accent).toBe("emerald")
    expect(screen.getByRole("radio", { name: "Emerald", hidden: true })).toBeChecked()
  })
})
