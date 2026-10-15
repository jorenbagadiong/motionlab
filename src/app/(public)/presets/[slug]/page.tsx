import { ArrowLeft, Blocks, SlidersHorizontal } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { PageHeader } from "@/components/layout/page-header"
import { Badge } from "@/components/ui/badge"
import { ButtonLink } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { PreviewStage } from "@/features/animations/preview/preview-stage"
import { CodePanel } from "@/features/code-generator/components/code-panel"
import { BUILT_IN_PRESETS, getBuiltInPreset } from "@/features/presets/catalog"
import { categoryLabel } from "@/features/presets/categories"
import { ConfigSpecTable } from "@/features/presets/components/config-spec-table"
import { EngineBadge } from "@/features/presets/components/engine-badge"

export function generateStaticParams() {
  return BUILT_IN_PRESETS.map((preset) => ({ slug: preset.slug }))
}

export async function generateMetadata({
  params,
}: PageProps<"/presets/[slug]">): Promise<Metadata> {
  const preset = getBuiltInPreset((await params).slug)
  return preset ? { title: preset.name, description: preset.description } : {}
}

export default async function PresetPage({ params }: PageProps<"/presets/[slug]">) {
  const preset = getBuiltInPreset((await params).slug)
  if (!preset) notFound()

  return (
    <Container className="flex flex-col gap-8 py-10 sm:py-14">
      <Link
        href="/explore"
        className="inline-flex w-fit items-center gap-1.5 rounded text-sm text-fg-muted hover:text-fg"
      >
        <ArrowLeft aria-hidden className="size-4" />
        All presets
      </Link>

      <PageHeader
        eyebrow={categoryLabel(preset.category)}
        title={preset.name}
        description={preset.description}
        actions={
          <>
            <ButtonLink href={`/playground/${preset.slug}`} variant="primary">
              <SlidersHorizontal aria-hidden />
              Customize in playground
            </ButtonLink>
            {preset.component && (
              <ButtonLink href={`/components/${preset.component}`}>
                <Blocks aria-hidden />
                Use as a component
              </ButtonLink>
            )}
          </>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <EngineBadge engine={preset.config.engine} />
        {preset.tags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>

      <section aria-labelledby="preview-heading" className="flex flex-col gap-3">
        <h2 id="preview-heading" className="sr-only">
          Preview
        </h2>
        <PreviewStage config={preset.config} label={preset.name} />
      </section>

      <CodePanel config={preset.config} name={preset.name} />

      <section aria-labelledby="config-heading" className="flex flex-col gap-3">
        <h2 id="config-heading" className="text-lg font-semibold">
          Supported configuration
        </h2>
        <p className="text-sm text-fg-muted">
          Only these properties apply to this preset. Values are validated against the ranges below.
        </p>
        <ConfigSpecTable config={preset.config} />
      </section>
    </Container>
  )
}
