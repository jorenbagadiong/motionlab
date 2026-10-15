import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it, vi } from "vitest"
import { defaultConfig } from "@/features/animations/model"
import { CodePanel } from "@/features/code-generator/components/code-panel"

const code = (label: string) => screen.getByLabelText(`${label} code`).textContent

function setSecureClipboard(writeText: ((text: string) => Promise<void>) | undefined) {
  Object.defineProperty(window, "isSecureContext", { configurable: true, value: !!writeText })
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: writeText ? { writeText } : undefined,
  })
}

afterEach(() => {
  setSecureClipboard(undefined)
})

describe("CodePanel", () => {
  it("shows install, implementation and usage steps", () => {
    render(<CodePanel config={defaultConfig("fade-slide")} name="Fade Up" />)
    const steps = within(screen.getAllByRole("list")[0]!).getAllByRole("listitem")
    // Accessible names: the decorative step number is hidden from assistive tech.
    expect(steps).toHaveLength(3)
    for (const name of [
      "Step 1: Install the library",
      "Step 2: Add the component to your project",
      "Step 3: Use it",
    ]) {
      expect(screen.getByRole("heading", { level: 3, name })).toBeInTheDocument()
    }
    expect(code("Terminal")).toBe("npm install motion@13")
    expect(code("fade-up.tsx")).toContain("export function FadeUp(")
    expect(code("Usage")).toContain("<FadeUp>")
  })

  it("describes Anime.js presets as functions", () => {
    render(<CodePanel config={defaultConfig("svg-draw")} name="Line Draw" />)
    expect(screen.getByRole("heading", { name: /Add the function/ })).toBeInTheDocument()
    expect(code("line-draw.js")).toContain("createDrawable(")
  })

  it("updates the code when the config changes", () => {
    const config = defaultConfig("fade-slide")
    const { rerender } = render(<CodePanel config={config} name="Fade Up" />)
    expect(code("fade-up.tsx")).toContain("duration: 0.6")
    rerender(<CodePanel config={{ ...config, duration: 1400 }} name="Fade Up" />)
    expect(code("fade-up.tsx")).toContain("duration: 1.4")
  })

  it("copies with the Clipboard API and announces success", async () => {
    const user = userEvent.setup()
    // userEvent.setup() installs its own clipboard stub; replace it afterwards.
    const writeText = vi.fn().mockResolvedValue(undefined)
    setSecureClipboard(writeText)
    render(<CodePanel config={defaultConfig("fade-slide")} name="Fade Up" />)

    await user.click(screen.getByRole("button", { name: "Copy Terminal" }))
    expect(writeText).toHaveBeenCalledWith("npm install motion@13")
    expect(screen.getByRole("button", { name: "Copied Terminal" })).toBeInTheDocument()
    expect(screen.getByText("Terminal copied to clipboard")).toBeInTheDocument()
  })

  it("falls back to legacy copy outside secure contexts (e.g. LAN over HTTP)", async () => {
    const user = userEvent.setup()
    setSecureClipboard(undefined)
    const execCommand = vi.fn().mockReturnValue(true)
    Object.defineProperty(document, "execCommand", { configurable: true, value: execCommand })
    render(<CodePanel config={defaultConfig("fade-slide")} name="Fade Up" />)

    await user.click(screen.getByRole("button", { name: "Copy Usage" }))
    expect(execCommand).toHaveBeenCalledWith("copy")
    expect(screen.getByRole("button", { name: "Copied Usage" })).toBeInTheDocument()
  })

  it("reports a failed copy", async () => {
    const user = userEvent.setup()
    setSecureClipboard(undefined)
    Object.defineProperty(document, "execCommand", {
      configurable: true,
      value: vi.fn().mockReturnValue(false),
    })
    render(<CodePanel config={defaultConfig("fade-slide")} name="Fade Up" />)

    await user.click(screen.getByRole("button", { name: "Copy Usage" }))
    expect(screen.getByText(/Copy failed\. Select the code/)).toBeInTheDocument()
  })

  it("makes code blocks keyboard-scrollable", () => {
    render(<CodePanel config={defaultConfig("fade-slide")} name="Fade Up" />)
    expect(screen.getByLabelText("fade-up.tsx code")).toHaveAttribute("tabindex", "0")
  })
})
