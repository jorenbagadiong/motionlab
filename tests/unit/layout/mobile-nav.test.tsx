import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { MobileNav } from "@/components/layout/mobile-nav"
import { isActivePath } from "@/components/layout/nav-links"

const navigation = vi.hoisted(() => ({ pathname: "/" }))

vi.mock("next/navigation", () => ({
  usePathname: () => navigation.pathname,
}))

beforeEach(() => {
  navigation.pathname = "/"
})

describe("MobileNav", () => {
  it("opens and closes with the toggle button", async () => {
    const user = userEvent.setup()
    render(<MobileNav />)
    const toggle = screen.getByRole("button", { name: "Open menu" })
    expect(toggle).toHaveAttribute("aria-expanded", "false")
    expect(screen.queryByRole("navigation", { name: "Mobile" })).not.toBeInTheDocument()

    await user.click(toggle)
    expect(toggle).toHaveAttribute("aria-expanded", "true")
    expect(screen.getByRole("navigation", { name: "Mobile" })).toBeVisible()

    await user.click(screen.getByRole("button", { name: "Close menu" }))
    expect(screen.queryByRole("navigation", { name: "Mobile" })).not.toBeInTheDocument()
  })

  it("closes on Escape and returns focus to the toggle", async () => {
    const user = userEvent.setup()
    render(<MobileNav />)
    await user.click(screen.getByRole("button", { name: "Open menu" }))
    await user.tab()
    expect(screen.getByRole("link", { name: "Explore" })).toHaveFocus()

    await user.keyboard("{Escape}")
    expect(screen.queryByRole("navigation", { name: "Mobile" })).not.toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Open menu" })).toHaveFocus()
  })

  it("closes after navigating to another route", async () => {
    const user = userEvent.setup()
    const { rerender } = render(<MobileNav />)
    await user.click(screen.getByRole("button", { name: "Open menu" }))
    navigation.pathname = "/explore"
    rerender(<MobileNav />)
    expect(screen.queryByRole("navigation", { name: "Mobile" })).not.toBeInTheDocument()
  })

  it("marks the current section", async () => {
    navigation.pathname = "/playground/fade-up"
    const user = userEvent.setup()
    render(<MobileNav />)
    await user.click(screen.getByRole("button", { name: "Open menu" }))
    expect(screen.getByRole("link", { name: "Playground" })).toHaveAttribute("aria-current", "page")
    expect(screen.getByRole("link", { name: "Explore" })).not.toHaveAttribute("aria-current")
  })
})

describe("isActivePath", () => {
  it("matches the route and its children only", () => {
    expect(isActivePath("/explore", "/explore")).toBe(true)
    expect(isActivePath("/explore/x", "/explore")).toBe(true)
    expect(isActivePath("/explorer", "/explore")).toBe(false)
  })
})
