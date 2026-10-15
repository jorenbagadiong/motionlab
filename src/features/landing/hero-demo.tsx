"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { PreviewStage } from "@/features/animations/preview/preview-stage"
import type { BuiltInPreset } from "@/features/presets/catalog"
import { EngineBadge } from "@/features/presets/components/engine-badge"
import { cn } from "@/lib/utils/cn"

/** A small live sampler of presets shown in the landing hero. */
export function HeroDemo({ presets }: { presets: readonly BuiltInPreset[] }) {
  const [selectedSlug, setSelectedSlug] = useState(presets[0]?.slug)
  const selected = presets.find((preset) => preset.slug === selectedSlug) ?? presets[0]
  if (!selected) return null

  return (
    <section
      aria-label="Live demo"
      className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-4 shadow-panel sm:p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="group" aria-label="Demo preset" className="flex flex-wrap gap-1.5">
          {presets.map((preset) => (
            <button
              key={preset.slug}
              type="button"
              aria-pressed={preset.slug === selected.slug}
              onClick={() => setSelectedSlug(preset.slug)}
              className={cn(
                "rounded-full border px-3 py-1 text-sm transition-colors",
                preset.slug === selected.slug
                  ? "border-accent/50 bg-accent-soft text-fg"
                  : "border-line text-fg-muted hover:text-fg",
              )}
            >
              {preset.name}
            </button>
          ))}
        </div>
        <EngineBadge engine={selected.config.engine} />
      </div>
      <PreviewStage key={selected.slug} config={selected.config} label={selected.name} />
      <Link
        href={`/playground/${selected.slug}`}
        className="inline-flex w-fit items-center gap-1.5 rounded text-sm font-medium text-accent hover:underline"
      >
        Customize {selected.name}
        <ArrowRight aria-hidden className="size-4" />
      </Link>
    </section>
  )
}
