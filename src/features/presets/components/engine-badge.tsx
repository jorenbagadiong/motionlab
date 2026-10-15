import { Badge } from "@/components/ui/badge"
import { ENGINES, type EngineId } from "@/features/animations/model"

export function EngineBadge({ engine }: { engine: EngineId }) {
  return (
    <Badge tone={engine}>
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      <span className="sr-only">Engine:</span> {ENGINES[engine].label}
    </Badge>
  )
}
