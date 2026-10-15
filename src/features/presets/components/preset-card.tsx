import { Blocks, SlidersHorizontal } from "lucide-react"
import Link from "next/link"
import { ButtonLink } from "@/components/ui/button"
import { PreviewStage } from "@/features/animations/preview/preview-stage"
import type { BuiltInPreset } from "../catalog"
import { categoryLabel } from "../categories"
import { EngineBadge } from "./engine-badge"

interface PresetCardProps {
  preset: BuiltInPreset
  headingLevel?: "h2" | "h3"
}

export function PresetCard({ preset, headingLevel: Heading = "h3" }: PresetCardProps) {
  const headingId = `preset-${preset.slug}`
  return (
    <article
      aria-labelledby={headingId}
      className="group flex w-full flex-col rounded-xl border border-line bg-surface shadow-panel transition-colors hover:border-line-strong"
    >
      <PreviewStage config={preset.config} label={preset.name} trigger="hover" variant="card" />
      <div className="flex flex-1 flex-col gap-3 border-t border-line p-4">
        <div className="flex items-start justify-between gap-3">
          <Heading id={headingId} className="font-semibold text-fg">
            <Link href={`/presets/${preset.slug}`} className="rounded hover:text-accent">
              {preset.name}
            </Link>
          </Heading>
          <EngineBadge engine={preset.config.engine} />
        </div>
        <p className="text-sm text-fg-muted">{preset.description}</p>
        <p className="text-xs text-fg-subtle">
          <span className="sr-only">Category:</span> {categoryLabel(preset.category)}
          <span aria-hidden> · </span>
          <span className="sr-only">Tags:</span> {preset.tags.join(", ")}
        </p>
        <div className="mt-auto flex gap-2 pt-1">
          <ButtonLink href={`/playground/${preset.slug}`} size="sm" variant="secondary">
            <SlidersHorizontal aria-hidden />
            Customize <span className="sr-only">{preset.name}</span>
          </ButtonLink>
          <ButtonLink href={`/presets/${preset.slug}`} size="sm" variant="ghost">
            Details <span className="sr-only">for {preset.name}</span>
          </ButtonLink>
          {preset.component && (
            <ButtonLink href={`/components/${preset.component}`} size="sm" variant="ghost">
              <Blocks aria-hidden />
              Component <span className="sr-only">for {preset.name}</span>
            </ButtonLink>
          )}
        </div>
      </div>
    </article>
  )
}
