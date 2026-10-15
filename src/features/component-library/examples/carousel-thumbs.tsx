import { Carousel, CarouselContent, CarouselItem, CarouselThumbs } from "@/components/ui/carousel"

const SLIDES = ["fade_up", "spring_pop", "svg_draw", "text_reveal", "orbit_spinner"]

export function CarouselThumbsExample() {
  return (
    <Carousel label="Presets" className="mx-auto w-full max-w-md">
      <CarouselContent>
        {SLIDES.map((name, i) => (
          <CarouselItem key={name}>
            <Slide name={name} index={i} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselThumbs>
        {(i) => (
          <span className="flex h-10 w-16 items-center justify-center rounded-sm border border-line bg-surface bg-dots font-mono text-[10px] text-fg-muted">
            {String(i + 1).padStart(2, "0")}
          </span>
        )}
      </CarouselThumbs>
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
