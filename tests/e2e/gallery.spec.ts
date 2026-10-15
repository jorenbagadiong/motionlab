import { expect, test } from "@playwright/test"
import { gotoHydrated } from "./helpers"
import { BUILT_IN_PRESETS } from "../../src/features/presets/catalog"

test.describe("gallery", () => {
  test.beforeEach(async ({ page }) => {
    await gotoHydrated(page, "/explore")
  })

  test("lists every built-in preset", async ({ page }) => {
    await expect(page.getByRole("article")).toHaveCount(BUILT_IN_PRESETS.length)
  })

  test("searches and shows an empty state", async ({ page }) => {
    const search = page.getByLabel("Search presets")
    await search.fill("headline")
    await expect(page.getByRole("article")).toHaveCount(2)

    await search.fill("definitely-not-a-preset")
    await expect(page.getByRole("heading", { name: "No presets match your filters" })).toBeVisible()
    await page.getByRole("button", { name: "Clear filters" }).click()
    await expect(page.getByRole("article")).toHaveCount(BUILT_IN_PRESETS.length)
  })

  test("filters by category with the keyboard", async ({ page }) => {
    await page.getByRole("radio", { name: "All" }).focus()
    await page.keyboard.press("ArrowRight")
    await expect(page.getByRole("radio", { name: "Text reveals" })).toBeChecked()
    await expect(page.getByRole("article")).toHaveCount(2)
  })

  test("opens a preset in the playground", async ({ page }) => {
    await page.getByLabel("Search presets").fill("line draw")
    await page.getByRole("link", { name: "Customize Line Draw" }).click()
    await expect(page).toHaveURL(/\/playground\/line-draw$/)
    await expect(page.getByRole("heading", { level: 1, name: "Line Draw" })).toBeVisible()
  })
})
