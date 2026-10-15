import { describe, expect, it } from "vitest"
import { getComponentDoc } from "@/features/component-library/registry"
import { BUILT_IN_PRESETS } from "@/features/presets/catalog"

describe("preset → component links", () => {
  it.each(BUILT_IN_PRESETS.filter((p) => p.component).map((p) => [p.slug, p.component!]))(
    "%s links to an existing component page (%s)",
    (_slug, component) => {
      expect(getComponentDoc(component)).toBeDefined()
    },
  )

  it("links every featured Anime.js preset to a component", () => {
    const featuredAnime = BUILT_IN_PRESETS.filter((p) => p.featured && p.config.engine === "anime")
    expect(featuredAnime.length).toBeGreaterThan(0)
    for (const preset of featuredAnime) expect(preset.component, preset.slug).toBeDefined()
  })
})
