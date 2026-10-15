"use client"

import { Search, SearchX } from "lucide-react"
import { useId, useState } from "react"
import { Button } from "@/components/ui/button"
import { Label, SelectInput, TextInput } from "@/components/ui/field"
import { ENGINES, type EngineId } from "@/features/animations/model"
import { cn } from "@/lib/utils/cn"
import type { BuiltInPreset } from "../catalog"
import { CATEGORIES, type CategoryId } from "../categories"
import {
  DEFAULT_FILTERS,
  filterPresets,
  hasActiveFilters,
  type PresetFilters,
  SORT_OPTIONS,
  type SortOption,
} from "../filter"
import { PresetCard } from "./preset-card"

const CATEGORY_CHOICES = [{ id: "all", label: "All" }, ...CATEGORIES] as const

export function GalleryBrowser({ presets }: { presets: readonly BuiltInPreset[] }) {
  const [filters, setFilters] = useState<PresetFilters>(DEFAULT_FILTERS)
  const results = filterPresets(presets, filters)
  const ids = { search: useId(), engine: useId(), sort: useId(), category: useId() }

  const update = <K extends keyof PresetFilters>(key: K, value: PresetFilters[K]) =>
    setFilters((current) => ({ ...current, [key]: value }))

  return (
    <div className="flex flex-col gap-6">
      <search className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-4">
        <div className="grid gap-4 sm:grid-cols-[1fr_auto_auto]">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={ids.search}>Search presets</Label>
            <div className="relative">
              <Search
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-fg-subtle"
              />
              <TextInput
                id={ids.search}
                type="search"
                placeholder="Try “spring”, “text” or “loop”"
                className="pl-9"
                value={filters.query}
                onChange={(event) => update("query", event.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={ids.engine}>Engine</Label>
            <SelectInput
              id={ids.engine}
              value={filters.engine}
              onChange={(event) => update("engine", event.target.value as EngineId | "all")}
            >
              <option value="all">All engines</option>
              {Object.values(ENGINES).map((engine) => (
                <option key={engine.id} value={engine.id}>
                  {engine.label}
                </option>
              ))}
            </SelectInput>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={ids.sort}>Sort by</Label>
            <SelectInput
              id={ids.sort}
              value={filters.sort}
              onChange={(event) => update("sort", event.target.value as SortOption)}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </SelectInput>
          </div>
        </div>

        <fieldset>
          <legend className="mb-2 text-sm font-medium text-fg-muted">Category</legend>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_CHOICES.map((choice) => {
              const checked = filters.category === choice.id
              return (
                <label
                  key={choice.id}
                  className={cn(
                    "cursor-pointer rounded-full border px-3 py-1.5 text-sm transition-colors has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent",
                    checked
                      ? "border-accent/50 bg-accent-soft text-fg"
                      : "border-line text-fg-muted hover:border-line-strong hover:text-fg",
                  )}
                >
                  <input
                    type="radio"
                    name={ids.category}
                    value={choice.id}
                    checked={checked}
                    onChange={() => update("category", choice.id as CategoryId | "all")}
                    className="sr-only"
                  />
                  {choice.label}
                </label>
              )
            })}
          </div>
        </fieldset>
      </search>

      <p aria-live="polite" className="text-sm text-fg-subtle">
        {results.length === 1 ? "1 preset" : `${results.length} presets`}
      </p>

      {results.length > 0 ? (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((preset) => (
            <li key={preset.slug} className="flex">
              <PresetCard preset={preset} headingLevel="h2" />
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-line px-6 py-16 text-center">
          <SearchX aria-hidden className="size-8 text-fg-subtle" />
          <h2 className="font-semibold">No presets match your filters</h2>
          <p className="max-w-sm text-sm text-fg-muted">
            Try a different search term, or clear the filters to see every preset.
          </p>
          {hasActiveFilters(filters) && (
            <Button size="sm" onClick={() => setFilters(DEFAULT_FILTERS)}>
              Clear filters
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
