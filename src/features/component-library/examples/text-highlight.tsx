import { TextHighlight } from "@/components/ui/text-highlight"

export function TextHighlightExample() {
  return (
    <div className="flex flex-col gap-4 text-lg leading-relaxed">
      <p>
        Motion runs the <TextHighlight variant="box">blocks</TextHighlight>, Anime.js draws the{" "}
        <TextHighlight variant="squiggle" delay={500}>
          details
        </TextHighlight>
        .
      </p>
      <p>
        Ship it <TextHighlight variant="circle">today</TextHighlight>, not{" "}
        <TextHighlight variant="strike" delay={600}>
          next sprint
        </TextHighlight>
        .
      </p>
      <p>
        <TextHighlight variant="marker">Reduced motion</TextHighlight> users see every mark{" "}
        <TextHighlight variant="underline" delay={500}>
          instantly
        </TextHighlight>
        .
      </p>
    </div>
  )
}
