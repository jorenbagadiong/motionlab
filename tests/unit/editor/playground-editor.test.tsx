import { act, fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import type { AnimationConfig } from "@/features/animations/model"
import {
  PlaygroundEditor,
  PREVIEW_DEBOUNCE_MS,
} from "@/features/editor/components/playground-editor"
import { getBuiltInPreset } from "@/features/presets/catalog"

// Expose the config the preview receives, without running animation engines.
vi.mock("@/features/animations/preview/preview-stage", () => ({
  PreviewStage: ({ config }: { config: AnimationConfig }) => (
    <pre data-testid="preview-config">{JSON.stringify(config)}</pre>
  ),
}))

const fadeUp = getBuiltInPreset("fade-up")!
const springPop = getBuiltInPreset("spring-pop")!

const previewConfig = () =>
  JSON.parse(screen.getByTestId("preview-config").textContent!) as Record<string, unknown>

const settle = () =>
  act(() => {
    vi.advanceTimersByTime(PREVIEW_DEBOUNCE_MS)
  })

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true })
})

afterEach(() => {
  vi.useRealTimers()
})

describe("PlaygroundEditor", () => {
  it("shows only the properties the preset supports", () => {
    render(<PlaygroundEditor preset={fadeUp} />)
    expect(screen.getByRole("slider", { name: "Duration" })).toBeInTheDocument()
    expect(screen.getByRole("combobox", { name: "Easing" })).toBeInTheDocument()
    expect(screen.queryByRole("slider", { name: "Stiffness" })).not.toBeInTheDocument()

    render(<PlaygroundEditor preset={springPop} />)
    expect(screen.getByRole("slider", { name: "Stiffness" })).toBeInTheDocument()
  })

  it("updates the preview from the slider after the debounce", () => {
    render(<PlaygroundEditor preset={fadeUp} />)
    fireEvent.change(screen.getByRole("slider", { name: "Duration" }), {
      target: { value: "1200" },
    })
    expect(previewConfig().duration).toBe(600)
    settle()
    expect(previewConfig().duration).toBe(1200)
    expect(screen.getByText("Modified")).toBeInTheDocument()
    expect(screen.getByRole("slider", { name: "Duration (modified)" })).toHaveAttribute(
      "aria-valuetext",
      "1200 ms",
    )
  })

  it("applies typed values on Enter and keeps the slider in sync", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<PlaygroundEditor preset={fadeUp} />)
    const input = screen.getByRole("spinbutton", { name: "Distance value (px)" })
    await user.clear(input)
    await user.type(input, "80")
    settle()
    // Nothing is applied while typing, so partial input never reaches the preview.
    expect(previewConfig().distance).toBe(24)

    await user.keyboard("{Enter}")
    settle()
    expect(previewConfig().distance).toBe(80)
    expect(screen.getByRole("slider", { name: /^Distance/ })).toHaveValue("80")
  })

  it("applies typed values on blur", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<PlaygroundEditor preset={fadeUp} />)
    const input = screen.getByRole("spinbutton", { name: "Delay value (ms)" })
    await user.clear(input)
    await user.type(input, "250")
    await user.tab()
    settle()
    expect(previewConfig().delay).toBe(250)
  })

  it("reports out-of-range input without applying it, and reverts on blur", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<PlaygroundEditor preset={fadeUp} />)
    const input = screen.getByRole("spinbutton", { name: "Duration value (ms)" })
    await user.clear(input)
    await user.type(input, "99999")

    expect(screen.getByRole("alert")).toHaveTextContent("Enter a value between 100 ms and 3000 ms")
    expect(input).toHaveAttribute("aria-invalid", "true")

    await user.tab()
    settle()
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
    expect(input).toHaveValue(600)
    expect(previewConfig().duration).toBe(600)
  })

  it("discards a typed draft on Escape", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<PlaygroundEditor preset={fadeUp} />)
    const input = screen.getByRole("spinbutton", { name: "Duration value (ms)" })
    await user.clear(input)
    await user.type(input, "1500{Escape}")
    expect(input).toHaveValue(600)
    await user.tab()
    settle()
    expect(previewConfig().duration).toBe(600)
  })

  it("changes select options", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<PlaygroundEditor preset={fadeUp} />)
    await user.selectOptions(screen.getByRole("combobox", { name: "Easing" }), "backOut")
    settle()
    expect(previewConfig().ease).toBe("backOut")
  })

  it("resets every property to the preset defaults", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<PlaygroundEditor preset={fadeUp} />)
    const reset = screen.getByRole("button", { name: "Reset" })
    expect(reset).toBeDisabled()

    fireEvent.change(screen.getByRole("slider", { name: "Duration" }), {
      target: { value: "1500" },
    })
    await user.selectOptions(screen.getByRole("combobox", { name: "Direction" }), "left")
    expect(reset).toBeEnabled()

    await user.click(reset)
    settle()
    expect(previewConfig()).toEqual(fadeUp.config)
    expect(reset).toBeDisabled()
    expect(screen.queryByText("Modified")).not.toBeInTheDocument()
  })
})
