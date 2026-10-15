import { describe, expect, it } from "vitest"
import { BUILT_IN_PRESETS } from "@/features/presets/catalog"
import { DEFAULT_FILTERS, filterPresets, hasActiveFilters } from "@/features/presets/filter"

const slugs = (filters: Partial<typeof DEFAULT_FILTERS>) =>
  filterPresets(BUILT_IN_PRESETS, { ...DEFAULT_FILTERS, ...filters }).map((p) => p.slug)

describe("filterPresets", () => {
  it("returns everything with default filters, featured first", () => {
    const result = filterPresets(BUILT_IN_PRESETS, DEFAULT_FILTERS)
    expect(result).toHaveLength(BUILT_IN_PRESETS.length)
    const firstNonFeatured = result.findIndex((p) => !p.featured)
    expect(result.slice(firstNonFeatured).some((p) => p.featured)).toBe(false)
  })

  it("matches name, tags and description case-insensitively", () => {
    expect(slugs({ query: "SPRING" })).toEqual(
      expect.arrayContaining(["spring-pop", "twist-in", "hover-lift"]),
    )
    expect(slugs({ query: "headline" })).toEqual(["character-rise", "letter-tumble"])
  })

  it("requires every search term to match", () => {
    expect(slugs({ query: "loop rotation" })).toEqual(["orbit-spinner"])
  })

  it("filters by category and engine together", () => {
    // Loaders are block animations, so they use Motion; Anime.js covers SVG and text.
    expect(slugs({ category: "loader", engine: "motion" }).sort()).toEqual(
      ["bouncing-dots", "orbit-spinner", "progress-fill"].sort(),
    )
    expect(slugs({ category: "loader", engine: "anime" })).toEqual([])
  })

  it("matches the engine label in search", () => {
    const result = filterPresets(BUILT_IN_PRESETS, { ...DEFAULT_FILTERS, query: "anime.js" })
    expect(result.length).toBeGreaterThan(0)
    expect(result.every((p) => p.config.engine === "anime")).toBe(true)
  })

  it("sorts by name in both directions", () => {
    const asc = slugs({ sort: "name-asc" })
    expect(slugs({ sort: "name-desc" })).toEqual([...asc].reverse())
    const names = filterPresets(BUILT_IN_PRESETS, { ...DEFAULT_FILTERS, sort: "name-asc" }).map(
      (p) => p.name,
    )
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)))
  })

  it("returns an empty list when nothing matches", () => {
    expect(slugs({ query: "zzzz-nothing" })).toEqual([])
  })

  it("does not mutate the input", () => {
    const before = BUILT_IN_PRESETS.map((p) => p.slug)
    filterPresets(BUILT_IN_PRESETS, { ...DEFAULT_FILTERS, sort: "name-desc" })
    expect(BUILT_IN_PRESETS.map((p) => p.slug)).toEqual(before)
  })
})

describe("hasActiveFilters", () => {
  it("ignores sort and whitespace-only queries", () => {
    expect(hasActiveFilters({ ...DEFAULT_FILTERS, sort: "name-asc", query: "   " })).toBe(false)
    expect(hasActiveFilters({ ...DEFAULT_FILTERS, engine: "motion" })).toBe(true)
  })
})
