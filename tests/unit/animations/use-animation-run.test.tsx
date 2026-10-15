import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { useAnimationRun } from "@/features/animations/hooks/use-animation-run"
import type { PlaybackControls } from "@/features/animations/playback"

function createSpyAdapter() {
  const instances: { config: number; controls: PlaybackControls }[] = []
  const start = vi.fn((_root: HTMLDivElement, config: number) => {
    const controls = { play: vi.fn(), pause: vi.fn(), dispose: vi.fn() }
    instances.push({ config, controls })
    return controls
  })
  return { start, instances }
}

type Adapter = ReturnType<typeof createSpyAdapter>

function Harness(props: { adapter: Adapter; config: number; autoplay: boolean; paused: boolean }) {
  const ref = useAnimationRun(props.adapter.start, props.config, {
    autoplay: props.autoplay,
    paused: props.paused,
  })
  return <div ref={ref} data-testid="root" />
}

describe("useAnimationRun", () => {
  it("does not start while autoplay is off", () => {
    const adapter = createSpyAdapter()
    render(<Harness adapter={adapter} config={1} autoplay={false} paused={false} />)
    expect(adapter.start).not.toHaveBeenCalled()
  })

  it("starts on mount with the root element and config", () => {
    const adapter = createSpyAdapter()
    const { getByTestId } = render(<Harness adapter={adapter} config={1} autoplay paused={false} />)
    expect(adapter.start).toHaveBeenCalledWith(getByTestId("root"), 1)
  })

  it("disposes the instance on unmount", () => {
    const adapter = createSpyAdapter()
    const { unmount } = render(<Harness adapter={adapter} config={1} autoplay paused={false} />)
    unmount()
    expect(adapter.instances[0]?.controls.dispose).toHaveBeenCalledOnce()
  })

  it("disposes the previous instance before starting a new one when config changes", () => {
    const adapter = createSpyAdapter()
    const { rerender } = render(<Harness adapter={adapter} config={1} autoplay paused={false} />)
    rerender(<Harness adapter={adapter} config={2} autoplay paused={false} />)
    expect(adapter.instances).toHaveLength(2)
    expect(adapter.instances[0]?.controls.dispose).toHaveBeenCalledOnce()
    expect(adapter.instances[1]?.config).toBe(2)
    expect(adapter.instances[1]?.controls.dispose).not.toHaveBeenCalled()
  })

  it("pauses and resumes the running instance", () => {
    const adapter = createSpyAdapter()
    const { rerender } = render(<Harness adapter={adapter} config={1} autoplay paused={false} />)
    const controls = adapter.instances[0]!.controls
    rerender(<Harness adapter={adapter} config={1} autoplay paused />)
    expect(controls.pause).toHaveBeenCalled()
    rerender(<Harness adapter={adapter} config={1} autoplay paused={false} />)
    expect(controls.play).toHaveBeenCalled()
  })

  it("starts paused when mounted in a paused state", () => {
    const adapter = createSpyAdapter()
    render(<Harness adapter={adapter} config={1} autoplay paused />)
    expect(adapter.instances[0]?.controls.pause).toHaveBeenCalled()
  })
})
