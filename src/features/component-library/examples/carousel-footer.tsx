"use client"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselStatus,
  useCarousel,
} from "@/components/ui/carousel"
import { TextScramble } from "@/components/ui/text-scramble"

const SLIDES = ["fade_up", "spring_pop", "svg_draw", "text_reveal", "orbit_spinner"]

export function CarouselFooterExample() {
  return (
    <Carousel label="Presets" className="mx-auto w-full max-w-md">
      <div className="overflow-hidden rounded-lg border border-line">
        <CarouselContent className="p-2 pb-0">
          {SLIDES.map((name, i) => (
            <CarouselItem key={name}>
              <Slide name={name} index={i} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <footer className="flex items-center gap-3 border-t border-line bg-surface px-3 py-2">
          <Caption />
          <CarouselStatus format="short" className="ml-auto" />
          <div className="flex">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </footer>
      </div>
    </Carousel>
  )
}

function Slide({ name, index }: { name: string; index: number }) {
  return (
    <div className="flex aspect-video flex-col justify-between rounded-md border border-line bg-surface bg-dots p-4 font-mono">
      <span className="text-xs text-fg-subtle">{String(index + 1).padStart(2, "0")}</span>
      <span className="text-sm text-fg sm:text-base">
        <span className="text-accent">&gt;</span> {name}.tsx
      </span>
    </div>
  )
}

/** Scrambles to the current slide's file name (Anime.js), under the slides. */
function Caption() {
  const { index } = useCarousel()
  return <TextScramble text={SLIDES[index] + ".tsx"} duration={500} className="truncate text-xs" />
}
