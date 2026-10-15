import {
  bouncingDotsParams,
  orbitSpinnerParams,
  progressBarParams,
  svgDrawParams,
  textRevealParams,
} from "@/features/animations/adapters/anime"
import type { ConfigFor } from "@/features/animations/model"
import { type CodeValue, raw, toCode } from "./serialize"
import type { Snippet } from "./types"

/**
 * Anime.js code generation. Parameters come from the same adapter builders
 * the preview runs. Each snippet exports a function that takes a root element
 * and returns the animation, so callers control timing and cleanup.
 */

const CLEANUP_NOTE =
  "Call animation.revert() when the element unmounts to stop the animation and restore styles."

function animeModule(
  imports: string[],
  fn: string,
  description: string,
  targets: string,
  params: Record<string, CodeValue>,
): string {
  return `import { ${imports.join(", ")} } from "animejs"

/**
 * ${description}
 * @param {ParentNode} root Element containing the markup shown in the usage example.
 */
export function ${fn}(root) {
  return animate(${targets}, ${toCode(params, 2)})
}
`
}

function reactUsage(fn: string, element: string, children: string): string {
  return `const ref = useRef<HTMLElement>(null)

useEffect(() => {
  if (!ref.current) return
  const animation = ${fn}(ref.current)
  return () => {
    animation.revert()
  }
}, [])

return (
  <${element} ref={ref}>
${children}
  </${element}>
)`
}

export function animeTextReveal(c: ConfigFor<"text-reveal">, fn: string): Snippet {
  return {
    code: animeModule(
      ["animate", "stagger"],
      fn,
      "Reveals each character of a headline in sequence.",
      `root.querySelectorAll(".char")`,
      { ...textRevealParams(c), delay: raw(`stagger(${c.stagger}, { start: ${c.delay} })`) },
    ),
    usage: reactUsage(
      fn,
      "h1",
      `    {Array.from("Motion").map((char, i) => (
      <span key={i} className="char" style={{ display: "inline-block" }}>
        {char}
      </span>
    ))}`,
    ),
    notes: ["Characters must be inline-block so their transforms apply.", CLEANUP_NOTE],
  }
}

export function animeSvgDraw(c: ConfigFor<"svg-draw">, fn: string): Snippet {
  return {
    code: animeModule(
      ["animate", "createDrawable", "stagger"],
      fn,
      "Draws each SVG stroke in sequence.",
      `createDrawable(root.querySelectorAll("path, rect, circle"))`,
      { ...svgDrawParams(c), delay: raw(`stagger(${c.stagger}, { start: ${c.delay} })`) },
    ),
    usage: reactUsage(
      fn,
      "svg",
      `    {/* viewBox, fill="none" and stroke attributes as in your icon */}
    <rect x="6" y="6" width="108" height="84" rx="14" />
    <path d="M22 66 L44 40 L62 56 L76 44 L98 66" />`,
    ),
    notes: ["Shapes need a stroke and no fill for the drawing to be visible.", CLEANUP_NOTE],
  }
}

export function animeBouncingDots(c: ConfigFor<"bouncing-dots">, fn: string): Snippet {
  const dots = Array.from({ length: c.count }, () => `    <span className="dot" />`).join("\n")
  return {
    code: animeModule(
      ["animate", "stagger"],
      fn,
      "A looping, staggered bounce for loading indicators.",
      `root.querySelectorAll(".dot")`,
      { ...bouncingDotsParams(c), delay: raw(`stagger(${c.stagger})`) },
    ),
    usage: reactUsage(fn, "div", dots),
    notes: [
      'Give the container role="status" and a text label so the loading state is announced.',
      CLEANUP_NOTE,
    ],
  }
}

export function animeProgressBar(c: ConfigFor<"progress-bar">, fn: string): Snippet {
  return {
    code: animeModule(
      ["animate"],
      fn,
      "Fills a progress bar using a transform, avoiding layout work.",
      `root.querySelectorAll(".bar")`,
      progressBarParams(c),
    ),
    usage: reactUsage(fn, "div", `    <div className="bar" style={{ transformOrigin: "left" }} />`),
    notes: ["The bar must use transform-origin: left so it grows from the start.", CLEANUP_NOTE],
  }
}

export function animeOrbitSpinner(c: ConfigFor<"orbit-spinner">, fn: string): Snippet {
  return {
    code: animeModule(
      ["animate"],
      fn,
      "Rotates satellites around a center point.",
      `root.querySelectorAll(".orbit")`,
      orbitSpinnerParams(c),
    ),
    usage: reactUsage(
      fn,
      "div",
      `    <div className="orbit">
      <span className="satellite" />
    </div>`,
    ),
    notes: ["Position the satellites inside .orbit; the whole group rotates.", CLEANUP_NOTE],
  }
}
