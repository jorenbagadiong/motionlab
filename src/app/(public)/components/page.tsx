import type { Metadata } from "next"
import { PageHeader } from "@/components/layout/page-header"
import { ComponentCard } from "@/features/component-library/components/component-card"
import { COMPONENT_LIST, componentsByCategory } from "@/features/component-library/registry"

export const metadata: Metadata = {
  title: "Components",
  description:
    "The MotionLab component library: buttons, form controls, alerts, dialogs and more, each with a live playground.",
}

export default function ComponentsPage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        eyebrow="Component library"
        title="Components"
        description={`${COMPONENT_LIST.length} accessible building blocks that follow your light/dark mode and color theme. Open one to tweak its props in a live playground and copy the code.`}
      />
      {componentsByCategory().map(({ category, docs }) => (
        <section
          key={category}
          aria-labelledby={`${category}-heading`}
          className="flex flex-col gap-4"
        >
          <h2 id={`${category}-heading`} className="text-lg font-semibold">
            {category}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {docs.map((doc) => (
              <ComponentCard key={doc.slug} doc={doc} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
