// @vitest-environment node
import fs from "node:fs"
import { describe, expect, it } from "vitest"
import { ACCENTS, DEFAULT_ACCENT } from "@/features/theme/theme"
import { contrast, over, parseOklch, type Rgba, WHITE } from "./color"

const css = fs.readFileSync("src/app/globals.css", "utf8")

/** Returns `--name: value` declarations from the first block whose selector ends with `selector`. */
function declarations(selector: string): Map<string, string> {
  const start = css.indexOf(`${selector} {`)
  if (start === -1) throw new Error(`Block not found: ${selector}`)
  const body = css.slice(css.indexOf("{", start) + 1, css.indexOf("}", start))
  const entries = [...body.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map((m) => [m[1]!, m[2]!.trim()])
  return new Map(entries as [string, string][])
}

const dark = declarations(":root")
const light = declarations(':root[data-theme="light"]')
const systemLight = declarations(':root:not([data-theme="dark"])')
const accents = new Map(
  ACCENTS.map((a) => [a.value, declarations(`:root[data-accent="${a.value}"]`)]),
)

describe("theme tokens", () => {
  it("keeps the explicit and system light palettes identical", () => {
    expect(systemLight).toEqual(light)
  })

  it("defines every dark token in the light palette too", () => {
    expect([...light.keys()].sort()).toEqual([...dark.keys()].sort())
  })

  it("maps every theme-aware Tailwind color to a token", () => {
    const accentTokens = accents.get(DEFAULT_ACCENT)!
    const inline = css.slice(css.indexOf("@theme inline {"))
    for (const [, token] of inline.matchAll(/--color-[\w-]+:\s*var\((--[\w-]+)\)/g)) {
      expect(dark.has(token!) || accentTokens.has(token!), `${token} is not defined`).toBe(true)
    }
  })
})

describe("accent color themes", () => {
  it("has a CSS palette for exactly the accents the picker offers", () => {
    const inCss = [...css.matchAll(/:root\[data-accent="([\w-]+)"\]/g)].map((m) => m[1])
    expect(inCss).toEqual(ACCENTS.map((a) => a.value))
  })

  it("makes the default accent the palette used without data-accent", () => {
    expect(css).toContain(`:root,\n:root[data-accent="${DEFAULT_ACCENT}"] {`)
  })

  it("defines the same tokens for every accent", () => {
    const keys = [...accents.get(DEFAULT_ACCENT)!.keys()].sort()
    for (const tokens of accents.values()) expect([...tokens.keys()].sort()).toEqual(keys)
  })

  it.each(ACCENTS)("shows the $label swatch in the fill color", ({ value, swatch }) => {
    expect(accents.get(value)!.get("--accent-strong")).toBe(swatch)
  })

  // Surfaces text can sit on, per mode; accent text also sits on its own soft tint.
  const tintOf = (palette: Map<string, string>) =>
    Number(/var\(--accent\) (\d+)%/.exec(palette.get("--accent-soft")!)![1]) / 100
  const modes = [
    { mode: "dark", palette: dark, text: "--accent-on-dark", tint: tintOf(dark) },
    { mode: "light", palette: light, text: "--accent-on-light", tint: tintOf(light) },
  ]
  const surfaces = ["--canvas", "--surface", "--surface-raised", "--surface-overlay"]

  describe.each(ACCENTS)("$label", ({ value }) => {
    const tokens = accents.get(value)!

    it.each(modes)(
      "keeps accent text readable in $mode mode (WCAG AA)",
      ({ palette, text, tint }) => {
        const fg = parseOklch(tokens.get(text)!)
        for (const surface of surfaces) {
          const bg: Rgba = parseOklch(palette.get(surface)!)
          expect(contrast(fg, bg), `${surface}`).toBeGreaterThanOrEqual(4.5)
          expect(
            contrast(fg, over({ ...fg, a: tint }, bg)),
            `tinted ${surface}`,
          ).toBeGreaterThanOrEqual(4.5)
        }
      },
    )

    it("keeps white text readable on the solid fills", () => {
      for (const token of ["--accent-strong", "--accent-hover"]) {
        expect(contrast(WHITE, parseOklch(tokens.get(token)!)), token).toBeGreaterThanOrEqual(4.5)
      }
    })
  })
})

describe("status colors", () => {
  const surfaces = ["--canvas", "--surface", "--surface-raised", "--surface-overlay"]
  const solid = (token: string) => {
    const match = new RegExp(`--color-${token}:\\s*([^;]+);`).exec(css)
    if (!match) throw new Error(`Missing --color-${token}`)
    return parseOklch(match[1]!)
  }

  // Alerts and badges put these colors on a 10% tint of themselves.
  describe.each([
    { mode: "dark", palette: dark },
    { mode: "light", palette: light },
  ])("$mode mode", ({ palette }) => {
    it.each(["--danger", "--success", "--warning"])("%s text clears WCAG AA", (token) => {
      const fg = parseOklch(palette.get(token)!)
      for (const surface of surfaces) {
        const bg = parseOklch(palette.get(surface)!)
        expect(contrast(fg, bg), surface).toBeGreaterThanOrEqual(4.5)
        expect(
          contrast(fg, over({ ...fg, a: 0.1 }, bg)),
          `tinted ${surface}`,
        ).toBeGreaterThanOrEqual(4.5)
      }
    })
  })

  it("keeps white text readable on destructive buttons", () => {
    expect(contrast(WHITE, solid("danger-strong"))).toBeGreaterThanOrEqual(4.5)
    expect(contrast(WHITE, solid("danger-hover"))).toBeGreaterThanOrEqual(4.5)
  })
})
