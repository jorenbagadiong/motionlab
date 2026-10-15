import { Kbd } from "@/components/ui/kbd"
import { Separator } from "@/components/ui/separator"

export function MiscExample() {
  return (
    <div className="flex items-center gap-3 text-sm text-fg-muted">
      <span>
        Apply with <Kbd>Enter</Kbd>
      </span>
      <Separator orientation="vertical" className="h-5" />
      <span>
        Revert with <Kbd>Esc</Kbd>
      </span>
    </div>
  )
}
