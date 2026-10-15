import { Tabs } from "@/components/ui/tabs"
import { CodeBlock } from "@/features/code-generator/components/code-block"
import type { ExampleSnippet } from "../examples"
import { ExampleDemo } from "./example-demo"

export function ExampleSection({ example }: { example: ExampleSnippet }) {
  const headingId = `example-${example.id}-heading`
  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h3 id={headingId} className="font-semibold">
          {example.title}
        </h3>
        <p className="text-sm text-fg-muted">{example.description}</p>
      </div>
      <Tabs
        label={`${example.title} example`}
        items={[
          {
            id: "preview",
            label: "Preview",
            content: (
              <div className="rounded-2xl border border-line bg-canvas bg-grid p-6 sm:p-8">
                <ExampleDemo id={example.id} />
              </div>
            ),
          },
          {
            id: "code",
            label: "Code",
            content: <CodeBlock code={example.code} label={`${example.id}-example.tsx`} />,
          },
        ]}
      />
    </section>
  )
}
