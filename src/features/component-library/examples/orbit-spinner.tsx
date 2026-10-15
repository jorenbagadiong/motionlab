import { OrbitSpinner } from "@/components/ui/orbit-spinner"

export function OrbitSpinnerExample() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 rounded-xl border border-line bg-surface p-4">
        <OrbitSpinner label="Rendering preview" />
        <div className="flex flex-col">
          <span className="text-sm font-medium">Rendering preview…</span>
          <span className="font-mono text-xs text-fg-subtle">frame 42 / 120</span>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <OrbitSpinner size="sm" />
        <OrbitSpinner />
        <OrbitSpinner size="lg" direction="counterclockwise" duration={2400} />
      </div>
    </div>
  )
}
