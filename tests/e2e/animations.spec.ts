import { expect, test } from "@playwright/test"
import { BUILT_IN_PRESETS } from "../../src/features/presets/catalog"
import { ANIMATED_SELECTOR, gotoHydrated, isEngineDriven, trackErrors } from "./helpers"

const timelinePresets = BUILT_IN_PRESETS.filter((p) => p.config.family !== "hover-lift")

test.describe("built-in presets run in the browser", () => {
  for (const preset of timelinePresets) {
    test(`${preset.slug} animates without errors`, async ({ page }) => {
      const errors = trackErrors(page)
      await gotoHydrated(page, `/presets/${preset.slug}`)
      await expect(page.locator(ANIMATED_SELECTOR).first()).toBeAttached()

      await page.getByRole("button", { name: "Replay" }).click()
      await expect
        .poll(() => isEngineDriven(page.locator(ANIMATED_SELECTOR).first()), {
          message: `expected ${preset.slug} to animate; page errors: ${JSON.stringify(errors)}`,
        })
        .toBe(true)
      expect(errors).toEqual([])
    })
  }

  test("hover lift responds to keyboard focus", async ({ page }) => {
    const errors = trackErrors(page)
    await gotoHydrated(page, "/presets/hover-lift")
    const demo = page.getByRole("button", { name: /hover lift demo/i })
    // Tab first so the browser treats the focus as keyboard focus (:focus-visible),
    // which is what Motion's whileFocus responds to.
    await page.keyboard.press("Tab")
    await demo.focus()
    await expect.poll(() => isEngineDriven(demo)).toBe(true)
    expect(errors).toEqual([])
  })
})

test.describe("playback controls", () => {
  test("pause toggles its pressed state", async ({ page }) => {
    await gotoHydrated(page, "/presets/bouncing-dots")
    const pause = page.getByRole("button", { name: "Pause" })
    await expect(pause).toBeEnabled()
    await pause.click()
    await expect(page.getByRole("button", { name: "Resume" })).toHaveAttribute(
      "aria-pressed",
      "true",
    )
  })
})

test.describe("reduced motion", () => {
  test.use({ colorScheme: "dark", reducedMotion: "reduce" })

  test("previews wait for an explicit play", async ({ page }) => {
    await gotoHydrated(page, "/presets/fade-up")
    await expect(page.getByText(/reduced motion is on/i)).toBeVisible()
    const target = page.locator(ANIMATED_SELECTOR).first()
    await expect(target).toBeAttached()
    expect(await isEngineDriven(target)).toBe(false)

    await page.getByRole("button", { name: "Play" }).click()
    await expect.poll(() => isEngineDriven(page.locator(ANIMATED_SELECTOR).first())).toBe(true)
  })
})
