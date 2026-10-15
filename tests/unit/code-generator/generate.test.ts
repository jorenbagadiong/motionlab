import { describe, expect, it } from "vitest"
import pkg from "../../../package.json"
import { defaultConfig, ENGINES } from "@/features/animations/model"
import { generateCode } from "@/features/code-generator/generate"
import { raw, toCode, toFileName, toIdentifier } from "@/features/code-generator/serialize"
import { BUILT_IN_PRESETS } from "@/features/presets/catalog"

describe("generateCode", () => {
  it.each(BUILT_IN_PRESETS.map((p) => [p.slug, p] as const))(
    "%s produces complete output",
    (_slug, preset) => {
      const out = generateCode(preset.config, preset.name)
      expect(out.engine).toBe(preset.config.engine)
      expect(out.code).toContain(`from "${ENGINES[preset.config.engine].packageName}`)
      expect(out.code).not.toMatch(/undefined|NaN|\[object Object\]/)
      expect(out.usage.length).toBeGreaterThan(0)
      expect(out.filename).toBe(
        `${preset.slug.replace("slide-in-left", "slide-in")}.${out.language}`,
      )
    },
  )

  it("converts Motion durations to seconds and keeps every transition option", () => {
    const config = {
      ...defaultConfig("fade-slide"),
      duration: 750,
      delay: 250,
      ease: "backOut" as const,
      repeat: "alternate" as const,
    }
    const { code, language } = generateCode(config, "Fade Up")
    expect(language).toBe("tsx")
    expect(code).toContain("duration: 0.75")
    expect(code).toContain("delay: 0.25")
    expect(code).toContain('ease: "backOut"')
    expect(code).toContain("repeat: Infinity")
    expect(code).toContain('repeatType: "reverse"')
  })

  it("omits repeat options when the animation plays once", () => {
    const { code } = generateCode(defaultConfig("fade-slide"), "Fade Up")
    expect(code).not.toContain("repeat")
  })

  it("starts Motion elements from the configured offset", () => {
    const config = { ...defaultConfig("fade-slide"), direction: "right" as const, distance: 40 }
    expect(generateCode(config, "Slide").code).toContain("initial={{ opacity: 0, x: -40, y: 0 }}")
  })

  it("keeps Anime.js durations in milliseconds", () => {
    const config = { ...defaultConfig("text-reveal"), duration: 1200, stagger: 60, delay: 100 }
    const { code, language } = generateCode(config, "Letters")
    expect(language).toBe("js")
    expect(code).toContain("duration: 1200")
    expect(code).toContain("delay: stagger(60, { start: 100 })")
  })

  it("uses spring physics for spring presets", () => {
    const config = { ...defaultConfig("spring-pop"), stiffness: 420, damping: 9, mass: 1.5 }
    const { code } = generateCode(config, "Pop")
    for (const part of ['type: "spring"', "stiffness: 420", "damping: 9", "mass: 1.5"]) {
      expect(code).toContain(part)
    }
  })

  it("reflects the configured item count in usage examples", () => {
    const stagger = generateCode({ ...defaultConfig("stagger-cards"), count: 6 }, "Cards")
    expect(stagger.usage.match(/"Item \d"/g)).toHaveLength(6)
    const dots = generateCode({ ...defaultConfig("bouncing-dots"), count: 5 }, "Dots")
    expect(dots.usage).toContain("count={5}")
    expect(dots.code).toContain("count = 5")
  })

  it("names exports after the preset", () => {
    expect(generateCode(defaultConfig("spring-pop"), "Twist In").code).toContain(
      "export function TwistIn(",
    )
    expect(generateCode(defaultConfig("svg-draw"), "Line Draw").code).toContain(
      "export function lineDraw(",
    )
  })

  it("pins install commands to the major versions the app uses", () => {
    const installed = { ...pkg.dependencies } as Record<string, string>
    for (const engine of Object.values(ENGINES)) {
      expect(installed[engine.packageName]?.split(".")[0]).toBe(String(engine.testedMajor))
    }
    expect(generateCode(defaultConfig("fade-slide"), "A").install).toBe(
      `npm install motion@${ENGINES.motion.testedMajor}`,
    )
  })
})

describe("serialization", () => {
  it("formats objects inline when short and multi-line when long", () => {
    expect(toCode({ a: 1, b: "x" })).toBe('{ a: 1, b: "x" }')
    expect(toCode({ alpha: 1, beta: 2, gamma: 3, delta: 4, epsilon: 5, zeta: 6, eta: 7 })).toBe(
      "{\n  alpha: 1,\n  beta: 2,\n  gamma: 3,\n  delta: 4,\n  epsilon: 5,\n  zeta: 6,\n  eta: 7,\n}",
    )
  })

  it("handles special numbers, raw code, quoting and undefined", () => {
    expect(toCode([Infinity, -0, 0.1 + 0.2])).toBe("[Infinity, 0, 0.3]")
    expect(toCode({ delay: raw("stagger(1)") })).toBe("{ delay: stagger(1) }")
    expect(toCode({ "data-x": 1, ok: undefined })).toBe('{ "data-x": 1 }')
    expect(toCode('say "hi"')).toBe('"say \\"hi\\""')
    expect(() => toCode(Number.NaN)).toThrow()
  })

  it("derives safe identifiers and file names", () => {
    expect(toIdentifier("Character Rise", "pascal")).toBe("CharacterRise")
    expect(toIdentifier("Character Rise", "camel")).toBe("characterRise")
    expect(toIdentifier("3D flip!", "pascal")).toBe("Animation3dFlip")
    expect(toIdentifier("<script>", "pascal")).toBe("Script")
    expect(toFileName("Slide In")).toBe("slide-in")
  })
})
