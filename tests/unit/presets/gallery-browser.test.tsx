import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { BUILT_IN_PRESETS } from "@/features/presets/catalog"
import { GalleryBrowser } from "@/features/presets/components/gallery-browser"

// Previews are covered separately; keep gallery tests free of animation engines.
vi.mock("@/features/animations/preview/preview-stage", () => ({
  PreviewStage: ({ label }: { label: string }) => <div data-testid={`preview-${label}`} />,
}))

function cardTitles() {
  return screen.getAllByRole("article").map((card) => within(card).getByRole("heading").textContent)
}

describe("GalleryBrowser", () => {
  it("lists every preset with a result count", () => {
    render(<GalleryBrowser presets={BUILT_IN_PRESETS} />)
    expect(screen.getAllByRole("article")).toHaveLength(BUILT_IN_PRESETS.length)
    expect(screen.getByText(`${BUILT_IN_PRESETS.length} presets`)).toBeInTheDocument()
  })

  it("filters by search query", async () => {
    const user = userEvent.setup()
    render(<GalleryBrowser presets={BUILT_IN_PRESETS} />)
    await user.type(screen.getByLabelText("Search presets"), "headline")
    expect(cardTitles()).toEqual(["Character Rise", "Letter Tumble"])
    expect(screen.getByText("2 presets")).toBeInTheDocument()
  })

  it("filters by category using radio buttons", async () => {
    const user = userEvent.setup()
    render(<GalleryBrowser presets={BUILT_IN_PRESETS} />)
    await user.click(screen.getByRole("radio", { name: "SVG" }))
    expect(screen.getByRole("radio", { name: "SVG" })).toBeChecked()
    expect(cardTitles()).toEqual(["Line Draw"])
    expect(screen.getByText("1 preset")).toBeInTheDocument()
  })

  it("supports arrow-key navigation between categories", async () => {
    const user = userEvent.setup()
    render(<GalleryBrowser presets={BUILT_IN_PRESETS} />)
    await user.click(screen.getByRole("radio", { name: "All" }))
    await user.keyboard("{ArrowRight}")
    expect(screen.getByRole("radio", { name: "Text reveals" })).toBeChecked()
    expect(cardTitles()).toEqual(["Character Rise", "Letter Tumble"])
  })

  it("filters by engine", async () => {
    const user = userEvent.setup()
    render(<GalleryBrowser presets={BUILT_IN_PRESETS} />)
    await user.selectOptions(screen.getByLabelText("Engine"), "motion")
    const expected = BUILT_IN_PRESETS.filter((p) => p.config.engine === "motion").length
    expect(screen.getAllByRole("article")).toHaveLength(expected)
  })

  it("sorts by name", async () => {
    const user = userEvent.setup()
    render(<GalleryBrowser presets={BUILT_IN_PRESETS} />)
    await user.selectOptions(screen.getByLabelText("Sort by"), "name-desc")
    const titles = cardTitles()
    expect(titles).toEqual([...titles].sort((a, b) => b!.localeCompare(a!)))
  })

  it("shows an empty state and clears filters", async () => {
    const user = userEvent.setup()
    render(<GalleryBrowser presets={BUILT_IN_PRESETS} />)
    await user.type(screen.getByLabelText("Search presets"), "no-such-animation")
    expect(screen.queryAllByRole("article")).toHaveLength(0)
    expect(screen.getByRole("heading", { name: "No presets match your filters" })).toBeVisible()

    await user.click(screen.getByRole("button", { name: "Clear filters" }))
    expect(screen.getAllByRole("article")).toHaveLength(BUILT_IN_PRESETS.length)
    expect(screen.getByLabelText("Search presets")).toHaveValue("")
  })

  it("links each card to its playground and details pages", () => {
    render(<GalleryBrowser presets={BUILT_IN_PRESETS} />)
    const card = screen.getAllByRole("article")[0]!
    const slug = BUILT_IN_PRESETS.find((p) => p.featured)!.slug
    expect(within(card).getByRole("link", { name: /^Customize/ })).toHaveAttribute(
      "href",
      `/playground/${slug}`,
    )
    expect(within(card).getByRole("link", { name: /^Details/ })).toHaveAttribute(
      "href",
      `/presets/${slug}`,
    )
  })
})
