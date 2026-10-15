import { TextReveal } from "@/components/ui/text-reveal"

export function TextRevealPresetsExample() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <span className="font-mono text-xs text-fg-subtle">Character Rise</span>
        <TextReveal
          as="h2"
          text="Motion"
          split="char"
          effect="slide"
          duration={800}
          stagger={40}
          className="text-5xl font-semibold tracking-tight"
        />
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-mono text-xs text-fg-subtle">Letter Tumble</span>
        <TextReveal
          as="h2"
          text="Motion"
          split="char"
          effect="rotate"
          duration={1200}
          stagger={60}
          ease="outElastic"
          className="text-5xl font-semibold tracking-tight"
        />
      </div>
    </div>
  )
}
