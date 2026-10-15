"use client"

import { animate, createTimeline, steps } from "animejs"
import { useRef } from "react"
import { type AnimeTrigger, useAnimeTrigger } from "@/lib/hooks/use-anime-trigger"
import { cn } from "@/lib/utils/cn"

export type TextScrambleMode = "scramble" | "type"

interface TextScrambleProps {
  /** The text to show. Ignored when `words` is given. */
  text?: string
  /** Cycles through these, one after another. */
  words?: string[]
  /** `scramble` decodes from random glyphs; `type` types it out behind a caret. */
  mode?: TextScrambleMode
  /** Milliseconds to scramble or type one word. */
  duration?: number
  /** Milliseconds a finished word stays before the next one. */
  pause?: number
  /** Repeat the word list forever. */
  loop?: boolean
  /** Glyphs used while scrambling. */
  glyphs?: string
  trigger?: AnimeTrigger
  replay?: boolean
  className?: string
}

const GLYPHS = "!<>-_\\/[]{}=+*^?#01"

function randomGlyph(glyphs: string) {
  return glyphs[Math.floor(Math.random() * glyphs.length)] ?? "#"
}

/** The text at progress `p` (0–1) of decoding `word`. Spaces stay spaces. */
export function scrambleFrame(word: string, p: number, glyphs = GLYPHS): string {
  const chars = Array.from(word)
  const revealed = Math.round(p * chars.length)
  return chars
    .map((char, i) => (i < revealed || char === " " ? char : randomGlyph(glyphs)))
    .join("")
}

/** The text at progress `p` (0–1) of typing `word`. */
export function typeFrame(word: string, p: number): string {
  const chars = Array.from(word)
  return chars.slice(0, Math.round(p * chars.length)).join("")
}

/**
 * Text that decodes from random glyphs or types itself out (Anime.js drives the
 * progress; the text node is updated directly, not through React state).
 * Screen readers get the words once, never the in-between frames.
 */
export function TextScramble({
  text = "",
  words,
  mode = "scramble",
  duration = 900,
  pause = 1600,
  loop = true,
  glyphs = GLYPHS,
  trigger = "mount",
  replay = false,
  className,
}: TextScrambleProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const list = words && words.length > 0 ? words : [text]
  const typing = mode === "type"
  // Reserve the longest word's width (monospace: 1ch per character, plus the caret)
  // so typing and cycling never push the surrounding text around. The text inside follows
  // the parent's text-align (e.g. text-center grows the word from the middle).
  const longest = Math.max(...list.map((word) => Array.from(word).length)) + (typing ? 1 : 0)

  useAnimeTrigger(ref, {
    trigger,
    replay,
    key: `${list.join("\u0000")}|${mode}|${duration}|${pause}|${loop}|${glyphs}`,
    // Typing starts from nothing; without this the whole word shows for a frame.
    prepare: (root) => {
      const node = root.querySelector("[data-output]")?.firstChild
      if (!typing || !node) return
      const resting = node.nodeValue
      node.nodeValue = "​"
      return {
        revert: () => {
          node.nodeValue = resting
        },
      }
    },
    play: (root) => {
      const node = root.querySelector("[data-output]")?.firstChild
      const write = (value: string) => {
        // Never empty, so React's text node stays in place.
        if (node) node.nodeValue = value || "​"
      }
      const frame = (word: string, p: number) =>
        write(typing ? typeFrame(word, p) : scrambleFrame(word, p, glyphs))

      const cycling = list.length > 1
      const timeline = createTimeline({ loop: cycling && loop })
      list.forEach((word, index) => {
        const progress = { p: 0 }
        timeline.add(progress, {
          p: [0, 1],
          duration,
          ease: "linear",
          onUpdate: () => frame(word, progress.p),
        })
        const last = index === list.length - 1
        if (!cycling || (last && !loop)) return
        // Hold the finished word, then (typing) delete it before the next one.
        const out = { p: 1 }
        timeline.add(out, {
          p: [1, typing ? 0 : 1],
          duration: typing ? duration / 2 : 1,
          delay: pause,
          ease: "linear",
          onUpdate: () => frame(word, out.p),
        })
      })

      const caret = root.querySelector("[data-caret]")
      const blink = caret
        ? animate(caret, {
            opacity: [1, 0],
            duration: 530,
            ease: steps(1),
            loop: true,
            alternate: true,
          })
        : undefined

      return {
        revert: () => {
          timeline.revert()
          blink?.revert()
          write(list[0] ?? "")
        },
      }
    },
  })

  return (
    <span ref={ref} className={cn("font-mono", className)}>
      <span className="sr-only">{list.join(", ")}</span>
      <span aria-hidden className="inline-block" style={{ minWidth: `min(${longest}ch, 100%)` }}>
        <span data-output className="whitespace-pre-wrap">
          {list[0] || "​"}
        </span>
        {typing && (
          <span data-caret className="ml-px text-accent">
            ▍
          </span>
        )}
      </span>
    </span>
  )
}
