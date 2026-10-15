import { render, screen, waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { formatTickerValue, NumberTicker } from "@/components/ui/number-ticker"
import { TextHighlight } from "@/components/ui/text-highlight"
import { TextReveal } from "@/components/ui/text-reveal"
import { scrambleFrame, TextScramble, typeFrame } from "@/components/ui/text-scramble"
import { setMediaQuery } from "../setup"

const REDUCED = "(prefers-reduced-motion: reduce)"

describe("TextReveal", () => {
  it("gives screen readers the whole text once and hides the pieces", () => {
    render(<TextReveal as="h2" text="Hello motion" split="char" />)
    expect(screen.getByRole("heading", { name: "Hello motion" })).toBeInTheDocument()
    const pieces = document.querySelectorAll("[data-piece]")
    expect(pieces).toHaveLength("Hellomotion".length)
    expect(pieces[0]!.closest("[aria-hidden]")).not.toBeNull()
  })

  it("splits words and lines", () => {
    const { rerender } = render(<TextReveal text="one two three" split="word" />)
    expect(document.querySelectorAll("[data-piece]")).toHaveLength(3)
    rerender(<TextReveal text={"first line\nsecond"} split="line" />)
    expect(document.querySelectorAll("[data-piece]")).toHaveLength(2)
    expect(document.querySelector("br")).not.toBeNull()
  })

  it("leaves the final state untouched with reduced motion", () => {
    setMediaQuery(REDUCED, true)
    render(<TextReveal text="Still" effect="blur" />)
    for (const piece of document.querySelectorAll<HTMLElement>("[data-piece]")) {
      expect(piece.style.opacity).toBe("")
    }
  })

  it("hides the pieces before they animate in", () => {
    render(<TextReveal text="Fade in" />)
    const piece = document.querySelector<HTMLElement>("[data-piece]")!
    expect(Number(piece.style.opacity)).toBeLessThan(1)
  })
})

describe("NumberTicker", () => {
  it("formats with decimals, padding and the fixed locale", () => {
    expect(formatTickerValue(1234.5, { decimals: 2 })).toBe("1,234.50")
    expect(formatTickerValue(3, { minDigits: 2 })).toBe("03")
  })

  it("exposes the formatted value with prefix and suffix", () => {
    render(<NumberTicker value={1999} prefix="$" suffix=" total" />)
    expect(screen.getByText("$1,999 total")).toHaveClass("sr-only")
  })

  it("renders one digit column per digit, keyed from the right", () => {
    render(<NumberTicker value={1284} />)
    const columns = [...document.querySelectorAll<HTMLElement>("[data-column]")]
    expect(columns.map((c) => c.dataset.digit)).toEqual(["1", "2", "8", "4"])
    expect(columns.map((c) => c.dataset.column)).toEqual(["4", "3", "2", "1"])
  })

  it("shows the final digits straight away with reduced motion", () => {
    setMediaQuery(REDUCED, true)
    render(<NumberTicker value={7} />)
    const column = document.querySelector<HTMLElement>("[data-column]")!
    expect(column.style.transform).toBe("translateY(-70%)")
  })
})

describe("TextScramble", () => {
  it("builds scramble and type frames", () => {
    expect(scrambleFrame("ABC", 1)).toBe("ABC")
    expect(scrambleFrame("A B", 0)).toMatch(/^. .$/)
    expect(scrambleFrame("ABCD", 0.5).slice(0, 2)).toBe("AB")
    expect(typeFrame("Hello", 0.4)).toBe("He")
  })

  it("gives screen readers the words, never the frames", () => {
    render(<TextScramble words={["Motion", "Anime.js"]} mode="type" />)
    expect(screen.getByText("Motion, Anime.js")).toHaveClass("sr-only")
  })

  it("lands on the exact text", async () => {
    render(<TextScramble text="DONE" duration={30} />)
    const output = document.querySelector("[data-output]")!
    await waitFor(() => expect(output.textContent).toBe("DONE"))
  })

  it("starts typing from an empty line", () => {
    render(<TextScramble text="Typed" mode="type" duration={5000} />)
    expect(document.querySelector("[data-output]")!.textContent).not.toBe("Typed")
  })
})

describe("TextHighlight", () => {
  it.each([
    ["underline", 1],
    ["squiggle", 1],
    ["strike", 1],
    ["circle", 1],
    ["box", 2],
  ] as const)("draws %s with %i path(s), hidden from assistive tech", (variant, paths) => {
    render(<TextHighlight variant={variant}>word</TextHighlight>)
    expect(document.querySelectorAll("[data-mark]")).toHaveLength(paths)
    expect(document.querySelector("svg")).toHaveAttribute("aria-hidden")
    expect(screen.getByText("word")).toBeInTheDocument()
  })

  it("uses a block for the marker variant", () => {
    render(<TextHighlight variant="marker">word</TextHighlight>)
    expect(document.querySelector("svg")).toBeNull()
    expect(document.querySelector("[data-marker]")).toHaveAttribute("aria-hidden")
  })
})
