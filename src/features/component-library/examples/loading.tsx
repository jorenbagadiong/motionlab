import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"

export function LoadingExample() {
  return (
    <div className="flex max-w-sm flex-col gap-4">
      <Progress label="Export progress" value={64} />
      <Progress label="Loading presets" />
      <div className="flex items-center gap-3">
        <Spinner label="Loading presets" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    </div>
  )
}
