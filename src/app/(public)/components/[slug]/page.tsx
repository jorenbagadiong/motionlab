import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { PageHeader } from "@/components/layout/page-header"
import { CodeBlock } from "@/features/code-generator/components/code-block"
import { ComponentPlayground } from "@/features/component-library/components/component-playground"
import { ExampleSection } from "@/features/component-library/components/example-section"
import { PropsTable } from "@/features/component-library/components/props-table"
import { getExample } from "@/features/component-library/examples"
import {
  COMPONENT_LIST,
  type ComponentSlug,
  getComponentDoc,
} from "@/features/component-library/registry"

export function generateStaticParams() {
  return COMPONENT_LIST.map((doc) => ({ slug: doc.slug }))
}

export async function generateMetadata({
  params,
}: PageProps<"/components/[slug]">): Promise<Metadata> {
  const doc = getComponentDoc((await params).slug)
  return doc ? { title: `${doc.name} · Components`, description: doc.description } : {}
}

export default async function ComponentPage({ params }: PageProps<"/components/[slug]">) {
  const doc = getComponentDoc((await params).slug)
  if (!doc) notFound()

  const index = COMPONENT_LIST.indexOf(doc)
  const previous = COMPONENT_LIST[index - 1]
  const next = COMPONENT_LIST[index + 1]
  const examples = doc.examples.map(getExample).filter((example) => example !== undefined)

  return (
    <article className="flex flex-col gap-10">
      <PageHeader eyebrow={doc.category} title={doc.name} description={doc.description} />

      <CodeBlock
        code={`import { ${doc.exports.join(", ")} } from "${doc.importPath}"`}
        label="Import"
      />

      {/* Keyed so the playground resets when navigating between components. */}
      <ComponentPlayground key={doc.slug} slug={doc.slug as ComponentSlug} />

      {examples.length > 0 && (
        <section aria-labelledby="examples-heading" className="flex flex-col gap-6">
          <h2 id="examples-heading" className="text-xl font-semibold tracking-tight">
            Examples
          </h2>
          {examples.map((example) => (
            <ExampleSection key={example.id} example={example} />
          ))}
        </section>
      )}

      <section aria-labelledby="props-heading" className="flex flex-col gap-4">
        <h2 id="props-heading" className="text-xl font-semibold tracking-tight">
          Props
        </h2>
        <PropsTable props={doc.props} />
      </section>

      <section aria-labelledby="a11y-heading" className="flex flex-col gap-4">
        <h2 id="a11y-heading" className="text-xl font-semibold tracking-tight">
          Accessibility
        </h2>
        <ul className="flex flex-col gap-2">
          {doc.a11y.map((note) => (
            <li key={note} className="flex gap-2.5 text-sm text-fg-muted">
              <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-success" />
              {note}
            </li>
          ))}
        </ul>
      </section>

      <nav
        aria-label="Previous and next component"
        className="grid gap-3 border-t border-line pt-6 sm:grid-cols-2"
      >
        {previous ? (
          <Link
            href={`/components/${previous.slug}`}
            className="flex flex-col gap-1 rounded-xl border border-line p-4 transition-colors hover:border-line-strong"
          >
            <span className="flex items-center gap-1 text-xs text-fg-subtle">
              <ArrowLeft aria-hidden className="size-3" /> Previous
            </span>
            <span className="font-medium">{previous.name}</span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link
            href={`/components/${next.slug}`}
            className="flex flex-col items-end gap-1 rounded-xl border border-line p-4 transition-colors hover:border-line-strong"
          >
            <span className="flex items-center gap-1 text-xs text-fg-subtle">
              Next <ArrowRight aria-hidden className="size-3" />
            </span>
            <span className="font-medium">{next.name}</span>
          </Link>
        )}
      </nav>
    </article>
  )
}
