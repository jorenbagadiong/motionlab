import type { Metadata } from "next"
import { PageHeader } from "@/components/layout/page-header"
import { Container } from "@/components/ui/container"
import { BUILT_IN_PRESETS } from "@/features/presets/catalog"
import { GalleryBrowser } from "@/features/presets/components/gallery-browser"

export const metadata: Metadata = {
  title: "Explore",
  description: "Browse working animation presets built with Motion for React and Anime.js.",
}

export default function ExplorePage() {
  return (
    <Container className="flex flex-col gap-8 py-10 sm:py-14">
      <PageHeader
        eyebrow="Gallery"
        title="Explore animations"
        description="Hover a card to preview it, then open it in the playground to customize every supported property."
      />
      <GalleryBrowser presets={BUILT_IN_PRESETS} />
    </Container>
  )
}
