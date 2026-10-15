"use client"

import { animate, utils } from "animejs"
import { useLayoutEffect, useRef } from "react"
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion"
import type { AnimeTrigger } from "@/lib/hooks/use-anime-trigger"
import { cn } from "@/lib/utils/cn"

interface NumberTickerProps {
  value: number
  /** Fixed number of decimals. */
  decimals?: number
  /** Pads with leading zeros, e.g. 2 renders 3 as "03". */
  minDigits?: number
  prefix?: string
  suffix?: string
  /** Locale for grouping and decimal separators. Fixed by default so server and client agree. */
  locale?: string
  /** Milliseconds for a full roll. */
  duration?: number
  /** When the first roll from zero plays. Later value changes always roll. */
  trigger?: AnimeTrigger
  className?: string
}

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
const offset = (digit: number) => `${-digit * 10}%`

export function formatTickerValue(
  value: number,
  { decimals = 0, minDigits = 1, locale = "en-US" } = {},
): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    minimumIntegerDigits: minDigits,
  }).format(value)
}

/**
 * A number whose digits roll like an odometer (Anime.js). Columns are keyed from
 * the right, so the ones column stays the ones column as the number grows, and
 * tabular figures keep the width steady while it rolls.
 */
export function NumberTicker({
  value,
  decimals = 0,
  minDigits = 1,
  prefix = "",
  suffix = "",
  locale = "en-US",
  duration = 900,
  trigger = "mount",
  className,
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduced = usePrefersReducedMotion()
  /** Digit shown by each column (keyed from the right) after the last roll. */
  const shown = useRef<Map<string, number> | null>(null)
  const formatted = formatTickerValue(value, { decimals, minDigits, locale })
  const chars = Array.from(formatted)

  useLayoutEffect(() => {
    const root = ref.current
    if (!root) return
    const columns = Array.from(root.querySelectorAll<HTMLElement>("[data-column]"))
    const targets = new Map(columns.map((el) => [el.dataset.column!, Number(el.dataset.digit)]))
    const first = shown.current === null
    const previous = shown.current ?? new Map<string, number>()
    shown.current = targets
    if (reduced) return

    const roll = () =>
      columns.map((el) => {
        const from = previous.get(el.dataset.column!) ?? 0
        const to = Number(el.dataset.digit)
        utils.set(el, { translateY: offset(from) })
        return animate(el, {
          translateY: [offset(from), offset(to)],
          duration: from === to ? 0 : duration,
          ease: "outExpo",
        })
      })

    if (!first || trigger === "mount" || typeof IntersectionObserver === "undefined") {
      const animations = roll()
      return () => animations.forEach((a) => a.cancel())
    }

    // First roll waits until the number scrolls into view.
    utils.set(columns, { translateY: offset(0) })
    let animations: ReturnType<typeof roll> = []
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return
      observer.disconnect()
      animations = roll()
    })
    observer.observe(root)
    return () => {
      observer.disconnect()
      animations.forEach((a) => a.cancel())
    }
  }, [formatted, reduced, duration, trigger])

  let digitIndex = chars.filter((c) => /\d/.test(c)).length
  return (
    <span ref={ref} className={cn("inline-flex tabular-nums", className)}>
      <span className="sr-only">{`${prefix}${formatted}${suffix}`}</span>
      <span aria-hidden className="inline-flex">
        {prefix && <span>{prefix}</span>}
        {chars.map((char, index) => {
          if (!/\d/.test(char)) {
            return <span key={`sep-${chars.length - index}`}>{char}</span>
          }
          const column = String(digitIndex--)
          const digit = Number(char)
          return (
            <span key={`d-${column}`} className="relative inline-block h-[1lh] overflow-hidden">
              <span
                data-column={column}
                data-digit={digit}
                className="flex flex-col"
                style={{ transform: `translateY(${offset(digit)})` }}
              >
                {DIGITS.map((d) => (
                  <span key={d} className="h-[1lh]">
                    {d}
                  </span>
                ))}
              </span>
            </span>
          )
        })}
        {suffix && <span>{suffix}</span>}
      </span>
    </span>
  )
}
