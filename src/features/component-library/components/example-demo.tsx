"use client"

import type { ComponentType } from "react"
import { AlertExample } from "../examples/alert"
import { BadgeExample } from "../examples/badge"
import { ButtonExample } from "../examples/button"
import { CardExample } from "../examples/card"
import { DialogExample } from "../examples/dialog"
import { FormExample } from "../examples/form"
import { LoadingExample } from "../examples/loading"
import { MiscExample } from "../examples/misc"
import { TabsExample } from "../examples/tabs"

export const EXAMPLE_COMPONENTS: Record<string, ComponentType> = {
  button: ButtonExample,
  badge: BadgeExample,
  alert: AlertExample,
  card: CardExample,
  form: FormExample,
  tabs: TabsExample,
  dialog: DialogExample,
  loading: LoadingExample,
  misc: MiscExample,
}

/** Renders an example component by id (pages are server components). */
export function ExampleDemo({ id }: { id: string }) {
  const Example = EXAMPLE_COMPONENTS[id]
  return Example ? <Example /> : null
}
