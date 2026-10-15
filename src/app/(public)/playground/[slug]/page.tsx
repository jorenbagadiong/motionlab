import type { Metadata } from "next"
import { notFound } from "next/navigation"
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

export default async function PlaygroundPage({ params }: PageProps<"/playground/[slug]">) {
  const preset = getBuiltInPreset((await params).slug)
  if (!preset) notFound()

  return (
    <div className="grid flex-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[15rem_minmax(0,1fr)_20rem] lg:gap-0 lg:p-0">
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
