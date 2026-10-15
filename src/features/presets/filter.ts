import { ENGINES, type EngineId } from "@/features/animations/model"
import type { BuiltInPreset } from "./catalog"
import { type CategoryId, categoryLabel } from "./categories"

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "name-asc", label: "Name (A–Z)" },
  { value: "name-desc", label: "Name (Z–A)" },
  { value: "category", label: "Category" },
] as const

export type SortOption = (typeof SORT_OPTIONS)[number]["value"]

export interface PresetFilters {
  query: string
  category: CategoryId | "all"
  engine: EngineId | "all"
  sort: SortOption
}

export const DEFAULT_FILTERS: PresetFilters = {
  query: "",
  category: "all",
  engine: "all",
  sort: "featured",
}

function searchableText(preset: BuiltInPreset): string {
  return [
    preset.name,
    preset.description,
    categoryLabel(preset.category),
    ENGINES[preset.config.engine].label,
    ...preset.tags,
  ]
    .join(" ")
    .toLowerCase()
}

export function filterPresets(
  presets: readonly BuiltInPreset[],
  filters: PresetFilters,
): BuiltInPreset[] {
  const terms = filters.query.toLowerCase().split(/\s+/).filter(Boolean)

  const matches = presets.filter((preset) => {
    if (filters.category !== "all" && preset.category !== filters.category) return false
    if (filters.engine !== "all" && preset.config.engine !== filters.engine) return false
    if (terms.length === 0) return true
    const text = searchableText(preset)
    return terms.every((term) => text.includes(term))
  })

  return sortPresets(matches, filters.sort)
}

function sortPresets(presets: BuiltInPreset[], sort: SortOption): BuiltInPreset[] {
  const byName = (a: BuiltInPreset, b: BuiltInPreset) => a.name.localeCompare(b.name)
  switch (sort) {
    case "featured":
      // Stable sort keeps catalog order within featured and non-featured groups.
      return presets.toSorted((a, b) => Number(!!b.featured) - Number(!!a.featured))
    case "name-asc":
      return presets.toSorted(byName)
    case "name-desc":
      return presets.toSorted((a, b) => byName(b, a))
    case "category":
      return presets.toSorted(
        (a, b) =>
          categoryLabel(a.category).localeCompare(categoryLabel(b.category)) || byName(a, b),
      )
  }
}

export function hasActiveFilters(filters: PresetFilters): boolean {
  return filters.query.trim() !== "" || filters.category !== "all" || filters.engine !== "all"
}
