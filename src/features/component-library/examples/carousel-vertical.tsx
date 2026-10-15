import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const SLIDES = ["fade_up", "spring_pop", "svg_draw", "text_reveal", "orbit_spinner"]

export function CarouselVerticalExample() {
  return (
    <Carousel label="Presets" orientation="vertical" className="mx-auto w-full max-w-sm">
      <div className="flex gap-2">
        <CarouselContent className="h-56 flex-1">
          {SLIDES.map((name, i) => (
            <CarouselItem key={name}>
              <Slide name={name} index={i} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex flex-col justify-center gap-1">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </div>
    </Carousel>
  )
}

function Slide({ name, index }: { name: string; index: number }) {
  return (
    <div className="flex h-full flex-col justify-between rounded-md border border-line bg-surface bg-dots p-4 font-mono">
      <span className="text-xs text-fg-subtle">{String(index + 1).padStart(2, "0")}</span>
      <span className="text-sm text-fg sm:text-base">
        <span className="text-accent">&gt;</span> {name}.tsx
      </span>
    </div>
  )
}
