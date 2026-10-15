import { act, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { ACCENT_STORAGE_KEY, THEME_INIT_SCRIPT, THEME_STORAGE_KEY } from "@/features/theme/theme"
import { ThemeToggle } from "@/features/theme/theme-toggle"

const root = document.documentElement

beforeEach(() => {
  localStorage.clear()
  delete root.dataset.theme
  delete root.dataset.accent
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe("ThemeToggle", () => {
  it("defaults to the system theme without forcing one", () => {
    render(<ThemeToggle />)
    expect(screen.getByRole("group", { name: "Theme" })).toBeInTheDocument()
    expect(screen.getByRole("radio", { name: "System" })).toBeChecked()
    expect(root.dataset.theme).toBeUndefined()
  })

  it("applies and remembers an explicit choice", async () => {
    const user = userEvent.setup()
    render(<ThemeToggle />)
    await user.click(screen.getByRole("radio", { name: "Light" }))
    expect(root.dataset.theme).toBe("light")
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light")
    expect(screen.getByRole("radio", { name: "Light" })).toBeChecked()

    await user.click(screen.getByRole("radio", { name: "Dark" }))
    expect(root.dataset.theme).toBe("dark")
  })

  it("returns to the system theme and clears the stored choice", async () => {
    localStorage.setItem(THEME_STORAGE_KEY, "dark")
    root.dataset.theme = "dark"
    const user = userEvent.setup()
    render(<ThemeToggle />)
    expect(screen.getByRole("radio", { name: "Dark" })).toBeChecked()

    await user.click(screen.getByRole("radio", { name: "System" }))
    expect(root.dataset.theme).toBeUndefined()
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBeNull()
  })

  it("supports arrow keys between options", async () => {
    const user = userEvent.setup()
    render(<ThemeToggle />)
    await user.click(screen.getByRole("radio", { name: "System" }))
    await user.keyboard("{ArrowRight}")
    expect(screen.getByRole("radio", { name: "Light" })).toBeChecked()
    expect(root.dataset.theme).toBe("light")
  })

  it("follows changes made in another tab", () => {
    render(<ThemeToggle />)
    act(() => {
      localStorage.setItem(THEME_STORAGE_KEY, "light")
      window.dispatchEvent(new StorageEvent("storage", { key: THEME_STORAGE_KEY }))
    })
    expect(screen.getByRole("radio", { name: "Light" })).toBeChecked()
    expect(root.dataset.theme).toBe("light")
  })

  it("still works when storage is unavailable", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked")
    })
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked")
    })
    const user = userEvent.setup()
    render(<ThemeToggle />)
    await user.click(screen.getByRole("radio", { name: "Dark" }))
    expect(root.dataset.theme).toBe("dark")
  })
})

describe("THEME_INIT_SCRIPT", () => {
  const run = () => new Function(THEME_INIT_SCRIPT)()

  it("applies a stored choice", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "light")
    run()
    expect(root.dataset.theme).toBe("light")
  })

  it("ignores missing or tampered values", () => {
    run()
    expect(root.dataset.theme).toBeUndefined()
    localStorage.setItem(THEME_STORAGE_KEY, '"><script>')
    run()
    expect(root.dataset.theme).toBeUndefined()
  })

  it("applies a stored accent alongside the mode", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "dark")
    localStorage.setItem(ACCENT_STORAGE_KEY, "emerald")
    run()
    expect(root.dataset.theme).toBe("dark")
    expect(root.dataset.accent).toBe("emerald")
  })

  it("ignores unknown or default accents", () => {
    localStorage.setItem(ACCENT_STORAGE_KEY, "chartreuse")
    run()
    expect(root.dataset.accent).toBeUndefined()
    localStorage.setItem(ACCENT_STORAGE_KEY, "violet")
    run()
    expect(root.dataset.accent).toBeUndefined()
  })

  it("never throws when storage is blocked", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked")
    })
    expect(run).not.toThrow()
  })
})
