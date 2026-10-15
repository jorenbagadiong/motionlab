"use client"

import { RotateCcw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PreviewStage } from "@/features/animations/preview/preview-stage"
import type { BuiltInPreset } from "@/features/presets/catalog"
import { categoryLabel } from "@/features/presets/categories"
import { EngineBadge } from "@/features/presets/components/engine-badge"
import { useConfigEditor } from "../use-config-editor"
import { useDebouncedValue } from "../use-debounced-value"
import { CodePanel } from "@/features/code-generator/components/code-panel"
import { ConfigControls } from "./config-controls"

/** Delay before the preview restarts, so dragging a slider doesn't restart it on every tick. */
export const PREVIEW_DEBOUNCE_MS = 200

/**
 * The editable center and right panels of the playground. Rendered as two
 * grid children so the page owns the three-column layout.
 */
export function PlaygroundEditor({ preset }: { preset: BuiltInPreset }) {
  const { config, setField, reset, changed } = useConfigEditor(preset.config)
  const previewConfig = useDebouncedValue(config, PREVIEW_DEBOUNCE_MS)
  const modified = changed.length > 0

  return (
    <>
      {/*
       * On small screens this wrapper bounds the pinned preview, so it stays
       * pinned only while scrolling the controls. On desktop it's "contents",
       * letting its children sit directly in the page's three-column grid.
       */}
      <div className="flex flex-col gap-6 lg:contents">
        <section
          aria-labelledby="playground-title"
          className="flex min-w-0 flex-col gap-4 max-lg:sticky max-lg:top-16 max-lg:z-10 max-lg:-mx-4 max-lg:bg-canvas max-lg:px-4 max-lg:pb-3 sm:max-lg:-mx-6 sm:max-lg:px-6 lg:p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-fg-subtle">{categoryLabel(preset.category)}</p>
              <h1 id="playground-title" className="text-2xl font-semibold tracking-tight">
                {preset.name}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              {modified && <Badge tone="accent">Modified</Badge>}
              <EngineBadge engine={preset.config.engine} />
            </div>
          </div>
          <PreviewStage config={previewConfig} label={preset.name} compact />
        </section>

        <aside
          aria-labelledby="properties-heading"
          className="flex min-w-0 flex-col gap-4 lg:row-span-2 lg:border-l lg:border-line lg:p-4"
        >
          <div className="flex items-center justify-between gap-3">
            <h2
              id="properties-heading"
              className="text-xs font-medium tracking-wide text-fg-subtle uppercase"
            >
              Properties
            </h2>
            <Button size="sm" variant="ghost" disabled={!modified} onClick={reset}>
              <RotateCcw aria-hidden />
              Reset
            </Button>
          </div>
          <p aria-live="polite" className="sr-only">
            {modified
              ? `${changed.length} ${changed.length === 1 ? "property" : "properties"} changed`
              : "All properties at their defaults"}
          </p>
          <ConfigControls config={config} changed={changed} onChange={setField} />
        </aside>
      </div>

      <CodePanel
        config={config}
        name={preset.name}
        editable
        className="max-lg:mt-4 lg:col-start-2 lg:px-6 lg:pb-10"
      />
    </>
  )
}
