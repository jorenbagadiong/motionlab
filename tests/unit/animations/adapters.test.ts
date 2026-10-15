import { describe, expect, it } from "vitest"
import {
  animeRepeat,
  orbitSpinnerParams,
  textRevealParams,
} from "@/features/animations/adapters/anime"
import {
  fadeSlideKeyframes,
  fadeSlideTransition,
  hoverLiftProps,
  motionRepeat,
  offsetFor,
  pageTransitionKeyframes,
  springPopTransition,
} from "@/features/animations/adapters/motion"
import { defaultConfig } from "@/features/animations/model"

describe("motion adapter", () => {
  it("starts elements on the opposite side of their travel direction", () => {
    expect(offsetFor("up", 20)).toEqual({ x: 0, y: 20 })
    expect(offsetFor("down", 20)).toEqual({ x: 0, y: -20 })
    expect(offsetFor("left", 20)).toEqual({ x: 20, y: 0 })
    expect(offsetFor("right", 20)).toEqual({ x: -20, y: 0 })
  })

  it("converts milliseconds to the seconds Motion expects", () => {
    const config = { ...defaultConfig("fade-slide"), duration: 750, delay: 250 }
    expect(fadeSlideTransition(config)).toMatchObject({ duration: 0.75, delay: 0.25 })
  })

  it("builds fade-slide keyframes from the configured offset", () => {
    const config = { ...defaultConfig("fade-slide"), direction: "right" as const, distance: 40 }
    expect(fadeSlideKeyframes(config)).toEqual({ opacity: [0, 1], x: [-40, 0], y: [0, 0] })
  })

  it("maps repeat modes", () => {
    expect(motionRepeat("none")).toEqual({})
    expect(motionRepeat("loop")).toEqual({ repeat: Infinity, repeatType: "loop" })
    expect(motionRepeat("alternate")).toEqual({ repeat: Infinity, repeatType: "reverse" })
  })

  it("uses spring physics from the config", () => {
    const config = defaultConfig("spring-pop")
    expect(springPopTransition(config)).toEqual({
      type: "spring",
      stiffness: config.stiffness,
      damping: config.damping,
      mass: config.mass,
      delay: 0,
    })
  })

  it("moves the outgoing page opposite to the incoming page", () => {
    const config = { ...defaultConfig("page-transition"), direction: "left" as const, distance: 50 }
    const { exit, enter } = pageTransitionKeyframes(config)
    expect(exit.x).toEqual([0, -50])
    expect(enter.x).toEqual([50, 0])
  })

  it("applies the same target for hover and focus", () => {
    const props = hoverLiftProps(defaultConfig("hover-lift"))
    expect(props.whileFocus).toEqual(props.whileHover)
    expect(props.transition.type).toBe("spring")
  })
})

describe("anime adapter", () => {
  it("maps repeat modes to explicit loop flags", () => {
    expect(animeRepeat("none")).toEqual({ loop: false, alternate: false })
    expect(animeRepeat("loop")).toEqual({ loop: true, alternate: false })
    expect(animeRepeat("alternate")).toEqual({ loop: true, alternate: true })
  })

  it("keeps durations in milliseconds", () => {
    const config = { ...defaultConfig("text-reveal"), duration: 1200 }
    expect(textRevealParams(config).duration).toBe(1200)
  })

  it("reverses rotation for counter-clockwise spinners", () => {
    const config = { ...defaultConfig("orbit-spinner"), spin: "counterclockwise" as const }
    expect(orbitSpinnerParams(config).rotate).toEqual([0, -360])
  })
})
