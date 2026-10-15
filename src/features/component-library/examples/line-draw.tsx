import { LineDraw } from "@/components/ui/line-draw"

export function LineDrawExample() {
  return (
    <div className="flex flex-wrap items-center gap-8">
      <LineDraw label="Image" viewBox="0 0 120 96" strokeWidth={3} className="h-24 w-32">
        <rect x="6" y="6" width="108" height="84" rx="14" />
        <path d="M22 66 L44 40 L62 56 L76 44 L98 66" />
        <circle cx="86" cy="26" r="8" />
      </LineDraw>
      <LineDraw viewBox="0 0 48 48" repeat="alternate" className="size-16 text-fg">
        <path d="M14 18 L4 24 L14 30" />
        <path d="M34 18 L44 24 L34 30" />
        <path d="M28 10 L20 38" />
      </LineDraw>
      <LineDraw
        label="Signature"
        viewBox="0 0 160 60"
        duration={2400}
        trigger="inView"
        className="h-16 w-44"
      >
        <path d="M8 44 C 20 8, 34 8, 30 40 S 52 52, 60 28 S 74 10, 78 38 C 82 52, 96 20, 104 34 S 128 46, 152 22" />
      </LineDraw>
    </div>
  )
}
