import { describe, expect, it } from "vitest"
import {
  AnimationConfigSchema,
  defaultConfig,
  FAMILIES,
  type FamilyId,
  familyFields,
  isLooping,
  numberField,
  parseConfig,
  selectField,
  supportsPlaybackControls,
} from "@/features/animations/model"

const familyIds = Object.keys(FAMILIES) as FamilyId[]

describe("family definitions", () => {
  it.each(familyIds)("%s defaults pass validation", (id) => {
    expect(AnimationConfigSchema.safeParse(defaultConfig(id)).success).toBe(true)
  })

  it.each(familyIds)("%s defaults sit inside every field's range", (id) => {
    for (const field of Object.values(familyFields(id))) {
      if (field.kind === "number") {
        expect(field.default).toBeGreaterThanOrEqual(field.min)
        expect(field.default).toBeLessThanOrEqual(field.max)
      } else {
        expect(field.options.map((o) => o.value)).toContain(field.default)
      }
    }
  })

  it("binds each family to exactly one engine", () => {
    for (const id of familyIds) {
      expect(defaultConfig(id).engine).toBe(FAMILIES[id].engine)
    }
  })
})

describe("field builders", () => {
  it("rejects a default outside the range", () => {
    expect(() => numberField({ label: "X", min: 0, max: 10, step: 1, default: 11 })).toThrow()
  })

  it("rejects an inverted range", () => {
    expect(() => numberField({ label: "X", min: 5, max: 1, step: 1, default: 3 })).toThrow()
  })

  it("rejects a select default that is not an option", () => {
    expect(() =>
      selectField({ label: "X", options: [{ value: "a", label: "A" }], default: "b" as "a" }),
    ).toThrow()
  })
})

describe("parseConfig", () => {
  it("fills missing properties with family defaults", () => {
    const result = parseConfig({ family: "fade-slide", duration: 900 })
    expect(result).toEqual({
      success: true,
      config: { ...defaultConfig("fade-slide"), duration: 900 },
    })
  })

  it("accepts values on the range boundaries", () => {
    expect(parseConfig({ family: "fade-slide", duration: 100, distance: 200 }).success).toBe(true)
  })

  it.each([
    ["below minimum", { family: "fade-slide", duration: 99 }],
    ["above maximum", { family: "fade-slide", distance: 201 }],
    ["not a number", { family: "fade-slide", delay: "100" }],
    ["NaN", { family: "fade-slide", delay: Number.NaN }],
    ["Infinity", { family: "fade-slide", duration: Number.POSITIVE_INFINITY }],
    ["non-integer count", { family: "stagger-cards", count: 3.5 }],
    ["easing from the other engine", { family: "fade-slide", ease: "outExpo" }],
    ["unknown option", { family: "orbit-spinner", spin: "sideways" }],
    ["mismatched engine", { family: "fade-slide", engine: "anime" }],
    ["unrelated property", { family: "fade-slide", stiffness: 300 }],
  ])("rejects %s", (_label, input) => {
    expect(parseConfig(input).success).toBe(false)
  })

  it.each([
    ["null", null],
    ["an array", []],
    ["a string", "fade-slide"],
    ["an unknown family", { family: "explode" }],
    ["a prototype key as family", { family: "constructor" }],
  ])("rejects %s", (_label, input) => {
    expect(parseConfig(input).success).toBe(false)
  })

  it("never treats strings as executable code", () => {
    const result = parseConfig({ family: "fade-slide", ease: "() => alert(1)" })
    expect(result.success).toBe(false)
  })

  it("reports the failing path", () => {
    const result = parseConfig({ family: "fade-slide", duration: 99999 })
    expect(result.success).toBe(false)
    if (!result.success) expect(result.error).toMatch(/^duration:/)
  })
})

describe("playback helpers", () => {
  it("treats infinite families as looping", () => {
    expect(isLooping(defaultConfig("bouncing-dots"))).toBe(true)
  })

  it("derives looping from the repeat mode", () => {
    expect(isLooping(defaultConfig("fade-slide"))).toBe(false)
    expect(isLooping({ ...defaultConfig("fade-slide"), repeat: "alternate" })).toBe(true)
  })

  it("disables playback controls for gesture families only", () => {
    expect(supportsPlaybackControls(defaultConfig("hover-lift"))).toBe(false)
    expect(supportsPlaybackControls(defaultConfig("spring-pop"))).toBe(true)
  })
})
