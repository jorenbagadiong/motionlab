"use client"

import { animate, stagger, steps, utils } from "animejs"
import { type ElementType, Fragment, useRef } from "react"
import { type AnimeTrigger, useAnimeTrigger } from "@/lib/hooks/use-anime-trigger"
import { cn } from "@/lib/utils/cn"

export type TextRevealSplit = "char" | "word" | "line"
export type TextRevealEffect = "slide" | "blur" | "rotate" | "terminal"

interface TextRevealProps {
  text: string
  /** Animate per character, per word, or per line (lines are separated by "\n"). */
  split?: TextRevealSplit
  effect?: TextRevealEffect
  /** Element to render, e.g. "h1". */
  as?: ElementType
  /** Milliseconds per piece. */
  duration?: number
  /** Milliseconds between pieces. */
  stagger?: number
  delay?: number
  /** Anime.js easing name, e.g. "outElastic". */
  ease?: string
  trigger?: AnimeTrigger
  replay?: boolean
  className?: string
}

const HIDDEN: Record<Exclude<TextRevealEffect, "terminal">, Record<string, number | string>> = {
  slide: { opacity: 0, translateY: "0.6em" },
  blur: { opacity: 0, filter: "blur(8px)" },
  rotate: { opacity: 0, translateY: "0.4em", rotate: 12 },
}
const SHOWN: Record<Exclude<TextRevealEffect, "terminal">, Record<string, number | string>> = {
  slide: { opacity: 1, translateY: "0em" },
  blur: { opacity: 1, filter: "blur(0px)" },
  rotate: { opacity: 1, translateY: "0em", rotate: 0 },
}

/** Lines → words (whitespace kept as its own entries). Lines are never split further. */
function splitText(text: string, split: TextRevealSplit): string[][] {
  return text
    .split("\n")
    .map((line) => (split === "line" ? [line] : line.split(/(\s+)/).filter(Boolean)))
}

/**
 * Text that animates in piece by piece with Anime.js. Screen readers get the
 * whole text once; the animated pieces are hidden from them.
 */
export function TextReveal({
  text,
  split = "word",
  effect = "slide",
  as: Tag = "p",
  duration = 600,
  stagger: gap,
  delay = 0,
  ease = "outExpo",
  trigger = "mount",
  replay = false,
  className,
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null)
  const terminal = effect === "terminal"
  const step = gap ?? (terminal ? 35 : split === "char" ? 30 : split === "word" ? 80 : 160)
  const lines = splitText(text, split)

  useAnimeTrigger(ref, {
    trigger,
    replay,
    key: `${text}|${split}|${effect}|${duration}|${step}|${delay}|${ease}`,
    prepare: (root) => {
      const pieces = root.querySelectorAll("[data-piece]")
      return utils.set(pieces, terminal ? { opacity: 0 } : HIDDEN[effect])
    },
    play: (root) => {
      const pieces = root.querySelectorAll("[data-piece]")
      if (!terminal) {
        return animate(pieces, {
          ...SHOWN[effect],
          duration,
          ease,
          delay: stagger(step, { start: delay }),
        })
      }
      // Pieces appear in fixed steps while a caret blinks after them.
      const typing = animate(pieces, {
        opacity: 1,
        duration: 1,
        delay: stagger(step, { start: delay }),
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
          typing.revert()
          blink?.revert()
        },
      }
    },
  })

  return (
    <Tag ref={ref} className={cn("text-balance", className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden className={cn(terminal && "font-mono")}>
        {lines.map((words, lineIndex) => (
          <Fragment key={lineIndex}>
            {lineIndex > 0 && <br />}
            {words.map((word, index) => {
              if (/^\s+$/.test(word)) return <Fragment key={index}>{word}</Fragment>
              if (split !== "char" && !terminal) {
                return (
                  <span key={index} data-piece className="inline-block">
                    {word}
                  </span>
                )
              }
              // Characters stay grouped per word so a word never breaks across lines.
              return (
                <span key={index} className="inline-block whitespace-nowrap">
                  {Array.from(word).map((char, charIndex) => (
                    <span key={charIndex} data-piece className="inline-block">
                      {char}
                    </span>
                  ))}
                </span>
              )
            })}
          </Fragment>
        ))}
        {terminal && (
          <span data-caret className="ml-0.5 inline-block text-accent">
            ▍
          </span>
        )}
      </span>
    </Tag>
  )
}
