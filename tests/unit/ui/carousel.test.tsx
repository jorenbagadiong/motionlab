import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPagination,
  CarouselPlayToggle,
  CarouselPrevious,
  CarouselStatus,
  CarouselThumbs,
} from "@/components/ui/carousel"
import { setMediaQuery } from "../setup"

function Demo(props: Partial<Parameters<typeof Carousel>[0]>) {
  return (
    <Carousel label="Presets" {...props}>
      <CarouselContent>
        {["a", "b", "c", "d"].map((name) => (
          <CarouselItem key={name}>
            <button type="button">Open {name}</button>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselStatus />
      <CarouselPagination />
      <CarouselNext />
      <CarouselThumbs>{(i) => <span>thumb {i + 1}</span>}</CarouselThumbs>
      <CarouselPlayToggle />
    </Carousel>
  )
}

const slide = (n: number) => screen.getByRole("group", { name: `${n} of 4` })
const live = () => document.querySelector("[aria-live]")!

describe("Carousel", () => {
  it("is a labelled carousel region with labelled slides", () => {
    render(<Demo />)
    const region = screen.getByRole("region", { name: "Presets" })
    expect(region).toHaveAttribute("aria-roledescription", "carousel")
    expect(slide(1)).toHaveAttribute("aria-roledescription", "slide")
    expect(live()).toHaveTextContent("Slide 1 of 4")
  })

  it("moves with the buttons and disables them at the ends", async () => {
    const user = userEvent.setup()
    const onIndexChange = vi.fn()
    render(<Demo onIndexChange={onIndexChange} />)
    const prev = screen.getByRole("button", { name: "Previous slide" })
    const next = screen.getByRole("button", { name: "Next slide" })
    expect(prev).toHaveAttribute("aria-disabled", "true")

    await user.click(next)
    expect(live()).toHaveTextContent("Slide 2 of 4")
    expect(onIndexChange).toHaveBeenLastCalledWith(1)
    for (let i = 0; i < 2; i++) await user.click(next)
    expect(live()).toHaveTextContent("Slide 4 of 4")
    expect(next).toHaveAttribute("aria-disabled", "true")
    // Still focusable, and clicking it does nothing.
    await user.click(next)
    expect(live()).toHaveTextContent("Slide 4 of 4")
  })

  it("wraps around with loop", async () => {
    const user = userEvent.setup()
    render(<Demo loop />)
    await user.click(screen.getByRole("button", { name: "Previous slide" }))
    expect(live()).toHaveTextContent("Slide 4 of 4")
  })

  it("navigates with arrow keys, Home and End while focus is inside", async () => {
    const user = userEvent.setup()
    render(<Demo />)
    screen.getByRole("button", { name: "Next slide" }).focus()
    await user.keyboard("{ArrowRight}")
    expect(live()).toHaveTextContent("Slide 2 of 4")
    await user.keyboard("{End}")
    expect(live()).toHaveTextContent("Slide 4 of 4")
    await user.keyboard("{Home}")
    expect(live()).toHaveTextContent("Slide 1 of 4")
  })

  it("uses Up and Down when vertical", async () => {
    const user = userEvent.setup()
    render(<Demo orientation="vertical" />)
    screen.getByRole("button", { name: "Next slide" }).focus()
    await user.keyboard("{ArrowDown}")
    expect(live()).toHaveTextContent("Slide 2 of 4")
    await user.keyboard("{ArrowRight}")
    expect(live()).toHaveTextContent("Slide 2 of 4")
  })

  it("makes off-screen slides inert", async () => {
    const user = userEvent.setup()
    render(<Demo />)
    expect(slide(1)).not.toHaveAttribute("inert")
    expect(slide(2)).toHaveAttribute("inert")
    await user.click(screen.getByRole("button", { name: "Next slide" }))
    expect(slide(1)).toHaveAttribute("inert")
    expect(slide(2)).not.toHaveAttribute("inert")
  })

  it("keeps several slides reachable with slidesPerView and stops at the last page", async () => {
    const user = userEvent.setup()
    render(<Demo slidesPerView={2} />)
    expect(slide(2)).not.toHaveAttribute("inert")
    // 4 slides, 2 per view → 3 positions.
    expect(screen.getAllByRole("button", { name: /^Go to slide/ })).toHaveLength(3 + 4)
    screen.getByRole("button", { name: "Next slide" }).focus()
    await user.keyboard("{End}")
    expect(live()).toHaveTextContent("Slide 3 of 4")
    expect(slide(4)).not.toHaveAttribute("inert")
  })

  it("marks the current page and thumbnail, and jumps on click", async () => {
    const user = userEvent.setup()
    render(<Demo />)
    const thumbs = screen.getAllByRole("button", { name: "Go to slide 3" })
    await user.click(thumbs[1]!)
    expect(live()).toHaveTextContent("Slide 3 of 4")
    for (const button of screen.getAllByRole("button", { name: "Go to slide 3" })) {
      expect(button).toHaveAttribute("aria-current", "true")
    }
  })

  it("shows the status as slide 01/04, hidden from screen readers", () => {
    render(<Demo />)
    const status = document.querySelector("[aria-hidden].font-mono")!
    expect(status.textContent).toContain("slide")
    expect(status.textContent).toContain("04")
  })

  it("only shows the play toggle with autoplay, and it pauses", async () => {
    const user = userEvent.setup()
    const { unmount } = render(<Demo />)
    expect(screen.queryByRole("button", { name: /autoplay/ })).not.toBeInTheDocument()
    unmount()

    render(<Demo autoplay={3000} loop />)
    await user.click(screen.getByRole("button", { name: "Pause autoplay" }))
    expect(screen.getByRole("button", { name: "Start autoplay" })).toBeInTheDocument()
  })

  it("turns autoplay off with reduced motion", () => {
    setMediaQuery("(prefers-reduced-motion: reduce)", true)
    render(<Demo autoplay={3000} />)
    expect(screen.queryByRole("button", { name: /autoplay/ })).not.toBeInTheDocument()
  })
})
