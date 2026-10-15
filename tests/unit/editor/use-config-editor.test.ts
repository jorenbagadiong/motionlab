import { act, renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { defaultConfig } from "@/features/animations/model"
import { useConfigEditor } from "@/features/editor/use-config-editor"

describe("useConfigEditor", () => {
  const initial = defaultConfig("fade-slide")

  it("ignores invalid updates so the config is always valid", () => {
    const { result } = renderHook(() => useConfigEditor(initial))
    act(() => result.current.setField("duration", 50_000))
    act(() => result.current.setField("family", "spring-pop"))
    act(() => result.current.setField("stiffness", 300))
    expect(result.current.config).toEqual(initial)
    expect(result.current.changed).toEqual([])
  })

  it("tracks changes and resets to the initial config", () => {
    const { result } = renderHook(() => useConfigEditor(initial))
    act(() => result.current.setField("distance", 60))
    expect(result.current.changed).toEqual(["distance"])
    act(() => result.current.reset())
    expect(result.current.config).toBe(initial)
  })
})
