import { describe, expect, it } from "vitest"
import { defaultConfig, FAMILIES, roundToStep } from "@/features/animations/model"
import {
  changedFields,
  updateConfigField,
  validateFieldInput,
} from "@/features/editor/editor-state"

describe("updateConfigField", () => {
  const base = defaultConfig("fade-slide")

  it("applies a valid value", () => {
    expect(updateConfigField(base, "duration", 900)).toEqual({
      success: true,
      config: { ...base, duration: 900 },
    })
  })

  it.each([
    ["out of range", "duration", 99999],
    ["wrong type", "duration", "fast"],
    ["invalid option", "ease", "outExpo"],
  ])("rejects a value that is %s", (_label, key, value) => {
    expect(updateConfigField(base, key, value).success).toBe(false)
  })

  it.each(["family", "engine", "stiffness", "__proto__"])("refuses to set %s", (key) => {
    expect(updateConfigField(base, key, "anime").success).toBe(false)
  })
})

describe("changedFields", () => {
  it("lists only properties that differ", () => {
    const base = defaultConfig("spring-pop")
    expect(changedFields(base, base)).toEqual([])
    expect(changedFields({ ...base, damping: 30, mass: 2 }, base)).toEqual(["damping", "mass"])
  })
})

describe("validateFieldInput", () => {
  const { duration } = FAMILIES["fade-slide"].fields
  const { count } = FAMILIES["stagger-cards"].fields

  it("accepts values in range", () => {
    expect(validateFieldInput(duration, 600)).toBeNull()
  })

  it("explains the allowed range", () => {
    expect(validateFieldInput(duration, 50)).toBe("Enter a value between 100 ms and 3000 ms")
    expect(validateFieldInput(duration, Number.NaN)).toMatch(/between/)
  })

  it("asks for whole numbers on integer fields", () => {
    expect(validateFieldInput(count, 2.5)).toBe("Enter a whole number between 2 and 6")
  })
})

describe("roundToStep", () => {
  it("removes floating-point noise using the step precision", () => {
    const { scale } = FAMILIES["hover-lift"].fields
    expect(roundToStep(scale, 1.0400000000000003)).toBe(1.04)
    const { duration } = FAMILIES["fade-slide"].fields
    expect(roundToStep(duration, 650.0000001)).toBe(650)
  })
})
