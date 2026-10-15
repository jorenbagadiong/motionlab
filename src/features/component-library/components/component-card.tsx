import Link from "next/link"
import { type ComponentDoc, initialValues } from "../model"
import { ComponentPreview } from "../previews"
import type { ComponentSlug } from "../registry"

/**
 * Overview card with a live (non-interactive) thumbnail. The whole card is
 * clickable through a stretched link on the title, so the preview's own
 * buttons and inputs are never nested inside the link.
 */
export function ComponentCard({ doc }: { doc: ComponentDoc }) {
  return (
    <article className="relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-colors hover:border-line-strong has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent">
      <div
        inert
        aria-hidden
        className="flex h-48 items-center justify-center overflow-hidden border-b border-line bg-canvas bg-grid p-4"
      >
        <div className="flex w-full scale-75 justify-center">
          <ComponentPreview slug={doc.slug as ComponentSlug} values={initialValues(doc.controls)} />
        </div>
      </div>
      <div className="flex flex-col gap-1 p-4">
        <h3 className="font-semibold">
          <Link
            href={`/components/${doc.slug}`}
            className="after:absolute after:inset-0 focus-visible:outline-none"
          >
            {doc.name}
          </Link>
        </h3>
        <p className="text-sm text-fg-muted">{doc.description}</p>
      </div>
    </article>
  )
}
