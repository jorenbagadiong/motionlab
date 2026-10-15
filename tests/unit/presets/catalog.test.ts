import { describe, expect, it } from "vitest"
import { AnimationConfigSchema, FAMILIES } from "@/features/animations/model"
import { BUILT_IN_PRESETS, DEFAULT_PRESET_SLUG, getBuiltInPreset } from "@/features/presets/catalog"
import { CATEGORIES } from "@/features/presets/categories"

describe("built-in catalog", () => {
  it("ships at least 8 presets", () => {
    expect(BUILT_IN_PRESETS.length).toBeGreaterThanOrEqual(8)
  })

  it.each(BUILT_IN_PRESETS.map((p) => [p.slug, p] as const))(
    "%s has a valid configuration",
    (_slug, preset) => {
      expect(AnimationConfigSchema.safeParse(preset.config).success).toBe(true)
    },
  )

  it("uses unique, URL-safe slugs", () => {
    const slugs = BUILT_IN_PRESETS.map((p) => p.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
  })

  it("covers every animation family and category", () => {
    const families = new Set(BUILT_IN_PRESETS.map((p) => p.config.family))
    expect([...families].sort()).toEqual(Object.keys(FAMILIES).sort())
    const categories = new Set(BUILT_IN_PRESETS.map((p) => p.category))
    expect([...categories].sort()).toEqual(CATEGORIES.map((c) => c.id).sort())
  })

  it("includes presets for both engines", () => {
    const engines = new Set(BUILT_IN_PRESETS.map((p) => p.config.engine))
    expect(engines).toEqual(new Set(["motion", "anime"]))
  })

  it("resolves the default playground preset", () => {
    expect(getBuiltInPreset(DEFAULT_PRESET_SLUG)).toBeDefined()
    expect(getBuiltInPreset("does-not-exist")).toBeUndefined()
  })
})
