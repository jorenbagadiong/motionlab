"use client"

import dynamic from "next/dynamic"
import type { ComponentType } from "react"
import type { AnimationConfig, ConfigFor, FamilyId } from "../model"
import type { RendererProps } from "./types"

function RendererFallback() {
  return <div aria-hidden className="size-16 animate-pulse rounded-xl bg-surface-overlay" />
}

/**
 * Each renderer is code-split, so a page only downloads the animation engine
 * (and family code) for the presets it actually displays.
 */
const RENDERERS: { [F in FamilyId]: ComponentType<RendererProps<ConfigFor<F>>> } = {
  "fade-slide": dynamic(() => import("./renderers/fade-slide"), { loading: RendererFallback }),
  "spring-pop": dynamic(() => import("./renderers/spring-pop"), { loading: RendererFallback }),
  "stagger-cards": dynamic(() => import("./renderers/stagger-cards"), {
    loading: RendererFallback,
  }),
  "hover-lift": dynamic(() => import("./renderers/hover-lift"), { loading: RendererFallback }),
  "page-transition": dynamic(() => import("./renderers/page-transition"), {
    loading: RendererFallback,
  }),
  "text-reveal": dynamic(() => import("./renderers/text-reveal"), { loading: RendererFallback }),
  "svg-draw": dynamic(() => import("./renderers/svg-draw"), { loading: RendererFallback }),
  "bouncing-dots": dynamic(() => import("./renderers/bouncing-dots"), {
    loading: RendererFallback,
  }),
  "progress-bar": dynamic(() => import("./renderers/progress-bar"), { loading: RendererFallback }),
  "orbit-spinner": dynamic(() => import("./renderers/orbit-spinner"), {
    loading: RendererFallback,
  }),
}

export function AnimationRenderer(props: RendererProps<AnimationConfig>) {
  // The mapped type above guarantees each family gets its own config type; the
  // cast only bridges TypeScript's inability to correlate the union lookup.
  const Renderer = RENDERERS[props.config.family] as ComponentType<RendererProps<AnimationConfig>>
  return <Renderer {...props} />
}
