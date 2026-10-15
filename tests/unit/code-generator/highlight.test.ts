import { describe, expect, it } from "vitest"
import { defaultConfig } from "@/features/animations/model"
import { generateCode } from "@/features/code-generator/generate"
import { tokenize } from "@/features/code-generator/highlight"
import { BUILT_IN_PRESETS } from "@/features/presets/catalog"

const typesOf = (source: string) =>
  tokenize(source)
    .filter((t) => t.text.trim())
    .map((t) => [t.type, t.text.trim()])

describe("tokenize", () => {
  it.each(BUILT_IN_PRESETS.map((p) => [p.slug, p] as const))(
    "is lossless for %s",
    (_slug, preset) => {
      const { code, usage } = generateCode(preset.config, preset.name)
      for (const source of [code, usage]) {
        expect(
          tokenize(source)
            .map((t) => t.text)
            .join(""),
        ).toBe(source)
      }
    },
  )

  it("classifies the main token types", () => {
    expect(typesOf('import { animate } from "animejs" // note')).toEqual([
      ["keyword", "import"],
      // Adjacent plain text is merged into one token.
      ["plain", "{ animate }"],
      ["keyword", "from"],
      ["string", '"animejs"'],
      ["comment", "// note"],
    ])
    expect(typesOf("animate(el, { duration: 0.6 })")).toEqual([
      ["function", "animate"],
      ["plain", "(el, {"],
      ["property", "duration"],
      ["plain", ":"],
      ["number", "0.6"],
      ["plain", "})"],
    ])
  })

  it("marks JSX tag names", () => {
    const tags = tokenize("<motion.div>{x}</motion.div>").filter((t) => t.type === "tag")
    expect(tags.map((t) => t.text)).toEqual(["motion.div", "motion.div"])
  })

  it("does not treat identifiers containing keywords as keywords", () => {
    expect(tokenize("imported").map((t) => t.type)).toEqual(["plain"])
  })

  it("keeps unterminated strings and odd input lossless", () => {
    for (const source of [
      '"unterminated',
      "a /* b",
      "x::y",
      "",
      defaultConfig("svg-draw").family,
    ]) {
      expect(
        tokenize(source)
          .map((t) => t.text)
          .join(""),
      ).toBe(source)
    }
  })
})
