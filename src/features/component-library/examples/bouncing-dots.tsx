import { BouncingDots } from "@/components/ui/bouncing-dots"

export function BouncingDotsExample() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-fit items-center gap-3 rounded-2xl rounded-bl-sm border border-line bg-surface px-4 py-3">
        <BouncingDots size="sm" label="Ada is typing" />
      </div>
      <div className="flex items-center gap-6">
        <BouncingDots size="sm" />
        <BouncingDots />
        <BouncingDots size="lg" count={5} height={12} />
      </div>
    </div>
  )
}
