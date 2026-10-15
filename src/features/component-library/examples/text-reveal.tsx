import { TextReveal } from "@/components/ui/text-reveal"

export function TextRevealExample() {
  return (
    <div className="flex flex-col gap-6">
      <TextReveal
        as="h2"
        text="Ship motion that feels designed."
        effect="blur"
        className="text-3xl font-semibold tracking-tight"
      />
      <TextReveal
        text={"$ npm run build\n✓ compiled in 1.2s"}
        effect="terminal"
        delay={600}
        className="text-sm text-fg-muted"
      />
      <TextReveal
        text="Every letter on its own beat."
        split="char"
        effect="rotate"
        trigger="inView"
        className="text-xl font-medium"
      />
    </div>
  )
}
