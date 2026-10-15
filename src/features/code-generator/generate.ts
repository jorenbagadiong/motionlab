import { type AnimationConfig, ENGINES } from "@/features/animations/model"
import { animeSvgDraw, animeTextReveal } from "./anime"
import {
  motionBouncingDots,
  motionFadeSlide,
  motionHoverLift,
  motionOrbitSpinner,
  motionPageTransition,
  motionProgressBar,
  motionSpringPop,
  motionStaggerCards,
} from "./motion"
import { toFileName, toIdentifier } from "./serialize"
import type { GeneratedCode, Snippet } from "./types"

function snippetFor(config: AnimationConfig, name: string): Snippet {
  const component = toIdentifier(name, "pascal")
  const fn = toIdentifier(name, "camel")
  switch (config.family) {
    case "fade-slide":
      return motionFadeSlide(config, component)
    case "spring-pop":
      return motionSpringPop(config, component)
    case "stagger-cards":
      return motionStaggerCards(config, component)
    case "hover-lift":
      return motionHoverLift(config, component)
    case "page-transition":
      return motionPageTransition(config, component)
    case "text-reveal":
      return animeTextReveal(config, fn)
    case "svg-draw":
      return animeSvgDraw(config, fn)
    case "bouncing-dots":
      return motionBouncingDots(config, component)
    case "progress-bar":
      return motionProgressBar(config, component)
    case "orbit-spinner":
      return motionOrbitSpinner(config, component)
  }
}

/** Generates a copy-ready implementation of `config`, named after the preset. */
export function generateCode(config: AnimationConfig, name: string): GeneratedCode {
  const engine = ENGINES[config.engine]
  const language = config.engine === "motion" ? "tsx" : "js"
  return {
    ...snippetFor(config, name),
    engine: config.engine,
    install: `npm install ${engine.packageName}@${engine.testedMajor}`,
    filename: `${toFileName(name)}.${language}`,
    language,
  }
}
