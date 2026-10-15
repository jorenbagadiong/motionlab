"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPagination,
  CarouselPrevious,
  useCarousel,
} from "@/components/ui/carousel"
import { NumberTicker } from "@/components/ui/number-ticker"
import { TextHighlight } from "@/components/ui/text-highlight"
import { TextReveal } from "@/components/ui/text-reveal"
import { TextScramble } from "@/components/ui/text-scramble"

interface Showcase {
  slug: string
  name: string
  demo: ReactNode
}

const SHOWCASE: Showcase[] = [
  {
    slug: "text-highlight",
    name: "Text Highlight",
    demo: (
      <p className="text-3xl font-semibold">
        Ship{" "}
        <TextHighlight variant="squiggle" trigger="mount">
          smooth
        </TextHighlight>{" "}
        UI.
      </p>
    ),
  },
  {
    slug: "text-reveal",
    name: "Text Reveal",
    demo: (
      <TextReveal
        text="Every word on cue."
        effect="blur"
        className="text-3xl font-semibold tracking-tight"
      />
    ),
  },
  {
    slug: "number-ticker",
    name: "Number Ticker",
    demo: (
      <p className="flex flex-col items-center gap-1 font-mono">
        <span className="text-xs text-fg-subtle">frames shipped</span>
        <NumberTicker value={12840} className="text-5xl text-fg" duration={1400} />
      </p>
    ),
  },
  {
    slug: "text-scramble",
    name: "Text Scramble",
    demo: (
      // Label above, word below, both centered. TextScramble reserves the longest word's
      // width, so the line never resizes; the word grows from the center as it types.
      <p className="flex flex-col items-center gap-1 text-center font-mono">
        <span className="text-xs text-fg-subtle">$ build --with</span>
        <TextScramble
          mode="type"
          words={["Motion", "Anime.js", "Tailwind CSS"]}
          loop={false}
          className="text-2xl text-fg"
        />
      </p>
    ),
  },
]

/** Remounts its demo whenever the slide becomes current, so the animation replays. */
function ShowcaseSlide({ item, index }: { item: Showcase; index: number }) {
  const { index: current } = useCarousel()
  const active = index === current
  return (
    <div className="flex aspect-[4/3] flex-col rounded-lg border border-line bg-canvas bg-dots p-4 sm:aspect-video">
      <div className="flex items-center justify-between font-mono text-xs">
        <span className="text-fg-subtle">{String(index + 1).padStart(2, "0")}</span>
        <Link
          href={`/components/${item.slug}`}
          className="text-fg-muted underline-offset-4 hover:text-fg hover:underline"
        >
          &gt; {item.name}
        </Link>
      </div>
      <div className="flex flex-1 items-center justify-center text-center">
        <div key={active ? "active" : "idle"}>{item.demo}</div>
      </div>
    </div>
  )
}

/** Live sampler of library components for the landing hero, itself built with the Carousel. */
export function ComponentShowcase() {
  return (
    <section
      aria-label="Live component demo"
      className="w-full min-w-0 rounded-2xl border border-line bg-surface p-3 shadow-panel sm:p-4"
    >
      {/* No autoplay: the hero stays still until someone drags or clicks. */}
      <Carousel label="Component showcase" loop>
        <CarouselContent>
          {SHOWCASE.map((item, i) => (
            <CarouselItem key={item.slug}>
              <ShowcaseSlide item={item} index={i} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex items-center justify-between gap-2">
          <CarouselPrevious />
          <CarouselPagination />
          <CarouselNext />
        </div>
      </Carousel>
    </section>
  )
}
