import Link from "next/link"
import { cn } from "@/lib/utils/cn"
import type { BuiltInPreset } from "../catalog"

interface PresetNavListProps {
  presets: readonly BuiltInPreset[]
  activeSlug: string
}

/** Preset picker for the playground: a vertical list on desktop, a scroller on mobile. */
export function PresetNavList({ presets, activeSlug }: PresetNavListProps) {
  return (
    <nav aria-label="Presets">
      <ul className="flex gap-1.5 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
        {presets.map((preset) => {
          const active = preset.slug === activeSlug
          return (
            <li key={preset.slug} className="shrink-0">
              <Link
                href={`/playground/${preset.slug}`}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg border px-3 py-2 text-sm transition-colors",
                  active
                    ? "border-accent/50 bg-accent-soft text-fg"
                    : "border-transparent text-fg-muted hover:bg-surface-raised hover:text-fg",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "size-2 rounded-full",
                    preset.config.engine === "motion" ? "bg-engine-motion" : "bg-engine-anime",
                  )}
                />
                {preset.name}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
