"use client"

import type { ComponentType } from "react"
import { AlertExample } from "../examples/alert"
import { BadgeExample } from "../examples/badge"
import { BouncingDotsExample } from "../examples/bouncing-dots"
import { ButtonExample } from "../examples/button"
import { CardExample } from "../examples/card"
import { CarouselDefaultExample } from "../examples/carousel-default"
import { CarouselFooterExample } from "../examples/carousel-footer"
import { CarouselMultipleExample } from "../examples/carousel-multiple"
import { CarouselOpacityExample } from "../examples/carousel-opacity"
import { CarouselPaginationExample } from "../examples/carousel-pagination"
import { CarouselProgressExample } from "../examples/carousel-progress"
import { CarouselScaleExample } from "../examples/carousel-scale"
import { CarouselStatusExample } from "../examples/carousel-status"
import { CarouselStatusShortExample } from "../examples/carousel-status-2"
import { CarouselThumbsExample } from "../examples/carousel-thumbs"
import { CarouselVerticalExample } from "../examples/carousel-vertical"
import { DialogExample } from "../examples/dialog"
import { FormExample } from "../examples/form"
import { LineDrawExample } from "../examples/line-draw"
import { LoadingExample } from "../examples/loading"
import { MiscExample } from "../examples/misc"
import { OrbitSpinnerExample } from "../examples/orbit-spinner"
import { NumberTickerExample } from "../examples/number-ticker"
import { TabsExample } from "../examples/tabs"
import { TextHighlightExample } from "../examples/text-highlight"
import { TextRevealExample } from "../examples/text-reveal"
import { TextRevealPresetsExample } from "../examples/text-reveal-presets"
import { TextScrambleExample } from "../examples/text-scramble"

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
  "bouncing-dots": BouncingDotsExample,
  "orbit-spinner": OrbitSpinnerExample,
  "line-draw": LineDrawExample,
  "text-reveal": TextRevealExample,
  "text-reveal-presets": TextRevealPresetsExample,
  "number-ticker": NumberTickerExample,
  "text-scramble": TextScrambleExample,
  "text-highlight": TextHighlightExample,
  "carousel-default": CarouselDefaultExample,
  "carousel-multiple": CarouselMultipleExample,
  "carousel-vertical": CarouselVerticalExample,
  "carousel-status": CarouselStatusExample,
  "carousel-status-2": CarouselStatusShortExample,
  "carousel-pagination": CarouselPaginationExample,
  "carousel-footer": CarouselFooterExample,
  "carousel-progress": CarouselProgressExample,
  "carousel-thumbs": CarouselThumbsExample,
  "carousel-opacity": CarouselOpacityExample,
  "carousel-scale": CarouselScaleExample,
}

/** Renders an example component by id (pages are server components). */
export function ExampleDemo({ id }: { id: string }) {
  const Example = EXAMPLE_COMPONENTS[id]
  return Example ? <Example /> : null
}
