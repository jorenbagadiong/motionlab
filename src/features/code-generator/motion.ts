import {
  fadeSlideKeyframes,
  fadeSlideTransition,
  hoverLiftProps,
  pageTransitionKeyframes,
  springPopKeyframes,
  springPopTransition,
  staggerCardsKeyframes,
} from "@/features/animations/adapters/motion"
import type { ConfigFor } from "@/features/animations/model"
import { type CodeValue, raw, toCode } from "./serialize"
import type { Snippet } from "./types"

/**
 * Motion for React code generation. Values come from the same adapter
 * builders the preview runs, so the snippet always matches the preview.
 */

type Keyframes = Record<string, readonly [number, number] | number[]>

const from = (frames: Keyframes) =>
  Object.fromEntries(Object.entries(frames).map(([key, values]) => [key, values[0]!]))
const to = (frames: Keyframes) =>
  Object.fromEntries(Object.entries(frames).map(([key, values]) => [key, values.at(-1)!]))

const seconds = (ms: number) => ms / 1000

/** Renders `name={value}` JSX props, indented for a component's opening tag. */
function props(entries: Record<string, CodeValue>, indent: number): string {
  const pad = " ".repeat(indent)
  return Object.entries(entries)
    .map(([key, value]) => `${pad}${key}={${toCode(value, indent)}}`)
    .join("\n")
}

const REDUCED_MOTION_NOTE =
  'Wrap your app in <MotionConfig reducedMotion="user"> so transform animations respect the reduced-motion setting.'

export function motionFadeSlide(c: ConfigFor<"fade-slide">, component: string): Snippet {
  const frames = fadeSlideKeyframes(c)
  return {
    code: `"use client"

import { motion } from "motion/react"
import type { ReactNode } from "react"

export function ${component}({ children }: { children: ReactNode }) {
  return (
    <motion.div
${props({ initial: from(frames), animate: to(frames), transition: fadeSlideTransition(c) }, 6)}
    >
      {children}
    </motion.div>
  )
}
`,
    usage: `<${component}>
  <Card />
</${component}>`,
    notes: [REDUCED_MOTION_NOTE],
  }
}

export function motionSpringPop(c: ConfigFor<"spring-pop">, component: string): Snippet {
  const frames = springPopKeyframes(c)
  return {
    code: `"use client"

import { motion } from "motion/react"
import type { ReactNode } from "react"

export function ${component}({ children }: { children: ReactNode }) {
  return (
    <motion.div
${props({ initial: from(frames), animate: to(frames), transition: springPopTransition(c) }, 6)}
    >
      {children}
    </motion.div>
  )
}
`,
    usage: `<${component}>
  <Badge />
</${component}>`,
    notes: [REDUCED_MOTION_NOTE],
  }
}

export function motionStaggerCards(c: ConfigFor<"stagger-cards">, component: string): Snippet {
  const frames = staggerCardsKeyframes(c)
  const list = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: raw(
          `stagger(${toCode(seconds(c.stagger))}, { startDelay: ${toCode(seconds(c.delay))} })`,
        ),
      },
    },
  }
  const item = {
    hidden: from(frames),
    visible: { ...to(frames), transition: { duration: seconds(c.duration), ease: c.ease } },
  }
  const labels = Array.from({ length: c.count }, (_, i) => `"Item ${i + 1}"`).join(", ")
  return {
    code: `"use client"

import { motion, stagger, type Variants } from "motion/react"

const list: Variants = ${toCode(list)}

const item: Variants = ${toCode(item)}

export function ${component}({ items }: { items: string[] }) {
  return (
    <motion.ul initial="hidden" animate="visible" variants={list}>
      {items.map((label) => (
        <motion.li key={label} variants={item}>
          {label}
        </motion.li>
      ))}
    </motion.ul>
  )
}
`,
    usage: `<${component} items={[${labels}]} />`,
    notes: [REDUCED_MOTION_NOTE],
  }
}

export function motionHoverLift(c: ConfigFor<"hover-lift">, component: string): Snippet {
  const { whileHover, whileFocus, whileTap, transition } = hoverLiftProps(c)
  return {
    code: `"use client"

import { motion } from "motion/react"
import type { ReactNode } from "react"

export function ${component}({ children }: { children: ReactNode }) {
  return (
    <motion.button
      type="button"
${props({ whileHover, whileFocus, whileTap, transition }, 6)}
    >
      {children}
    </motion.button>
  )
}
`,
    usage: `<${component}>Open project</${component}>`,
    notes: [
      "whileFocus responds to keyboard focus, so the effect is available without a mouse.",
      REDUCED_MOTION_NOTE,
    ],
  }
}

export function motionPageTransition(c: ConfigFor<"page-transition">, component: string): Snippet {
  const { exit, enter } = pageTransitionKeyframes(c)
  const transition = { duration: seconds(c.duration), ease: c.ease }
  return {
    code: `"use client"

import { AnimatePresence, motion } from "motion/react"
import type { ReactNode } from "react"

/** Animates between pages: the old page exits, then the new one enters. */
export function ${component}({ pageKey, children }: { pageKey: string; children: ReactNode }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pageKey}
${props({ initial: from(enter), animate: to(enter), exit: to(exit), transition }, 8)}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
`,
    usage: `const [page, setPage] = useState("home")

<${component} pageKey={page}>
  {page === "home" ? <Home /> : <Details />}
</${component}>`,
    notes: [
      "Change pageKey to trigger the transition; the exit finishes before the next page enters.",
      REDUCED_MOTION_NOTE,
    ],
  }
}
