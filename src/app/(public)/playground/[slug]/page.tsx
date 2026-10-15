import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { PlaygroundEditor } from "@/features/editor/components/playground-editor"
import { BUILT_IN_PRESETS, getBuiltInPreset } from "@/features/presets/catalog"
import { PresetNavList } from "@/features/presets/components/preset-nav-list"

export function generateStaticParams() {
  return BUILT_IN_PRESETS.map((preset) => ({ slug: preset.slug }))
}

export async function generateMetadata({
  params,
}: PageProps<"/playground/[slug]">): Promise<Metadata> {
  const preset = getBuiltInPreset((await params).slug)
  return preset ? { title: `${preset.name} · Playground` } : {}
}

const GRID =
  "grid flex-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[15rem_minmax(0,1fr)_20rem] lg:gap-0 lg:p-0"

/**
 * The App Shell is shared by every playground link, so it can't depend on the slug.
 * Reading params happens inside the Suspense boundary; the shell is the skeleton.
 */
export default function PlaygroundPage({ params }: PageProps<"/playground/[slug]">) {
  return (
    <Suspense fallback={<PlaygroundSkeleton />}>
      <Playground params={params} />
    </Suspense>
  )
}

function PlaygroundSkeleton() {
  return (
    <div className={GRID} role="status" aria-label="Loading playground">
      <div className="flex flex-col gap-2 lg:border-r lg:border-line lg:p-4">
        <Skeleton className="h-3 w-16" />
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-9 w-full" />
        ))}
      </div>
      <Skeleton className="h-80 lg:m-6 lg:h-auto" />
      <div className="flex flex-col gap-3 lg:border-l lg:border-line lg:p-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    </div>
  )
}

async function Playground({ params }: Pick<PageProps<"/playground/[slug]">, "params">) {
  const preset = getBuiltInPreset((await params).slug)
  if (!preset) notFound()

  return (
    <div className={GRID}>
      <aside
        aria-label="Preset selection"
        className="flex min-w-0 flex-col gap-3 lg:row-span-2 lg:border-r lg:border-line lg:p-4"
      >
        <h2 className="text-xs font-medium tracking-wide text-fg-subtle uppercase">Presets</h2>
        <PresetNavList presets={BUILT_IN_PRESETS} activeSlug={preset.slug} />
      </aside>

      {/* Keyed so editor and playback state reset when switching presets. */}
      <PlaygroundEditor key={preset.slug} preset={preset} />
    </div>
  )
}
