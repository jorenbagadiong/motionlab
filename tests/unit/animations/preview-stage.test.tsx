import { act, fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { defaultConfig } from "@/features/animations/model"
import { PreviewStage } from "@/features/animations/preview/preview-stage"
import type { RendererProps } from "@/features/animations/preview/types"
import { setMediaQuery } from "../setup"

/**
 * The real renderers drive Motion/Anime.js. Here a fake renderer records each
 * mount so we can assert on playback state deterministically, without timing.
 */
const mounts: RendererProps<unknown>[] = []
let mountCounter = 0

vi.mock("@/features/animations/preview/registry", () => ({
  AnimationRenderer: (props: RendererProps<unknown>) => {
    mounts.push(props)
    return (
      <div
        data-testid="renderer"
        data-autoplay={String(props.autoplay)}
        data-paused={String(props.paused)}
        // A ref callback runs once per DOM mount, so it identifies remounts.
        ref={(node) => {
          if (node && !node.dataset.mountId) node.dataset.mountId = String(++mountCounter)
        }}
      />
    )
  },
}))

const renderer = () => screen.getByTestId("renderer")

beforeEach(() => {
  mounts.length = 0
  mountCounter = 0
})

describe("PreviewStage", () => {
  it("autoplays in stage mode", () => {
    render(<PreviewStage config={defaultConfig("fade-slide")} label="Fade Up" />)
    expect(renderer()).toHaveAttribute("data-autoplay", "true")
    expect(screen.getByRole("button", { name: "Replay" })).toBeInTheDocument()
  })

  it("replays by remounting the renderer", async () => {
    const user = userEvent.setup()
    render(<PreviewStage config={defaultConfig("fade-slide")} label="Fade Up" />)
    const first = renderer().dataset.mountId
    await user.click(screen.getByRole("button", { name: "Replay" }))
    expect(renderer().dataset.mountId).not.toBe(first)
    expect(renderer()).toHaveAttribute("data-autoplay", "true")
  })

  it("toggles pause with an accessible pressed state", async () => {
    const user = userEvent.setup()
    render(<PreviewStage config={defaultConfig("fade-slide")} label="Fade Up" />)
    const pause = screen.getByRole("button", { name: "Pause" })
    expect(pause).toHaveAttribute("aria-pressed", "false")
    await user.click(pause)
    expect(renderer()).toHaveAttribute("data-paused", "true")
    const resume = screen.getByRole("button", { name: "Resume" })
    expect(resume).toHaveAttribute("aria-pressed", "true")
    await user.click(resume)
    expect(renderer()).toHaveAttribute("data-paused", "false")
  })

  it("clears pause when replaying", async () => {
    const user = userEvent.setup()
    render(<PreviewStage config={defaultConfig("fade-slide")} label="Fade Up" />)
    await user.click(screen.getByRole("button", { name: "Pause" }))
    await user.click(screen.getByRole("button", { name: "Replay" }))
    expect(renderer()).toHaveAttribute("data-paused", "false")
  })

  it("restarts and resumes playback when the config changes", async () => {
    const user = userEvent.setup()
    const config = defaultConfig("fade-slide")
    const { rerender } = render(<PreviewStage config={config} label="Fade Up" />)
    await user.click(screen.getByRole("button", { name: "Pause" }))
    const pausedMount = renderer().dataset.mountId
    expect(renderer()).toHaveAttribute("data-paused", "true")

    rerender(<PreviewStage config={{ ...config, duration: 1200 }} label="Fade Up" />)
    expect(renderer().dataset.mountId).not.toBe(pausedMount)
    expect(renderer()).toHaveAttribute("data-autoplay", "true")
    expect(renderer()).toHaveAttribute("data-paused", "false")
  })

  it("does not restart when re-rendered with an equal config", () => {
    const { rerender } = render(
      <PreviewStage config={defaultConfig("fade-slide")} label="Fade Up" />,
    )
    const first = renderer().dataset.mountId
    rerender(<PreviewStage config={defaultConfig("fade-slide")} label="Fade Up" />)
    expect(renderer().dataset.mountId).toBe(first)
  })

  it("does not autoplay when reduced motion is preferred, but plays on request", async () => {
    setMediaQuery("(prefers-reduced-motion: reduce)", true)
    const user = userEvent.setup()
    render(<PreviewStage config={defaultConfig("fade-slide")} label="Fade Up" />)
    expect(renderer()).toHaveAttribute("data-autoplay", "false")
    expect(screen.getByText(/reduced motion is on/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Pause" })).toBeDisabled()

    await user.click(screen.getByRole("button", { name: "Play" }))
    expect(renderer()).toHaveAttribute("data-autoplay", "true")
  })

  it("rests in card mode until hovered with a mouse", () => {
    render(
      <PreviewStage
        config={defaultConfig("fade-slide")}
        label="Fade Up"
        trigger="hover"
        variant="card"
      />,
    )
    expect(renderer()).toHaveAttribute("data-autoplay", "false")
    act(() => {
      fireEvent.pointerEnter(renderer().parentElement!, { pointerType: "mouse" })
    })
    expect(renderer()).toHaveAttribute("data-autoplay", "true")
  })

  it("returns looping card previews to rest when the pointer leaves", () => {
    render(
      <PreviewStage
        config={defaultConfig("bouncing-dots")}
        label="Dots"
        trigger="hover"
        variant="card"
      />,
    )
    const area = renderer().parentElement!
    act(() => {
      fireEvent.pointerEnter(area, { pointerType: "mouse" })
    })
    expect(renderer()).toHaveAttribute("data-autoplay", "true")
    act(() => {
      fireEvent.pointerLeave(area, { pointerType: "mouse" })
    })
    expect(renderer()).toHaveAttribute("data-autoplay", "false")
  })

  it("labels the card replay button with the preset name", async () => {
    const user = userEvent.setup()
    render(
      <PreviewStage
        config={defaultConfig("fade-slide")}
        label="Fade Up"
        trigger="hover"
        variant="card"
      />,
    )
    await user.click(screen.getByRole("button", { name: "Replay Fade Up preview" }))
    expect(renderer()).toHaveAttribute("data-autoplay", "true")
  })

  it("shows gesture guidance instead of playback controls for gesture presets", () => {
    render(<PreviewStage config={defaultConfig("hover-lift")} label="Hover Lift" />)
    expect(screen.queryByRole("button", { name: "Replay" })).not.toBeInTheDocument()
    expect(screen.getByText(/hover, focus or press/i)).toBeInTheDocument()
  })
})
