import { Container } from "@/components/ui/container"
import { LibrarySidebar } from "@/features/component-library/components/library-sidebar"

export default function ComponentsLayout({ children }: LayoutProps<"/components">) {
  return (
    <Container className="grid gap-6 py-6 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-10 lg:py-10">
      <aside className="lg:sticky lg:top-24 lg:max-h-[calc(100dvh-7rem)] lg:self-start lg:overflow-y-auto lg:pb-6">
        <LibrarySidebar />
      </aside>
      <div className="flex min-w-0 flex-col">{children}</div>
    </Container>
  )
}
