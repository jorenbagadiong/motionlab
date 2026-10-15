import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { BouncingDots } from "@/components/ui/bouncing-dots"
import { LineDraw } from "@/components/ui/line-draw"
import { OrbitSpinner } from "@/components/ui/orbit-spinner"
import { setMediaQuery } from "../setup"

const REDUCED = "(prefers-reduced-motion: reduce)"

describe("BouncingDots", () => {
  it("is a labelled status with hidden dots", () => {
    render(<BouncingDots label="Ada is typing" />)
    expect(screen.getByRole("status")).toHaveTextContent("Ada is typing")
    const dots = document.querySelectorAll("[data-dot]")
    expect(dots).toHaveLength(3)
    for (const dot of dots) expect(dot).toHaveAttribute("aria-hidden")
  })

  it("keeps the dot count between 3 and 6", () => {
    const { rerender } = render(<BouncingDots count={1} />)
    expect(document.querySelectorAll("[data-dot]")).toHaveLength(3)
    rerender(<BouncingDots count={9} />)
    expect(document.querySelectorAll("[data-dot]")).toHaveLength(6)
  })

  it("stays still with reduced motion", () => {
    setMediaQuery(REDUCED, true)
    render(<BouncingDots />)
    for (const dot of document.querySelectorAll<HTMLElement>("[data-dot]")) {
      expect(dot.style.transform).toMatch(/^(none)?$/)
    }
  })
})

describe("OrbitSpinner", () => {
  it("is a labelled status", () => {
    render(<OrbitSpinner label="Rendering preview" />)
    expect(screen.getByRole("status")).toHaveTextContent("Rendering preview")
  })

  it("does not rotate with reduced motion", () => {
    setMediaQuery(REDUCED, true)
    render(<OrbitSpinner />)
    expect(document.querySelector<HTMLElement>("[data-orbit]")!.style.transform).toMatch(
      /^(none)?$/,
    )
  })
})

describe("LineDraw", () => {
  const shapes = (
    <>
      <path d="M0 0 L10 10" />
      <circle cx="5" cy="5" r="2" />
    </>
  )

  it("is an image when labelled, decorative otherwise", () => {
    const { rerender } = render(<LineDraw label="Logo">{shapes}</LineDraw>)
    expect(screen.getByRole("img", { name: "Logo" })).toBeInTheDocument()
    rerender(<LineDraw>{shapes}</LineDraw>)
    expect(screen.queryByRole("img")).not.toBeInTheDocument()
    expect(document.querySelector("svg")).toHaveAttribute("aria-hidden", "true")
  })

  it("shows the full drawing with reduced motion", () => {
    setMediaQuery(REDUCED, true)
    render(<LineDraw>{shapes}</LineDraw>)
    expect(document.querySelector("path")!.getAttribute("stroke-dasharray")).toBeNull()
  })
})
