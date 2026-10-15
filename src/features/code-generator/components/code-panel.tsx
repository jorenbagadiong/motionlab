"use client"

import { Lightbulb } from "lucide-react"
import { useId } from "react"
import { type AnimationConfig, ENGINES } from "@/features/animations/model"
import { cn } from "@/lib/utils/cn"
import { generateCode } from "../generate"
import { CodeBlock } from "./code-block"

interface CodePanelProps {
  config: AnimationConfig
  /** Preset name, used to name the generated component or function. */
  name: string
  /** True where the config can be edited, so the code updates live. */
  editable?: boolean
  className?: string
}

/** "How to use" instructions with code generated from the current config. */
export function CodePanel({ config, name, editable = false, className }: CodePanelProps) {
  const headingId = useId()
  const generated = generateCode(config, name)
  const engine = ENGINES[generated.engine]
  const kind = generated.language === "tsx" ? "component" : "function"

  const steps = [
    { title: "Install the library", label: "Terminal", code: generated.install },
    { title: `Add the ${kind} to your project`, label: generated.filename, code: generated.code },
    { title: "Use it", label: "Usage", code: generated.usage },
  ]

  return (
    <section aria-labelledby={headingId} className={cn("flex min-w-0 flex-col gap-4", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id={headingId} className="text-lg font-semibold">
          How to use
        </h2>
        <p className="text-xs text-fg-subtle">
          Generated for {engine.label} {engine.testedMajor}
        </p>
      </div>
      <p className="text-sm text-fg-muted">
        {editable
          ? "The code below matches the preview exactly and updates as you change properties."
          : "The code below matches the preview exactly. Open the playground to customize it first."}
      </p>

      <ol className="flex flex-col gap-5">
        {steps.map((step, index) => (
          <li key={step.title} className="flex min-w-0 flex-col gap-2">
            <h3 className="flex items-center gap-2 text-sm font-medium">
              <span
                aria-hidden
                className="flex size-5 items-center justify-center rounded-full bg-accent-soft text-xs text-accent"
              >
                {index + 1}
              </span>
              <span className="sr-only">Step {index + 1}:</span> {step.title}
            </h3>
            <CodeBlock code={step.code} label={step.label} />
          </li>
        ))}
      </ol>

      {generated.notes.length > 0 && (
        <ul className="flex flex-col gap-2 rounded-xl border border-line bg-surface p-4 text-sm text-fg-muted">
          {generated.notes.map((note) => (
            <li key={note} className="flex gap-2">
              <Lightbulb aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
              {note}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
