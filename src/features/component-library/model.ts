/**
 * Component library model: each UI component is described by data (name,
 * category, playground controls, props table) plus a pure function that prints
 * usage code for a set of control values. Previews live in previews.tsx so this
 * module stays free of React and can be used anywhere (proxy, tests).
 */

export type Control =
  | { kind: "select"; label: string; options: readonly string[]; initial: string }
  | { kind: "boolean"; label: string; initial: boolean }
  | { kind: "text"; label: string; initial: string; maxLength?: number }
  | { kind: "number"; label: string; initial: number; min: number; max: number; step: number }

export type Controls = Record<string, Control>

export type ControlValue = string | number | boolean

/**
 * The value type each control produces; select options stay literal types.
 * For the general `Controls` type (any component) it is a plain record.
 */
export type ValuesOf<C extends Controls> = Controls extends C
  ? Record<string, ControlValue>
  : {
      [K in keyof C]: C[K] extends { kind: "select"; options: readonly (infer O)[] }
        ? O
        : C[K] extends { kind: "boolean" }
          ? boolean
          : C[K] extends { kind: "number" }
            ? number
            : string
    }

export const CATEGORIES = [
  "Actions",
  "Forms",
  "Feedback",
  "Display",
  "Navigation",
  "Overlay",
] as const
export type Category = (typeof CATEGORIES)[number]

export interface PropDoc {
  name: string
  type: string
  default?: string
  description: string
}

export interface ComponentDoc<C extends Controls = Controls> {
  slug: string
  name: string
  category: Category
  description: string
  /** Module to import from, and the names it exports for this component. */
  importPath: string
  exports: string[]
  controls: C
  code: (values: ValuesOf<C>) => string
  props: PropDoc[]
  /** Ids of example files in ./examples shown under the playground. */
  examples: string[]
  /** Accessibility notes shown on the page. */
  a11y: string[]
}

/** Identity helper that keeps select options as literal types (const type parameter). */
export function defineComponent<const C extends Controls>(doc: ComponentDoc<C>): ComponentDoc<C> {
  return doc
}

export function initialValues<C extends Controls>(controls: C): ValuesOf<C> {
  return Object.fromEntries(
    Object.entries(controls).map(([key, control]) => [key, control.initial]),
  ) as ValuesOf<C>
}
