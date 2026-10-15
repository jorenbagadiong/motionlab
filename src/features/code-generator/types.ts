import type { EngineId } from "@/features/animations/model"

/** Family-specific output of a generator. */
export interface Snippet {
  /** The component or function to add to a project. */
  code: string
  /** A short example of using it. */
  usage: string
  notes: string[]
}

export interface GeneratedCode extends Snippet {
  engine: EngineId
  install: string
  filename: string
  language: "tsx" | "js"
}
