"use client"

import { RotateCcw } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CodeBlock } from "@/features/code-generator/components/code-block"
import { type ControlValue, initialValues } from "../model"
import { ComponentPreview } from "../previews"
import { type ComponentSlug, getComponentDoc } from "../registry"
import { PropControls } from "./prop-controls"

/**
 * Live playground: controls on the right, the component in the middle, and the
 * matching usage code underneath. Takes a slug (not the doc) because the doc's
 * code function can't be passed from a server component.
 */
export function ComponentPlayground({ slug }: { slug: ComponentSlug }) {
  const doc = getComponentDoc(slug)!
  const initial: Record<string, ControlValue> = initialValues(doc.controls)
  const [values, setValues] = useState(initial)
  const changed = Object.keys(values).filter((key) => values[key] !== initial[key])
  const code = doc.code(values)
  const fileName = `${doc.name.replace(/\s+/g, "")}Demo.tsx`

  return (
    <section aria-labelledby="playground-heading" className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-panel">
        <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5">
          <div className="flex items-center gap-2">
            <h2 id="playground-heading" className="text-sm font-semibold">
              Playground
            </h2>
            {changed.length > 0 && <Badge tone="accent">Modified</Badge>}
          </div>
          <Button
            size="sm"
            variant="ghost"
            disabled={changed.length === 0}
            onClick={() => setValues(initial)}
          >
            <RotateCcw aria-hidden />
            Reset
          </Button>
        </div>
        <div className="grid lg:grid-cols-[minmax(0,1fr)_17rem]">
          <div
            data-testid="component-preview"
            className="flex min-h-72 items-center justify-center bg-canvas bg-grid p-6 sm:p-10"
          >
            <ComponentPreview slug={slug} values={values} />
          </div>
          <div
            role="group"
            aria-label="Props"
            className="border-t border-line p-4 lg:max-h-[32rem] lg:overflow-y-auto lg:border-t-0 lg:border-l"
          >
            <PropControls
              controls={doc.controls}
              values={values}
              changed={changed}
              onChange={(name, value) => setValues((current) => ({ ...current, [name]: value }))}
            />
          </div>
        </div>
      </div>
      <CodeBlock code={code} label={fileName} />
    </section>
  )
}
